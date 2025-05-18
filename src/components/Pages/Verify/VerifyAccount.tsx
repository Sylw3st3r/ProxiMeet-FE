import { Box } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

const verifyToken = async (token: string) => {
  return axios.post(`http://localhost:3001/users/verify`, {
    token,
  });
};

export default function VerifyAccount() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  let params = useParams();

  const { mutate } = useMutation({
    mutationFn: verifyToken,
    onSuccess: () => {
      enqueueSnackbar("Account activated!", { variant: "success" });
      navigate("/");
    },
    onError: () => {
      enqueueSnackbar("Couldn't add event!", { variant: "error" });
    },
  });

  useEffect(() => {
    if (params.token) {
      mutate(params.token);
    }
  }, []);

  return <Box></Box>;
}
