import React, { useState } from "react";
import { Box, Button, LinearProgress, Grid } from "@mui/material";
import { Outlet, useNavigate } from "react-router";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import AllEventsToolbar from "./AllEventsToolbar";
import { client } from "../../..";
import EventCard from "./EventCard";
import DeleteEventConfirmationPrompt from "./Forms/DeleteEventConfirmationPrompt";

const deleteEventRequest = async (event: any) => {
  return await axios.delete(`http://localhost:3001/events/delete/${event.id}`);
};

const getData = async (
  signal: AbortSignal,
  search: string,
  page: number,
  limit: number,
) => {
  const response = await axios.get(
    `http://localhost:3001/events/own?search=${search}&page=${page}&limit=${limit}`,
    {
      signal,
    },
  );
  return response.data;
};

const UserEvents = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [deletionConfirmationOpen, setDeletionConfirmationOpen] =
    useState(false);

  const { mutate: deleteEvent, isPending: deletionPending } = useMutation({
    mutationFn: deleteEventRequest,
    onSuccess: async () => {
      client.invalidateQueries({ queryKey: ["user-events"] });
      client.invalidateQueries({ queryKey: ["events"] });
      setSelectedCard(null);
      closeDeletionConfirmationPrompt();
    },
  });

  const { data, isPending } = useQuery({
    queryKey: ["user-events", { search, page, limit }],
    queryFn: ({ signal }) => getData(signal, search, page, limit),
  });

  const openDeletionConfirmationPrompt = () => {
    setDeletionConfirmationOpen(true);
  };

  const closeDeletionConfirmationPrompt = () => {
    setDeletionConfirmationOpen(false);
  };

  const navigate = useNavigate();

  return (
    <Box>
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
          variant={"contained"}
          onClick={() => {
            navigate("add");
          }}
        >
          Add
        </Button>
        <Box flex={1} />
        <Button
          disabled={!selectedCard || isPending}
          variant={"contained"}
          onClick={() => {
            navigate(`edit/${selectedCard}`);
          }}
        >
          Edit
        </Button>
        <Box flex={1} />

        <Button
          disabled={!selectedCard || isPending}
          variant={"contained"}
          onClick={openDeletionConfirmationPrompt}
        >
          Delete
        </Button>
      </AllEventsToolbar>
      {isPending ? (
        <LinearProgress color="primary" />
      ) : (
        <Grid p={2} container spacing={3} justifyContent={"center"}>
          {(data as any).events.map((item: any, index: number) => (
            <Grid key={index} style={{ flexGrow: 1, maxWidth: 220 }}>
              <EventCard
                key={item.id}
                event={item}
                selected={item.id === selectedCard?.id}
                setSelected={() => {
                  item.id === selectedCard?.id
                    ? setSelectedCard(null)
                    : setSelectedCard(item);
                }}
              />
            </Grid>
          ))}
        </Grid>
      )}
      {deletionConfirmationOpen && (
        <DeleteEventConfirmationPrompt
          deleteEvent={deleteEvent}
          isPending={deletionPending}
          handleClose={closeDeletionConfirmationPrompt}
          event={selectedCard}
        ></DeleteEventConfirmationPrompt>
      )}
      <Outlet></Outlet>
    </Box>
  );
};

export default UserEvents;
