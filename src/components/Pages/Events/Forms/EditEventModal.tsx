import { useLoaderData, useNavigate, useOutletContext } from "react-router";
import * as Yup from "yup";
import { EventFields } from "./event-fields.type";
import { InputFieldDefinition } from "../../../Form/input-field-definition.type";
import { useContext } from "react";
import { AuthContext } from "../../../../authentication/auth-context";
import FormModal from "../../../Form/FormModal";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { client } from "../../../..";

const INPUT_FIELDS_DEFINITIONS: Record<EventFields, InputFieldDefinition> = {
  name: {
    label: "name.label",
    placeholder: "name.placeholder",
    type: "text",
  },
  description: {
    label: "description.label",
    placeholder: "description.placeholder",
    type: "text",
  },
  image: {
    label: "image.label",
    placeholder: "image.placeholder",
    type: "image",
  },
  location: {
    label: "location.label",
    placeholder: "location.placeholder",
    type: "location",
  },
};

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

const VALIDATOR: Yup.ObjectSchema<Record<EventFields, any>> = Yup.object({
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
});

type submitData = {
  id: number;
  name: string;
  description: string;
  image: string | Blob;
  location: {
    lat: number;
    lng: number;
  };
};

type eventModel = {
  id: number;
  name: string;
  description: string;
  image: string;
  lat: number;
  lng: number;
};

const handleSubmit = async ({
  data,
  token,
}: {
  data: submitData;
  token: string | null;
}) => {
  // Prepere data
  const requestData = new FormData();
  requestData.append("name", data.name);
  requestData.append("description", data.description);
  requestData.append("image", data.image);
  requestData.append("lat", `${data.location.lat}`);
  requestData.append("lng", `${data.location.lng}`);

  return await axios.patch(
    `http://localhost:3001/events/edit/${data.id}`,
    requestData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export default function EditEventModal() {
  const { token } = useContext(AuthContext);
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

  const INITIAL_DATA: submitData = {
    id: data.data.event.id,
    name: data.data.event.name,
    description: data.data.event.description,
    image: data.data.event.image,
    location: {
      lat: data.data.event.lat,
      lng: data.data.event.lng,
    },
  };

  return (
    <FormModal<EventFields>
      handleSubmit={(data: submitData) => mutate({ data, token })}
      INPUT_FIELDS_DEFINITIONS={INPUT_FIELDS_DEFINITIONS}
      INITIAL_VALUES={{ ...INITIAL_DATA }}
      VALIDATOR={VALIDATOR}
      onClose={onClose}
      loading={isPending}
    />
  );
}
