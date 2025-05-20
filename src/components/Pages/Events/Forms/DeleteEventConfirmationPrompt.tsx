import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export default function DeleteEventConfirmationPrompt({
  event,
  handleClose,
  isPending,
  deleteEvent,
}: {
  event: any;
  isPending: boolean;
  deleteEvent: (event: any) => void;
  handleClose: () => void;
}) {
  return (
    <Dialog
      open={true}
      keepMounted
      onClose={isPending ? () => {} : handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{`Are you sure that you want to delete ${event.name}?`}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Deletion will be permanent
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={isPending} onClick={handleClose}>
          Cancel
        </Button>
        <Box flex={1} />
        <Button
          loading={isPending}
          onClick={() => {
            deleteEvent(event);
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
