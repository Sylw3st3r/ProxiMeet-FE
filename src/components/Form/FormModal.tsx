import React from "react";
import { Formik, Form } from "formik";
import { Box, Dialog, useTheme, Typography, Button } from "@mui/material";
import ImageUpload from "./ImageUpload";
import FormInput from "./Input";
import { InputFieldDefinition } from "./input-field-definition.type";
import * as Yup from "yup";
import LocationPicker from "./LocationPicker";

type FormModalProps<T extends string> = {
  handleSubmit: any;
  INITIAL_VALUES: Record<
    T,
    string | null | Blob | { lat: number; lng: number }
  >;
  INPUT_FIELDS_DEFINITIONS: Record<T, InputFieldDefinition>;
  VALIDATOR: Yup.ObjectSchema<Record<T, any>>;
};

export default function FormModal<T extends string>({
  handleSubmit,
  INITIAL_VALUES,
  VALIDATOR,
  INPUT_FIELDS_DEFINITIONS,
}: FormModalProps<T>) {
  const theme = useTheme();

  return (
    <Dialog open={true} maxWidth="sm" fullWidth>
      <Formik
        initialValues={{ ...INITIAL_VALUES }}
        onSubmit={handleSubmit}
        validationSchema={VALIDATOR}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "80vh",
                bgcolor: theme.palette.background.default,
                borderRadius: 2,
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  p: 2,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="h6">Add Event</Typography>
              </Box>

              {/* Scrollable Content */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  p: 4,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {(Object.keys(INPUT_FIELDS_DEFINITIONS) as T[]).map((key) => {
                  const definition = INPUT_FIELDS_DEFINITIONS[key];
                  switch (definition.type) {
                    case "image":
                      return (
                        <ImageUpload key={key} name={key} {...definition} />
                      );
                    case "location":
                      return (
                        <LocationPicker key={key} name={key} {...definition} />
                      );
                    default:
                      return (
                        <FormInput
                          variant="standard"
                          key={key}
                          name={key}
                          {...definition}
                        />
                      );
                  }
                })}
              </Box>

              {/* Footer (always visible) */}
              <Box
                sx={{
                  p: 2,
                  borderTop: `1px solid ${theme.palette.divider}`,
                  textAlign: "right",
                }}
              >
                <Button type="submit" variant="contained">
                  Add Event
                </Button>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
