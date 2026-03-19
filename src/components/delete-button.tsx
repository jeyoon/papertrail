"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

interface DeleteButtonProps {
  id: string;
  action: (id: string) => Promise<void>;
  label?: string;
  title?: string;
  description?: string;
}

export function DeleteButton({
  id,
  action,
  label = "×",
  title = "Delete this item?",
  description,
}: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleConfirm() {
    setPending(true);
    try {
      await action(id);
      setOpen(false);
      toast.success("Deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={pending}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-sm font-mono px-2 py-1 hover:text-[var(--accent)] disabled:opacity-30"
        style={{ color: "var(--muted-foreground)" }}
        title="Delete"
      >
        {label}
      </button>

      <Dialog open={open} onClose={() => !pending && setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle
          sx={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: "1.15rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            pb: description ? 0 : undefined,
          }}
        >
          {title}
        </DialogTitle>
        {description && (
          <DialogContent>
            <DialogContentText sx={{ fontSize: "0.875rem" }}>
              {description}
            </DialogContentText>
          </DialogContent>
        )}
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setOpen(false)}
            disabled={pending}
            variant="outlined"
            size="small"
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={pending}
            variant="contained"
            color="error"
            size="small"
            sx={{ textTransform: "none" }}
          >
            {pending ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
