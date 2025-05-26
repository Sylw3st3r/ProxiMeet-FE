import { useState, useRef, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  List,
  ListItem,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { AuthContext } from "../../authentication/auth-context";

type Message = {
  sender: number;
  message: string;
};

export function ChatWindow({
  eventId,
  messages,
  onSend,
}: {
  eventId: number;
  messages: Message[];
  onSend: (message: string) => void;
}) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { id } = useContext(AuthContext);
  const theme = useTheme();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <Paper
      elevation={12}
      sx={{
        width: 320,
        display: "flex",
        flexDirection: "column",
        height: 400,
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid #ddd",
          bgcolor: "primary.main",
          color: "primary.contrastText",
        }}
      >
        <Typography variant="h6">Event Chat #{eventId}</Typography>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 2,
          bgcolor: "background.default",
        }}
      >
        <List dense>
          {messages.map((msg, i) => {
            const isUser = msg.sender === id;
            const bgColor = isUser
              ? theme.palette.primary.dark
              : theme.palette.primary.light;
            const textColor = theme.palette.getContrastText(bgColor);
            const prevSender = i > 0 ? messages[i - 1].sender : null;
            const showCaption = !isUser && msg.sender !== prevSender;

            return (
              <Box key={i}>
                {showCaption && (
                  <Typography
                    variant="caption"
                    sx={{
                      ml: 1,
                      mb: 0.5,
                      color: theme.palette.text.secondary,
                    }}
                  >
                    User {msg.sender}
                  </Typography>
                )}
                <ListItem
                  sx={{
                    justifyContent: isUser ? "flex-end" : "flex-start",
                    display: "flex",
                    pb: 0.5,
                    pr: !isUser ? 3 : 0,
                    pl: isUser ? 3 : 0,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "90%",
                      bgcolor: bgColor,
                      color: textColor,
                      p: 1.5,
                      borderRadius: 2,
                      textAlign: isUser ? "right" : "left",
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                      overflowWrap: "break-word",
                    }}
                  >
                    <Typography variant="body2" sx={{ color: textColor }}>
                      {msg.message}
                    </Typography>
                  </Box>
                </ListItem>
              </Box>
            );
          })}
          <div ref={messagesEndRef} />
        </List>
      </Box>

      <Box
        sx={{
          p: 1,
          borderTop: "1px solid #ddd",
          display: "flex",
          gap: 1,
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Type a message"
          size="small"
          fullWidth
          value={input}
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
    </Paper>
  );
}
