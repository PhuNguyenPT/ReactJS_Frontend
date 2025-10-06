// Type definitions for admission data
export interface AdmissionProgram {
  admissionCode: string;
  admissionType: string;
  admissionTypeName: string;
  id: string;
  majorCode: string;
  majorName: string;
  province: string;
  studyProgram: string;
  subjectCombination: string;
  tuitionFee: string;
  uniCode: string;
  uniName: string;
  uniType: string;
  uniWebLink: string;
}

export interface AdmissionApiResponse {
  content: AdmissionProgram[];
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  sort: {
    orders: {
      direction: string;
      field: string;
    }[];
  };
  totalElements: number;
  totalPages: number;
}

// Transformed data structure for the UI
export interface University {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  courses: Course[];
  applicationMethods: string[];
  tuitionFeeRange: string;
  location: string;
  uniType: string;
  webLink: string;
}

export interface Course {
  name: string;
  code: string;
  majorCode: string;
  admissionType: string;
  admissionTypeName: string;
  subjectCombination: string;
  tuitionFee: string;
  studyProgram: string;
}
