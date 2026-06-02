

export type GradingFormulaType = 'sir-baks' | 'linear' | 'base-50' | 'base-60' | 'zero-based';

export interface GradingComponent {
  id: string;
  name: string;
  weight: number; 
  score: number | null;
  maxScore: number | null;
  formulaType: GradingFormulaType;
  isAverage?: boolean;
  subScores?: (number | null)[];
  subMaxScores?: (number | null)[];
}

export interface GradingTemplate {
  id: string;
  name: string;
  description: string;
  passingGrade: number; // The threshold for passing (e.g., 50, 60, or 75)
  periodRatios: {
    midterm: number;
    finals: number;
  };
  defaultComponents: GradingComponent[];
}

export const GRADING_TEMPLATES: GradingTemplate[] = [
  {
    id: 'diff-cal-distura',
    name: 'Diff Cal',
    description: 'Differential Calculus (Distura): Sir Baks System. Passing: 75%.',
    passingGrade: 75,
    periodRatios: { midterm: 0.3, finals: 0.7 },
    defaultComponents: [
      { id: 'quiz', name: 'Quizzes', weight: 0.35, score: null, maxScore: 100, formulaType: 'sir-baks', isAverage: true, subScores: [null, null], subMaxScores: [100, 100] },
      { id: 'exam', name: 'Major Exam', weight: 0.45, score: null, maxScore: 100, formulaType: 'sir-baks' },
      { id: 'attendance', name: 'Attendance', weight: 0.10, score: 10, maxScore: 10, formulaType: 'linear' },
      { id: 'problem-set', name: 'Problem Set', weight: 0.10, score: 10, maxScore: 10, formulaType: 'linear' },
    ]
  },
  {
    id: 'integral-cal-distura',
    name: 'Integral Cal',
    description: 'Integral Calculus (Distura): Sir Baks System. Passing: 75%.',
    passingGrade: 75,
    periodRatios: { midterm: 0.3, finals: 0.7 },
    defaultComponents: [
      { id: 'quiz', name: 'Quizzes', weight: 0.35, score: null, maxScore: 100, formulaType: 'sir-baks', isAverage: true, subScores: [null, null], subMaxScores: [100, 100] },
      { id: 'exam', name: 'Major Exam', weight: 0.45, score: null, maxScore: 100, formulaType: 'sir-baks' },
      { id: 'attendance', name: 'Attendance', weight: 0.10, score: 10, maxScore: 10, formulaType: 'linear' },
      { id: 'problem-set', name: 'Problem Set', weight: 0.10, score: 10, maxScore: 10, formulaType: 'linear' },
    ]
  },
  {
    id: 'cmat-borbon',
    name: 'CMAT',
    description: 'Const Materials (Borbon): Zero-Based. Passing: 50%.',
    passingGrade: 50,
    periodRatios: { midterm: 0.3, finals: 0.7 },
    defaultComponents: [
      { id: 'quiz', name: 'Quizzes', weight: 0.40, score: null, maxScore: 100, formulaType: 'linear', isAverage: true, subScores: [null], subMaxScores: [100] },
      { id: 'exam', name: 'Major Exam', weight: 0.50, score: null, maxScore: 100, formulaType: 'linear' },
      { id: 'problem-set', name: 'Problem Set', weight: 0.10, score: null, maxScore: 100, formulaType: 'linear' },
    ]
  },
  {
    id: 'strema-cabanus',
    name: 'Strema',
    description: 'Mechanics of Deformable Bodies (Cabanus): Zero-Based. Passing: 60%.',
    passingGrade: 60,
    periodRatios: { midterm: 0.3, finals: 0.7 },
    defaultComponents: [
      { id: 'quiz', name: 'Quizzes', weight: 0.30, score: null, maxScore: 100, formulaType: 'linear', isAverage: true, subScores: [null], subMaxScores: [100] },
      { id: 'exam', name: 'Major Exam', weight: 0.50, score: null, maxScore: 100, formulaType: 'linear' },
      { id: 'problem-set', name: 'Problem Set', weight: 0.20, score: null, maxScore: 100, formulaType: 'linear' },
    ]
  }
];

export const calculateComponentScore = (component: GradingComponent): number => {
  let percentage = 0;

  if (component.isAverage && component.subScores && component.subMaxScores) {
    const validPairs = component.subScores.map((s, i) => ({ s, m: component.subMaxScores![i] }))
      .filter(p => p.s !== null && p.m !== null && p.m !== 0);
    
    if (validPairs.length > 0) {
      const sums = validPairs.reduce((acc, p) => acc + (p.s! / p.m!), 0);
      percentage = sums / validPairs.length;
    }
  } else if (component.score !== null && component.maxScore !== null && component.maxScore !== 0) {
    percentage = component.score / component.maxScore;
  }

  const weightPoints = component.weight * 100;

  switch (component.formulaType) {
    case 'sir-baks':
    case 'base-50':
      return (percentage * 0.5 + 0.5) * weightPoints;
    case 'base-60':
      return (percentage * 0.4 + 0.6) * weightPoints;
    case 'linear':
    default:
      return percentage * weightPoints;
  }
};

export const getFormulaLatex = (component: GradingComponent): string => {
  let scoreStr = "Score";
  let maxStr = "Max";

  if (component.isAverage && component.subScores && component.subMaxScores) {
    const validPairs = component.subScores.map((s, i) => ({ s, m: component.subMaxScores![i] }))
      .filter(p => p.s !== null && p.m !== null && p.m !== 0);
    
    if (validPairs.length > 0) {
      const avg = (validPairs.reduce((acc, p) => acc + (p.s! / p.m!), 0) / validPairs.length) * 100;
      scoreStr = avg.toFixed(2);
      maxStr = "100";
    }
  } else {
    scoreStr = component.score !== null ? component.score.toString() : "Score";
    maxStr = component.maxScore !== null ? component.maxScore.toString() : "Max";
  }

  const weightPoints = (component.weight * 100).toFixed(0);

  switch (component.formulaType) {
    case 'sir-baks':
    case 'base-50':
      return `\\left( \\frac{${scoreStr}}{${maxStr}} \\times 0.5 + 0.5 \\right) \\times ${weightPoints}`;
    case 'base-60':
      return `\\left( \\frac{${scoreStr}}{${maxStr}} \\times 0.4 + 0.6 \\right) \\times ${weightPoints}`;
    case 'linear':
    default:
      return `\\frac{${scoreStr}}{${maxStr}} \\times ${weightPoints}`;
  }
};
