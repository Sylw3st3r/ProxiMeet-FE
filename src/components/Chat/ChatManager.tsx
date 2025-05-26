import { useState } from "react";
import { ChatWindow } from "./ChatWindow";
import { useWebSocket } from "./useWebSocket";
import { Box } from "@mui/material";

type ChatMessage = {
  sender: number;
  eventId: number;
  message: string;
  timestamp: number;
};

const MOCK_OPEN_EVENTS = [1, 2];

export function ChatManager() {
  const [chats, setChats] = useState<{ [eventId: number]: ChatMessage[] }>({});

  const { sendMessage } = useWebSocket((incomingMessage: ChatMessage) => {
    const { eventId } = incomingMessage;
    setChats((prev) => ({
      ...prev,
      [eventId]: [...(prev[eventId] || []), incomingMessage],
    }));
  });

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        display: "flex",
        gap: 2,
        maxWidth: "100vw",
        padding: 1,
        zIndex: 100,
      }}
    >
      {MOCK_OPEN_EVENTS.map((eventId) => (
        <ChatWindow
          key={eventId}
          eventId={eventId}
          messages={chats[eventId] || []}
          onSend={(msg) => sendMessage(eventId, msg)}
        />
      ))}
    </Box>
  );
}
