import { useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getChatMessages } from "../../vendor/events-vendor";

// move to separate file
export type Message = {
  id: number;
  event_id: number;
  sender: {
    id: number;
    firstName: string;
    lastName: string;
    avatar: string | null;
  } | null;
  message: string;
};

// Split in 2 separate hooks and combine into one
export function useChatMessages(
  event: {
    event_id: number;
    event_name: string;
    last_message_timestamp: number | null;
  },
  liveMessages: Message[],
) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Query for fetching messages that are saved in DB
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["chatMessages", event.event_id],
      queryFn: async ({
        pageParam,
        signal,
      }: {
        pageParam?: number;
        signal: AbortSignal;
      }) => {
        return getChatMessages(signal, event.event_id, pageParam);
      },
      getNextPageParam: (lastPage) => {
        if (!lastPage.hasMore || lastPage.messages.length === 0)
          return undefined;
        // For the next page load we pass id of the oldes message from previous page
        // So that we know from where to start loading more messages
        return lastPage.messages[0].id;
      },
      initialPageParam: undefined,
      refetchOnWindowFocus: false,
    });

  // Fetch more data (if there is any more data to fetch) when scrolling to the top of container
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !hasNextPage || isFetchingNextPage) return;

    const handleScroll = async () => {
      if (container.scrollTop === 0) {
        const prevScrollHeight = container.scrollHeight;

        await fetchNextPage();

        requestAnimationFrame(() => {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - prevScrollHeight;
        });
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const uniqueByIdMap = new Map();

  // Combine messages recieved through Websockets and through rest API
  const combinedMessages = [
    ...(data?.pages.flatMap((page) => page.messages) || []),
    ...liveMessages,
  ];

  // Removing potentiall duplicates of messages
  combinedMessages.forEach((message) => {
    uniqueByIdMap.set(message.id, message); // overwrites duplicates, keeping last one
  });

  // Array of messages in asscending order (newest message is at he bottom)
  const allMessages = Array.from(uniqueByIdMap.values()).sort(
    (a, b) => a.id - b.id,
  );

  return {
    scrollContainerRef,
    allMessages,
    isFetchingNextPage,
    hasNextPage,
  };
}
