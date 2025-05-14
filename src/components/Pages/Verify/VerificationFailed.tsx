import { Box, Typography, Button } from "@mui/material";
import { AxiosError } from "axios";
import React from "react";
import { useNavigate, useRouteError } from "react-router";

export default function VerifyFaied() {
  const navigate = useNavigate();
  const error = useRouteError();

  if (
    error instanceof AxiosError &&
    error.response?.data?.errorDescription?.message
  ) {
    return (
      <Box>
        <Typography>{error.response.data.errorDescription.message}</Typography>
        <Button
          onClick={() => {
            navigate("/");
          }}
        >
          SIGIN
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography>Something went wrong! Try again later</Typography>
    </Box>
  );
}
