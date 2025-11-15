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

    // Group courses by major - ONLY get unique major codes
    const courseMap = new Map<string, AdmissionProgram>();
    programs.forEach((p) => {
      // Only keep the first occurrence of each major
      if (!courseMap.has(p.majorCode)) {
        courseMap.set(p.majorCode, p);
      }
    });

    // Create course objects - one per unique major
    const courses: Course[] = [];
    courseMap.forEach((prog) => {
      courses.push({
        name: prog.majorName,
        code: prog.majorCode,
        majorCode: prog.majorCode,
        admissionType: prog.admissionType,
        admissionTypeName: prog.admissionTypeName,
        subjectCombination: prog.subjectCombination,
        tuitionFee: formatCurrency(parseInt(prog.tuitionFee)),
        studyProgram: prog.studyProgram,
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
