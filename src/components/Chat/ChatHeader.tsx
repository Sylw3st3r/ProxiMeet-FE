import { Box, Typography, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CloseIcon from "@mui/icons-material/Close";

export function ChatHeader({
  eventId,
  collapsed,
  onToggleCollapse,
  onClose,
}: {
  eventId: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onClose: () => void;
}) {
  return (
    <Box
      sx={{
        p: 1,
        borderBottom: "1px solid #ddd",
        bgcolor: "primary.main",
        color: "primary.contrastText",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        {/* TODO: replace with actuall name of event */}
        Event Chat #{eventId}
      </Typography>

      <Box>
        {/* TODO: add button for marking all events of chat as read */}
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
