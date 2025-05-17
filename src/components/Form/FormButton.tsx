import { Button } from "@mui/material";
import { useFormikContext } from "formik";
import React from "react";

export default function FormButton({ children, loading, ...other }: any) {
  const { submitForm } = useFormikContext();

  return (
    <Button
      loading={loading}
      variant="outlined"
      sx={{ mt: 2 }}
      {...other}
      onClick={submitForm}
    >
      {children}
    </Button>
  );
}
