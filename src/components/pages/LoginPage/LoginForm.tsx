// pages/Login/LoginForm.tsx
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { Link } from "react-router-dom";
import PasswordField from "../../common/PasswordField";
import useLoginForm from "../../../hooks/useLoginForm";

export default function LoginForm() {
  const {
    email,
    password,
    setEmail,
    setPassword,
    errors,
    handleLogin,
    loading,
    apiError,
  } = useLoginForm();

  return (
    <Box
      component="form"
      className="form"
      noValidate
      autoComplete="off"
      onSubmit={(e) => void handleLogin(e)}
    >
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
        error={!!errors.email}
        helperText={errors.email}
      />

      <label className="form-label">Password</label>
      <PasswordField
        placeholder="Enter your password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        error={!!errors.password}
        helperText={errors.password}
      />

      {/* Show API error here */}
      {apiError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {apiError}
        </Alert>
      )}

      <Typography
        variant="body2"
        sx={{ mt: 2, mb: 1, textAlign: "left", color: "#000" }}
      >
        Don't have an account?{" "}
        <Link
          to="/signup"
          style={{
            color: "#1976d2",
            textDecoration: "none",
            fontWeight: "bold",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#0d47a1")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#1976d2")}
        >
          Sign up here
        </Link>
      </Typography>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
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
        {loading ? "Logging in..." : "LOGIN"}
      </Button>
    </Box>
  );
}
