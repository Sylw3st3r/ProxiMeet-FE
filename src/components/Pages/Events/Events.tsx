import React, { useContext, useEffect, useState } from "react";
import {
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Card,
  Box,
  useTheme,
  Pagination,
  TextField,
  Button,
  Toolbar,
} from "@mui/material";
import { Outlet, useLoaderData, useNavigate } from "react-router";
import axios from "axios";
import { AuthContext } from "../../../authentication/auth-context";
const CardGrid = () => {
  const { token } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [data, setData] = useState<{
    events: { name: string; id: number; description: string; image: string }[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  } | null>(null);
  const cardWidth = 220;

  const theme = useTheme();

  const navigate = useNavigate();

  const [prevSearchRef, setPrevSearchRef] = useState(""); // start with empty string or initial value

  const getData = async (search: string, page: number) => {
    const response = await axios.get(
      `http://localhost:3001/events/all?search=${search}&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    setData(response.data);
  };

  useEffect(() => {
    if (search !== prevSearchRef && page !== 1) {
      // Search changed → reset page but do NOT fetch yet
      setPage(1);
    } else {
      // Either page changed or it's initial load → fetch data
      getData(search, page);
    }

    // Always update previous search after comparison
    setPrevSearchRef(search);
  }, [search, page]);

  if (!data) {
    return <Typography>AAAAA</Typography>;
  }

  return (
    <Box>
      <Toolbar
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          position: "sticky",
          top: 0,
          zIndex: 200,
          bgcolor: theme.palette.background.paper,
          flexWrap: "wrap",
        }}
      >
        <TextField
          size="small"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
        <Box sx={{ flex: 1 }} />
        <Pagination
          count={data.totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          variant="outlined"
          color="primary"
        />
        <Button onClick={() => navigate("add")}>Add</Button>
      </Toolbar>
      <Grid p={2} container spacing={3} justifyContent={"center"}>
        {data.events.map((item, index) => (
          <Grid key={index} style={{ flexGrow: 1, maxWidth: cardWidth }}>
            <Card
              sx={{
                width: cardWidth,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
              elevation={4}
            >
              <CardMedia
                component="img"
                image={`http://localhost:3001/images/${item.image}`}
                alt={item.name}
                sx={{
                  aspectRatio: "16/9",
                  objectFit: "cover",
                }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Outlet></Outlet>
    </Box>
  );
};

export default CardGrid;
