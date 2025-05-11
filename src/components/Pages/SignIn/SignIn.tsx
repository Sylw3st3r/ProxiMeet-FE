import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { Box, Button, Typography } from "@mui/material";
import FormInput from "../../utils/Input/Input";
import FormButton from "../../utils/FormButton/FormButton";

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
  email: Yup.string().required("email.required").email("email.invalid"),
  password: Yup.string().required("password.required"),
});

const INITIAL_VALUES = {
  email: "",
  password: "",
};

export default function SignIn() {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Formik
        initialValues={{ ...INITIAL_VALUES }}
        onSubmit={(signupData) => console.log(signupData)}
        validationSchema={VALIDATOR}
      >
        <Form>
          <Box
            sx={{ display: "flex", flexDirection: "column", width: "300px" }}
          >
            {INPUT_FIELDS_DEFINITIONS.map((definition, index) => (
              <FormInput variant="standard" key={index} {...definition} />
            ))}
            <FormButton>Signin</FormButton>
            <Typography textAlign="center">{t("or")}</Typography>
            <Button>{t("signup")}</Button>
          </Box>
        </Form>
      </Formik>
    </Box>
  );
}
