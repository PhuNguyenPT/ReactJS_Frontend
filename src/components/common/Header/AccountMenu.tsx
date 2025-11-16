import * as React from "react";
import {
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Logout } from "@mui/icons-material";
import useLogout from "../../../hooks/auth/useLogout";

interface AccountMenuProps {
  displayName?: string;
}

export default function AccountMenu({ displayName }: AccountMenuProps) {
  const navigate = useNavigate();
  const logout = useLogout();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (action: string) => {
    handleClose();

    switch (action) {
      case "profile":
        void navigate("/profile");
        break;
    }
  };

  // Get the first letter of displayName for avatar
  const getAvatarLetter = () => {
    return displayName ? displayName.charAt(0).toUpperCase() : "U";
  };

  return (
    <React.Fragment>
      <Tooltip
        title="Account settings"
        arrow={!isMobile}
        disableHoverListener={isMobile}
      >
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{
            ml: { xs: 0.5, sm: 1 },
            padding: { xs: "1px", sm: "2px" },
            border: { xs: "1.5px solid white", sm: "2px solid white" },
            borderRadius: "50%",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
            // Increase touch target on mobile
            minWidth: { xs: 40, sm: "auto" },
            minHeight: { xs: 40, sm: "auto" },
          }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar
            sx={{
              width: { xs: 28, sm: 32 },
              height: { xs: 28, sm: 32 },
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            {getAvatarLetter()}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        disablePortal={false}
        disableScrollLock={true}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              minWidth: { xs: 180, sm: 200 },
              "& .MuiAvatar-root": {
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 },
                ml: -0.5,
                mr: 1,
                fontSize: { xs: "0.9rem", sm: "1rem" },
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: { xs: 10, sm: 14 },
                width: { xs: 8, sm: 10 },
                height: { xs: 8, sm: 10 },
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            handleMenuItemClick("profile");
          }}
          sx={{
            py: { xs: 1.2, sm: 1 },
            px: { xs: 1.5, sm: 2 },
            fontSize: { xs: "0.9rem", sm: "1rem" },
            minHeight: { xs: 44, sm: 48 },
          }}
        >
          <Avatar
            sx={{
              width: { xs: 28, sm: 32 },
              height: { xs: 28, sm: 32 },
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            {getAvatarLetter()}
          </Avatar>
          My Profile
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => void logout()}
          sx={{
            py: { xs: 1.2, sm: 1 },
            px: { xs: 1.5, sm: 2 },
            fontSize: { xs: "0.9rem", sm: "1rem" },
            minHeight: { xs: 44, sm: 48 },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: { xs: 36, sm: 40 },
            }}
          >
            <Logout
              fontSize="small"
              sx={{
                fontSize: { xs: "1.1rem", sm: "1.25rem" },
              }}
            />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
