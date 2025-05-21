import React, { useState } from "react";
import { Box, Button, LinearProgress, Grid, ButtonGroup } from "@mui/material";
import { Outlet, useNavigate } from "react-router";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import AllEventsToolbar from "./AllEventsToolbar";
import { client } from "../../..";
import EventCard from "./EventCard";
import {
  deleteEventRequest,
  getAllUserData,
} from "../../../vendor/events-vendor";
import { useConfirm } from "../../../hooks/useConfirm";
import { Event } from "../../../model/event";

const UserEvents = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const { confirm, ConfirmDialogComponent } = useConfirm();

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
      <AllEventsToolbar
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
          disabled={deletionPending}
          variant={"contained"}
          onClick={() => {
            navigate("add");
          }}
        >
          Add
        </Button>
        <Box flex={1} />
      </AllEventsToolbar>
      {isPending ? (
        <LinearProgress color="primary" />
      ) : data ? (
        <Grid p={2} container spacing={3} justifyContent={"center"}>
          {data.events.map((event, index: number) => (
            <Grid key={index} style={{ flexGrow: 1, maxWidth: 220 }}>
              <EventCard key={event.id} event={event}>
                <ButtonGroup>
                  <Button
                    disabled={deletionPending}
                    onClick={() => {
                      navigate(`edit/${event.id}`);
                    }}
                    size="small"
                  >
                    Edit
                  </Button>
                  <Button
                    loading={deletionPending}
                    onClick={() => {
                      deleteEventMutation(event);
                    }}
                    size="small"
                  >
                    Delete
                  </Button>
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
