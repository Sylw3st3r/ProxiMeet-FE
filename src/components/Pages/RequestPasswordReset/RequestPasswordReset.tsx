import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { Box, Button, Typography, useTheme } from "@mui/material";
import FormInput from "../../Form/FormInput";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { requestPasswordResetToken } from "../../../vendor/auth-vendor";

const VALIDATOR = Yup.object({
  email: Yup.string()
    .required("auth.form.email.required")
    .email("auth.form.email.invalid"),
});

const INITIAL_VALUES = {
  email: "",
};

export default function RequestPasswordReset() {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate, isPending } = useMutation({
    mutationFn: requestPasswordResetToken,
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
                name: "email",
                label: "auth.form.email.label",
                placeholder: "auth.form.email.placeholder",
                type: "email",
              }}
            />

            <Button loading={isPending} type="submit" variant="contained">
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
