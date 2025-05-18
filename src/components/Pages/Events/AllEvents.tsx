import React, { useContext, useEffect, useState } from "react";
import {
  Grid,
  Box,
  useTheme,
  Pagination,
  TextField,
  Button,
  Toolbar,
  LinearProgress,
  Select,
  MenuItem,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router";
import axios from "axios";
import { AuthContext } from "../../../authentication/auth-context";
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

  const cardWidth = 220;

  const { data, isLoading, error } = useQuery({
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
            <Grid key={index} style={{ flexGrow: 1, maxWidth: cardWidth }}>
              <EventCard key={item.id} event={item}></EventCard>
            </Grid>
          ))}
        </Grid>
      )}
      <Outlet></Outlet>
    </Box>
  );
}
