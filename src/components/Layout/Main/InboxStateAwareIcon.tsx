import { useQuery } from "@tanstack/react-query";
import { getUnseenNotificationsCount } from "../../../vendor/notifications-vendor";
import { Badge } from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";

function useInboxPolling() {
  // Polling every 30s to check if we have something new in inbox
  // At the beggining used websockets to inform user about new notification
  // Decided that it was an overkill
  const { data } = useQuery({
    queryKey: ["unseen-notifications-count"],
    queryFn: ({ signal }) => getUnseenNotificationsCount(signal),
    refetchInterval: 30000,
  });

  return { data };
}

export default function InboxStateAwareIcon() {
  const { data } = useInboxPolling();

  return data ? (
    <Badge badgeContent={data} color="secondary">
      <MailIcon />
    </Badge>
  ) : (
    <MailIcon />
  );
}
