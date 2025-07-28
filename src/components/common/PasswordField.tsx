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
}

const PasswordField = ({
  placeholder,
  value,
  onChange,
  error,
  helperText,
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

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
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => {
                    setShowPassword((prev) => !prev);
                  }}
                  edge="end"
                  disableRipple
                  disableFocusRipple
                  sx={{
                    padding: 1,
                    "&:focus": {
                      outline: "none",
                    },
                    "&:hover": {
                      backgroundColor: "transparent",
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
