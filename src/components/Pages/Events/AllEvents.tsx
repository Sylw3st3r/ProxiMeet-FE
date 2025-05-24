import {
  Grid,
  ButtonGroup,
  Tooltip,
  IconButton,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import EventCard from "./EventCard";
import { useConfirm } from "../../../hooks/useConfirm";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import {
  checkEventOverlapHandler,
  attendEvent,
  getAllEventsData,
  resignFromAttendingEvent,
} from "../../../vendor/events-vendor";
import { client } from "../../..";
import { useTranslation } from "react-i18next";
import CommonToolbar from "../../Toolbar/CommonToolbar";
import useQueryParamControls from "../../../hooks/useQueryParamsControls";

function useAllEventsData(search: string, page: number, limit: number) {
  // Fetch all events
  const { data, isPending: allEventsPending } = useQuery({
    queryKey: ["events", { search, page, limit }],
    queryFn: ({ signal }) => getAllEventsData(signal, search, page, limit),
  });

  return { data, allEventsPending };
}

function useAttendEventMutation() {
  const { confirm, ConfirmDialogComponent } = useConfirm();
  const { t } = useTranslation();

  // Check if there are overlapping events
  // If yes then confirm with user that we want to proceed
  // If there are no overlapping events then proceed
  const attendEventRequestHandler = async (id: number) => {
    const overlapingEvents = await checkEventOverlapHandler(id);

    if (overlapingEvents.length) {
      // Wait for confirmation
      const userConfirmed = await confirm({
        title: t("event.overlap_confirm_title"),
        message: t("event.overlap_confirm_message", {
          events: overlapingEvents.map((event) => event.name).join(", "),
        }),
      });
      if (!userConfirmed) {
        return;
      }
    }
    return attendEvent(id);
  };

  const { mutate: attendEventMutation, isPending: attendEventPending } =
    useMutation({
      mutationFn: attendEventRequestHandler,
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ["user-events"] });
        client.invalidateQueries({ queryKey: ["events"] });
      },
    });

  return { ConfirmDialogComponent, attendEventMutation, attendEventPending };
}

function useResignFromAttendEvent() {
  const {
    mutate: resignFromAttendEventMutation,
    isPending: resignFromEventPending,
  } = useMutation({
    mutationFn: resignFromAttendingEvent,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["user-events"] });
      client.invalidateQueries({ queryKey: ["events"] });
    },
  });
  return { resignFromAttendEventMutation, resignFromEventPending };
}

// Hook responsible for data fetching, mutations and state manipulation of AllEvents component
function useAllEventsController() {
  // Handles query params
  const params = useQueryParamControls();
  // Handles events data requests
  const { data, allEventsPending } = useAllEventsData(
    params.debouncedSearch,
    params.page,
    params.limit,
  );
  // Handles request for marking events as being attended by himself
  const { attendEventMutation, ConfirmDialogComponent, attendEventPending } =
    useAttendEventMutation();
  // Handles request for resigning from attendeding event
  const { resignFromAttendEventMutation, resignFromEventPending } =
    useResignFromAttendEvent();

  // AllEvents toolbar + Confirmation popup
  const AllEventsControls = (
    <>
      {ConfirmDialogComponent}
      <CommonToolbar
        isLoading={
          allEventsPending || attendEventPending || resignFromEventPending
        }
        {...params}
        totalPages={data?.totalPages}
      />
    </>
  );

  return {
    data,
    AllEventsControls,
    resignFromAttendEventMutation,
    attendEventMutation,
  };
}

export default function AllEvents() {
  const {
    data,
    AllEventsControls,
    attendEventMutation,
    resignFromAttendEventMutation,
  } = useAllEventsController();
  const { t } = useTranslation();

  const noData = data === undefined || data.events.length === 0;

  return (
    <>
      {AllEventsControls}
      {noData ? (
        <Typography
          variant="body1"
          sx={{ textAlign: "center", color: "text.secondary", mt: 4 }}
        >
          No events to show.
        </Typography>
      ) : (
        <Grid p={2} container spacing={3} justifyContent={"center"}>
          {data.events.map((event, index: number) => (
            <Grid key={event.id} style={{ flexGrow: 1, maxWidth: 220 }}>
              <EventCard event={event}>
                <ButtonGroup>
                  {event.attending ? (
                    <Tooltip title={t("event.resign")}>
                      <IconButton
                        onClick={() => {
                          resignFromAttendEventMutation(event.id);
                        }}
                      >
                        <PersonRemoveIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title={t("event.attend")}>
                      <IconButton
                        onClick={() => {
                          attendEventMutation(event.id);
                        }}
                      >
                        <HowToRegIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </ButtonGroup>
              </EventCard>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
