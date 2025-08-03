// components/PasswordField.tsx
import { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface PasswordFieldProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  // Optional external state management
  showPassword?: boolean;
  setShowPassword?: (show: boolean) => void;
}

const PasswordField = ({
  placeholder,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  showPassword: externalShowPassword,
  setShowPassword: externalSetShowPassword,
}: PasswordFieldProps) => {
  // Internal state (used when external state is not provided)
  const [internalShowPassword, setInternalShowPassword] = useState(false);

  // Use external state if provided, otherwise use internal state
  const showPassword = externalShowPassword ?? internalShowPassword;
  const setShowPassword = externalSetShowPassword ?? setInternalShowPassword;

  return (
    <div>
      <TextField
        placeholder={placeholder}
        fullWidth
        required
        variant="outlined"
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        size="small"
        value={value}
        onChange={onChange}
        error={!!error}
        helperText={helperText}
        disabled={disabled}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                  edge="end"
                  disabled={disabled}
                  disableRipple
                  disableFocusRipple
                  sx={{
                    padding: 1,
                    "&:focus": {
                      outline: "none",
                    },
                    "&:hover": {
                      backgroundColor: disabled
                        ? "transparent"
                        : "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </div>
  );
};

export default PasswordField;
