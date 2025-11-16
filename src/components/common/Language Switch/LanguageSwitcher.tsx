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
      <Tooltip
        title="Change Language"
        // Disable tooltip on mobile for better UX
        disableHoverListener={isMobile}
        disableTouchListener={isMobile}
      >
        <IconButton
          onClick={handleClick}
          size={isMobile ? "small" : "medium"}
          sx={{
            ml: {
              xs: 0.5,
              sm: 1,
              md: 2,
            },
            "&:focus": {
              outline: "none",
            },
            "&:focus-visible": {
              outline: "2px solid",
              outlineColor: "primary.main",
              outlineOffset: "2px",
            },
            // Responsive padding with better touch targets
            padding: {
              xs: "6px",
              sm: "8px",
              md: "10px",
            },
            // Minimum touch target size for mobile (48x48px recommended)
            minWidth: {
              xs: 40,
              sm: 44,
              md: 48,
            },
            minHeight: {
              xs: 40,
              sm: 44,
              md: 48,
            },
            "&:active": {
              transform: "scale(0.95)",
            },
          }}
          aria-controls={open ? "language-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          aria-label={`Current language: ${currentLang?.name ?? "Unknown"}. Click to change language.`}
          color="inherit"
        >
          {/* Show current language code instead of flag */}
          {currentLang ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: {
                  xs: "0.75rem",
                  sm: "0.875rem",
                  md: "1.75rem",
                },
                fontWeight: 700,
                letterSpacing: {
                  xs: "0.5px",
                  sm: "0.75px",
                  md: "1px",
                },
                lineHeight: 1,
                color: "inherit",
                userSelect: "none",
              }}
            >
              {currentLang.code.toUpperCase()}
            </Box>
          ) : (
            <LanguageIcon
              sx={{
                fontSize: {
                  xs: "1.25rem",
                  sm: "1.5rem",
                  md: "1.75rem",
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
            elevation: isMobile ? 2 : 3,
            sx: {
              minWidth: {
                xs: 120,
                sm: 140,
                md: 180,
              },
              mt: {
                xs: 0.5,
                sm: 1,
                md: 1.5,
              },
              maxWidth: {
                xs: 200,
                sm: 220,
                md: "auto",
              },
              borderRadius: {
                xs: 2,
                sm: 2,
                md: 2,
              },
              boxShadow: isMobile
                ? "0px 4px 12px rgba(0, 0, 0, 0.15)"
                : undefined,
            },
          },
          transition: {
            timeout: 200,
          },
        }}
        // Adjust anchor position for better mobile display
        anchorOrigin={{
          horizontal: isMobile ? "right" : "left",
          vertical: "bottom",
        }}
        transformOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
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
                gap: {
                  xs: 0.75,
                  sm: 1,
                  md: 1.5,
                },
                py: {
                  xs: 1,
                  sm: 1.25,
                  md: 1.5,
                },
                px: {
                  xs: 1.25,
                  sm: 1.75,
                  md: 2,
                },
                minHeight: {
                  xs: 44,
                  sm: 44,
                  md: "auto",
                },
                "&.Mui-selected": {
                  backgroundColor: "action.selected",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                },
                "&:hover": {
                  backgroundColor: "action.hover",
                  "& .MuiListItemText-primary": {
                    fontWeight: 600,
                  },
                },
                "&:active": {
                  backgroundColor: "action.selected",
                },
                transition: "all 0.2s ease-in-out",
                cursor: "pointer",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    fontSize: {
                      xs: "1.125rem",
                      sm: "1.25rem",
                      md: "1.5rem",
                    },
                    lineHeight: 1,
                    display: "flex",
                    alignItems: "center",
                    userSelect: "none",
                  }}
                >
                  {language.flag}
                </Box>
              </ListItemIcon>

              <ListItemText
                primary={language.name}
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: {
                        xs: "0.875rem",
                        sm: "0.9375rem",
                        md: "1rem",
                      },
                      fontWeight: isSelected ? 600 : 400,
                      lineHeight: 1.5,
                      color: isSelected ? "primary.main" : "text.primary",
                      userSelect: "none",
                      transition: "color 0.2s ease-in-out",
                    },
                  },
                }}
              />

              {/* Optional: Add checkmark for selected language on mobile */}
              {isSelected && isMobile && (
                <Box
                  sx={{
                    ml: "auto",
                    color: "primary.main",
                    fontSize: "0.875rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  ✓
                </Box>
              )}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default LanguageSwitcher;
