import {
  Grid,
  ButtonGroup,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Outlet, useNavigate } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "../../..";
import EventCard from "./EventCard";
import {
  deleteEventRequest,
  getAllUserData,
} from "../../../vendor/events-vendor";
import { useConfirm } from "../../../hooks/useConfirm";
import { Event } from "../../../model/event";
import { AddBoxSharp } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import CommonToolabr from "../../Toolbar/CommonToolbar";
import useQueryParamControls from "../../../hooks/useQueryParamsControls";

function useUserEventsData(search: string, page: number, limit: number) {
  const { data, isPending: userEventsPending } = useQuery({
    queryKey: ["user-events", { search, page, limit }],
    queryFn: ({ signal }) => getAllUserData(signal, search, page, limit),
  });

  return { data, userEventsPending };
}

function useDeleteEventMutation() {
  const { confirm, ConfirmDialogComponent } = useConfirm();

  // Confirm with user that they are sure about this action
  const deleteEventRequestHandler = async (event: Event) => {
    const userConfirmed = await confirm({
      title: `Are you sure you want to delete ${event.name}?`,
      message: "Event will be delited permanently",
    });
    if (!userConfirmed) {
      return;
    }

    return deleteEventRequest(event.id);
  };

  const { mutate: deleteEventMutation, isPending: deleteEventPending } =
    useMutation({
      mutationFn: deleteEventRequestHandler,
      onSuccess: async () => {
        client.invalidateQueries({ queryKey: ["user-events"] });
        client.invalidateQueries({ queryKey: ["events"] });
      },
    });

  return { ConfirmDialogComponent, deleteEventMutation, deleteEventPending };
}

// Hook responsible for data fetching, mutations and state manipulation of UserEvents component
function useUserEventsControler() {
  // Handles query params
  const params = useQueryParamControls();
  // Handles events data requests
  const { data, userEventsPending } = useUserEventsData(
    params.debouncedSearch,
    params.page,
    params.limit,
  );
  // Handles request for deletion of event
  const { deleteEventMutation, ConfirmDialogComponent, deleteEventPending } =
    useDeleteEventMutation();

  const navigate = useNavigate();

  // UserEvents toolbar + Confirmation popup
  const UserEventsControls = (
    <>
      {ConfirmDialogComponent}
      <CommonToolabr
        isLoading={userEventsPending || deleteEventPending}
        {...params}
        totalPages={data?.totalPages}
      >
        <Tooltip title="Add event">
          <span>
            <IconButton size="small" onClick={() => navigate("add")}>
              <AddBoxSharp />
            </IconButton>
          </span>
        </Tooltip>
      </CommonToolabr>
    </>
  );

  return { data, deleteEventMutation, UserEventsControls };
}

const UserEvents = () => {
  const { data, deleteEventMutation, UserEventsControls } =
    useUserEventsControler();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const noData = data === undefined || data.events.length === 0;

  return (
    <>
      {UserEventsControls}
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
            <Grid key={index} style={{ flexGrow: 1, maxWidth: 220 }}>
              <EventCard key={event.id} event={event}>
                <ButtonGroup>
                  <Tooltip title={t("common.edit")}>
                    <IconButton
                      onClick={() => {
                        navigate(`edit/${event.id}`);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t("common.delete")}>
                    <IconButton
                      onClick={() => {
                        deleteEventMutation(event);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ButtonGroup>
              </EventCard>
            </Grid>
          ))}
        </Grid>
      )}
      <Outlet></Outlet>
    </>
  );
};

export default UserEvents;
