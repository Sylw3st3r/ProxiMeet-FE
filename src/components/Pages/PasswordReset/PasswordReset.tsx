import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { Box, Button, Typography, useTheme } from "@mui/material";
import FormInput from "../../Form/Input";
import { useNavigate, useParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../../../vendor/auth-vendor";

const VALIDATOR = Yup.object({
  token: Yup.string().required("token.required"),
  password: Yup.string().required("password.required"),
  matchingPassword: Yup.string()
    .required("password.required")
    .test("passwords-match", "matchingPassword.match", function (value) {
      return this.parent.password === value;
    }),
});

export default function PasswordReset() {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  let params = useParams();

  const { mutate, isPending } = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      handleClick();
    },
  });

  const handleClick = () => {
    navigate("/");
  };

  if (!params.token) {
    return <></>;
  }

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
          token: params.token,
          password: "",
          matchingPassword: "",
        }}
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

            <FormInput
              variant="standard"
              {...{
                name: "password",
                label: "password.label",
                placeholder: "password.required",
                type: "password",
              }}
            />

            <FormInput
              variant="standard"
              {...{
                name: "matchingPassword",
                label: "matchingPassword.label",
                placeholder: "matchingPassword.placeholder",
                type: "password",
              }}
            />

            <Button loading={isPending} type="submit" variant="contained">
              Reset password
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
