import { Box, CircularProgress, LinearProgress, List } from "@mui/material";
import { useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { Message } from "./useChatMessages";

export function ChatMessageList({
  messages,
  collapsed,
  isLoadingMore,
  scrollContainerRef,
}: {
  messages: Message[];
  collapsed: boolean;
  isLoadingMore: boolean;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!collapsed) {
      messagesEndRef.current?.scrollIntoView();
    }
  }, [messages, collapsed]);

  return (
    <Box
      ref={scrollContainerRef}
      sx={{
        flexGrow: 1,
        overflowY: "auto",
        p: 2,
        bgcolor: "background.default",
        position: "relative",
      }}
    >
      {isLoadingMore && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <List dense>
        {messages.map((message, i) => {
          // Find id of the last person who sent a message
          const prevSender = i > 0 ? messages[i - 1]?.sender?.id : null;
          // If the message sender is same as in the previus message then we do not show caption again
          const showCaption =
            message.sender !== null && message.sender.id !== prevSender;
          return (
            <ChatMessage
              key={message.id}
              message={message}
              showCaption={showCaption}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </List>
    </Box>
  );
}
