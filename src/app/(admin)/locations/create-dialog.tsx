"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createLocation, updateLocation } from "@/app/actions/locations";
import { toast } from "sonner";

interface Initial {
  id: string;
  name: string;
  address: string;
  notes: string;
}

interface Props {
  initial?: Initial;
}

export function CreateLocationDialog({ initial }: Props) {
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
        await updateLocation(initial!.id, fd);
        toast.success("Location saved");
      } else {
        await createLocation(fd);
        toast.success("Location added");
      }
      setOpen(false);
      router.refresh();
    } catch {
      toast.error(isEdit ? "Failed to save location" : "Failed to add location");
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
        <Button onClick={() => setOpen(true)}>Add Location</Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-2xl tracking-wide uppercase">
              {isEdit ? "Edit Location" : "New Location"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Store Name</Label>
              <Input id="name" name="name" required placeholder="e.g. Grove Street Coffee" defaultValue={initial?.name} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" required placeholder="123 Main St, City" defaultValue={initial?.address} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" placeholder="Hours, contact, any useful details..." rows={3} defaultValue={initial?.notes} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? "Saving..." : isEdit ? "Save" : "Add Location"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
