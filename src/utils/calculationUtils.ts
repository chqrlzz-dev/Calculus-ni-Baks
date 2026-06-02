import { GradingComponent, calculateComponentScore } from './gradingSystems';

// Calculate total period grade from dynamic components
export const calculateTotalPeriodGrade = (components: GradingComponent[]): number => {
  if (!components || !Array.isArray(components)) {
    console.error('[DEBUG] components is undefined or not an array', components);
    return 0;
  }
  return components.reduce((sum, comp) => sum + (calculateComponentScore(comp) || 0), 0);
};

// Calculate final grade with dynamic period weighting
export const calculateFinalGrade = (
  midterm: number, 
  finals: number, 
  midtermWeight: number = 0.30, 
  finalsWeight: number = 0.70
): number => {
  return (midterm * midtermWeight) + (finals * finalsWeight);
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
  const mWeight = midtermWeight > 1 ? midtermWeight / 100 : midtermWeight;
  const fWeight = finalsWeight > 1 ? finalsWeight / 100 : finalsWeight;
  const needed = (targetGrade - (currentMidterm * mWeight)) / fWeight;
  return needed;
};

// GPE mapping
export const calculateGPE = (finalGrade: number, passingGrade: number = 75): string => {
  const roundedGrade = naturalRound(finalGrade);
  
  // Adjusted GPE scale based on the passing threshold
  // If passing is 50, then 50% = 3.0. If passing is 75, then 75% = 3.0.
  if (roundedGrade < passingGrade) return "5.00";
  
  // For simplicity and since most CE subjects follow the 75% = 3.0 standard in PH
  // we will stick to the provided scale but adjust the "5.0" floor.
  if (roundedGrade >= 99) return "1.00";
  if (roundedGrade >= 96) return "1.25";
  if (roundedGrade >= 93) return "1.50";
  if (roundedGrade >= 90) return "1.75";
  if (roundedGrade >= 87) return "2.00";
  if (roundedGrade >= 84) return "2.25";
  if (roundedGrade >= 81) return "2.50";
  if (roundedGrade >= 78) return "2.75";
  if (roundedGrade >= 75) return "3.00";
  
  // Handle cases where passing is below 75 (transmuted)
  if (passingGrade < 75 && roundedGrade >= passingGrade) return "3.00";

  return "5.00";
};

// UI color mapping
export const getGradeColor = (finalGrade: number, passingGrade: number = 75): string => {
  const roundedGrade = naturalRound(finalGrade);
  if (roundedGrade < passingGrade) return "text-destructive";
  if (roundedGrade < passingGrade + 5) return "text-yellow-500";
  if (roundedGrade < passingGrade + 15) return "text-orange-400";
  return "text-green-500";
};

export const formatFinalGrade = (finalGrade: number): string => {
  const roundedGrade = naturalRound(finalGrade);
  return `${roundedGrade} (${finalGrade.toFixed(2)})`;
};
