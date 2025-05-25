import { Box } from "@mui/material";
import ProfileAvatarSection from "./Sections/ProfileAvatarSection";
import ProfileBasicDataSection from "./Sections/ProfileBasicDataSection";
import ProfileEmailSection from "./Sections/ProfileEmailSection";
import ProfilePasswordSection from "./Sections/ProfilePasswordSection";

export default function Profile() {
  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        px: 2,
        py: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {" "}
      <ProfileAvatarSection />
      <ProfileBasicDataSection />
      <ProfileEmailSection />
      <ProfilePasswordSection />
    </Box>
  );
}
