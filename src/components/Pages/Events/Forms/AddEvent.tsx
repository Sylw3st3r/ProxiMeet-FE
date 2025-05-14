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
  location: {
    label: "location.label",
    placeholder: "location.placeholder",
    type: "text",
  },
  image: {
    label: "image.label",
    placeholder: "image.placeholder",
    type: "image",
  },
};

const VALIDATOR: Yup.ObjectSchema<Record<EventFields, any>> = Yup.object({
  name: Yup.string().required("name.required"),
  description: Yup.string().required("description.required"),
  location: Yup.string().required("location.required"),
  image: Yup.mixed()
    .required("Image is required")
    .test("fileType", "Only images are allowed", (value) => {
      return (
        value &&
        ["image/jpeg", "image/png", "image/jpg"].includes((value as any).type)
      );
    })
  })

const INITIAL_VALUES: Record<EventFields, string | null> = {
  name: "",
  description: "",
  location: "",
  image: null,
};

export default function AddEventModal() {
  const { token } = useContext(AuthContext);

  const handleSubmit = async (data: Record<string, string | Blob>) => {
    // Prepere data
    const requestData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      requestData.append(key, value);
    });

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
