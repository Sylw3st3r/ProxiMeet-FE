import {
  Menu,
  MenuItem,
  Stack,
  Typography,
  Box,
  ListItemText,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useQuery } from "@tanstack/react-query";
import { getEventsByUnreadCount } from "../../vendor/events-vendor";

interface ChatMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: (event: Event | React.SyntheticEvent) => void;
  onSelectChat: (eventId: number) => void;
}

export function ChatMenu({
  anchorEl,
  open,
  onClose,
  onSelectChat,
}: ChatMenuProps) {
  const { data } = useQuery({
    queryKey: ["events-by-unread"],
    queryFn: ({ signal }) => {
      return getEventsByUnreadCount(signal, 1, 20);
    },
  });

  if (!data) {
    return null;
  }

  // TODO: remake entire component,
  // Add infinite scroll to load events with smaller number of unread messages

  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
      transformOrigin={{ vertical: "bottom", horizontal: "right" }}
      PaperProps={{
        sx: {
          minWidth: 280,
          borderRadius: 2,
          p: 1,
          boxShadow: 6,
        },
      }}
    >
      {data.events.length ? (
        data.events.map((event) => {
          const isUnread = event.unread_count > 0;
          return (
            <MenuItem
              key={event.event_id}
              onClick={() => onSelectChat(event.event_id)}
              sx={{
                alignItems: "flex-start",
                borderRadius: 1,
                mb: 0.5,
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                width="100%"
              >
                {isUnread && (
                  // Make it blink when there are unread messages
                  <FiberManualRecordIcon
                    color="error"
                    sx={{ fontSize: 10, mt: 0.5 }}
                  />
                )}
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight={isUnread ? "bold" : "normal"}
                    noWrap
                  >
                    {event.event_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {isUnread
                      ? `${event.unread_count} unread message${event.unread_count > 1 ? "s" : ""}`
                      : "No unread messages"}
                  </Typography>
                </Box>
              </Stack>
            </MenuItem>
          );
        })
      ) : (
        <MenuItem disabled>
          <ListItemText primary="No chats available" />
        </MenuItem>
      )}
    </Menu>
  );
}
