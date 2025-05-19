import { useLoaderData, useNavigate } from "react-router";
import * as Yup from "yup";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { client } from "../../../..";
import EventEntityFormModal, { eventSubmitData } from "./EventEntityFormModal";

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

type eventModel = {
  id: number;
  name: string;
  description: string;
  image: string;
  lat: number;
  lng: number;
  start: string;
  end: string;
};

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
  const data = useLoaderData<{
    data: {
      event: eventModel;
    };
  }>();

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

  const INITIAL_VALUES = {
    id: data.data.event.id,
    name: data.data.event.name,
    description: data.data.event.description,
    image: data.data.event.image,
    location: {
      lat: data.data.event.lat,
      lng: data.data.event.lng,
    },
    dateTimeRange: {
      start: new Date(data.data.event.start),
      end: new Date(data.data.event.end),
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
