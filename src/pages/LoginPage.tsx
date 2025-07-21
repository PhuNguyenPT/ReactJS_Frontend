// src/pages/Login.tsx
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";

export default function Login() {
  usePageTitle("UniGuide | Login");

  return (
    <>
      <div className="background" />
      <div className="signup-container">
        <div className="signup-card">
          <h1 className="title">Welcome to UniGuide</h1>
          <p className="subtitle">Login to your account</p>

          <Box component="form" className="form" noValidate autoComplete="off">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <TextField
              placeholder="jane.doe@example.com"
              fullWidth
              required
              variant="outlined"
              type="email"
              size="small"
            />

            <label className="form-label" htmlFor="password">
              Password
            </label>
            <TextField
              placeholder="Enter your password"
              fullWidth
              required
              variant="outlined"
              type="password"
              autoComplete="current-password"
              size="small"
            />
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
              LOGIN
            </Button>
          </Box>
        </div>
      </div>
    </>
  );
}
