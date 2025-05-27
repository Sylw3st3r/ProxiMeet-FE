import { useState } from "react";
import { Paper } from "@mui/material";

import { ChatMessageList } from "./ChatMessageList";
import { Message, useChatMessages } from "./useChatMessages";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";

export function ChatWindow({
  eventId,
  onSend,
  onClose,
  liveMessages,
}: {
  eventId: number;
  onSend: (message: string) => void;
  onClose: () => void;
  // Messages recieved via websockets
  liveMessages: Message[];
}) {
  const [collapsed, setCollapsed] = useState(false);

  const { scrollContainerRef, allMessages, isFetchingNextPage } =
    useChatMessages(eventId, liveMessages);

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
        eventId={eventId}
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
          <ChatInput onSend={onSend} />
        </>
      )}
    </Paper>
  );
}
