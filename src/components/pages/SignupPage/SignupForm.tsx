import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useSignupForm } from "../../../hooks/auth/useSignupForm";
import PasswordField from "../../common/PasswordField/PasswordField";

export default function SignupForm() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    loading,
    apiError,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleSubmit,
    clearApiError,
  } = useSignupForm();

  return (
    <>
      <Box
        component="form"
        className="form"
        noValidate
        autoComplete="off"
        onSubmit={(e) => void handleSubmit(e)}
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
            if (apiError) clearApiError();
          }}
          error={!!errors.email}
          helperText={errors.email}
          disabled={loading}
        />

        {/* Password */}
        <label className="form-label">Password</label>
        <PasswordField
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (apiError) clearApiError();
          }}
          error={!!errors.password}
          helperText={errors.password}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          disabled={loading}
        />

        {/* Confirm Password */}
        <label className="form-label">Confirm Password</label>
        <PasswordField
          placeholder="Repeat your password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (apiError) clearApiError();
          }}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          showPassword={showConfirmPassword}
          setShowPassword={setShowConfirmPassword}
          disabled={loading}
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

        {/* API Error Alert */}
        {apiError && (
          <Alert severity="error" sx={{ mt: 1 }} onClose={clearApiError}>
            {apiError}
          </Alert>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{
            mt: 2,
            backgroundColor: loading ? "#ccc" : "#ff69b4",
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: "8px",
            height: "43px",
            "&:hover": {
              backgroundColor: loading ? "#ccc" : "#e6418eff",
            },
            "&:disabled": {
              backgroundColor: "#ccc",
              color: "#666",
            },
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={20} color="inherit" />
              SIGNING UP...
            </Box>
          ) : (
            "SIGN UP"
          )}
        </Button>
      </Box>
    </>
  );
}
