import type { FormData } from "./FormDataContext";

/**
 * Helper function to check if a value is empty (null, undefined, empty string, or whitespace)
 */
function isEmpty(value: unknown): boolean {
  return (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "")
  );
}

/**
 * Helper function to filter out empty values from arrays
 */
function filterNonEmpty<T>(arr: (T | null | undefined)[]): T[] {
  return arr.filter((item) => !isEmpty(item)) as T[];
}

/**
 * Transform form data to API schema, excluding all empty/null/undefined values
 */
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

  // Build the base payload with only non-empty values
  const payload: Record<string, unknown> = {};

  // Add province if not empty
  if (!isEmpty(formData.firstForm)) {
    payload.province = formData.firstForm;
  }

  // Add uniType if not empty
  if (!isEmpty(formData.uniType)) {
    payload.uniType = formData.uniType;
  }

  // Add majors (filter out null/empty values)
  const majors = filterNonEmpty(formData.secondForm);
  if (majors.length > 0) {
    payload.majors = majors;
  }

  // Build national exams array (only include if scores are provided)
  const nationalExams = [];

  if (!isEmpty(formData.thirdForm.mathScore)) {
    const mathScore = parseFloat(formData.thirdForm.mathScore);
    if (!isNaN(mathScore)) {
      nationalExams.push({ name: "Toán", score: mathScore });
    }
  }

  if (!isEmpty(formData.thirdForm.literatureScore)) {
    const litScore = parseFloat(formData.thirdForm.literatureScore);
    if (!isNaN(litScore)) {
      nationalExams.push({ name: "Ngữ Văn", score: litScore });
    }
  }

  // Add chosen subjects with scores
  formData.thirdForm.chosenSubjects.forEach((subject, i) => {
    const score = formData.thirdForm.chosenScores[i];
    if (!isEmpty(subject) && !isEmpty(score)) {
      const parsedScore = parseFloat(score);
      if (!isNaN(parsedScore)) {
        nationalExams.push({ name: subject, score: parsedScore });
      }
    }
  });

  if (nationalExams.length > 0) {
    payload.nationalExams = nationalExams;
  }

  // Add aptitude test score if available
  if (
    aptitudeCategory?.scores.length &&
    !isEmpty(aptitudeCategory.scores[0].score)
  ) {
    const score = parseFloat(aptitudeCategory.scores[0].score);
    if (!isNaN(score)) {
      payload.aptitudeTestScore = {
        examType: {
          type: "DGNL",
          value: "VNUHCM",
        },
        score,
      };
    }
  }

  // Add VSAT scores if available
  const vsatScores = vsatCategory?.scores
    .filter((s) => !isEmpty(s.subject) && !isEmpty(s.score))
    .map((s) => ({
      name: s.subject,
      score: parseFloat(s.score) || 0,
    }))
    .filter((s) => !isNaN(s.score));

  if (vsatScores && vsatScores.length > 0) {
    payload.vsatScores = vsatScores;
  }

  // Add talent scores if available
  const talentScores = talentCategory?.scores
    .filter((s) => !isEmpty(s.subject) && !isEmpty(s.score))
    .map((s) => ({
      name: s.subject,
      score: parseFloat(s.score) || 0,
    }))
    .filter((s) => !isNaN(s.score));

  if (talentScores && talentScores.length > 0) {
    payload.talentScores = talentScores;
  }

  // Add awards if available
  const awards = nationalAwards
    .filter((a) => !isEmpty(a.firstField) && !isEmpty(a.secondField))
    .map((a) => ({
      category: a.firstField,
      level: a.secondField,
      name: "Học sinh giỏi cấp Quốc Gia",
    }));

  if (awards.length > 0) {
    payload.awards = awards;
  }

  // Add certifications if available
  const certifications = [
    ...languageCerts
      .filter((c) => !isEmpty(c.firstField) && !isEmpty(c.secondField))
      .map((c) => ({
        examType: {
          type: "CCNN",
          value: c.firstField,
        },
        level: c.secondField,
      })),
    ...internationalCerts
      .filter((c) => !isEmpty(c.firstField) && !isEmpty(c.secondField))
      .map((c) => ({
        examType: {
          type: "CCQT",
          value: c.firstField,
        },
        level: c.secondField,
      })),
  ];

  if (certifications.length > 0) {
    payload.certifications = certifications;
  }

  // Add budget only if values are meaningful (not default 0, 900000000)
  const minBudget = formData.fifthForm.costRange[0];
  const maxBudget = formData.fifthForm.costRange[1];

  if (minBudget > 0 || maxBudget < 900000000) {
    payload.minBudget = minBudget;
    payload.maxBudget = maxBudget;
  }

  // Add special student cases if available
  if (formData.sixthForm.specialStudentCases.length > 0) {
    payload.specialStudentCases = formData.sixthForm.specialStudentCases;
  }

  // Add conducts if any grade has a conduct value
  const conducts = Object.entries(formData.seventhForm.grades)
    .filter(([, values]) => !isEmpty(values.conduct))
    .map(([grade, values]) => ({
      grade: parseInt(grade, 10),
      conduct: values.conduct,
    }));

  if (conducts.length > 0) {
    payload.conducts = conducts;
  }

  // Add academic performances if any grade has a performance value
  const academicPerformances = Object.entries(formData.seventhForm.grades)
    .filter(([, values]) => !isEmpty(values.academicPerformance))
    .map(([grade, values]) => ({
      grade: parseInt(grade, 10),
      academicPerformance: values.academicPerformance,
    }));

  if (academicPerformances.length > 0) {
    payload.academicPerformances = academicPerformances;
  }

  return payload;
}
