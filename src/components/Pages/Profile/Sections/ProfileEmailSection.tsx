import { useContext } from "react";
import { AuthContext } from "../../../../authentication/auth-context";
import CollapsibleProfileFormSection from "./CollapsibleProfileFormSection";
import FormInput from "../../../Form/FormInput";
import * as Yup from "yup";
import { useConfirm } from "../../../../hooks/useConfirm";
import { usePromptInput } from "../../../../hooks/usePromptInput";
import { changeEmailData } from "../../../../vendor/profile-vendor";
import { useMutation } from "@tanstack/react-query";

const EMAIL_VALIDATOR = Yup.object({
  email: Yup.string()
    .required("auth.form.email.required")
    .email("auth.form.email.invalid"),
});

function useEmailChangeMutation() {
  const { confirm, ConfirmDialogComponent } = useConfirm();
  const { PromptInputComponent, prompt } = usePromptInput();
  const { logOut } = useContext(AuthContext);

  const emailChangeHandler = async ({ email }: { email: string }) => {
    const confirmationPassword = await prompt({
      title: "Identity Confirmation",
      message: "To proceed, please enter your current password.",
      label: "Current Password",
      type: "password",
    });

    if (!confirmationPassword) {
      return;
    }

    const proceed = await confirm({
      title: "Confirm Email Change",
      message:
        "Are you sure you want to change your email? This action will log you out.",
    });

    if (!proceed) {
      return;
    }

    return changeEmailData(email, confirmationPassword);
  };

  const { mutate: emailChangeMutation } = useMutation({
    mutationFn: emailChangeHandler,
    onSuccess: () => {
      logOut();
    },
  });

  return { ConfirmDialogComponent, PromptInputComponent, emailChangeMutation };
}

export default function ProfileEmailSection() {
  const { email } = useContext(AuthContext);
  const { ConfirmDialogComponent, PromptInputComponent, emailChangeMutation } =
    useEmailChangeMutation();
  return (
    <>
      {ConfirmDialogComponent}
      {PromptInputComponent}
      <CollapsibleProfileFormSection<"email", string>
        title="Email"
        initialValues={{ email }}
        validationSchema={EMAIL_VALIDATOR}
        onSubmit={emailChangeMutation}
      >
        <FormInput
          name="email"
          label="auth.form.email.label"
          placeholder="auth.form.email.placeholder"
          type="email"
          variant="standard"
        />
      </CollapsibleProfileFormSection>
    </>
  );
}
