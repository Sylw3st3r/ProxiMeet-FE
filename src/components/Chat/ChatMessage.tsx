import { Box, ListItem, Typography, useTheme, Avatar } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../../authentication/auth-context";
import { Message } from "./useChatMessages";

export function ChatMessage({
  message,
  showCaption,
}: {
  message: Message;
  showCaption: boolean;
}) {
  const theme = useTheme();
  const { id } = useContext(AuthContext);

  // If message does not have sender id then that means that it was a system message
  // For example "User John Doe has joined the chat"
  // We use this flag to aply specific styles
  const isSystem = message.sender === null;
  // If user is the one who send this message the we also want to aply differen styles
  // Messages on the right, different color of the message and no caption
  const isUser = message?.sender?.id === id;

  if (isSystem) {
    return (
      <ListItem sx={{ justifyContent: "center", py: 0.5 }}>
        <Typography
          variant="caption"
          sx={{
            fontStyle: "italic",
            color: theme.palette.text.disabled,
            textAlign: "center",
          }}
        >
          {message.message}
        </Typography>
      </ListItem>
    );
  }

  const bgColor = isUser
    ? theme.palette.primary.dark
    : theme.palette.primary.light;
  const textColor = theme.palette.getContrastText(bgColor);

  return (
    <Box>
      {showCaption && !isUser && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            ml: 1,
            mb: 0.5,
            color: theme.palette.text.secondary,
          }}
        >
          <Avatar
            src={
              message.sender?.avatar
                ? `http://localhost:3001/images/${message.sender?.avatar}`
                : undefined
            }
            sx={{ width: 24, height: 24, mr: 1 }}
          >
            {!message.sender?.avatar && message.sender?.firstName
              ? message.sender.firstName[0]
              : ""}
          </Avatar>
          <Typography variant="caption">
            {`${message.sender?.firstName} ${message.sender?.lastName}`}
          </Typography>
        </Box>
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
          <Typography variant="body2">{message.message}</Typography>
        </Box>
      </ListItem>
    </Box>
  );
}
