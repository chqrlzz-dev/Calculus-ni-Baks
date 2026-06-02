// Local storage utilities for persisting grade calculator data

import { GradingComponent, GRADING_TEMPLATES } from './gradingSystems';

export interface CourseData {
  id: string;
  name: string;
  templateId?: string;
  passingGrade: number; // Persisted passing threshold
  midtermComponents: GradingComponent[];
  finalsComponents: GradingComponent[];
  settings: {
    midtermWeight: number;
    finalsWeight: number;
    targetGrade: number;
  };
  lastModified: string;
  midtermState?: any;
  finalsState?: any;
}

export interface AppSettings {
  fontSize: number; // Font size in rem (0.8 to 1.4)
  theme: string;
  defaultTargetGrade: number;
}

const STORAGE_KEYS = {
  COURSES: 'grade-calculator-courses',
  ACTIVE_COURSE: 'grade-calculator-active-course',
  APP_SETTINGS: 'grade-calculator-settings'
};

// Course data management
export const saveCourses = (courses: CourseData[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  } catch (error) {
    console.error('Failed to save courses:', error);
  }
};

export const loadCourses = (): CourseData[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.COURSES);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load courses:', error);
    return [];
  }
};

export const saveCourse = (course: CourseData): void => {
  try {
    const courses = loadCourses();
    const existingIndex = courses.findIndex(c => c.id === course.id);
    
    if (existingIndex >= 0) {
      courses[existingIndex] = { ...course, lastModified: new Date().toISOString() };
    } else {
      courses.push({ ...course, lastModified: new Date().toISOString() });
    }
    
    saveCourses(courses);
  } catch (error) {
    console.error('Failed to save course:', error);
  }
};

export const deleteCourse = (courseId: string): void => {
  try {
    const courses = loadCourses();
    const filteredCourses = courses.filter(c => c.id !== courseId);
    saveCourses(filteredCourses);
    
    // If this was the active course, clear it
    if (getActiveCourseId() === courseId) {
      setActiveCourseId(null);
    }
  } catch (error) {
    console.error('Failed to delete course:', error);
  }
};

// Active course management
export const setActiveCourseId = (courseId: string | null): void => {
  try {
    if (courseId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_COURSE, courseId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_COURSE);
    }
  } catch (error) {
    console.error('Failed to set active course:', error);
  }
};

export const getActiveCourseId = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_COURSE);
  } catch (error) {
    console.error('Failed to get active course:', error);
    return null;
  }
};

// App settings management
export const saveAppSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save app settings:', error);
  }
};

export const loadAppSettings = (): AppSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
    return stored ? JSON.parse(stored) : {
      fontSize: 1.0,
      theme: 'system',
      defaultTargetGrade: 75
    };
  } catch (error) {
    console.error('Failed to load app settings:', error);
    return {
      fontSize: 1.0,
      theme: 'system',
      defaultTargetGrade: 75
    };
  }
};

// Default course data
export const createDefaultCourse = (name: string = 'General Calculus'): CourseData => {
  const template = GRADING_TEMPLATES[0]; // Sir Baks is default
  return {
    id: crypto.randomUUID(),
    name,
    templateId: template.id,
    passingGrade: template.passingGrade,
    midtermComponents: JSON.parse(JSON.stringify(template.defaultComponents)),
    finalsComponents: JSON.parse(JSON.stringify(template.defaultComponents)),
    settings: {
      midtermWeight: template.periodRatios.midterm,
      finalsWeight: template.periodRatios.finals,
      targetGrade: 75
    },
    lastModified: new Date().toISOString()
  };
};

export const createCourseFromTemplate = (name: string, templateId: string): CourseData => {
  const template = GRADING_TEMPLATES.find(t => t.id === templateId) || GRADING_TEMPLATES[0];
  return {
    id: crypto.randomUUID(),
    name,
    templateId: template.id,
    passingGrade: template.passingGrade,
    midtermComponents: JSON.parse(JSON.stringify(template.defaultComponents)),
    finalsComponents: JSON.parse(JSON.stringify(template.defaultComponents)),
    settings: {
      midtermWeight: template.periodRatios.midterm,
      finalsWeight: template.periodRatios.finals,
      targetGrade: 75
    },
    lastModified: new Date().toISOString()
  };
};