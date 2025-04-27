import {EXPO_BASE_URL_LMS} from '@env'

interface SyllabusItem {
  item_id: number;
  exam_id: number;
  parent_item_id: number | null;
  description: string;
  created_by: number;
}

export async function getSyllabusItems(examId: number): Promise<SyllabusItem[] | null> {
  const BASEURL=EXPO_BASE_URL_LMS
  try {
    const res = await fetch(`${BASEURL}/api/exam/exams/${examId}/syllabus`);

    if (!res.ok) throw new Error('Failed to fetch syllabus items');

    const data: SyllabusItem[] = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
