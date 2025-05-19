import React, { useContext } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { Box, Button, Typography, useTheme } from "@mui/material";
import FormInput from "../../Form/Input";
import FormButton from "../../Form/FormButton";
import axios from "axios";
import { AuthContext } from "../../../authentication/auth-context";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { client } from "../../..";
import { useSnackbar } from "notistack";

const INPUT_FIELDS_DEFINITIONS = [
  {
    name: "email",
    label: "email.label",
    placeholder: "email.placeholder",
    type: "email",
  },
  {
    name: "password",
    label: "password.label",
    placeholder: "password.required",
    type: "password",
  },
];

const VALIDATOR = Yup.object({
  email: Yup.string().required("email.required"),
  password: Yup.string().required("password.required"),
});

const INITIAL_VALUES = {
  email: "",
  password: "",
};

const handleSubmit = async (data: any) => {
  return await axios.post("http://localhost:3001/users/signin", data);
};

export default function SignIn() {
  const { logIn } = useContext(AuthContext);
  const { t } = useTranslation();
  const theme = useTheme();

  const { mutate, isPending } = useMutation({
    mutationFn: handleSubmit,
    onSuccess: (response) => {
      logIn(response.data);
    },
    onError: () => {
      enqueueSnackbar("Couldn't add event!", { variant: "error" });
    },
  });
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  function handleClick() {
    navigate("/signup");
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: theme.palette.background.paper,
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
              backgroundColor: "background.paper",
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

            {INPUT_FIELDS_DEFINITIONS.map((definition, index) => (
              <FormInput variant="standard" key={index} {...definition} />
            ))}

            <FormButton loading={isPending}>Signin</FormButton>

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
              {t("signup")}
            </Button>
          </Box>
        </Form>
      </Formik>
    </Box>
  );
}
