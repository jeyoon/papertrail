"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createEvent, updateEvent } from "@/app/actions/events";
import { toast } from "sonner";

interface Initial {
  id: string;
  name: string;
  date: string;
  landingUrl: string;
  description: string;
}

interface Props {
  initial?: Initial;
}

export function CreateEventDialog({ initial }: Props) {
  const isEdit = !!initial;
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    try {
      const fd = new FormData(e.currentTarget);
      if (isEdit) {
        await updateEvent(initial!.id, fd);
        toast.success("Event saved");
      } else {
        await createEvent(fd);
        toast.success("Event added");
      }
      setOpen(false);
      router.refresh();
    } catch {
      toast.error(isEdit ? "Failed to save event" : "Failed to add event");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      {isEdit ? (
        <button
          onClick={() => setOpen(true)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-sm font-mono px-2 py-1 hover:text-[var(--accent)]"
          style={{ color: "var(--muted-foreground)" }}
          title="Edit"
        >
          ✎
        </button>
      ) : (
        <Button onClick={() => setOpen(true)}>Add Event</Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-2xl tracking-wide uppercase">
              {isEdit ? "Edit Event" : "New Event"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Event Name</Label>
              <Input id="name" name="name" required placeholder="e.g. Summer Block Party" defaultValue={initial?.name} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" required defaultValue={initial?.date} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="landingUrl">Landing URL</Label>
              <Input id="landingUrl" name="landingUrl" type="url" required placeholder="https://..." defaultValue={initial?.landingUrl} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="Brief description..." rows={3} defaultValue={initial?.description} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? "Saving..." : isEdit ? "Save" : "Add Event"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
