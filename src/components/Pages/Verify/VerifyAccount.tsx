import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";

export default function VerifyAccount() {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography>Account was activated. You can sign in</Typography>
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
