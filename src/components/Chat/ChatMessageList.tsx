import { Box, List } from "@mui/material";
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
      {/* TODO: add visual indicator of more data being loaded */}
      {/* TODO: with the use of debouncing mark messages as read from the newest to the one we scrolled up to */}
      <List dense>
        {messages.map((message, i) => {
          // Find id of the last person who sent a message
          const prevSender = i > 0 ? messages[i - 1].sender_id : null;
          // If the message sender is same as in the previus message then we do not show caption again
          const showCaption =
            message.sender_id !== null && message.sender_id !== prevSender;
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
