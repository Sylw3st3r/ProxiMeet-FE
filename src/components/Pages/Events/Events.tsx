import React, { useState } from "react";
import {
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Card,
  Box,
  useTheme,
} from "@mui/material";
import { Outlet, useLoaderData } from "react-router";
const CardGrid = () => {
  const { data } = useLoaderData();
  const [events, setEvents] = useState<
    { name: string; id: number; description: string; image: string }[]
  >(data.events);
  const cardWidth = 220;

  return (
    <Box p={2}>
      <Grid container spacing={3} justifyContent={"center"}>
        {[...events, ...events, ...events, ...events, ...events].map(
          (item, index) => (
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
          ),
        )}
      </Grid>
      <Outlet></Outlet>
    </Box>
  );
};

export default CardGrid;
