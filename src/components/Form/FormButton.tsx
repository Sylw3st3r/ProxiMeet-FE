import { Button } from "@mui/material";
import { useFormikContext } from "formik";
import React from "react";

export default function FormButton({ children, ...other }: any) {
  const { submitForm } = useFormikContext();

  return (
    <Button {...other} onClick={submitForm}>
      {children}
    </Button>
  );
}
