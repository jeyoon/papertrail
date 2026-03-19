"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createFlyer } from "@/app/actions/flyers";
import { toast } from "sonner";

interface Props {
  events: { id: string; name: string }[];
  designs: { id: string; name: string }[];
}

export function CreateFlyerDialog({ events, designs }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [eventId, setEventId] = useState("");
  const [designId, setDesignId] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const fd = new FormData();
    fd.set("eventId", eventId);
    fd.set("designId", designId);
    try {
      await createFlyer(fd);
      setOpen(false);
      setEventId("");
      setDesignId("");
      toast.success("Flyer created");
      router.refresh();
    } catch {
      toast.error("Failed to create flyer");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>New Flyer</Button>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-wide uppercase">
            New Flyer
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Event</Label>
            <Select value={eventId} onValueChange={(v) => setEventId(v ?? "")} required>
              <SelectTrigger>
                <SelectValue placeholder="Select an event..." />
              </SelectTrigger>
              <SelectContent>
                {events.map((ev) => (
                  <SelectItem key={ev.id} value={ev.id}>{ev.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Design</Label>
            <Select value={designId} onValueChange={(v) => setDesignId(v ?? "")} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a design..." />
              </SelectTrigger>
              <SelectContent>
                {designs.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={pending || !eventId || !designId}>
              {pending ? "Creating..." : "Create Flyer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}
