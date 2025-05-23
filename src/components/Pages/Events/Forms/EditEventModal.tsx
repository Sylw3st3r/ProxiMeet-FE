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
      if (typeof value === "string") return true;
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

function useGetEvent(id?: string) {
  const validId = !(!id || isNaN(Number(id)) || Number(id) < 1);

  const { data: eventData, isPending: eventDataPending } = useQuery({
    queryKey: ["events", { id }],
    queryFn: ({ signal }) => getEvent(signal, Number(id)),
    enabled: validId,
  });

  return { eventData, eventDataPending, validId };
}

function useEditEvent() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const onClose = () => {
    navigate("/dashboard/user-events");
  };

  const { mutate: editEventMutate, isPending: editPending } = useMutation({
    mutationFn: editEvent,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["user-events"] });
      client.invalidateQueries({ queryKey: ["events"] });
      onClose();
      enqueueSnackbar("Event eddited successfuly!", { variant: "success" });
    },
    onError: () => {
      enqueueSnackbar("Couldn't edit event!", { variant: "error" });
    },
  });

  return { editEventMutate, editPending };
}

export default function EditEventModal() {
  let { id } = useParams();
  const { eventData, eventDataPending } = useGetEvent(id);
  const { editEventMutate, editPending } = useEditEvent();

  const navigate = useNavigate();
  const onClose = () => {
    navigate("/dashboard/user-events");
  };

  return (
    <EventEntityFormModal
      handleSubmit={(data) => {
        editEventMutate(data);
      }}
      INITIAL_VALUES={{ ...transformEventDataToForm(eventData) }}
      VALIDATOR={VALIDATOR}
      onClose={onClose}
      mutationPending={editPending}
      loadingData={eventDataPending}
      headerText="event.form.editHeader"
      submitButtonText="common.edit"
    />
  );
}
