import { TextField, TextFieldVariants } from "@mui/material";
import { useField } from "formik";
import { useTranslation } from "react-i18next";

export default function FormInput({
  name,
  ...other
}: {
  name: string;
  type?: string;
  multilane?: boolean;
  label: string;
  placeholder: string;
  variant?: TextFieldVariants;
}) {
  const [fields, meta] = useField(name);
  const { t } = useTranslation();

  const configuration = {
    ...fields,
    ...other,
    error: false,
    helperText: "",
  };

  if (meta && meta.touched && meta.error) {
    configuration.error = true;
    configuration.helperText = meta.error;
  }

  return (
    <TextField
      {...configuration}
      helperText={t(configuration.helperText)}
      placeholder={t(configuration.placeholder)}
      label={t(configuration.label)}
    />
  );
}
