import { LinearProgress, Toolbar, useTheme } from "@mui/material";
import { ReactNode } from "react";

export default function BlankToolbar({
  children,
  isLoading,
}: {
  children?: ReactNode;
  isLoading?: boolean;
}) {
  const theme = useTheme();

  return (
    <Toolbar
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        position: "sticky",
        top: 0,
        zIndex: 200,
        bgcolor: theme.palette.background.paper,
        flexWrap: "wrap",
      }}
    >
      {isLoading && (
        <LinearProgress
          sx={{ position: "absolute", top: "100%", right: 0, left: 0 }}
        />
      )}
      {children}
    </Toolbar>
  );
}
