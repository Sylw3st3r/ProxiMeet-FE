import React, { useState } from "react";
import { Grid, Box, LinearProgress } from "@mui/material";
import { Outlet } from "react-router";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import EventCard from "./EventCard";
import AllEventsToolbar from "./AllEventsToolbar";

const getData = async (
  signal: AbortSignal,
  search: string,
  page: number,
  limit: number,
) => {
  const response = await axios.get(
    `http://localhost:3001/events/all?search=${search}&page=${page}&limit=${limit}`,
    {
      signal,
    },
  );
  return response.data;
};

export default function AllEvents() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(20);

  const [selectedCard, setSelectedCard] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["events", { search, page, limit }],
    queryFn: ({ signal }) => getData(signal, search, page, limit),
  });

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
      ></AllEventsToolbar>
      {isLoading ? (
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
      <Outlet></Outlet>
    </Box>
  );
}
