import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Chip,
  Divider,
} from "@mui/material";
import { useState, useMemo, useCallback } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
//import { useTranslation } from "react-i18next";

interface Course {
  name: string;
  code: string;
  score: number;
}

interface University {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  courses: Course[];
  applicationMethod: string[];
  tuitionFee: string;
  location: string;
  matchScore: number;
}

// Mock data - replace with actual data from your API/backend
const mockUniversities: University[] = [
  {
    id: "1",
    name: "Đại học Kinh tế TP.HCM",
    shortName: "UEH",
    matchScore: 95,
    location: "TP. Hồ Chí Minh",
    courses: [
      { name: "Kinh doanh Quốc tế", code: "IB", score: 24.5 },
      { name: "Quản trị Kinh doanh", code: "BA", score: 23.8 },
      { name: "Kế toán", code: "AC", score: 24.0 },
    ],
    applicationMethod: ["Xét điểm thi THPT", "Xét học bạ", "Xét điểm SAT/ACT"],
    tuitionFee: "15.000.000 - 20.000.000 VNĐ/năm",
  },
  {
    id: "2",
    name: "Đại học Bách Khoa TP.HCM",
    shortName: "HCMUT",
    matchScore: 92,
    location: "TP. Hồ Chí Minh",
    courses: [
      { name: "Công nghệ Thông tin", code: "IT", score: 25.0 },
      { name: "Kỹ thuật Máy tính", code: "CE", score: 24.5 },
      { name: "Khoa học Máy tính", code: "CS", score: 25.5 },
    ],
    applicationMethod: ["Xét điểm thi THPT", "Xét học bạ THPT", "Kỳ thi riêng"],
    tuitionFee: "12.000.000 - 18.000.000 VNĐ/năm",
  },
  {
    id: "3",
    name: "Đại học Tôn Đức Thắng",
    shortName: "TDTU",
    matchScore: 88,
    location: "TP. Hồ Chí Minh",
    courses: [
      { name: "Công nghệ Phần mềm", code: "SE", score: 22.5 },
      { name: "Hệ thống Thông tin", code: "IS", score: 22.0 },
      { name: "An toàn Thông tin", code: "InfoSec", score: 23.0 },
    ],
    applicationMethod: ["Xét điểm thi THPT", "Xét học bạ", "Xét kết hợp"],
    tuitionFee: "10.000.000 - 15.000.000 VNĐ/năm",
  },
  {
    id: "4",
    name: "Đại học Nông Lâm TP.HCM",
    shortName: "NLU",
    matchScore: 85,
    location: "TP. Hồ Chí Minh",
    courses: [
      { name: "Công nghệ Sinh học", code: "BT", score: 21.5 },
      { name: "Môi trường", code: "ENV", score: 20.8 },
      { name: "Nông học", code: "AG", score: 21.0 },
    ],
    applicationMethod: ["Xét điểm thi THPT", "Xét học bạ"],
    tuitionFee: "8.000.000 - 12.000.000 VNĐ/năm",
  },
  {
    id: "5",
    name: "Đại học Công Nghệ Thông Tin",
    shortName: "UIT",
    matchScore: 90,
    location: "TP. Hồ Chí Minh",
    courses: [
      { name: "Khoa học Dữ liệu", code: "DS", score: 24.8 },
      { name: "Trí tuệ Nhân tạo", code: "AI", score: 25.2 },
      { name: "An ninh Mạng", code: "NS", score: 24.0 },
    ],
    applicationMethod: ["Xét điểm thi THPT", "Xét học bạ", "Olympic Tin học"],
    tuitionFee: "11.000.000 - 16.000.000 VNĐ/năm",
  },
];

export default function FinalResult() {
  //const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter universities based on search query
  const filteredUniversities = useMemo(() => {
    if (!searchQuery.trim()) {
      return mockUniversities;
    }

    const query = searchQuery.toLowerCase();
    return mockUniversities.filter(
      (uni) =>
        uni.name.toLowerCase().includes(query) ||
        uni.shortName.toLowerCase().includes(query) ||
        uni.courses.some((course) => course.name.toLowerCase().includes(query)),
    );
  }, [searchQuery]);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
    },
    [],
  );

  return (
    <Box
      className="final-result"
      sx={{
        width: "100%",
        maxWidth: "1100px",
        margin: "0 auto",
        px: 2,
        py: 3,
      }}
    >
      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm trường đại học hoặc ngành học..."
          value={searchQuery}
          onChange={handleSearchChange}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{ color: "#A657AE", fontSize: "1.8rem" }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            backgroundColor: "white",
            borderRadius: "30px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "30px",
              "& fieldset": {
                borderColor: "rgba(166, 87, 174, 0.3)",
              },
              "&:hover fieldset": {
                borderColor: "#A657AE",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#A657AE",
                borderWidth: "2px",
              },
            },
            "& input": {
              padding: "16px 20px",
              fontSize: "1rem",
            },
          }}
        />
      </Box>

      {/* University Results */}
      <Box>
        {filteredUniversities.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "16px",
            }}
          >
            <Typography variant="h6" sx={{ color: "#A657AE", fontWeight: 500 }}>
              Không tìm thấy trường đại học phù hợp với từ khóa "{searchQuery}"
            </Typography>
          </Box>
        ) : (
          filteredUniversities.map((university) => (
            <Accordion
              key={university.id}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "12px !important",
                mb: 3,
                "&:before": { display: "none" },
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "#A657AE" }} />}
                sx={{
                  backgroundColor: "rgba(166, 87, 174, 0.1)",
                  borderRadius: "12px",
                  minHeight: "70px",
                  "& .MuiAccordionSummary-content": {
                    alignItems: "center",
                    justifyContent: "space-between",
                    my: 1.5,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flex: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#A657AE",
                      fontWeight: 600,
                      fontSize: "1.2rem",
                    }}
                  >
                    {university.name} ({university.shortName})
                  </Typography>
                </Box>
              </AccordionSummary>

              <AccordionDetails sx={{ px: 4, py: 3 }}>
                {/* Courses Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#A657AE",
                      fontWeight: 600,
                      mb: 2,
                      fontSize: "1.1rem",
                    }}
                  >
                    Các ngành học phù hợp:
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {university.courses.map((course) => (
                      <Box
                        key={`${university.id}-${course.code}`}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          backgroundColor: "rgba(166, 87, 174, 0.05)",
                          padding: "12px 20px",
                          borderRadius: "8px",
                          border: "1px solid rgba(166, 87, 174, 0.2)",
                        }}
                      >
                        <Box>
                          <Typography
                            sx={{
                              color: "#333",
                              fontWeight: 500,
                              fontSize: "1rem",
                            }}
                          >
                            {course.name}
                          </Typography>
                          <Typography
                            sx={{
                              color: "#666",
                              fontSize: "0.85rem",
                              mt: 0.5,
                            }}
                          >
                            Mã ngành: {course.code}
                          </Typography>
                        </Box>
                        <Chip
                          label={`Điểm: ${String(course.score)}`}
                          sx={{
                            backgroundColor: "#A657AE",
                            color: "white",
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Application Method */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#A657AE",
                      fontWeight: 600,
                      mb: 2,
                      fontSize: "1.1rem",
                    }}
                  >
                    Phương thức xét tuyển:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {university.applicationMethod.map((method) => (
                      <Chip
                        key={`${university.id}-${method}`}
                        label={method}
                        sx={{
                          backgroundColor: "rgba(166, 87, 174, 0.15)",
                          color: "#A657AE",
                          fontWeight: 500,
                          fontSize: "0.9rem",
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Tuition Fee */}
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#A657AE",
                      fontWeight: 600,
                      mb: 1,
                      fontSize: "1.1rem",
                    }}
                  >
                    Học phí:
                  </Typography>
                  <Typography
                    sx={{
                      color: "#333",
                      fontSize: "1rem",
                    }}
                  >
                    {university.tuitionFee}
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Box>
    </Box>
  );
}
