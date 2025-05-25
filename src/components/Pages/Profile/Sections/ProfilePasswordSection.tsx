import CollapsibleProfileFormSection from "./CollapsibleProfileFormSection";
import FormInput from "../../../Form/FormInput";
import * as Yup from "yup";
import { useContext } from "react";
import { useConfirm } from "../../../../hooks/useConfirm";
import { usePromptInput } from "../../../../hooks/usePromptInput";
import { AuthContext } from "../../../../authentication/auth-context";
import { changePasswordData } from "../../../../vendor/profile-vendor";
import { useMutation } from "@tanstack/react-query";

const PASSWORD_VALIDATOR = Yup.object({
  password: Yup.string().required("Password is required."),
  matchingPassword: Yup.string()
    .required("Please confirm your password.")
    .test("passwords-match", "Passwords must match.", function (value) {
      return this.parent.password === value;
    }),
});

function usePasswordChangeMutation() {
  const { confirm, ConfirmDialogComponent } = useConfirm();
  const { PromptInputComponent, prompt } = usePromptInput();
  const { logOut } = useContext(AuthContext);

  const passwordChangeHandler = async ({
    password,
    matchingPassword,
  }: {
    password: string;
    matchingPassword: string;
  }) => {
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
      title: "Confirm Password Change",
      message:
        "Are you sure you want to change your password? This action will log you out.",
    });

    if (!proceed) {
      return;
    }

    return changePasswordData(password, matchingPassword, confirmationPassword);
  };

  const { mutate: passwordDataChangeMutation } = useMutation({
    mutationFn: passwordChangeHandler,
    onSuccess: () => {
      logOut();
    },
  });

  return {
    ConfirmDialogComponent,
    PromptInputComponent,
    passwordDataChangeMutation,
  };
}

export default function ProfilePasswordSection() {
  const {
    PromptInputComponent,
    ConfirmDialogComponent,
    passwordDataChangeMutation,
  } = usePasswordChangeMutation();

  return (
    <>
      {PromptInputComponent}
      {ConfirmDialogComponent}
      <CollapsibleProfileFormSection<"password" | "matchingPassword", string>
        title="Change Password"
        initialValues={{ password: null, matchingPassword: null }}
        validationSchema={PASSWORD_VALIDATOR}
        onSubmit={passwordDataChangeMutation}
      >
        <FormInput
          name="password"
          label="New Password"
          placeholder="Enter your new password"
          type="password"
          variant="standard"
        />
        <FormInput
          name="matchingPassword"
          label="Confirm New Password"
          placeholder="Re-enter your new password"
          type="password"
          variant="standard"
        />
      </CollapsibleProfileFormSection>
    </>
  );
}
