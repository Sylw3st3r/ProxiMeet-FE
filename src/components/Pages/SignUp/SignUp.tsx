import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { Box, Button, Typography, useTheme } from "@mui/material";
import FormInput from "../../Form/Input";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { signup } from "../../../vendor/auth-vendor";
import { AxiosError } from "axios";

const INPUT_FIELDS_DEFINITIONS = [
  {
    name: "firstName",
    label: "firstName.label",
    placeholder: "firstName.placeholder",
    type: "text",
  },
  {
    name: "lastName",
    label: "lastName.label",
    placeholder: "lastName.placeholder",
    type: "text",
  },
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
  {
    name: "matchingPassword",
    label: "matchingPassword.label",
    placeholder: "matchingPassword.placeholder",
    type: "password",
  },
];

const VALIDATOR = Yup.object({
  firstName: Yup.string().required("firstName.required"),
  lastName: Yup.string().required("lastName.required"),
  email: Yup.string().required("email.required").email("email.invalid"),
  password: Yup.string().required("password.required"),
  matchingPassword: Yup.string()
    .required("password.required")
    .test("passwords-match", "matchingPassword.match", function (value) {
      return this.parent.password === value;
    }),
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
              signup
            </Button>

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
