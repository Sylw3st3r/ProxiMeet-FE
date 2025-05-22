import * as Yup from "yup";
import { useNavigate } from "react-router";
import { useSnackbar } from "notistack";
import { useMutation } from "@tanstack/react-query";
import { client } from "../../../..";
import EventEntityFormModal from "./EventEntityFormModal";
import { addEvent } from "../../../../vendor/events-vendor";

const coordinatesSchema = Yup.object({
  lat: Yup.number()
    .required("Latitude is required")
    .min(-90, "Latitude must be greater than or equal to -90")
    .max(90, "Latitude must be less than or equal to 90"),
  lng: Yup.number()
    .required("Longitude is required")
    .min(-180, "Longitude must be greater than or equal to -180")
    .max(180, "Longitude must be less than or equal to 180"),
});

const VALIDATOR = Yup.object({
  name: Yup.string().required("name.required"),
  description: Yup.string().required("description.required"),
  image: Yup.mixed()
    .required("Image is required")
    .test("fileType", "Only images are allowed", (value) => {
      return (
        value &&
        ["image/jpeg", "image/png", "image/jpg"].includes((value as any).type)
      );
    }),
  location: coordinatesSchema.required("Location is required"),
  dateTimeRange: Yup.object({
    start: Yup.date()
      .required("Start date is required")
      .typeError("Start date must be a valid date"),
    end: Yup.date()
      .required("End date is required")
      .typeError("End date must be a valid date")
      .min(
        Yup.ref("start"),
        "End date must be later than or equal to start date",
      ),
  }).required("Date range is required"),
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
      headerText="Add event"
      submitButtonText="Add"
    />
  );
}
