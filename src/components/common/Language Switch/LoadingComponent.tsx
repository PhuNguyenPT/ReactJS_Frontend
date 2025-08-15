import { CircularProgress, Box } from "@mui/material";

const LoadingComponent = () => {
  return (
    <>
      <div className="background" />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "fixed",
          width: "100%",
          height: "100%",
          fontSize: "3rem",
          fontWeight: 500,
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircularProgress
            size={40}
            thickness={4}
            sx={{
              color: "#ff69b4",
            }}
          />
          <Box
            sx={{
              color: "#ffffffff",
              fontSize: "2.5rem",
              fontWeight: 500,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Loading...
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default LoadingComponent;
