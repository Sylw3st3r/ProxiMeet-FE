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

export default function SignIn() {
  const { setUserData } = useContext(AuthContext);
  const { t } = useTranslation();
  const theme = useTheme();

  const navigate = useNavigate();

  function handleClick() {
    navigate("/signup");
  }

  const handleSubmit = async (data: any) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/users/signin",
        data,
      );
      setUserData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

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
        onSubmit={handleSubmit}
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

            <FormButton>Signin</FormButton>

            <Typography
              textAlign="center"
              color="text.secondary"
              sx={{ my: 2 }}
            >
              {t("or")}
            </Typography>

            <Button onClick={handleClick} variant="outlined">
              {t("signup")}
            </Button>
          </Box>
        </Form>
      </Formik>
    </Box>
  );
}
