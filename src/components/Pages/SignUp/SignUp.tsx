import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { Box, Button, Typography, useTheme } from "@mui/material";
import FormInput from "../../Form/FormInput";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { signup } from "../../../vendor/auth-vendor";
import { AxiosError } from "axios";

const INPUT_FIELDS_DEFINITIONS = [
  {
    name: "firstName",
    label: "auth.form.firstName.label",
    placeholder: "auth.form.firstName.placeholder",
    type: "text",
  },
  {
    name: "lastName",
    label: "auth.form.lastName.label",
    placeholder: "auth.form.lastName.placeholder",
    type: "text",
  },
  {
    name: "email",
    label: "auth.form.email.label",
    placeholder: "auth.form.email.placeholder",
    type: "email",
  },
  {
    name: "password",
    label: "auth.form.password.label",
    placeholder: "auth.form.password.required",
    type: "password",
  },
  {
    name: "matchingPassword",
    label: "auth.form.matchingPassword.label",
    placeholder: "auth.form.matchingPassword.placeholder",
    type: "password",
  },
];

const VALIDATOR = Yup.object({
  firstName: Yup.string().required("auth.form.firstName.required"),
  lastName: Yup.string().required("auth.form.lastName.required"),
  email: Yup.string()
    .required("auth.form.email.required")
    .email("auth.form.email.invalid"),
  password: Yup.string().required("auth.form.password.required"),
  matchingPassword: Yup.string()
    .required("auth.form.password.required")
    .test(
      "passwords-match",
      "auth.form.matchingPassword.mustMatch",
      function (value) {
        return this.parent.password === value;
      },
    ),
});

const INITIAL_VALUES = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  matchingPassword: "",
};

export default function SignUp() {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      handleClick();
    },
    onError: (error: AxiosError<{ errorDescription: string }>) => {
      enqueueSnackbar(
        error.response?.data?.errorDescription ||
          "Something went wrong! Try again later",
        { variant: "error" },
      );
    },
  });
  const { enqueueSnackbar } = useSnackbar();

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
        onSubmit={(data) => mutate(data)}
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

            {INPUT_FIELDS_DEFINITIONS.map((definition, index) => (
              <FormInput variant="standard" key={index} {...definition} />
            ))}

            <Button loading={isPending} type="submit" variant="contained">
              {t("auth.signup")}
            </Button>

            <Typography
              textAlign="center"
              color="text.secondary"
              sx={{ my: 2 }}
            >
              {t("common.or")}
            </Typography>

            <Button
              loading={isPending}
              onClick={handleClick}
              variant="outlined"
            >
              {t("auth.signin")}
            </Button>
          </Box>
        </Form>
      </Formik>
    </Box>
  );
}
