import { GradingComponent, calculateComponentScore } from './gradingSystems';

// Calculate total period grade from dynamic components
export const calculateTotalPeriodGrade = (components: GradingComponent[]): number => {
  console.log('[DEBUG] Starting calculateTotalPeriodGrade', { componentsCount: components.length });
  const total = components.reduce((sum, comp) => sum + calculateComponentScore(comp), 0);
  console.log('[DEBUG] Total period grade result:', total.toFixed(2));
  return total;
};

// Calculate final grade with dynamic period weighting
export const calculateFinalGrade = (
  midterm: number, 
  finals: number, 
  midtermWeight: number = 0.30, 
  finalsWeight: number = 0.70
): number => {
  console.log('[DEBUG] Starting calculateFinalGrade', { midterm, finals, midtermWeight, finalsWeight });
  const result = (midterm * midtermWeight) + (finals * finalsWeight);
  console.log('[DEBUG] Final grade result:', result.toFixed(2));
  return result;
};

// Natural rounding function
export const naturalRound = (num: number): number => {
  return Math.round(num);
};

// Reverse engineering needed finals score
export const calculatePointsNeeded = (
  currentMidterm: number, 
  targetGrade: number = 75,
  midtermWeight: number = 0.3,
  finalsWeight: number = 0.7
): number => {
  console.log('[DEBUG] Starting calculatePointsNeeded', { currentMidterm, targetGrade, midtermWeight, finalsWeight });
  const mWeight = midtermWeight > 1 ? midtermWeight / 100 : midtermWeight;
  const fWeight = finalsWeight > 1 ? finalsWeight / 100 : finalsWeight;
  const needed = (targetGrade - (currentMidterm * mWeight)) / fWeight;
  console.log('[DEBUG] Points needed result:', needed.toFixed(2));
  return needed;
};

// GPE mapping
export const calculateGPE = (finalGrade: number): string => {
  const roundedGrade = naturalRound(finalGrade);
  let result = "5.00";
  if (roundedGrade < 75) result = "5.00";
  else if (roundedGrade >= 99) result = "1.00";
  else if (roundedGrade >= 96) result = "1.25";
  else if (roundedGrade >= 93) result = "1.50";
  else if (roundedGrade >= 90) result = "1.75";
  else if (roundedGrade >= 87) result = "2.00";
  else if (roundedGrade >= 84) result = "2.25";
  else if (roundedGrade >= 81) result = "2.50";
  else if (roundedGrade >= 78) result = "2.75";
  else if (roundedGrade >= 75) result = "3.00";
  
  console.log('[DEBUG] GPE conversion:', { finalGrade, roundedGrade, gpe: result });
  return result;
};

// UI color mapping
export const getGradeColor = (finalGrade: number): string => {
  const roundedGrade = naturalRound(finalGrade);
  if (roundedGrade < 75) return "text-destructive";
  if (roundedGrade < 80) return "text-yellow-500";
  if (roundedGrade < 90) return "text-orange-400";
  return "text-green-500";
};

export const formatFinalGrade = (finalGrade: number): string => {
  const roundedGrade = naturalRound(finalGrade);
  return `${roundedGrade} (${finalGrade.toFixed(2)})`;
};
