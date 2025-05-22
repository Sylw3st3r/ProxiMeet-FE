import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({
  open,
  title = "common.confirm",
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{t(title)}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          {t("common.cancel")}
        </Button>
        <Button onClick={onConfirm} color="primary" variant="contained">
          {t("common.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function useConfirm() {
  const [dialogState, setDialogState] = useState<{
    data: Omit<ConfirmDialogProps, "onConfirm" | "onCancel" | "open">;
    resolve: (result: boolean) => void;
    open: boolean;
  } | null>(null);

  const confirm = (
    data: Omit<ConfirmDialogProps, "onConfirm" | "onCancel" | "open">,
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialogState({ data, resolve, open: true });
    });
  };

  const handleClose = (result: boolean) => {
    if (dialogState) {
      dialogState.resolve(result);
      setDialogState(null);
    }
  };

  const ConfirmDialogComponent = dialogState ? (
    <ConfirmDialog
      open={dialogState.open}
      message={dialogState.data.message}
      title={dialogState.data.title}
      onConfirm={() => handleClose(true)}
      onCancel={() => handleClose(false)}
    />
  ) : null;

  return { confirm, ConfirmDialogComponent };
}
