export const Grades = {
  L: 0, K: 0, E: 0, D: 0,
  Cm: 1, C: 2, Cp: 3, Bm: 4, B: 5, Bp: 6, Am: 7, A: 8, Ap: 9
} as const;
export type GradeStrings = keyof typeof Grades | '';

export interface Course {
  id: string;
  name: string;
  grade: GradeStrings;
  points: number;
}

export interface Trimester {
  id: string;
  courses: Course []
}

export interface Year {
  id: string;
  trimesters: Trimester [];
}