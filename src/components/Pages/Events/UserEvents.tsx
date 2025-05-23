import { useState } from "react";
import {
  Box,
  Button,
  LinearProgress,
  Grid,
  ButtonGroup,
  IconButton,
  Tooltip,
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
import { Add } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import CommonToolabr from "../../Toolbar/CommonToolbar";

const UserEvents = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const { confirm, ConfirmDialogComponent } = useConfirm();
  const { t } = useTranslation();

  // Check if there are ovelpaing events
  // If yes then confirm with user that we want to proceed
  // If no then proceed automaticly
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

  const { mutate: deleteEventMutation, isPending: deletionPending } =
    useMutation({
      mutationFn: deleteEventRequestHandler,
      onSuccess: async () => {
        client.invalidateQueries({ queryKey: ["user-events"] });
        client.invalidateQueries({ queryKey: ["events"] });
      },
    });

  const { data, isPending } = useQuery({
    queryKey: ["user-events", { search, page, limit }],
    queryFn: ({ signal }) => getAllUserData(signal, search, page, limit),
  });

  const navigate = useNavigate();

  return (
    <Box>
      {ConfirmDialogComponent}
      <CommonToolabr
        {...{
          search,
          setSearch,
          page,
          setPage,
          limit,
          setLimit,
          totalPages: data?.totalPages,
        }}
      >
        <Button
          startIcon={<Add />}
          disabled={deletionPending}
          variant={"contained"}
          onClick={() => {
            navigate("add");
          }}
        >
          {t("common.add")}
        </Button>
        <Box flex={1} />
      </CommonToolabr>
      {isPending ? (
        <LinearProgress color="primary" />
      ) : data ? (
        <Grid p={2} container spacing={3} justifyContent={"center"}>
          {data.events.map((event, index: number) => (
            <Grid key={index} style={{ flexGrow: 1, maxWidth: 220 }}>
              <EventCard key={event.id} event={event}>
                <ButtonGroup>
                  <Tooltip title={t("common.edit")}>
                    <IconButton
                      disabled={deletionPending}
                      onClick={() => {
                        navigate(`edit/${event.id}`);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t("common.delete")}>
                    <IconButton
                      loading={deletionPending}
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
      ) : (
        <Box />
      )}
      <Outlet></Outlet>
    </Box>
  );
};

export default UserEvents;
