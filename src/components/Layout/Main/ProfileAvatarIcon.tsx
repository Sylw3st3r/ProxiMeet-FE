import { useContext } from "react";
import { AuthContext } from "../../../authentication/auth-context";
import { Avatar, useTheme } from "@mui/material";

export default function ProfileAvatarIcon() {
  const { avatar, firstName, lastName } = useContext(AuthContext);
  const theme = useTheme();

  return avatar ? (
    <Avatar
      sx={{ width: 24, height: 24 }}
      alt={`${firstName} ${lastName}`}
      src={`http://localhost:3001/images/${avatar}`}
    />
  ) : (
    <Avatar sx={{ width: 24, height: 24, bgcolor: theme.palette.primary.main }}>
      {firstName?.[0] || "?"}
    </Avatar>
  );
}
