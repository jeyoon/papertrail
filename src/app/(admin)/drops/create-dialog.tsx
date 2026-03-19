"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createDrop } from "@/app/actions/drops";
import { toast } from "sonner";

interface Props {
  flyers: { id: string; event: { name: string }; design: { name: string } }[];
  locations: { id: string; name: string }[];
}

export function CreateDropDialog({ flyers, locations }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [flyerId, setFlyerId] = useState("");
  const [locationId, setLocationId] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const fd = new FormData();
    fd.set("flyerId", flyerId);
    fd.set("locationId", locationId);
    try {
      await createDrop(fd);
      setOpen(false);
      setFlyerId("");
      setLocationId("");
      toast.success("Drop created — QR code generated");
      router.refresh();
    } catch {
      toast.error("Failed to create drop");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>New Drop</Button>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-wide uppercase">
            New Drop
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
          A unique QR code will be generated for this flyer × location combination.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Flyer</Label>
            <Select value={flyerId} onValueChange={(v) => setFlyerId(v ?? "")} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a flyer..." />
              </SelectTrigger>
              <SelectContent>
                {flyers.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.event.name} / {p.design.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Location</Label>
            <Select value={locationId} onValueChange={(v) => setLocationId(v ?? "")} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a location..." />
              </SelectTrigger>
              <SelectContent>
                {locations.map((l) => (
                  <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={pending || !flyerId || !locationId}>
              {pending ? "Generating..." : "Generate Drop"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}
