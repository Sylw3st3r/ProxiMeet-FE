import { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAllNotifications,
  markAllAsSeen,
  markSelectedAsSeen,
  markSelectedAsUnseen,
} from "../../../vendor/notifications-vendor";
import { useConfirm } from "../../../hooks/useConfirm";
import { client } from "../../..";
import { PaginatedNotifications } from "../../../model/notification";
import InboxNotification from "./InboxNotification";

import { IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { ChecklistSharp } from "@mui/icons-material";
import CommonToolbar from "../../Toolbar/CommonToolbar";
import useQueryParamControls from "../../../hooks/useQueryParamsControls";

// Hook resposnible for handling state of selected notifications
function useSelectedNotifications(data?: PaginatedNotifications) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const isSelected = (id: number) => selectedIds.includes(id);

  // Clear selectedIds when new data is fetched
  useEffect(() => {
    setSelectedIds([]);
  }, [data]);

  return {
    selectedIds,
    isSelected,
    toggleSelect,
  };
}

// Hook responsible for handling fetching of notifications
function useInboxNotifications(search: string, page: number, limit: number) {
  const { data, isPending: notificationsPending } = useQuery({
    queryKey: ["notifications", { search, page, limit }],
    queryFn: ({ signal }) => getAllNotifications(signal, search, page, limit),
  });

  return { data, notificationsPending };
}

// Hook responsible for handling marking all notifications as seen
// Even those that aren't visible in inbox (those that are on different pages)
// Thats why we confirm it with user
function useMarkAllNotificationsAsSeen() {
  const { confirm, ConfirmDialogComponent } = useConfirm();

  const markAllAsSeenHandler = async () => {
    const userConfirmed = await confirm({
      title: "Are you sure you want to mark all notifications as seen?",
      message: "There is no reverse button.",
    });
    if (!userConfirmed) return;
    return markAllAsSeen();
  };

  const { mutate: markAllAsSeenMutation, isPending: markAllPending } =
    useMutation({
      mutationFn: markAllAsSeenHandler,
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ["notifications"] });
        client.invalidateQueries({ queryKey: ["unseen-notifications-count"] });
      },
    });

  return { markAllAsSeenMutation, ConfirmDialogComponent, markAllPending };
}

// Hook responsible for handling marking all selected notifications as seen
function useMarkSelectedNotificationsAsSeen() {
  const {
    mutate: markSelectedAsSeenMutation,
    isPending: markSelectedAsSeenPending,
  } = useMutation({
    mutationFn: markSelectedAsSeen,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["notifications"] });
      client.invalidateQueries({ queryKey: ["unseen-notifications-count"] });
    },
  });

  return { markSelectedAsSeenMutation, markSelectedAsSeenPending };
}

// Hook responsible for handling marking all selected notifications as unseen
function useMarkSelectedNotificationsAsUnseen() {
  const {
    mutate: markSelectedAsUnseenMutation,
    isPending: markSelectedAsUnseenPending,
  } = useMutation({
    mutationFn: markSelectedAsUnseen,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["notifications"] });
      client.invalidateQueries({ queryKey: ["unseen-notifications-count"] });
    },
  });

  return { markSelectedAsUnseenMutation, markSelectedAsUnseenPending };
}

// Hook responsible for data fetching, mutations and state manipulation of Inbox component
function useInboxControls() {
  // Handles query params
  const params = useQueryParamControls();
  // Handles notification data requests
  const { data, notificationsPending } = useInboxNotifications(
    params.debouncedSearch,
    params.page,
    params.limit,
  );
  // Handles state of selected notifications
  const { toggleSelect, isSelected, selectedIds } =
    useSelectedNotifications(data);
  // Handles request for marking all notifications as seen
  const { markAllAsSeenMutation, ConfirmDialogComponent, markAllPending } =
    useMarkAllNotificationsAsSeen();
  // Handles request for marking selected notifications as seen
  const { markSelectedAsSeenMutation, markSelectedAsSeenPending } =
    useMarkSelectedNotificationsAsSeen();
  // Handles request for marking selected notifications as unseen
  const { markSelectedAsUnseenMutation, markSelectedAsUnseenPending } =
    useMarkSelectedNotificationsAsUnseen();

  const noNotifications = !(
    data?.notifications && data.notifications.length > 0
  );
  const noSelectedNotifications = !selectedIds.length;

  // Inbox toolbar (with action buttons) + Confirmation popup
  const InboxControls = (
    <>
      {ConfirmDialogComponent}
      <CommonToolbar
        isLoading={
          notificationsPending ||
          markAllPending ||
          markSelectedAsSeenPending ||
          markSelectedAsUnseenPending
        }
        {...params}
        totalPages={data?.totalPages}
      >
        <Tooltip title="Mark all as seen">
          <span>
            <IconButton
              disabled={noNotifications}
              size="small"
              onClick={() => markAllAsSeenMutation()}
            >
              <ChecklistSharp />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Mark selected as seen">
          <span>
            <IconButton
              disabled={noSelectedNotifications}
              size="small"
              onClick={() => markSelectedAsSeenMutation(selectedIds)}
            >
              <VisibilityIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Mark selected as unseen">
          <span>
            <IconButton
              disabled={noSelectedNotifications}
              size="small"
              onClick={() => markSelectedAsUnseenMutation(selectedIds)}
            >
              <VisibilityOffIcon />
            </IconButton>
          </span>
        </Tooltip>
      </CommonToolbar>
    </>
  );

  return {
    data,
    markAllAsSeenMutation,
    InboxControls,
    toggleSelect,
    isSelected,
  };
}

export default function Inbox() {
  const { data, InboxControls, toggleSelect, isSelected } = useInboxControls();

  const noData = data === undefined || data.notifications.length === 0;

  return (
    <>
      {InboxControls}
      <Box sx={{ maxWidth: 600, margin: "auto", mt: 4 }}>
        {noData ? (
          <Typography
            variant="body1"
            sx={{ textAlign: "center", color: "text.secondary", mt: 4 }}
          >
            No notifications to show.
          </Typography>
        ) : (
          data.notifications.map((notification) => (
            <InboxNotification
              key={notification.id}
              notification={notification}
              isSelected={isSelected}
              toggleSelect={toggleSelect}
            />
          ))
        )}
      </Box>
    </>
  );
}
