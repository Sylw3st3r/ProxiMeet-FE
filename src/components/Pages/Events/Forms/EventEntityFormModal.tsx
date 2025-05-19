import React from "react";
import { Formik, Form } from "formik";
import { Box, Dialog, useTheme, Typography, Button } from "@mui/material";
import ImageUpload from "../../../Form/ImageUpload";
import FormInput from "../../../Form/Input";
import * as Yup from "yup";
import LocationPicker from "../../../Form/FormLocationPicker";
import FormDateTimeRangePicker from "../../../Form/FormDateTimeRangePicker";

export type EventEntityFields =
  | "name"
  | "description"
  | "image"
  | "location"
  | "dateTimeRange";

type EventEntityModalProps = {
  handleSubmit: (data: eventSubmitData) => void;
  INITIAL_VALUES: Record<
    EventEntityFields,
    | string
    | null
    | Blob
    | { lat: number; lng: number }
    | { start: Date | null; end: Date | null }
  >;
  VALIDATOR: Yup.ObjectSchema<Record<EventEntityFields, any>>;
  onClose: () => void;
  loading: boolean;
  headerText: string;
  submitButtonText: string;
};

export type eventSubmitData = {
  id?: string;
  name: string;
  description: string;
  image: string | Blob;
  location: {
    lat: number;
    lng: number;
  };
  dateTimeRange: {
    start: Date;
    end: Date;
  };
};

export default function EventEntityFormModal({
  handleSubmit,
  INITIAL_VALUES,
  VALIDATOR,
  loading,
  onClose,
  headerText,
  submitButtonText,
}: EventEntityModalProps) {
  const theme = useTheme();

  return (
    <Dialog onClose={onClose} open={true} maxWidth="sm" fullWidth>
      <Formik
        initialValues={{
          ...(INITIAL_VALUES as eventSubmitData),
        }}
        onSubmit={handleSubmit}
        validationSchema={VALIDATOR}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                maxHeight: "80vh",
                bgcolor: theme.palette.background.default,
                borderRadius: 2,
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: theme.palette.background.paper,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="h6">{headerText}</Typography>
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
                <FormInput
                  variant="standard"
                  {...{
                    name: "name",
                    label: "name.label",
                    placeholder: "name.placeholder",
                  }}
                />

                <FormInput
                  variant="standard"
                  {...{
                    name: "description",
                    label: "description.label",
                    placeholder: "description.placeholder",
                  }}
                />

                <FormDateTimeRangePicker
                  {...{
                    name: "dateTimeRange",
                    label: "dateTimeRange.label",
                    placeholder: "dateTimeRange.placeholder",
                  }}
                />

                <ImageUpload
                  {...{
                    name: "image",
                    label: "image.label",
                    placeholder: "image.placeholder",
                  }}
                />

                <LocationPicker
                  {...{
                    name: "location",
                    label: "location.label",
                    placeholder: "location.placeholder",
                  }}
                />
              </Box>

              {/* Footer (always visible) */}
              <Box
                sx={{
                  p: 2,
                  borderTop: `1px solid ${theme.palette.divider}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  bgcolor: theme.palette.background.paper,
                }}
              >
                <Button onClick={onClose} variant="contained">
                  Close
                </Button>
                <Button loading={loading} type="submit" variant="contained">
                  {submitButtonText}
                </Button>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
