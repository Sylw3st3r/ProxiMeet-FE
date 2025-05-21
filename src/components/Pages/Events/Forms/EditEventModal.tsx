import { useNavigate, useParams } from "react-router";
import * as Yup from "yup";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { client } from "../../../..";
import EventEntityFormModal, { eventSubmitData } from "./EventEntityFormModal";
import { getEvent } from "../../../../vendor/events-vendor";
import { LinearProgress } from "@mui/material";

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

const handleSubmit = async (data: eventSubmitData) => {
  // Prepere data
  const requestData = new FormData();
  requestData.append("name", data.name);
  requestData.append("description", data.description);
  requestData.append("image", data.image);
  requestData.append("lat", `${data.location.lat}`);
  requestData.append("lng", `${data.location.lng}`);
  requestData.append("start", `${data.dateTimeRange.start.toISOString()}`);
  requestData.append("end", `${data.dateTimeRange.end.toISOString()}`);

  return await axios.patch(
    `http://localhost:3001/events/edit/${data.id}`,
    requestData,
  );
};

export default function EditEventModal() {
  let { id } = useParams();

  const validId = !(!id || isNaN(Number(id)) || Number(id) < 1);

  const { data: eventData, isPending: eventPending } = useQuery({
    queryKey: ["events", { id }],
    queryFn: ({ signal }) => getEvent(signal, Number(id)),
    enabled: validId,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: handleSubmit,
    onSuccess: async () => {
      client.invalidateQueries({ queryKey: ["user-events"] });
      client.invalidateQueries({ queryKey: ["events"] });
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

  if (eventPending) {
    return <LinearProgress></LinearProgress>;
  }

  if (!eventData) {
    return <></>;
  }

  const INITIAL_VALUES = {
    id: eventData.id,
    name: eventData.name,
    description: eventData.description,
    image: eventData.image,
    location: {
      lat: eventData.lat,
      lng: eventData.lng,
    },
    dateTimeRange: {
      start: new Date(eventData.start),
      end: new Date(eventData.end),
    },
  };

  return (
    <EventEntityFormModal
      handleSubmit={(data) => {
        mutate(data);
      }}
      INITIAL_VALUES={{ ...INITIAL_VALUES }}
      VALIDATOR={VALIDATOR}
      onClose={onClose}
      loading={isPending}
      headerText="Edit event"
      submitButtonText="Edit"
    />
  );
}
