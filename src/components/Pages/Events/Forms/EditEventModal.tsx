import { useNavigate, useParams } from "react-router";
import * as Yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { client } from "../../../..";
import EventEntityFormModal from "./EventEntityFormModal";
import { editEvent, getEvent } from "../../../../vendor/events-vendor";
import { Event } from "../../../../model/event";

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
      if (typeof value === "string") return true;
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

function transformEventDataToForm(event?: Event) {
  if (event) {
    return {
      id: event.id,
      name: event.name,
      description: event.description,
      image: event.image,
      location: {
        lat: event.lat,
        lng: event.lng,
      },
      dateTimeRange: {
        start: new Date(event.start),
        end: new Date(event.end),
      },
    };
  }
  return {
    name: "",
    description: "",
    image: null,
    location: null,
    dateTimeRange: {
      start: null,
      end: null,
    },
  };
}

export default function EditEventModal() {
  let { id } = useParams();

  const validId = !(!id || isNaN(Number(id)) || Number(id) < 1);

  const { data: eventData, isPending: eventDataPending } = useQuery({
    queryKey: ["events", { id }],
    queryFn: ({ signal }) => getEvent(signal, Number(id)),
    enabled: validId,
  });

  const { mutate, isPending: editPending } = useMutation({
    mutationFn: editEvent,
    onSuccess: async () => {
      client.invalidateQueries({ queryKey: ["user-events"] });
      client.invalidateQueries({ queryKey: ["events"] });
      onClose();
      enqueueSnackbar("Event eddited successfuly!", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Couldn't edit event!", { variant: "error" });
    },
  });

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const onClose = () => {
    navigate("/dashboard/user-events");
  };

  return (
    <EventEntityFormModal
      handleSubmit={(data) => {
        mutate(data);
      }}
      INITIAL_VALUES={{ ...transformEventDataToForm(eventData) }}
      VALIDATOR={VALIDATOR}
      onClose={onClose}
      mutationPending={editPending}
      loadingData={eventDataPending}
      headerText="Edit event"
      submitButtonText="Edit"
    />
  );
}
