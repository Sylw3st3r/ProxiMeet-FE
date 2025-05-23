import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { verifyUser } from "../../../vendor/auth-vendor";

function useVerifyUser() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: verifyUserMutate } = useMutation({
    mutationFn: verifyUser,
    onSuccess: () => {
      enqueueSnackbar("Account activated!", { variant: "success" });
      navigate("/");
    },
    onError: () => {
      enqueueSnackbar("Something went wrong! Couldn't activate account!", {
        variant: "error",
      });
    },
  });

  return { verifyUserMutate };
}

export default function VerifyAccount() {
  const { verifyUserMutate } = useVerifyUser();
  let { token } = useParams();

  useEffect(() => {
    if (token) {
      verifyUserMutate(token);
    }
  }, [verifyUserMutate, token]);

  return <></>;
}
