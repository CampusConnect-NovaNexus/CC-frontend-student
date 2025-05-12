import {EXPO_BASE_URL_LMS} from '@env'

interface SyllabusItem {
  item_id: string;
  exam_id: string;
  parent_item_id: string | null;
  description: string;
  created_by: string;
  total_students?: number;
  who_studied?: number;
  stats?: {
    total_students: number;
    who_studied: number;
  };
}

export async function getSyllabusItems(examId: string): Promise<SyllabusItem[] | null> {
  
  const BASEURL=EXPO_BASE_URL_LMS
  try {
    const res = await fetch(`${BASEURL}/api/exam/exams/${examId}/syllabus`);
    console.log("get syllabus items", res)

    if (!res.ok) throw new Error('Failed to fetch syllabus items');

    const data: SyllabusItem[] = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
