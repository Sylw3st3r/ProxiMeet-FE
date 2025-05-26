import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../authentication/auth-context";

const MAX_RETRIES = 10;

export function useWebSocket(onMessage: (data: any) => void) {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const { token } = useContext(AuthContext);

  const connect = () => {
    if (!token) return;

    const ws = new WebSocket(`ws://localhost:3001?token=${token}`);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    ws.onmessage = (event) => {
      console.log("✅ Message recived connected");
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch {}
    };

    ws.onclose = (event) => {
      console.warn(
        `❌ WebSocket closed. Code: ${event.code}, Reason: ${event.reason}`,
      );
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      ws.close(); // Trigger reconnect logic
    };
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      socketRef.current?.close();
    };
  }, [token]);

  const sendMessage = (eventId: number, message: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ eventId, message }));
    } else {
      console.warn("Cannot send message: WebSocket not connected");
    }
  };

  return { sendMessage };
}
