import { useContext } from "react";
import { AuthContext } from "../../../../authentication/auth-context";
import CollapsibleProfileFormSection from "./CollapsibleProfileFormSection";
import FormInput from "../../../Form/FormInput";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { useConfirm } from "../../../../hooks/useConfirm";
import { changeBasicData } from "../../../../vendor/profile-vendor";

const NAME_VALIDATOR = Yup.object({
  firstName: Yup.string().required("auth.form.firstName.required"),
  lastName: Yup.string().required("auth.form.lastName.required"),
});

function useBasicDataChangeMutation() {
  const { confirm, ConfirmDialogComponent } = useConfirm();
  const { updateUserData } = useContext(AuthContext);

  // Confirm with user that they are sure about this action
  const basicDataChangeHandler = async (submitData: {
    firstName: string;
    lastName: string;
  }) => {
    const proceed = await confirm({
      title: "Are you sure?",
      message: "Data change",
    });

    if (!proceed) {
      return;
    }

    return changeBasicData(submitData.firstName, submitData.lastName);
  };

  const { mutate: basicDataChangeMutation, isPending: basicDataChangePending } =
    useMutation({
      mutationFn: basicDataChangeHandler,
      onSuccess: (data) => {
        if (data) {
          updateUserData(data);
        }
      },
    });

  return {
    ConfirmDialogComponent,
    basicDataChangeMutation,
    basicDataChangePending,
  };
}

export default function ProfileBasicDataSection() {
  const { ConfirmDialogComponent, basicDataChangeMutation } =
    useBasicDataChangeMutation();
  const { firstName, lastName } = useContext(AuthContext);
  return (
    <>
      {ConfirmDialogComponent}
      <CollapsibleProfileFormSection<"firstName" | "lastName", string>
        title="Basic Info"
        initialValues={{ firstName, lastName }}
        validationSchema={NAME_VALIDATOR}
        onSubmit={basicDataChangeMutation}
      >
        <FormInput
          name="firstName"
          label="auth.form.firstName.label"
          placeholder="auth.form.firstName.placeholder"
          variant="standard"
        />
        <FormInput
          name="lastName"
          label="auth.form.lastName.label"
          placeholder="auth.form.lastName.placeholder"
          type="text"
          variant="standard"
        />
      </CollapsibleProfileFormSection>
    </>
  );
}
