import React, { useState } from "react";
import {
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Card,
  Button,
} from "@mui/material";
import { Outlet, useLoaderData, useNavigate } from "react-router";

const EventCard = ({
  name,
  description,
  image,
  id,
}: {
  id: number;
  name: string;
  description: string;
  image: string;
}) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardMedia
        component="img"
        height="200"
        image={`http://localhost:3001/images/${image}`}
        alt={name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        <Button
          onClick={() => {
            navigate(`edit/${id}`);
          }}
        >
          EDIT
        </Button>
      </CardContent>
    </Card>
  );
};

export default function Events() {
  const { data } = useLoaderData();
  const [events, setEvents] = useState<
    { name: string; id: number; description: string; image: string }[]
  >(data.events);

  const updateEvent = (object: {
    id: number;
    organizerId: number;
    name: string;
    description: string;
    location: string;
    image: string;
  }) => {
    setEvents((previousState) => {
      const indexToReplace = previousState.findIndex(
        (event) => event.id === object.id,
      );

      const newState = [...previousState];
      if (indexToReplace !== -1) {
        newState.splice(indexToReplace, 1, object);
      }

      return newState;
    });
  };

  return (
    <Grid
      container
      p={3}
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 6, sm: 8, md: 12 }}
    >
      {events.map((event) => (
        <Grid size={{ xs: 2, sm: 4, md: 4 }} key={event.id}>
          <EventCard
            id={event.id}
            name={event.name}
            description={event.description}
            image={event.image}
          />
        </Grid>
      ))}
      <Outlet context={updateEvent} />
    </Grid>
  );
}
