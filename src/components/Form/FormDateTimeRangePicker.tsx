import { useFormikContext, useField } from "formik";
import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";
import {
  LocalizationProvider,
  DateTimePicker,
  DateTimePickerProps,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

type DateTimePickerChangeValue = DateTimePickerProps["value"];

export default function FormDateTimeRange({
  name,
  labelStart,
  labelEnd,
  disabled,
}: {
  name: string;
  label: string;
  placeholder: string;
  labelStart: string;
  labelEnd: string;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const { setFieldValue } = useFormikContext();

  const [startField, startMeta] = useField(`${name}.start`);
  const [endField, endMeta] = useField(`${name}.end`);

  const handleChange = (
    fieldName: string,
    value: DateTimePickerChangeValue,
  ) => {
    setFieldValue(fieldName, value);
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container spacing={2}>
        <DateTimePicker
          label={t(labelStart)}
          value={startField.value}
          disabled={disabled}
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
          disabled={disabled}
          onChange={(val) => handleChange(`${name}.end`, val)}
          ampm={false}
          slotProps={{
            textField: {
              fullWidth: true,
              variant: "standard",
              error: Boolean(endMeta.touched && endMeta.error),
              helperText: t(
                endMeta.touched && endMeta.error ? t(endMeta.error) : "",
              ),
            },
          }}
        />
      </Grid>
    </LocalizationProvider>
  );
}
