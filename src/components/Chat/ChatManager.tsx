import { useState, useRef } from "react";
import { ChatWindow } from "./ChatWindow";
import { useWebSocket } from "./useWebSocket";
import { Box, Fab, Badge } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { useQuery } from "@tanstack/react-query";
import { getChatEvents } from "../../vendor/events-vendor";
import { Message } from "./useChatMessages";
import { ChatMenu } from "./ChatMenu";
import { client } from "../..";

export function ChatManager() {
  // Messages recived websockets
  const [chats, setChats] = useState<{ [event_id: number]: Message[] }>({});
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Returns count of unread messages
  // All unread messages since he joined
  // And all unread messages up to the moment he left event
  const { data } = useQuery({
    queryKey: ["unread-chat"],
    queryFn: ({ signal }) => getChatEvents(signal),
  });

  const anchorRef = useRef<HTMLDivElement>(null);

  // Send message via Websockets
  const { sendMessage } = useWebSocket((incomingMessage: Message) => {
    const { event_id } = incomingMessage;
    setChats((prev) => ({
      ...prev,
      [event_id]: [...(prev[event_id] || []), incomingMessage],
    }));
    // On message recieved refetch state of unread messages
    client.invalidateQueries({ queryKey: ["unread-chat"] });
  });

  const handleSelectChat = (eventId: number) => {
    setActiveChatId(eventId);
    setMenuOpen(false);
  };

  const handleToggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleCloseMenu = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setMenuOpen(false);
  };

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
      <Box ref={anchorRef}>
        <Fab
          color="primary"
          onClick={handleToggleMenu}
          sx={
            data
              ? {
                  animation: "pulse 1.2s infinite ease-in-out",
                  "@keyframes pulse": {
                    "0%": { transform: "scale(1)", boxShadow: 3 },
                    "50%": { transform: "scale(1.1)", boxShadow: 6 },
                    "100%": { transform: "scale(1)", boxShadow: 3 },
                  },
                }
              : undefined
          }
        >
          {data ? (
            <Badge badgeContent={data} color="secondary">
              <ChatIcon />
            </Badge>
          ) : (
            <ChatIcon />
          )}
        </Fab>

        {/* Move to sidebar when ready, Probably will have to turn Manager into provider */}
        <ChatMenu
          anchorEl={anchorRef.current}
          open={menuOpen}
          onClose={handleCloseMenu}
          onSelectChat={handleSelectChat}
        />
      </Box>

      {activeChatId && (
        <ChatWindow
          onClose={() => setActiveChatId(null)}
          key={activeChatId}
          eventId={activeChatId}
          liveMessages={chats[activeChatId] || []}
          onSend={(msg) => sendMessage(activeChatId, msg)}
        />
      )}
    </Box>
  );
}
