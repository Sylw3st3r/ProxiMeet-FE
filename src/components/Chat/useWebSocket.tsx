import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../authentication/auth-context";

const MAX_RETRIES = 10;

export function useWebSocket(onMessage: (data: any) => void) {
  const socketRef = useRef<WebSocket | null>(null);
  const retryRef = useRef(0);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const { token } = useContext(AuthContext);

  const connect = () => {
    if (!token) return;

    const ws = new WebSocket(`ws://localhost:3001?token=${token}`);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      retryRef.current = 0; // Reset retry count
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch {}
    };

    ws.onclose = () => {
      console.warn("❌ WebSocket closed. Attempting to reconnect...");
      attemptReconnect();
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      ws.close(); // Trigger reconnect logic
    };
  };

  const attemptReconnect = () => {
    if (retryRef.current < MAX_RETRIES) {
      const delay = Math.min(1000 * 2 ** retryRef.current, 30000);
      reconnectTimeout.current = setTimeout(() => {
        retryRef.current += 1;
        connect();
      }, delay);
    } else {
      console.error("❌ Max WebSocket reconnection attempts reached");
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      socketRef.current?.close();
    };
  }, [token]); // Reconnect when token changes

  const sendMessage = (eventId: number, message: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ eventId, message }));
    } else {
      console.warn("Cannot send message: WebSocket not connected");
    }
  };

  return { sendMessage };
}
