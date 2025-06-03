import { useState, useContext } from "react";
import { ChatWindow } from "./ChatWindow";
import { useWebSocket } from "./useWebSocket";
import { Box, Fab, Badge } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getChatEvents, markMessagesAsRead } from "../../vendor/events-vendor";
import { Message } from "./useChatMessages";
import { ChatMenu } from "./ChatMenu";
import { AuthContext } from "../../authentication/auth-context";

function useUnreadStatus() {
  // List of events with unread messages recieved via websockets
  // We hold it in state so that we don't fetch status each time we recieve a new message
  const [eventsWithUnreadMessage, setEventsWithUnreadMessage] = useState<
    number[]
  >([]);

  // Function for adding new event to the unread state
  function addNewEventWithUnreadMessage(event_id: number) {
    setEventsWithUnreadMessage((previous) => {
      return Array.from(new Set([...previous, event_id]));
    });
  }

  // Returns array of event ids for all events with any unread message
  const { data, refetch } = useQuery({
    queryKey: ["unread-chat"],
    queryFn: async ({ signal }) => {
      const response = await getChatEvents(signal);
      setEventsWithUnreadMessage([]);
      return response;
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const { mutate: markAsReadMutation } = useMutation({
    mutationFn: markMessagesAsRead,
    onSuccess() {
      refetch();
    },
  });

  // List of unique events with unread messages
  const combinedEventsWithUnreadMessage = Array.from(
    new Set([...(data || []), ...eventsWithUnreadMessage]),
  );

  return {
    combinedEventsWithUnreadMessage,
    addNewEventWithUnreadMessage,
    markAsReadMutation,
  };
}

export function ChatManager() {
  // Messages recived websockets
  const [chats, setChats] = useState<{ [event_id: number]: Message[] }>({});
  const { id } = useContext(AuthContext);
  const [activeChat, setActiveChat] = useState<{
    event_id: number;
    event_name: string;
    last_message_timestamp: number | null;
  } | null>(null);

  const {
    combinedEventsWithUnreadMessage,
    addNewEventWithUnreadMessage,
    markAsReadMutation,
  } = useUnreadStatus();

  // Send message via Websockets
  const { sendMessage } = useWebSocket((incomingMessage: Message) => {
    const { event_id, sender } = incomingMessage;
    setChats((prev) => ({
      ...prev,
      [event_id]: [...(prev[event_id] || []), incomingMessage],
    }));
    // If user is the sender the we know that he read that message (because he sent it). Thats why we ignore recieved message
    if (id !== sender?.id) {
      addNewEventWithUnreadMessage(event_id);
    }
  });

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        zIndex: 100,
      }}
    >
      <ChatMenu
        setActiveChat={setActiveChat}
        eventsWithUnreadMessages={combinedEventsWithUnreadMessage}
      />
      {activeChat && (
        <ChatWindow
          hasUnread={combinedEventsWithUnreadMessage.includes(
            activeChat.event_id,
          )}
          onClose={() => setActiveChat(null)}
          key={activeChat.event_id}
          event={activeChat}
          liveMessages={chats[activeChat.event_id] || []}
          onSend={(msg) => sendMessage(activeChat.event_id, msg)}
          markAsRead={() => {
            markAsReadMutation(activeChat.event_id);
          }}
        />
      )}
    </Box>
  );
}
