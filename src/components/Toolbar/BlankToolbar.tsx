import { Toolbar, useTheme } from "@mui/material";
import { ReactNode } from "react";

export default function BlankToolbar({ children }: { children?: ReactNode }) {
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
      {children}
    </Toolbar>
  );
}
