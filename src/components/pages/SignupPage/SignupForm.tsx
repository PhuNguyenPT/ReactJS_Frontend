import { Box, Button, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useSignupForm } from "../../../hooks/useSignupForm";
import PasswordField from "../../common/PasswordField";

export default function SignupForm() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    emailError,
    passwordError,
    confirmPasswordError,
    handleSubmit,
  } = useSignupForm();

  return (
    <Box
      component="form"
      className="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      {/* Email */}
      <label className="form-label" htmlFor="email">
        Email
      </label>
      <TextField
        placeholder="E-mail"
        fullWidth
        required
        variant="outlined"
        type="email"
        size="small"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        error={!!emailError}
        helperText={emailError}
      />

      {/* Password */}
      <label className="form-label">Password</label>
      <PasswordField
        placeholder="Enter your password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        error={!!passwordError}
        helperText={passwordError}
      />

      {/* Confirm Password */}
      <label className="form-label">Confirm Password</label>
      <PasswordField
        placeholder="Repeat your password"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
        }}
        error={!!confirmPasswordError}
        helperText={confirmPasswordError}
      />

      <Typography
        variant="body2"
        sx={{ mt: 2, mb: 1, textAlign: "left", color: "#000" }}
      >
        Already have an account?{" "}
        <Link
          to="/login"
          style={{
            color: "#1976d2",
            textDecoration: "none",
            fontWeight: "bold",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#0d47a1")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#1976d2")}
        >
          Login here
        </Link>
      </Typography>

      {/* Submit button */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{
          mt: 2,
          backgroundColor: "#ff69b4",
          textTransform: "none",
          fontWeight: "bold",
          borderRadius: "8px",
          height: "43px",
          "&:hover": {
            backgroundColor: "#e6418eff",
          },
        }}
      >
        SIGN UP
      </Button>
    </Box>
  );
}
