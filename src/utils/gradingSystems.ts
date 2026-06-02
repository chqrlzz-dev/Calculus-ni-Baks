
export type GradingFormulaType = 'sir-baks' | 'linear' | 'base-50' | 'custom';

export interface GradingComponent {
  id: string;
  name: string;
  weight: number; // Percentage (e.g., 0.35 for 35%)
  score: number | null;
  maxScore: number | null;
  formulaType: GradingFormulaType;
  isAverage?: boolean; // If true, it might contain sub-scores
  subScores?: (number | null)[];
  subMaxScores?: (number | null)[];
}

export interface PeriodState {
  components: GradingComponent[];
}

export interface GradingTemplate {
  id: string;
  name: string;
  description: string;
  midtermWeights: {
    [key: string]: number;
  };
  finalsWeights: {
    [key: string]: number;
  };
  periodRatios: {
    midterm: number;
    finals: number;
  };
  defaultComponents: GradingComponent[];
}

export const GRADING_TEMPLATES: GradingTemplate[] = [
  {
    id: 'sir-baks-calculus',
    name: 'Differential & Integral Calculus (Sir Baks)',
    description: 'Quizzes (35%), Major Exam (45%), Attendance (10%), Problem Set (10%). Midterm: 30%, Finals: 70%.',
    midtermWeights: { quiz: 0.35, exam: 0.45, attendance: 0.1, problemSet: 0.1 },
    finalsWeights: { quiz: 0.35, exam: 0.45, attendance: 0.1, problemSet: 0.1 },
    periodRatios: { midterm: 0.3, finals: 0.7 },
    defaultComponents: [
      { id: 'quiz', name: 'Quizzes', weight: 0.35, score: null, maxScore: 100, formulaType: 'sir-baks', isAverage: true, subScores: [null, null], subMaxScores: [100, 100] },
      { id: 'exam', name: 'Major Exam', weight: 0.45, score: null, maxScore: 100, formulaType: 'sir-baks' },
      { id: 'attendance', name: 'Attendance', weight: 0.10, score: 10, maxScore: 10, formulaType: 'linear' },
      { id: 'problem-set', name: 'Problem Set', weight: 0.10, score: 10, maxScore: 10, formulaType: 'linear' },
    ]
  },
  {
    id: 'const-materials',
    name: 'Construction Materials and Testing',
    description: 'Quiz (40%), Midterm Exam (50%), Problem Set (10%). Midterm: 30%, Finals: 70%.',
    midtermWeights: { quiz: 0.4, exam: 0.5, problemSet: 0.1 },
    finalsWeights: { quiz: 0.4, exam: 0.5, problemSet: 0.1 },
    periodRatios: { midterm: 0.3, finals: 0.7 },
    defaultComponents: [
      { id: 'quiz', name: 'Quizzes', weight: 0.40, score: null, maxScore: 100, formulaType: 'linear', isAverage: true, subScores: [null], subMaxScores: [100] },
      { id: 'exam', name: 'Exam', weight: 0.50, score: null, maxScore: 100, formulaType: 'linear' },
      { id: 'problem-set', name: 'Problem Set', weight: 0.10, score: null, maxScore: 100, formulaType: 'linear' },
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

  switch (component.formulaType) {
    case 'sir-baks':
      // ((Raw / Max) * 0.5 + 0.5) * WeightPoints
      return (percentage * 0.5 + 0.5) * (component.weight * 100);
    case 'base-50':
      return (percentage * 0.5 + 0.5) * (component.weight * 100);
    case 'linear':
    default:
      // (Raw / Max) * WeightPoints
      return percentage * (component.weight * 100);
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
    case 'linear':
    default:
      return `\\frac{${scoreStr}}{${maxStr}} \\times ${weightPoints}`;
  }
};
