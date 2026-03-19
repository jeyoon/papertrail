"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createVisit } from "@/app/actions/visits";
import { toast } from "sonner";

interface Drop {
  id: string;
  location: { id: string; name: string };
  flyer: { event: { name: string }; design: { name: string } };
}

interface Location {
  id: string;
  name: string;
}

interface AttemptRow {
  dropId: string;
  quantity: string;
  status: string;
  comment: string;
}

interface Props {
  locations: Location[];
  drops: Drop[];
}

const STATUSES = ["accepted", "rejected", "tentative"];

export function LogVisitDialog({ locations, drops }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [locationId, setLocationId] = useState("");
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const router = useRouter();

  const locationDrops = drops.filter((p) => p.location.id === locationId);

  function addAttempt() {
    setAttempts((prev) => [
      ...prev,
      { dropId: "", quantity: "", status: "accepted", comment: "" },
    ]);
  }

  function updateAttempt(i: number, field: keyof AttemptRow, value: string) {
    setAttempts((prev) =>
      prev.map((a, idx) => (idx === i ? { ...a, [field]: value } : a))
    );
  }

  function removeAttempt(i: number) {
    setAttempts((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const fd = new FormData(e.currentTarget);
    fd.set("locationId", locationId);
    fd.set("attempts", JSON.stringify(attempts.filter((a) => a.dropId)));
    try {
      await createVisit(fd);
      setOpen(false);
      setLocationId("");
      setAttempts([]);
      toast.success("Visit logged");
      router.refresh();
    } catch {
      toast.error("Failed to log visit");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Log Visit</Button>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-wide uppercase">
            Log Visit
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Visit details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Select value={locationId} onValueChange={(v) => { setLocationId(v ?? ""); setAttempts([]); }} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select store..." />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((l) => (
                    <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="visitedAt">Date &amp; Time</Label>
              <Input id="visitedAt" name="visitedAt" type="datetime-local" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="visitedBy">Visited By</Label>
            <Input id="visitedBy" name="visitedBy" required placeholder="Your name" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" placeholder="General notes about the visit..." rows={2} />
          </div>

          {/* Dropoff attempts */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="table-label">Dropoff Attempts</div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAttempt}
                disabled={!locationId}
              >
                + Add
              </Button>
            </div>

            {attempts.length === 0 && (
              <p className="text-xs py-3 text-center border border-dashed"
                style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
                {locationId
                  ? "Add at least one flyer dropoff attempt"
                  : "Select a location first"}
              </p>
            )}

            <div className="space-y-3">
              {attempts.map((a, i) => (
                <div
                  key={i}
                  className="border p-3 space-y-3"
                  style={{ borderColor: "var(--border)", background: "var(--background)" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="table-label">Attempt {i + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeAttempt(i)}
                      className="text-xs font-mono"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      ×
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Drop</Label>
                    <Select
                      value={a.dropId}
                      onValueChange={(v) => updateAttempt(i, "dropId", v ?? "")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select drop..." />
                      </SelectTrigger>
                      <SelectContent>
                        {locationDrops.length === 0 ? (
                          <SelectItem value="__none" disabled>
                            No drops at this location
                          </SelectItem>
                        ) : (
                          locationDrops.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.flyer.event.name} / {p.flyer.design.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Status</Label>
                      <Select
                        value={a.status}
                        onValueChange={(v) => updateAttempt(i, "status", v ?? "")}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Qty Left</Label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="e.g. 25"
                        value={a.quantity}
                        onChange={(e) => updateAttempt(i, "quantity", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Comment</Label>
                    <Input
                      placeholder="Optional note..."
                      value={a.comment}
                      onChange={(e) => updateAttempt(i, "comment", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={pending || !locationId}>
              {pending ? "Saving..." : "Log Visit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}
