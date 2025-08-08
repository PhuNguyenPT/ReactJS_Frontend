import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { useTranslation } from "../../../hooks/useTranslation"; // adjust import path as needed

// Language options
const languages = [
  {
    code: "en",
    name: "English",
    flag: "🇺🇸",
  },
  {
    code: "vi",
    name: "Tiếng Việt",
    flag: "🇻🇳",
  },
];

const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, changeLanguage } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (languageCode: string) => {
    void changeLanguage(languageCode);
    handleClose();
  };

  return (
    <>
      <Tooltip title="Change Language">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "language-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          color="inherit"
        >
          <LanguageIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "language-button",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => {
              handleLanguageChange(language.code);
            }}
            selected={language.code === currentLanguage}
          >
            <ListItemIcon>
              <span className="language-flag">{language.flag}</span>
            </ListItemIcon>
            <ListItemText primary={language.name} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSwitcher;
