import {EXPO_BASE_URL_LMS} from '@env'
interface AddSyllabusRequest {
  description: string;
  parent_item_id: string | null;
  user_id: string;
}

interface AddSyllabusResponse {
  message: string;
  item_id: string;
}

export async function addSyllabusItem(body: AddSyllabusRequest,exam_id:string): Promise<AddSyllabusResponse | null> {
  const BASEURL=EXPO_BASE_URL_LMS
  
  try {
    const res = await fetch(`${BASEURL}/api/exam/exams/${exam_id}/syllabus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data: AddSyllabusResponse = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
