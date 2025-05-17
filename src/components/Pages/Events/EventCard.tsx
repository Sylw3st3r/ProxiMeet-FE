import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Skeleton,
  Typography,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import ImageIcon from "@mui/icons-material/Image";
import { useNavigate } from "react-router";

export default function EventCard({
  event,
  onEditClick,
}: {
  event: { id: number; name: string; description: string; image: string };
  onEditClick?: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      elevation={4}
    >
      <Box sx={{ position: "relative", width: 220, aspectRatio: "16/9" }}>
        {!loaded && (
          <>
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              sx={{ position: "absolute", top: 0, left: 0 }}
            />
            <ImageIcon
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "rgba(0,0,0,0.3)",
              }}
              fontSize="large"
            />
          </>
        )}

        <CardMedia
          component="img"
          sx={{
            aspectRatio: "16/9",
            objectFit: "cover",
          }}
          width="220"
          image={`http://localhost:3001/images/${event.image}`}
          onLoad={() => setLoaded(true)}
          style={{
            display: loaded ? "block" : "none",
            objectFit: "cover",
          }}
        />
      </Box>

      <CardContent>
        <Typography variant="h6" gutterBottom>
          {event.name}
        </Typography>
        <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
          {onEditClick && (
            <Button variant={"outlined"} onClick={onEditClick}>
              Edit
            </Button>
          )}
          {!onEditClick && (
            <Typography variant="body2" color="text.secondary">
              {event.description}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
