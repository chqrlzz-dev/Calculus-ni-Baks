import jsPDF from 'jspdf';
import { CourseData } from './storage';
import { 
  calculateTotalPeriodGrade, 
  calculateFinalGrade, 
  calculateGPE, 
  formatFinalGrade 
} from './calculationUtils';
import { calculateComponentScore } from './gradingSystems';

export const generatePDFTranscript = async (course: CourseData): Promise<void> => {
  console.log('[DEBUG] Starting generatePDFTranscript', { courseName: course.name });
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Set colors
    const primaryColor: [number, number, number] = [244, 114, 182]; // Pink
    const secondaryColor: [number, number, number] = [75, 85, 99]; // Gray
    const successColor: [number, number, number] = [34, 197, 94]; // Green
    
    // Calculate grades
    const midtermGrade = calculateTotalPeriodGrade(course.midtermComponents);
    const finalsGrade = calculateTotalPeriodGrade(course.finalsComponents);
    const finalGrade = calculateFinalGrade(midtermGrade, finalsGrade, course.settings.midtermWeight, course.settings.finalsWeight);
    const gpe = calculateGPE(finalGrade);
    
    // PDF Header
    pdf.setTextColor(...primaryColor);
    pdf.setFontSize(24);
    pdf.text('Calculus ni Baks 📘✏️', 20, 25);
    
    pdf.setDrawColor(...primaryColor);
    pdf.setLineWidth(0.5);
    pdf.line(20, 30, 190, 30);
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(16);
    pdf.text(`Subject: ${course.name}`, 20, 45);
    pdf.setFontSize(12);
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 55);
    
    let yPos = 70;
    pdf.setFontSize(16);
    pdf.text('Grading Summary', 20, yPos);
    yPos += 15;
    
    // Midterm Section
    pdf.setTextColor(...primaryColor);
    pdf.setFontSize(14);
    pdf.text('Midterm Period', 20, yPos);
    pdf.setTextColor(0, 0, 0);
    yPos += 10;
    
    course.midtermComponents.forEach(comp => {
      const score = calculateComponentScore(comp);
      pdf.setFontSize(10);
      pdf.text(`• ${comp.name}: ${score.toFixed(2)} pts (${(comp.weight * 100).toFixed(0)}%)`, 25, yPos);
      yPos += 7;
    });
    
    pdf.setFontSize(11);
    pdf.text(`Midterm Total: ${midtermGrade.toFixed(2)}%`, 25, yPos);
    yPos += 15;

    // Finals Section
    pdf.setTextColor(...primaryColor);
    pdf.setFontSize(14);
    pdf.text('Finals Period', 20, yPos);
    pdf.setTextColor(0, 0, 0);
    yPos += 10;
    
    course.finalsComponents.forEach(comp => {
      const score = calculateComponentScore(comp);
      pdf.setFontSize(10);
      pdf.text(`• ${comp.name}: ${score.toFixed(2)} pts (${(comp.weight * 100).toFixed(0)}%)`, 25, yPos);
      yPos += 7;
    });
    
    pdf.setFontSize(11);
    pdf.text(`Finals Total: ${finalsGrade.toFixed(2)}%`, 25, yPos);
    yPos += 20;
    
    // Results
    pdf.setTextColor(...primaryColor);
    pdf.setFontSize(18);
    pdf.text('Final Computation', 20, yPos);
    pdf.setTextColor(0, 0, 0);
    yPos += 12;
    
    pdf.setFontSize(12);
    pdf.text(`Final Grade: ${formatFinalGrade(finalGrade)}`, 30, yPos);
    yPos += 10;
    pdf.setTextColor(...successColor);
    pdf.text(`GPE: ${gpe}`, 30, yPos);
    pdf.setTextColor(0, 0, 0);
    
    // Footer
    const pageHeight = pdf.internal.pageSize.height;
    pdf.setFontSize(8);
    pdf.text('Verified @ Calculus ni Baks | Code by @chqrlzz', 20, pageHeight - 10);
    
    pdf.save(`${course.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_report.pdf`);
    console.log('[DEBUG] PDF export successful');
  } catch (error) {
    console.error('[DEBUG] Failed to generate PDF:', error);
    throw new Error('Failed to generate PDF transcript');
  }
};
