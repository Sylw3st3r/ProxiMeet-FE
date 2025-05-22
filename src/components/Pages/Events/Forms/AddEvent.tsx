import * as Yup from "yup";
import { useNavigate } from "react-router";
import { useSnackbar } from "notistack";
import { useMutation } from "@tanstack/react-query";
import { client } from "../../../..";
import EventEntityFormModal from "./EventEntityFormModal";
import { addEvent } from "../../../../vendor/events-vendor";

const coordinatesSchema = Yup.object({
  lat: Yup.number()
    .required("event.form.location.lat.required")
    .min(-90, "event.form.location.lat.min")
    .max(90, "event.form.location.lat.max"),
  lng: Yup.number()
    .required("event.form.location.lng.required")
    .min(-180, "event.form.location.lng.min")
    .max(180, "event.form.location.lng.max"),
});

const VALIDATOR = Yup.object({
  name: Yup.string().required("event.form.name.required"),
  description: Yup.string().required("event.form.description.required"),
  image: Yup.mixed()
    .required("event.form.image.required")
    .test("fileType", "event.form.image.valid", (value) => {
      return (
        value &&
        ["image/jpeg", "image/png", "image/jpg"].includes((value as any).type)
      );
    }),
  location: coordinatesSchema.required("event.form.location.required"),
  dateTimeRange: Yup.object({
    start: Yup.date()
      .required("event.form.dateTimeRange.start.required")
      .typeError("event.form.dateTimeRange.start.valid"),
    end: Yup.date()
      .required("event.form.dateTimeRange.end.required")
      .typeError("event.form.dateTimeRange.end.valid")
      .min(Yup.ref("start"), "event.form.dateTimeRange.end.afterStart"),
  }).required("event.form.dateTimeRange.required"),
});

const INITIAL_VALUES = {
  name: "",
  description: "",
  image: null,
  location: null,
  dateTimeRange: {
    start: null,
    end: null,
  },
};

export default function AddEventModal() {
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: addEvent,
    onSuccess: async () => {
      client.invalidateQueries({ queryKey: ["user-events"] });
      client.invalidateQueries({ queryKey: ["events"] });
      onClose();
      enqueueSnackbar("Event was added successfuly!", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Couldn't add event!", { variant: "error" });
    },
  });
  const { enqueueSnackbar } = useSnackbar();

  const onClose = async () => {
    return navigate("/dashboard/user-events");
  };

  return (
    <EventEntityFormModal
      handleSubmit={(data) => {
        mutate(data);
      }}
      INITIAL_VALUES={{ ...INITIAL_VALUES }}
      VALIDATOR={VALIDATOR}
      onClose={onClose}
      mutationPending={isPending}
      headerText="event.form.addHeader"
      submitButtonText="common.add"
    />
  );
}
