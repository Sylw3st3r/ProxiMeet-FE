import { useContext } from "react";
import { AuthContext } from "../../../authentication/auth-context";
import { Box, useTheme } from "@mui/material";

export default function ProfileAvatarIcon() {
  const { avatar, firstName } = useContext(AuthContext);
  const theme = useTheme();

  return avatar ? (
    <Box
      component="img"
      src={`http://localhost:3001/images/${avatar}`}
      alt="avatar"
      sx={{
        width: 24,
        height: 24,
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />
  ) : (
    <Box
      sx={{
        width: 24,
        height: 24,
        borderRadius: "50%",
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.875rem",
        fontWeight: "bold",
        textTransform: "uppercase",
      }}
    >
      {firstName?.[0] || "?"}
    </Box>
  );
}
