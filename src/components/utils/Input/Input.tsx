import { TextField } from "@mui/material";
import { useField } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";

export default function FormInput({ name, placeholder, ...other }: any) {
  const [fields, meta] = useField(name);
  const { t } = useTranslation();

  const configuration = {
    ...fields,
    ...other,
  };

  if (meta && meta.touched && meta.error) {
    configuration.error = true;
    configuration.helperText = meta.error;
  }

  return (
    <TextField
      {...configuration}
      helperText={t(configuration.helperText) || ""}
      placeholder={t(configuration.placeholder)}
      label={t(configuration.label)}
    />
  );
}
