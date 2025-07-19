import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function Signup() {
  return (
    <>
      <div className="background" />
      <div className="signup-container">
        <div className="signup-card">
          <h1 className="title">Get started with UniGuide</h1>
          <p className="subtitle">Create a free account</p>

          <Box component="form" className="form" noValidate autoComplete="off">
            <TextField
              label="Full Name"
              placeholder="Jane Doe"
              fullWidth
              required
              margin="normal"
              variant="outlined"
            />

            <TextField
              label="Email Address"
              placeholder="jane.doe@example.com"
              fullWidth
              required
              margin="normal"
              variant="outlined"
              type="email"
            />

            <TextField
              label="Phone Number"
              placeholder="+84 123 456 789"
              fullWidth
              required
              margin="normal"
              variant="outlined"
              type="tel"
            />

            <TextField
              label="Password"
              placeholder="At least 8 characters"
              fullWidth
              required
              margin="normal"
              variant="outlined"
              type="password"
              autoComplete="new-password"
            />
            <TextField
              label="Confirm Password"
              placeholder="Repeat your password"
              fullWidth
              required
              margin="normal"
              variant="outlined"
              type="password"
              autoComplete="new-password"
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Sign Up
            </Button>
          </Box>
        </div>
      </div>
    </>
  );
}
