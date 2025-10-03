import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Box,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { useTranslation } from "../../../hooks/locales/useTranslation";

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
] as const;

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

  const handleLanguageChange = async (languageCode: string) => {
    try {
      await changeLanguage(languageCode);
      handleClose();
    } catch (error) {
      console.error("Failed to change language:", error);
      handleClose();
    }
  };

  // Get current language details for display
  const currentLang = languages.find((lang) => lang.code === currentLanguage);

  return (
    <>
      <Tooltip title="Change Language">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{
            ml: 2,
            "&:focus": {
              outline: "none",
            },
            "&:focus-visible": {
              outline: "none",
            },
          }}
          aria-controls={open ? "language-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          color="inherit"
          disableRipple
        >
          {/* Show current flag instead of generic icon */}
          {currentLang ? (
            <Box sx={{ fontSize: "1.25rem" }}>{currentLang.flag}</Box>
          ) : (
            <LanguageIcon />
          )}
        </IconButton>
      </Tooltip>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 2,
            sx: {
              minWidth: 180,
              mt: 1,
            },
          },
        }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {languages.map((language) => {
          const isSelected = language.code === currentLanguage;

          return (
            <MenuItem
              key={language.code}
              onClick={() => {
                void handleLanguageChange(language.code);
              }}
              selected={isSelected}
              sx={{
                display: "flex",
                alignItems: "center",
                py: 1.2,
                "&.Mui-selected": {
                  backgroundColor: "action.selected",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                },
                "&:hover .MuiListItemText-primary": {
                  fontWeight: 600,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  marginRight: 1.5, //
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    fontSize: "1.25rem",
                    lineHeight: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {language.flag}
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={language.name}
                slotProps={{
                  primary: {
                    variant: "body1",
                    fontWeight: isSelected ? 600 : 400,
                    sx: { lineHeight: 1 }, // ✅ text aligns with flag better
                  },
                }}
              />
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default LanguageSwitcher;
