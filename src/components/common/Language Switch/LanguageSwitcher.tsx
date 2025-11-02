import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Box,
  useMediaQuery,
  useTheme,
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

  // Responsive breakpoints
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // < 600px

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
          size={isMobile ? "small" : "medium"}
          sx={{
            ml: isMobile ? 1 : 2,
            "&:focus": {
              outline: "none",
            },
            "&:focus-visible": {
              outline: "none",
            },
            // Responsive padding
            padding: {
              xs: "4px",
              sm: "8px",
              md: "8px",
            },
          }}
          aria-controls={open ? "language-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          color="inherit"
          disableRipple
        >
          {/* Show current language code instead of flag */}
          {currentLang ? (
            <Box
              sx={{
                marginTop: {
                  xs: "3px",
                  sm: "4px",
                  md: "5px",
                },
                fontSize: {
                  xs: "0.9rem",
                  sm: "1.2rem",
                  md: "1.5rem",
                },
                fontWeight: 600,
                letterSpacing: {
                  xs: "0.3px",
                  sm: "0.4px",
                  md: "0.5px",
                },
              }}
            >
              {currentLang.code.toUpperCase()}
            </Box>
          ) : (
            <LanguageIcon
              sx={{
                fontSize: {
                  xs: "1.2rem",
                  sm: "1.5rem",
                  md: "1.8rem",
                },
              }}
            />
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
            elevation: isMobile ? 1 : 2,
            sx: {
              minWidth: {
                xs: 140,
                sm: 160,
                md: 180,
              },
              mt: {
                xs: 0.5,
                sm: 0.8,
                md: 1,
              },
              // Adjust max width on mobile to prevent overflow
              maxWidth: {
                xs: "90vw",
                sm: "auto",
              },
            },
          },
        }}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
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
                py: {
                  xs: 0.8,
                  sm: 1,
                  md: 1.2,
                },
                px: {
                  xs: 1,
                  sm: 1.5,
                  md: 2,
                },
                "&.Mui-selected": {
                  backgroundColor: "action.selected",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                },
                "&:hover .MuiListItemText-primary": {
                  fontWeight: 600,
                },
                // Increase touch target size on mobile
                minHeight: {
                  xs: 44,
                  sm: "auto",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  marginRight: {
                    xs: 1,
                    sm: 1.2,
                    md: 1.5,
                  },
                  marginBottom: {
                    xs: "2px",
                    sm: "2.5px",
                    md: "3px",
                  },
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    fontSize: {
                      xs: "1rem",
                      sm: "1.1rem",
                      md: "1.25rem",
                    },
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
                    sx: {
                      lineHeight: 1,
                      display: "flex",
                      alignItems: "center",
                      fontSize: {
                        xs: "0.875rem",
                        sm: "0.95rem",
                        md: "1rem",
                      },
                    },
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
