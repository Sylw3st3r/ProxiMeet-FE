import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { Box, Button, Typography, useTheme } from "@mui/material";
import FormInput from "../../Form/FormInput";
import { useNavigate, useParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../../../vendor/auth-vendor";

const VALIDATOR = Yup.object({
  token: Yup.string().required("auth.form.token.required"),
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

function useResetPassword() {
  const navigate = useNavigate();

  const { mutate: resetPasswordMutate, isPending: passwordResetPending } =
    useMutation({
      mutationFn: resetPassword,
      onSuccess: () => {
        navigate("/");
      },
    });

  return { resetPasswordMutate, passwordResetPending };
}

export default function PasswordReset() {
  const { resetPasswordMutate, passwordResetPending } = useResetPassword();
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const params = useParams();

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
        initialValues={{
          token: params.token || "",
          password: "",
          matchingPassword: "",
        }}
        onSubmit={(data) => resetPasswordMutate(data)}
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
                name: "password",
                label: "auth.form.password.label",
                placeholder: "auth.form.password.placeholder",
                type: "password",
              }}
            />

            <FormInput
              variant="standard"
              {...{
                name: "matchingPassword",
                label: "auth.form.matchingPassword.label",
                placeholder: "auth.form.matchingPassword.placeholder",
                type: "password",
              }}
            />

            <Button
              loading={passwordResetPending}
              type="submit"
              variant="contained"
            >
              {t("auth.resetPassword")}
            </Button>

            <Typography
              textAlign="center"
              color="text.secondary"
              sx={{ my: 2 }}
            >
              {t("common.or")}
            </Typography>

            <Button
              loading={passwordResetPending}
              onClick={() => {
                navigate("/");
              }}
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
