import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { HTMLInputTypeAttribute, useState } from "react";
import { useTranslation } from "react-i18next";

interface PromptInputDialogProps {
  open: boolean;
  title?: string;
  message: string;
  label?: string;
  confirmText?: string;
  cancelText?: string;
  type?: HTMLInputTypeAttribute;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

function PromptInputDialog({
  open,
  title = "common.confirm",
  message,
  type = "text",
  label = "common.enterValue",
  confirmText = "common.confirm",
  cancelText = "common.cancel",
  onConfirm,
  onCancel,
}: PromptInputDialogProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!value.trim()) {
      setError(t("common.required"));
      return;
    }
    onConfirm(value);
    setValue("");
    setError("");
  };

  const handleCancel = () => {
    onCancel();
    setValue("");
    setError("");
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      keepMounted
      PaperProps={{
        sx: {
          borderRadius: 1,
          px: 3,
          pt: 2,
          pb: 1,
          boxShadow: 6,
          minWidth: 500,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: "1.25rem", pb: 1 }}>
        {t(title)}
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 2 }}>
        <Typography variant="body1" color="text.secondary" mb={2}>
          {t(message)}
        </Typography>
        <TextField
          label={t(label)}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          fullWidth
          error={!!error}
          helperText={error}
          autoFocus
          type={type}
        />
      </DialogContent>

      <DialogActions
        sx={{ justifyContent: "flex-end", gap: 1.5, pt: 1, pb: 1.5 }}
      >
        <Button
          onClick={handleCancel}
          variant="outlined"
          sx={{ textTransform: "none", borderRadius: 1, minWidth: 100 }}
        >
          {t(cancelText)}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          sx={{ textTransform: "none", borderRadius: 1, minWidth: 100 }}
        >
          {t(confirmText)}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function usePromptInput() {
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    props: Omit<PromptInputDialogProps, "open" | "onConfirm" | "onCancel">;
    resolve: (value: string | null) => void;
  } | null>(null);

  const prompt = (
    props: Omit<PromptInputDialogProps, "open" | "onConfirm" | "onCancel">,
  ): Promise<string | null> => {
    return new Promise((resolve) => {
      setDialogState({ open: true, props, resolve });
    });
  };

  const handleConfirm = (value: string) => {
    dialogState?.resolve(value);
    setDialogState(null);
  };

  const handleCancel = () => {
    dialogState?.resolve(null);
    setDialogState(null);
  };

  const PromptInputComponent = dialogState ? (
    <PromptInputDialog
      open={dialogState.open}
      {...dialogState.props}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  ) : null;

  return { prompt, PromptInputComponent };
}
