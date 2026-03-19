"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPrintOrder, updatePrintOrder } from "@/app/actions/print-orders";
import { toast } from "sonner";

interface Initial {
  id: string;
  quantity: number;
  orderedAt: string;
  notes: string;
  flyerLabel: string;
}

interface Props {
  flyers: { id: string; event: { name: string }; design: { name: string } }[];
  initial?: Initial;
}

export function CreatePrintOrderDialog({ flyers, initial }: Props) {
  const isEdit = !!initial;
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [flyerId, setFlyerId] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const fd = new FormData(e.currentTarget);
    try {
      if (isEdit) {
        await updatePrintOrder(initial!.id, fd);
        toast.success("Print order saved");
      } else {
        fd.set("flyerId", flyerId);
        await createPrintOrder(fd);
        setFlyerId("");
        toast.success("Print order logged");
      }
      setOpen(false);
      router.refresh();
    } catch {
      toast.error(isEdit ? "Failed to save print order" : "Failed to log print order");
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
        <Button onClick={() => setOpen(true)}>Log Print Order</Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-2xl tracking-wide uppercase">
              {isEdit ? "Edit Print Order" : "New Print Order"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {isEdit ? (
              <div className="space-y-1.5">
                <Label>Flyer</Label>
                <p className="text-sm px-3 py-2 border rounded" style={{ color: "var(--muted-foreground)", borderColor: "var(--border)" }}>
                  {initial!.flyerLabel}
                </p>
              </div>
            ) : (
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
            )}
            <div className="space-y-1.5">
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" name="quantity" type="number" min="1" required placeholder="e.g. 100" defaultValue={initial?.quantity} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="orderedAt">Order Date</Label>
              <Input id="orderedAt" name="orderedAt" type="date" defaultValue={initial?.orderedAt} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" placeholder="Print vendor, paper type, etc." rows={2} defaultValue={initial?.notes} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={pending || (!isEdit && !flyerId)}>
                {pending ? "Saving..." : isEdit ? "Save" : "Log Order"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
