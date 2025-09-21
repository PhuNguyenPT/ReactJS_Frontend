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

    aptitudeTestScore: aptitudeCategory?.scores.length
      ? {
          examType: { type: "DGNL", value: "VNUHCM" },
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

    awards: nationalAwards.map((a) => ({
      category: a.firstFieldOther ?? a.firstField,
      level: a.secondField,
      name: a.firstField,
    })),

    certifications: [
      ...languageCerts.map((c) => ({
        examType: { type: "CCNN", value: c.firstField },
        level: c.secondField,
      })),
      ...internationalCerts.map((c) => ({
        examType: { type: "CCQT", value: c.firstField },
        level: c.secondField,
      })),
    ],

    minBudget: formData.fifthForm.costRange[0],
    maxBudget: formData.fifthForm.costRange[1],

    specialStudentCases: formData.sixthForm.specialStudentCases,

    conducts: Object.entries(formData.seventhForm.grades).map(
      ([grade, values]) => ({
        grade: parseInt(grade, 10),
        conduct: values.conduct,
      }),
    ),

    academicPerformances: Object.entries(formData.seventhForm.grades).map(
      ([grade, values]) => ({
        grade: parseInt(grade, 10),
        academicPerformance: values.academicPerformance,
      }),
    ),
  };
}

// Example usage for API calls:
// const { getFormDataForApi } = useFormData();
// const vietnameseFormData = getFormDataForApi();
// const apiPayload = transformFormDataToApiSchema(vietnameseFormData);
