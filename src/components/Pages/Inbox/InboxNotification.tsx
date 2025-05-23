import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Checkbox,
} from "@mui/material";
import { Notification } from "../../../model/notification";

export default function InboxNotification({
  notification,
  isSelected,
  toggleSelect,
}: {
  notification: Notification;
  isSelected: (id: number) => boolean;
  toggleSelect: (id: number) => void;
}) {
  return (
    <Accordion defaultExpanded={false} sx={{ mb: 1 }}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{
          bgcolor: notification.seen ? "action.hover" : "background.paper",
          color: notification.seen ? "text.disabled" : "text.primary",
        }}
      >
        <Checkbox
          checked={isSelected(notification.id)}
          onChange={() => toggleSelect(notification.id)}
          onClick={(e) => e.stopPropagation()} // Prevent accordion toggle on checkbox click
          onFocus={(e) => e.stopPropagation()}
          sx={{ mr: 2 }}
        />
        <Typography
          variant="subtitle1"
          sx={{ textDecoration: notification.seen ? "line-through" : "none" }}
        >
          {notification.subject}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography
          sx={{
            color: notification.seen ? "text.disabled" : "text.primary",
            whiteSpace: "pre-wrap",
          }}
        >
          {notification.message}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}
