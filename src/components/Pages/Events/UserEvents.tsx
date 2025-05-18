import React, { useContext, useEffect, useState } from "react";
import {
  CardContent,
  CardMedia,
  Typography,
  Card,
  Box,
  useTheme,
  Pagination,
  TextField,
  Button,
  LinearProgress,
  Collapse,
  Divider,
  Toolbar,
  Select,
  MenuItem,
  Grid,
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
    `http://localhost:3001/events/own?search=${search}&page=${page}&limit=${limit}`,
    {
      signal,
    },
  );
  return response.data;
};

const UserEvents = () => {
  const { token } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["user-events", { search, page, limit }],
    queryFn: ({ signal }) => getData(signal, search, page, limit),
  });

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
      </AllEventsToolbar>
      {isLoading ? (
        <LinearProgress color="primary" />
      ) : (
        <Grid p={2} container spacing={3} justifyContent={"center"}>
          {(data as any).events.map((item: any, index: number) => (
            <Grid key={index} style={{ flexGrow: 1, maxWidth: 220 }}>
              <EventCard
                onEditClick={() => {
                  {
                    navigate(`edit/${item.id}`);
                  }
                }}
                key={item.id}
                event={item}
              ></EventCard>
            </Grid>
          ))}
        </Grid>
      )}
      <Outlet context={{ refetch }}></Outlet>
    </Box>
  );
};

export default UserEvents;
