import { Formik, Form } from "formik";
import {
  Box,
  Dialog,
  useTheme,
  Typography,
  Button,
  LinearProgress,
} from "@mui/material";
import ImageUpload from "../../../Form/ImageUpload";
import FormInput from "../../../Form/Input";
import * as Yup from "yup";
import LocationPicker from "../../../Form/FormLocationPicker";
import FormDateTimeRangePicker from "../../../Form/FormDateTimeRangePicker";
import { EventSubmitData } from "../../../../model/event";

export type EventEntityFields =
  | "name"
  | "description"
  | "image"
  | "location"
  | "dateTimeRange";

type EventEntityModalProps = {
  handleSubmit: (data: EventSubmitData) => void;
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
  loadingData?: boolean;
  mutationPending: boolean;
  headerText: string;
  submitButtonText: string;
};

export default function EventEntityFormModal({
  handleSubmit,
  INITIAL_VALUES,
  VALIDATOR,
  loadingData,
  mutationPending,
  onClose,
  headerText,
  submitButtonText,
}: EventEntityModalProps) {
  const theme = useTheme();

  return (
    <Dialog
      onClose={mutationPending ? undefined : onClose}
      open={true}
      maxWidth="sm"
      fullWidth
    >
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...(INITIAL_VALUES as EventSubmitData),
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
                  position: "relative",
                  bgcolor: theme.palette.background.paper,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="h6">{headerText}</Typography>
                {(loadingData || mutationPending) && (
                  <LinearProgress
                    sx={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
                  />
                )}
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
                    disabled: loadingData,
                    name: "name",
                    label: "name.label",
                    placeholder: "name.placeholder",
                  }}
                />

                <FormInput
                  variant="standard"
                  {...{
                    disabled: loadingData,
                    multiline: true,
                    name: "description",
                    label: "description.label",
                    placeholder: "description.placeholder",
                  }}
                />

                <FormDateTimeRangePicker
                  {...{
                    disabled: loadingData,
                    name: "dateTimeRange",
                    label: "dateTimeRange.label",
                    placeholder: "dateTimeRange.placeholder",
                  }}
                />

                <ImageUpload
                  {...{
                    disabled: loadingData,
                    name: "image",
                    label: "image.label",
                    placeholder: "image.placeholder",
                  }}
                />

                <LocationPicker
                  {...{
                    disabled: loadingData,
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
                <Button
                  disabled={mutationPending}
                  onClick={onClose}
                  variant="contained"
                >
                  Close
                </Button>
                <Button
                  disabled={loadingData}
                  loading={mutationPending}
                  type="submit"
                  variant="contained"
                >
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
