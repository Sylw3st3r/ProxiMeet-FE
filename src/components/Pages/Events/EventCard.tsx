import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Skeleton,
  Typography,
  CardActions,
} from "@mui/material";
import React, { ReactNode, useState } from "react";
import ImageIcon from "@mui/icons-material/Image";

export default function EventCard({
  event,
  children,
}: {
  event: { id: number; name: string; description: string; image: string };
  children?: ReactNode;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Card
      sx={{
        width: 220,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
      elevation={4}
    >
      {/* Image */}
      <Box sx={{ position: "relative", width: "100%", aspectRatio: "16/9" }}>
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
          image={`http://localhost:3001/images/${event.image}`}
          onLoad={() => setLoaded(true)}
          sx={{
            display: loaded ? "block" : "none",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>
      <CardContent sx={{ height: 180 }}>
        <Typography
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textWrap: "wrap",
          }}
          gutterBottom
          variant="h5"
          component="div"
        >
          {event.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {event.description}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: "center", alignItems: "center" }}>
        {children}
      </CardActions>
    </Card>
  );
}
