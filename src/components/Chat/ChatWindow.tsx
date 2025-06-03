import { useState } from "react";
import { Paper } from "@mui/material";

import { ChatMessageList } from "./ChatMessageList";
import { Message, useChatMessages } from "./useChatMessages";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";

export function ChatWindow({
  hasUnread,
  event,
  onSend,
  onClose,
  liveMessages,
  markAsRead,
}: {
  event: {
    event_id: number;
    event_name: string;
    last_message_timestamp: number | null;
  };
  onSend: (message: string) => void;
  onClose: () => void;
  // Messages recieved via websockets
  liveMessages: Message[];
  markAsRead: () => void;
  hasUnread: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const { scrollContainerRef, allMessages, isFetchingNextPage } =
    useChatMessages(event, liveMessages);

  return (
    <Paper
      elevation={12}
      sx={{
        mt: 2,
        width: 320,
        display: "flex",
        flexDirection: "column",
        height: collapsed ? "auto" : 400,
      }}
    >
      <ChatHeader
        hasUnread={hasUnread}
        event={event}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
        onClose={onClose}
      />
      {/* Make it smooth */}
      {!collapsed && (
        <>
          <ChatMessageList
            messages={allMessages}
            collapsed={collapsed}
            isLoadingMore={isFetchingNextPage}
            scrollContainerRef={scrollContainerRef}
          />
          <ChatInput markAsRead={markAsRead} onSend={onSend} />
        </>
      )}
    </Paper>
  );
}
