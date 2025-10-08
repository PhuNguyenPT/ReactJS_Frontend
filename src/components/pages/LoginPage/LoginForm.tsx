import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import PasswordField from "../../common/PasswordField/PasswordField";
import useLoginForm from "../../../hooks/auth/useLoginForm";
import { useTranslation } from "react-i18next";

export default function LoginForm() {
  const { t } = useTranslation();
  const {
    email,
    password,
    setEmail,
    setPassword,
    errors,
    handleLogin,
    loading,
    apiError,
    showPassword,
    setShowPassword,
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
        placeholder={t("loginForm.enterEmail")}
        autoComplete="email"
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

      <label className="form-label">{t("forms.password")}</label>
      <PasswordField
        placeholder={t("loginForm.enterPassword")}
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        error={!!errors.password}
        helperText={errors.password}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        disabled={loading}
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
        {t("loginForm.noAccount")}{" "}
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
          {t("loginForm.signupLink")}
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
        {loading ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={20} color="inherit" />
            {t("loginForm.logging_in")}
          </Box>
        ) : (
          t("loginForm.login")
        )}
      </Button>
    </Box>
  );
}
