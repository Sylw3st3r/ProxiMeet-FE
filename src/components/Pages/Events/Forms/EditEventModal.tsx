import { useLoaderData, useOutletContext } from "react-router";
import * as Yup from "yup";
import { EventFields } from "./event-fields.type";
import { InputFieldDefinition } from "../../../Form/input-field-definition.type";
import { useContext } from "react";
import { AuthContext } from "../../../../authentication/auth-context";
import FormModal from "../../../Form/FormModal";

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
      if (typeof value === "string") return true; // Skip check for strings
      return (
        value &&
        ["image/jpeg", "image/png", "image/jpg"].includes((value as any).type)
      );
    }),
});

export default function EditEventModal() {
  const { token } = useContext(AuthContext);
  const data = useLoaderData<{
    data: { event: Record<EventFields, string | null> };
  }>();
  const { updateEvent } = useOutletContext<any>();

  console.log(data);

  const handleSubmit = async (data: Record<string, string | Blob>) => {
    // Prepere data
    const requestData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      requestData.append(key, value);
    });

    console.log(requestData);
  };

  return (
    <FormModal<EventFields>
      handleSubmit={handleSubmit}
      INPUT_FIELDS_DEFINITIONS={INPUT_FIELDS_DEFINITIONS}
      INITIAL_VALUES={{ ...data.data.event }}
      VALIDATOR={VALIDATOR}
    />
  );
}
