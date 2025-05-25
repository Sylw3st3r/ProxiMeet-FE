import { useContext } from "react";
import { useConfirm } from "../../../../hooks/useConfirm";
import { changeAvatar } from "../../../../vendor/profile-vendor";
import ImageUpload from "../../../Form/ImageUpload";
import CollapsibleProfileFormSection from "./CollapsibleProfileFormSection";
import * as Yup from "yup";
import { AuthContext } from "../../../../authentication/auth-context";
import { useMutation } from "@tanstack/react-query";

const AVATAR_VALIDATOR = Yup.object({
  avatar: Yup.mixed()
    .required("event.form.image.required")
    .test("fileType", "event.form.image.valid", (value) => {
      if (typeof value === "string") return true;
      return (
        value &&
        ["image/jpeg", "image/png", "image/jpg"].includes((value as any).type)
      );
    }),
});

function useAvatarChangeMutation() {
  const { confirm, ConfirmDialogComponent } = useConfirm();
  const { updateUserData } = useContext(AuthContext);

  // Confirm with user that they are sure about this action
  const avatarChangeHandler = async ({ avatar }: { avatar: Blob | string }) => {
    if (typeof avatar === "string") {
      return;
    }

    const proceed = await confirm({
      title: "Are you sure?",
      message: "Data change",
    });

    if (!proceed) {
      return;
    }

    return changeAvatar(avatar);
  };

  const { mutate: avatarChangeMutation } = useMutation({
    mutationFn: avatarChangeHandler,
    onSuccess: (data) => {
      if (data) {
        updateUserData(data);
      }
    },
  });

  return { ConfirmDialogComponent, avatarChangeMutation };
}

export default function ProfileAvatarSection() {
  const { avatar } = useContext(AuthContext);
  const { ConfirmDialogComponent, avatarChangeMutation } =
    useAvatarChangeMutation();

  return (
    <>
      {ConfirmDialogComponent}
      <CollapsibleProfileFormSection<"avatar", Blob | string>
        title="Profile Picture"
        initialValues={{ avatar }}
        validationSchema={AVATAR_VALIDATOR}
        onSubmit={avatarChangeMutation}
      >
        <ImageUpload name="avatar" label="event.form.image.label" aspect={1} />
      </CollapsibleProfileFormSection>
    </>
  );
}
