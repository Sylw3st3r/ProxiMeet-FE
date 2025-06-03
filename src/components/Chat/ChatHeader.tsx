import { Box, Typography, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CloseIcon from "@mui/icons-material/Close";

export function ChatHeader({
  event,
  collapsed,
  onToggleCollapse,
  onClose,
  hasUnread,
}: {
  event: {
    event_id: number;
    event_name: string;
    last_message_timestamp: number | null;
  };
  collapsed: boolean;
  onToggleCollapse: () => void;
  onClose: () => void;
  hasUnread: boolean;
}) {
  return (
    <Box
      sx={(theme) => ({
        p: 1,
        borderBottom: "1px solid #ddd",
        bgcolor: "primary.main",
        color: "primary.contrastText",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        animation: hasUnread ? "pulseBg 1.6s infinite ease-in-out" : "none",
        "@keyframes pulseBg": {
          "0%": {
            backgroundColor: theme.palette.primary.light,
          },
          "50%": {
            backgroundColor: theme.palette.primary.dark,
          },
          "100%": {
            backgroundColor: theme.palette.primary.light,
          },
        },
      })}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        {event.event_name}
      </Typography>

      <Box>
        <IconButton
          size="small"
          onClick={onToggleCollapse}
          sx={{ color: "inherit" }}
          aria-label="toggle collapse"
        >
          {collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </IconButton>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ color: "inherit" }}
          aria-label="close chat"
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
