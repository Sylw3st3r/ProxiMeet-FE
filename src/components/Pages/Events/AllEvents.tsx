import React, { useState } from "react";
import {
  Grid,
  Box,
  LinearProgress,
  ButtonGroup,
  Tooltip,
  IconButton,
} from "@mui/material";
import { Outlet } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import EventCard from "./EventCard";
import AllEventsToolbar from "./AllEventsToolbar";
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

export default function AllEvents() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const { confirm, ConfirmDialogComponent } = useConfirm();

  // Check if there are ovelpaing events
  // If yes then confirm with user that we want to proceed
  // If no then proceed automaticly
  const attendEventRequestHandler = async (id: number) => {
    const overlapingEvents = await checkEventOverlapHandler(id);

    if (overlapingEvents.length) {
      // Wait for confirmation
      const userConfirmed = await confirm({
        title: "Overlap detected. Do you want to proceed anyway?",
        message: `Detected overlap with: ${overlapingEvents.map((event) => event.name).join(", ")}`,
      });
      if (!userConfirmed) {
        return;
      }
    }
    return attendEvent(id);
  };

  const { mutate: attendEventMutation, isPending: attendEventMutationPending } =
    useMutation({
      mutationFn: attendEventRequestHandler,
      onSuccess: () => {
        client.invalidateQueries({ queryKey: ["user-events"] });
        client.invalidateQueries({ queryKey: ["events"] });
      },
    });

  const {
    mutate: resignFromAttendEventMutation,
    isPending: resignFromAttendEventMutationPending,
  } = useMutation({
    mutationFn: resignFromAttendingEvent,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["user-events"] });
      client.invalidateQueries({ queryKey: ["events"] });
    },
  });

  // Fetch all events
  const { data, isLoading } = useQuery({
    queryKey: ["events", { search, page, limit }],
    queryFn: ({ signal }) => getAllEventsData(signal, search, page, limit),
  });

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
      ></AllEventsToolbar>
      {isLoading ? (
        <LinearProgress color="primary" />
      ) : data && data.events.length ? (
        <Grid p={2} container spacing={3} justifyContent={"center"}>
          {data.events.map((event, index: number) => (
            <Grid key={index} style={{ flexGrow: 1, maxWidth: 220 }}>
              <EventCard key={event.id} event={event}>
                <ButtonGroup>
                  {event.attending ? (
                    <Tooltip title="Resign">
                      <IconButton
                        disabled={resignFromAttendEventMutationPending}
                        onClick={() => {
                          resignFromAttendEventMutation(event.id);
                        }}
                      >
                        <PersonRemoveIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Attend">
                      <IconButton
                        disabled={attendEventMutationPending}
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
      ) : (
        <Box />
      )}
      <Outlet></Outlet>
    </Box>
  );
}
