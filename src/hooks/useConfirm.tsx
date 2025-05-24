import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
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
    <Dialog
      open={open}
      onClose={onCancel}
      keepMounted
      PaperProps={{
        sx: {
          borderRadius: 1, // Subtle, sharp corners
          px: 3,
          pt: 2,
          pb: 1,
          boxShadow: 6,
          minWidth: 500, // Wider layout
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: "1.25rem", pb: 1 }}>
        {t(title)}
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 2 }}>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{ justifyContent: "flex-end", gap: 1.5, pt: 1, pb: 1.5 }}
      >
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{
            textTransform: "none",
            borderRadius: 1,
            minWidth: 100,
          }}
        >
          {t("common.cancel")}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="primary"
          sx={{
            textTransform: "none",
            borderRadius: 1,
            minWidth: 100,
          }}
        >
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
