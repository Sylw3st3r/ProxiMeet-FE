import React, { useContext } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { Box, Button, Typography, TextField } from "@mui/material";
import FormInput from "../../Form/Input";
import FormButton from "../../Form/FormButton";
import { AuthContext } from "../../../authentication/auth-context";
import axios from "axios";
import { useNavigate } from "react-router";

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

  const handleSubmit = async (data: any) => {
    console.log(data);

    let response;
    try {
      response = await axios.put("http://localhost:3001/users/signup", data);
    } catch (error) {
      console.log(error);
    }

    console.log(response);
  };

  const navigate = useNavigate();

  function handleClick() {
    navigate("/");
  }

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
        onSubmit={handleSubmit}
        validationSchema={VALIDATOR}
      >
        <Form>
          <Box
            sx={{ display: "flex", flexDirection: "column", width: "300px" }}
          >
            {INPUT_FIELDS_DEFINITIONS.map((definition, index) => (
              <FormInput variant="standard" key={index} {...definition} />
            ))}
            <FormButton>signup</FormButton>
            <Typography textAlign="center">{t("or")}</Typography>
            <Button onClick={handleClick}>{t("signin")}</Button>
          </Box>
        </Form>
      </Formik>
    </Box>
  );
}
