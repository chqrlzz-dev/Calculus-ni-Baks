import html2canvas from 'html2canvas';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { CourseData } from './storage';
import { 
  calculateTotalPeriodGrade, 
  calculateFinalGrade, 
  calculateGPE, 
} from './calculationUtils';
import { getFormulaLatex } from './gradingSystems';

export const generateImageTranscript = async (course: CourseData): Promise<void> => {
  console.log('[DEBUG] Starting generateImageTranscript', { courseName: course.name });
  try {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '800px';
    container.style.padding = '50px';
    container.style.backgroundColor = '#0a0a0a';
    container.style.fontFamily = 'Outfit, sans-serif';
    container.style.color = '#ffffff';
    
    const midtermGrade = calculateTotalPeriodGrade(course.midtermComponents);
    const finalsGrade = calculateTotalPeriodGrade(course.finalsComponents);
    const finalGrade = calculateFinalGrade(midtermGrade, finalsGrade, course.settings.midtermWeight, course.settings.finalsWeight);
    const gpe = calculateGPE(finalGrade);

    const finalTotalFormula = `\\text{Total} = (${midtermGrade.toFixed(1)} \\times ${course.settings.midtermWeight}) + (${finalsGrade.toFixed(1)} \\times ${course.settings.finalsWeight})`;

    container.innerHTML = `
      <div style="background: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 40px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #f472b6; font-size: 32px; margin: 0; font-weight: 900; letter-spacing: -1px;">CALCULUS NI BAKS</h1>
          <p style="font-size: 10px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 3px; margin-top: 5px;">Academic Verification Protocol 📘✏️</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
          <div style="background: rgba(255,255,255,0.03); padding: 25px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); text-align: center;">
            <div style="font-size: 10px; color: rgba(255,255,255,0.5); text-transform: uppercase; font-weight: 900; margin-bottom: 10px;">Midterm</div>
            <div style="font-size: 36px; font-weight: 900; color: ${midtermGrade >= 75 ? '#f472b6' : '#ef4444'}">${midtermGrade.toFixed(1)}%</div>
          </div>
          <div style="background: rgba(255,255,255,0.03); padding: 25px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); text-align: center;">
            <div style="font-size: 10px; color: rgba(255,255,255,0.5); text-transform: uppercase; font-weight: 900; margin-bottom: 10px;">Finals</div>
            <div style="font-size: 36px; font-weight: 900; color: ${finalsGrade >= 75 ? '#f472b6' : '#ef4444'}">${finalsGrade.toFixed(1)}%</div>
          </div>
        </div>

        <div style="background: rgba(255,255,255,0.02); padding: 30px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 30px;">
          <h3 style="font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; color: #f472b6; margin: 0 0 20px 0;">Mathematical Proof</h3>
          
          <div style="margin-bottom: 25px;">
            <div style="font-size: 10px; font-weight: 900; color: rgba(255,255,255,0.3); text-transform: uppercase; margin-bottom: 10px;">[1] Midterm Logic</div>
            <div id="midterm-logic" style="margin-bottom: 10px; padding: 15px; background: rgba(255,255,255,0.02); border-radius: 12px;"></div>
          </div>

          <div style="margin-bottom: 25px;">
            <div style="font-size: 10px; font-weight: 900; color: rgba(255,255,255,0.3); text-transform: uppercase; margin-bottom: 10px;">[2] Finals Logic</div>
            <div id="finals-logic" style="margin-bottom: 10px; padding: 15px; background: rgba(255,255,255,0.02); border-radius: 12px;"></div>
          </div>

          <div>
            <div style="font-size: 10px; font-weight: 900; color: rgba(255,255,255,0.3); text-transform: uppercase; margin-bottom: 10px;">[3] Final Integration</div>
            <div id="final-total" style="padding: 20px; background: rgba(244, 114, 182, 0.05); border-radius: 12px; border: 1px solid rgba(244, 114, 182, 0.1);"></div>
          </div>
        </div>

        <div style="background: rgba(244, 114, 182, 0.1); padding: 40px; border-radius: 24px; border: 1px solid rgba(244, 114, 182, 0.3); text-align: center; position: relative; overflow: hidden;">
          <div style="font-size: 14px; color: #f472b6; text-transform: uppercase; font-weight: 900; letter-spacing: 2px; margin-bottom: 10px;">Overall Standing</div>
          <div style="font-size: 80px; font-weight: 900; line-height: 1; color: #f472b6; margin-bottom: 15px;">${Math.round(finalGrade)}%</div>
          <div style="font-size: 32px; font-weight: 900; color: rgba(255,255,255,0.9);">GPE: ${gpe}</div>
        </div>

        <div style="margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 20px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: rgba(255,255,255,0.4);">
          <div>Generated on ${new Date().toLocaleDateString()} | Verified @ Calculus ni Baks</div>
          <div style="font-weight: 900; color: #f472b6;">@CHQRLZZ PROTOCOL</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(container);

    const mLogic = course.midtermComponents.map(c => `\\text{${c.name}} = ${getFormulaLatex(c)}`).join(' \\\\ ');
    const fLogic = course.finalsComponents.map(c => `\\text{${c.name}} = ${getFormulaLatex(c)}`).join(' \\\\ ');

    katex.render(mLogic, container.querySelector('#midterm-logic') as HTMLElement, { displayMode: true });
    katex.render(fLogic, container.querySelector('#finals-logic') as HTMLElement, { displayMode: true });
    katex.render(finalTotalFormula, container.querySelector('#final-total') as HTMLElement, { displayMode: true });

    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(container, { 
      backgroundColor: null, 
      scale: 2, 
      logging: false, 
      useCORS: true,
    });
    
    document.body.removeChild(container);
    
    const link = document.createElement('a');
    link.download = `${course.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_grades.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    console.log('[DEBUG] Image export successful');
  } catch (error) {
    console.error('[DEBUG] Failed to generate image:', error);
    throw new Error('Failed to generate image transcript');
  }
};
