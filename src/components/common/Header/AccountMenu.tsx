import * as React from "react";
import {
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Logout } from "@mui/icons-material";
import useAuth from "../../../hooks/useAuth";
import { logoutUser } from "../../../services/user/authService";

interface AccountMenuProps {
  displayName?: string;
}

export default function AccountMenu({ displayName }: AccountMenuProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = async (action: string) => {
    handleClose();

    switch (action) {
      case "profile":
        void navigate("/profile");
        break;
      case "logout":
        try {
          // Call the logout API to invalidate tokens on the server
          await logoutUser();
        } catch (error) {
          console.error("Logout API error:", error);
          // Continue with local logout even if API fails
        } finally {
          // Always clear local auth state regardless of API result
          logout();
          window.location.replace("/");
        }
        break;
      default:
        break;
    }
  };

  // Get the first letter of displayName for avatar
  const getAvatarLetter = () => {
    return displayName ? displayName.charAt(0).toUpperCase() : "U";
  };

  return (
    <React.Fragment>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{
            ml: 1,
            padding: "2px",
            border: "2px solid white",
            borderRadius: "50%",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar sx={{ width: 32, height: 32 }}>{getAvatarLetter()}</Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
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
        <MenuItem onClick={() => void handleMenuItemClick("profile")}>
          <Avatar sx={{ width: 32, height: 32 }}>{getAvatarLetter()}</Avatar>
          My Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => void handleMenuItemClick("logout")}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
