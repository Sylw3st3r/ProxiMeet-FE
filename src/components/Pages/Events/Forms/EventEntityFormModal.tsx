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
import FormInput from "../../../Form/FormInput";
import * as Yup from "yup";
import LocationPicker from "../../../Form/FormLocationPicker";
import FormDateTimeRangePicker from "../../../Form/FormDateTimeRangePicker";
import { EventSubmitData } from "../../../../model/event";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
                borderRadius: 2,
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  p: 2,
                  position: "relative",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="h6">{t(headerText)}</Typography>
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
                    label: "event.form.name.label",
                    placeholder: "event.form.name.placeholder",
                  }}
                />

                <FormInput
                  variant="standard"
                  {...{
                    disabled: loadingData,
                    multiline: true,
                    name: "description",
                    label: "event.form.description.label",
                    placeholder: "event.form.description.placeholder",
                  }}
                />

                <FormDateTimeRangePicker
                  {...{
                    disabled: loadingData,
                    labelStart: "event.form.dateTimeRange.start.label",
                    labelEnd: "event.form.dateTimeRange.end.label",
                    name: "dateTimeRange",
                    label: "event.form.dateTimeRange.label",
                    placeholder: "event.form.dateTimeRange.placeholder",
                  }}
                />

                <ImageUpload
                  {...{
                    disabled: loadingData,
                    name: "image",
                    label: "event.form.image.label",
                    placeholder: "event.form.image.placeholder",
                  }}
                />

                <LocationPicker
                  {...{
                    disabled: loadingData,
                    name: "location",
                    label: "event.form.location.label",
                    placeholder: "event.form.location.placeholder",
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
                }}
              >
                <Button disabled={mutationPending} onClick={onClose}>
                  {t("common.close")}
                </Button>
                <Button
                  disabled={loadingData}
                  loading={mutationPending}
                  type="submit"
                  variant="contained"
                >
                  {t(submitButtonText)}
                </Button>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
