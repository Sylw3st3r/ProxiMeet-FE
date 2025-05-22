import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { verifyUser } from "../../../vendor/auth-vendor";

export default function VerifyAccount() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  let params = useParams();

  const { mutate } = useMutation({
    mutationFn: verifyUser,
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
  }, [mutate, params.token]);

  return <></>;
}
