import type { FormData } from "./FormDataContext";

export function transformFormDataToApiSchema(formData: FormData) {
  // Extract optional categories
  const aptitudeCategory = formData.thirdForm.optionalCategories.find(
    (c) => c.name === "ĐGNL",
  );
  const vsatCategory = formData.thirdForm.optionalCategories.find(
    (c) => c.name === "V-SAT",
  );
  const talentCategory = formData.thirdForm.optionalCategories.find(
    (c) => c.name === "Năng khiếu",
  );

  // Extract fourthForm categories
  const nationalAwards =
    formData.fourthForm.categories.find(
      (c) => c.categoryType === "national_award",
    )?.entries ?? [];

  const internationalCerts =
    formData.fourthForm.categories.find(
      (c) => c.categoryType === "international_cert",
    )?.entries ?? [];

  const languageCerts =
    formData.fourthForm.categories.find(
      (c) => c.categoryType === "language_cert",
    )?.entries ?? [];

  return {
    province: formData.firstForm ?? "",
    uniType: formData.uniType ?? "",

    // formData.secondForm now contains Vietnamese values when coming from getFormDataForApi()
    majors: formData.secondForm.filter(Boolean) as string[],

    nationalExams: [
      { name: "Toán", score: parseFloat(formData.thirdForm.mathScore) || 0 },
      {
        name: "Ngữ Văn",
        score: parseFloat(formData.thirdForm.literatureScore) || 0,
      },
      ...formData.thirdForm.chosenSubjects.map((subject, i) => ({
        name: subject ?? "",
        score: parseFloat(formData.thirdForm.chosenScores[i] || "0") || 0,
      })),
    ],

    // Fixed: Only include if scores exist, match the example structure
    aptitudeTestScore: aptitudeCategory?.scores.length
      ? {
          examType: {
            type: "DGNL",
            value: "VNUHCM", // This should be dynamic based on the actual exam type
          },
          score: parseFloat(aptitudeCategory.scores[0].score) || 0,
        }
      : null,

    vsatScores:
      vsatCategory?.scores.map((s) => ({
        name: s.subject,
        score: parseFloat(s.score) || 0,
      })) ?? [],

    talentScores:
      talentCategory?.scores.map((s) => ({
        name: s.subject,
        score: parseFloat(s.score) || 0,
      })) ?? [],

    // Fixed: Awards structure to match the example
    awards: nationalAwards.map((a) => ({
      category: a.firstField, // The subject/field (e.g., "Tiếng Anh")
      level: a.secondField, // The rank (e.g., "Hạng Nhất")
      name: "Học sinh giỏi cấp Quốc Gia", // This should be based on the award type
    })),

    // Fixed: Certifications structure
    certifications: [
      ...languageCerts.map((c) => ({
        examType: {
          type: "CCNN", // Language certification
          value: c.firstField, // e.g., "IELTS"
        },
        level: c.secondField, // e.g., "6.5"
      })),
      ...internationalCerts.map((c) => ({
        examType: {
          type: "CCQT", // International certification
          value: c.firstField, // e.g., "SAT"
        },
        level: c.secondField, // e.g., "1200"
      })),
    ],

    // Budget values are already in VND after getFormDataForApi conversion
    minBudget: formData.fifthForm.costRange[0],
    maxBudget: formData.fifthForm.costRange[1],

    // Special cases are already in Vietnamese after getFormDataForApi conversion
    specialStudentCases: formData.sixthForm.specialStudentCases,

    // Conducts are already in Vietnamese after getFormDataForApi conversion
    conducts: Object.entries(formData.seventhForm.grades).map(
      ([grade, values]) => ({
        grade: parseInt(grade, 10),
        conduct: values.conduct,
      }),
    ),

    // Academic performances are already in Vietnamese after getFormDataForApi conversion
    academicPerformances: Object.entries(formData.seventhForm.grades).map(
      ([grade, values]) => ({
        grade: parseInt(grade, 10),
        academicPerformance: values.academicPerformance,
      }),
    ),
  };
}
