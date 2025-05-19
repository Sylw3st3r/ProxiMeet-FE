import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { Box, Button, Typography, useTheme } from "@mui/material";
import FormInput from "../../Form/Input";
import FormButton from "../../Form/FormButton";
import axios from "axios";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";

const VALIDATOR = Yup.object({
  email: Yup.string().required("email.required").email("email.invalid"),
});

const INITIAL_VALUES = {
  email: "",
};

const handleSubmit = async (data: { email: string }) => {
  return axios.post("http://localhost:3001/users/request-password-reset", data);
};

export default function RequestPasswordReset() {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate, isPending } = useMutation({
    mutationFn: handleSubmit,
    onSuccess: () => {
      enqueueSnackbar("Check your inbox for password reset", {
        variant: "success",
      });
      handleClick();
    },
  });

  const handleClick = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: theme.palette.background.default,
      }}
    >
      <Formik
        initialValues={{ ...INITIAL_VALUES }}
        onSubmit={(data: any) => mutate(data)}
        validationSchema={VALIDATOR}
      >
        <Form>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "300px",
              p: 3,
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              boxShadow: theme.shadows[3],
            }}
          >
            <Typography
              variant="h6"
              noWrap
              color="primary"
              sx={{ textAlign: "center", mb: 2 }}
            >
              ProxiMeet
            </Typography>

            <FormInput
              variant="standard"
              {...{
                name: "email",
                label: "email.label",
                placeholder: "email.placeholder",
                type: "email",
              }}
            />

            <FormButton loading={isPending}>Request password change</FormButton>

            <Typography
              textAlign="center"
              color="text.secondary"
              sx={{ my: 2 }}
            >
              {t("or")}
            </Typography>

            <Button
              loading={isPending}
              onClick={handleClick}
              variant="outlined"
            >
              {t("signin")}
            </Button>
          </Box>
        </Form>
      </Formik>
    </Box>
  );
}
