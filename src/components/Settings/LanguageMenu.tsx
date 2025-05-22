import { useContext, useState } from "react";
import { TranslationContext } from "../../translations/translation-context";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { Language } from "@mui/icons-material";

export function LanguageMenu({ marginLeft }: { marginLeft?: number }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { changeLanguage } = useContext(TranslationContext);
  const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (lang?: "en" | "pl") => {
    setAnchorEl(null);
    if (lang) {
      changeLanguage(lang);
    }
  };

  return (
    <>
      <IconButton sx={{ marginLeft }} onClick={handleClick}>
        <Language />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={() => handleClose()}>
        <MenuItem onClick={() => handleClose("en")}>English</MenuItem>
        <MenuItem onClick={() => handleClose("pl")}>Polski</MenuItem>
      </Menu>
    </>
  );
}
