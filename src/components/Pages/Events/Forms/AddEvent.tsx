import React, { useContext } from "react";
import * as Yup from "yup";
import FormModal from "../../../Form/FormModal";
import { EventFields } from "./event-fields.type";
import { InputFieldDefinition } from "../../../Form/input-field-definition.type";
import axios from "axios";
import { AuthContext } from "../../../../authentication/auth-context";

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
      return (
        value &&
        ["image/jpeg", "image/png", "image/jpg"].includes((value as any).type)
      );
    }),
  location: coordinatesSchema.required("Location is required"),
});

const INITIAL_VALUES: Record<
  EventFields,
  | string
  | null
  | {
      lat: number;
      lng: number;
    }
> = {
  name: "",
  description: "",
  image: null,
  location: null,
};

type submitData = {
  name: string;
  description: string;
  image: string | Blob;
  location: {
    lat: number;
    lng: number;
  };
};

export default function AddEventModal() {
  const { token } = useContext(AuthContext);

  const handleSubmit = async (data: submitData) => {
    // Prepere data
    const requestData = new FormData();
    requestData.append("name", data.name);
    requestData.append("description", data.description);
    requestData.append("image", data.image);
    requestData.append("lat", `${data.location.lat}`);
    requestData.append("lng", `${data.location.lng}`);

    try {
      const response = await axios.put(
        `http://localhost:3001/events/add`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <FormModal<EventFields>
      handleSubmit={handleSubmit}
      INPUT_FIELDS_DEFINITIONS={INPUT_FIELDS_DEFINITIONS}
      INITIAL_VALUES={{ ...INITIAL_VALUES }}
      VALIDATOR={VALIDATOR}
    />
  );
}
