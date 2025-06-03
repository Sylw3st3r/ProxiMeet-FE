import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";

export function ChatInput({
  onSend,
  markAsRead,
}: {
  onSend: (msg: string) => void;
  markAsRead: () => void;
}) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <Box
      sx={{
        p: 1,
        borderTop: "1px solid #ddd",
        display: "flex",
        gap: 1,
      }}
    >
      {/* TODO: block if user left the group, show information that user cant send more messages */}
      <TextField
        variant="outlined"
        placeholder="Type a message"
        size="small"
        fullWidth
        value={input}
        onFocus={markAsRead}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && input.trim()) {
            handleSend();
          }
        }}
      />
      <IconButton
        color="primary"
        onClick={handleSend}
        disabled={!input.trim()}
        aria-label="send message"
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
}
