import type {
  AdmissionProgram,
  University,
  Course,
} from "../type/interface/admissionTypes";

/**
 * Transform raw admission API data into grouped university data
 */
export function transformAdmissionData(
  programs: AdmissionProgram[],
): University[] {
  // Group programs by university
  const universityMap = new Map<string, AdmissionProgram[]>();

  programs.forEach((program) => {
    const existing = universityMap.get(program.uniCode) ?? [];
    universityMap.set(program.uniCode, [...existing, program]);
  });

  // Transform into University objects
  const universities: University[] = [];

  universityMap.forEach((programs) => {
    const firstProgram = programs[0];

    // Get unique application methods
    const applicationMethods = [
      ...new Set(programs.map((p) => p.admissionTypeName)),
    ];

    // Get tuition fee range
    const tuitionFees = programs
      .map((p) => parseInt(p.tuitionFee))
      .filter((fee) => !isNaN(fee));

    const minFee = Math.min(...tuitionFees);
    const maxFee = Math.max(...tuitionFees);

    const tuitionFeeRange =
      minFee === maxFee
        ? formatCurrency(minFee)
        : `${formatCurrency(minFee)} - ${formatCurrency(maxFee)}`;

    // Group courses by major
    const courseMap = new Map<string, AdmissionProgram[]>();
    programs.forEach((p) => {
      const existing = courseMap.get(p.majorCode) ?? [];
      courseMap.set(p.majorCode, [...existing, p]);
    });

    // Create course objects
    const courses: Course[] = [];
    courseMap.forEach((progs) => {
      const mainProg = progs[0];
      courses.push({
        name: mainProg.majorName,
        code: mainProg.majorCode,
        majorCode: mainProg.majorCode,
        admissionType: mainProg.admissionType,
        admissionTypeName: mainProg.admissionTypeName,
        subjectCombination: progs.map((p) => p.subjectCombination).join(", "),
        tuitionFee: formatCurrency(parseInt(mainProg.tuitionFee)),
        studyProgram: mainProg.studyProgram,
      });
    });

    universities.push({
      id: firstProgram.uniCode,
      name: firstProgram.uniName,
      shortName: firstProgram.uniCode,
      courses,
      applicationMethods,
      tuitionFeeRange,
      location: firstProgram.province,
      uniType: firstProgram.uniType,
      webLink: firstProgram.uniWebLink,
    });
  });

  return universities;
}

/**
 * Format number as Vietnamese currency
 */
function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)} triệu VNĐ`;
  }
  return `${amount.toLocaleString("vi-VN")} VNĐ`;
}
