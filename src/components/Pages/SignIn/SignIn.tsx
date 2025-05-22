import { useContext } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { Box, Button, Typography, useTheme } from "@mui/material";
import FormInput from "../../Form/FormInput";
import { AuthContext } from "../../../authentication/auth-context";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { signin } from "../../../vendor/auth-vendor";

const INPUT_FIELDS_DEFINITIONS = [
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
];

const VALIDATOR = Yup.object({
  email: Yup.string().required("auth.form.email.required"),
  password: Yup.string().required("auth.form.password.required"),
});

const INITIAL_VALUES = {
  email: "",
  password: "",
};

export default function SignIn() {
  const { logIn } = useContext(AuthContext);
  const { t } = useTranslation();
  const theme = useTheme();

  const { mutate, isPending } = useMutation({
    mutationFn: signin,
    onSuccess: (userData) => {
      logIn(userData);
    },
  });

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

            <Button loading={isPending} type="submit" variant="contained">
              {t("auth.signin")}
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
              {t("auth.signup")}
            </Button>
          </Box>
        </Form>
      </Formik>
    </Box>
  );
}
