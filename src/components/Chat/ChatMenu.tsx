import {
  Badge,
  Box,
  CircularProgress,
  Fab,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ChatIcon from "@mui/icons-material/Chat";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { getEventsByUnreadCount } from "../../vendor/events-vendor";

interface ChatMenuProps {
  eventsWithUnreadMessages: number[];
  setActiveChat: (event: {
    event_id: number;
    event_name: string;
    last_message_timestamp: number | null;
  }) => void;
}

const PAGE_SIZE = 20;

export function ChatMenu({
  setActiveChat,
  eventsWithUnreadMessages,
}: ChatMenuProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["events-by-unread"],
      queryFn: ({ pageParam, signal }) =>
        getEventsByUnreadCount(signal, pageParam, PAGE_SIZE),
      getNextPageParam: (lastPage, pages) =>
        lastPage.totalPages > pages.length ? pages.length + 1 : undefined,
      initialPageParam: 1,
    });

  const [open, setOpen] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!observerRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  const allEvents = data?.pages.flatMap((page) => page.events) ?? [];

  const handleToggleMenu = () => setOpen((prev) => !prev);

  const handleCloseMenu = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpen(false);
  };

  return (
    <Box ref={anchorRef}>
      <Fab
        color="primary"
        onClick={handleToggleMenu}
        sx={
          eventsWithUnreadMessages.length
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
        {eventsWithUnreadMessages.length ? (
          <Badge
            badgeContent={eventsWithUnreadMessages.length}
            color="secondary"
          >
            <ChatIcon />
          </Badge>
        ) : (
          <ChatIcon />
        )}
      </Fab>

      <Menu
        open={open}
        onClose={handleCloseMenu}
        anchorEl={anchorRef.current}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            width: 340,
            minHeight: 500,
            maxHeight: 500,
            overflowY: "auto",
            borderRadius: 0,
            p: 0,
            boxShadow: 6,
          },
        }}
        MenuListProps={{
          disablePadding: true,
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            backgroundColor: "primary.dark",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={600}
            color="primary.contrastText"
          >
            Event group chats
          </Typography>
        </Box>

        {isLoading ? (
          <Stack alignItems="center" p={2}>
            <CircularProgress size={24} />
          </Stack>
        ) : allEvents.length ? (
          <>
            {allEvents.map((event) => {
              const hasUnread = eventsWithUnreadMessages.includes(
                event.event_id,
              );
              return (
                <MenuItem
                  key={event.event_id}
                  onClick={() => {
                    setOpen(false);
                    setActiveChat(event);
                  }}
                  sx={{
                    borderRadius: 0,
                    alignItems: "flex-start",
                    px: 2,
                    py: 1.2,
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    width="100%"
                  >
                    {hasUnread && (
                      <FiberManualRecordIcon
                        color="secondary"
                        sx={{
                          width: "12px",
                          height: "12px",
                          animation: "blink 1s infinite",
                          "@keyframes blink": {
                            "0%": { opacity: 1 },
                            "50%": { opacity: 0 },
                            "100%": { opacity: 1 },
                          },
                        }}
                      />
                    )}
                    <Box sx={{ overflow: "hidden" }}>
                      <Typography
                        variant="body1"
                        noWrap
                        fontWeight={500}
                        sx={{ lineHeight: 1.3 }}
                      >
                        {event.event_name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                      >
                        {event.last_message_timestamp
                          ? new Date(
                              event.last_message_timestamp,
                            ).toLocaleString()
                          : "No messages yet"}
                      </Typography>
                    </Box>
                  </Stack>
                </MenuItem>
              );
            })}

            {hasNextPage && (
              <Box
                ref={observerRef}
                display="flex"
                justifyContent="center"
                py={1}
              >
                {isFetchingNextPage && <CircularProgress size={20} />}
              </Box>
            )}
          </>
        ) : (
          <MenuItem disabled sx={{ px: 2, py: 2 }}>
            <ListItemText primary="No chats available" />
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
}
