import React from "react";
import { useFormikContext, useField } from "formik";
import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface Props {
  name: string;
  labelStart?: string;
  labelEnd?: string;
  [key: string]: any;
}

export default function FormDateTimeRange({
  name,
  labelStart = "Start Date",
  labelEnd = "End Date",
}: Props) {
  const { t } = useTranslation();
  const { setFieldValue } = useFormikContext<any>();

  const [startField, startMeta] = useField(`${name}.start`);
  const [endField, endMeta] = useField(`${name}.end`);

  const handleChange = (fieldName: string, value: any) => {
    setFieldValue(fieldName, value);
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container spacing={2}>
        <DateTimePicker
          label={t(labelStart)}
          value={startField.value}
          onChange={(val) => handleChange(`${name}.start`, val)}
          ampm={false}
          slotProps={{
            textField: {
              fullWidth: true,
              variant: "standard",
              error: Boolean(startMeta.touched && startMeta.error),
              helperText:
                startMeta.touched && startMeta.error ? t(startMeta.error) : "",
            },
          }}
        />
        <DateTimePicker
          label={t(labelEnd)}
          value={endField.value}
          onChange={(val) => handleChange(`${name}.end`, val)}
          ampm={false}
          slotProps={{
            textField: {
              fullWidth: true,
              variant: "standard",
              error: Boolean(endMeta.touched && endMeta.error),
              helperText:
                endMeta.touched && endMeta.error ? t(endMeta.error) : "",
            },
          }}
        />
      </Grid>
    </LocalizationProvider>
  );
}
