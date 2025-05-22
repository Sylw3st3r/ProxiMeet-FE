import { Switch, useColorScheme } from "@mui/material";

export default function ThemeSwitch() {
  const { mode, setMode } = useColorScheme();

  return (
    <Switch
      value={mode === "light" ? "dark" : "light"}
      onClick={() => {
        setMode(mode === "light" ? "dark" : "light");
      }}
    />
  );
}
