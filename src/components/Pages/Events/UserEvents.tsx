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
} from "@mui/material";
import { Outlet, useNavigate } from "react-router";
import axios from "axios";
import { AuthContext } from "../../../authentication/auth-context";

const ExpandableCard = ({ item }: any) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const edit = (id: number) => {
    navigate(`edit/${id}`);
  };

  return (
    <Card sx={{ mb: 2, backgroundColor: theme.palette.background.paper }}>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" } }}>
        <CardMedia
          component="img"
          sx={{
            width: { sm: 250 },
            height: { xs: 200, sm: "auto" },
            objectFit: "cover",
          }}
          image={`http://localhost:3001/images/${item.image}`}
          alt={item.name}
        />
        <CardContent sx={{ flex: 1 }}>
          <Typography component="h2" variant="h6">
            {item.name}
          </Typography>
          <Box sx={{ textAlign: "right", px: 2, pb: 2 }}>
            <Button size="small" onClick={() => setExpanded(!expanded)}>
              {expanded ? "Show less" : "Show more"}
            </Button>
            <Button size="small" onClick={() => edit(item.id)}>
              Edit
            </Button>
          </Box>
        </CardContent>
      </Box>

      <Divider />

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {item.description}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

const UserEvents = () => {
  const { token } = useContext(AuthContext);
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [search, setSearch] = useState("");
  const [data, setData] = useState<{
    events: { name: string; id: number; description: string; image: string }[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  } | null>(null);

  const navigate = useNavigate();

  const getData = async () => {
    const response = await axios.get(
      `http://localhost:3001/events/own?search=${search}&page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    setData(response.data);
  };

  useEffect(() => {
    getData();
  }, [search, page, limit]);

  if (!data) {
    return <LinearProgress />;
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
        <Select
          value={limit}
          onChange={(event) => {
            setLimit(event.target.value);
            setPage(1);
          }}
          autoWidth
          size="small"
        >
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </Select>
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

      <Box sx={{ maxWidth: 900, margin: "auto", padding: 2 }}>
        {data.events.map((item, index) => (
          <ExpandableCard key={index} item={item} />
        ))}
      </Box>

      <Outlet context={{ reloadEvents: getData }} />
    </Box>
  );
};

export default UserEvents;
