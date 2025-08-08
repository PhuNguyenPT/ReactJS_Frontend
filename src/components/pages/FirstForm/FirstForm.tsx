import { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  OutlinedInput,
  useTheme,
  type Theme,
  type SelectChangeEvent,
  type MenuProps,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// Dummy data (replace with API fetch later)
const provinces = [
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Đà Nẵng",
  "Cần Thơ",
  "Hải Phòng",
];

function getStyles(name: string, selected: string[], theme: Theme) {
  return {
    fontWeight: selected.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

const FirstForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setSelectedProvinces(typeof value === "string" ? value.split(",") : value);
  };
  const handleNext = () => {
    if (selectedProvinces.length > 0) {
      void navigate("/secondForm");
    } else {
      alert("Vui lòng chọn Tỉnh/Thành phố");
    }
  };

  return (
    <Box component="form" className="first-form">
      <FormControl fullWidth variant="outlined">
        <InputLabel>Tỉnh/Thành phố</InputLabel>
        <Select
          multiple
          value={selectedProvinces}
          onChange={handleChange}
          input={<OutlinedInput label="Tỉnh/Thành phố" />}
          MenuProps={MenuProps}
          sx={{
            borderRadius: 999,
            marginRight: 10,
            textAlign: "left",
            justifyContent: "flex-start",
          }}
        >
          {provinces.map((province) => (
            <MenuItem
              key={province}
              value={province}
              style={getStyles(province, selectedProvinces, theme)}
            >
              {province}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        sx={{
          mt: 4,
          px: 4,
          py: 1.5,
          borderRadius: 2,
          backgroundColor: "#A657AE",
          textTransform: "none",
          fontWeight: "bold",
          marginLeft: 45,
          marginTop: 15,
          "&:hover": {
            backgroundColor: "#8B4A8F",
          },
        }}
        onClick={handleNext}
      >
        Enter
      </Button>
    </Box>
  );
};

export default FirstForm;
