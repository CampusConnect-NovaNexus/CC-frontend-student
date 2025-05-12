import { EXPO_BASE_URL_LMS } from '@env'

interface SyllabusItemStats {
  stats: {
    total_students: number;
    who_studied: number;
  };
}

export const getSyllabusItemStats = async (itemId: string): Promise<SyllabusItemStats | null> => {
  try {
    const res = await fetch(`${EXPO_BASE_URL_LMS}/api/exam/checklist/${itemId}/stats`);
    
    if (!res.ok) {
      throw new Error('Failed to fetch syllabus item stats');
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching syllabus item stats:', error);
    return null;
  }
};