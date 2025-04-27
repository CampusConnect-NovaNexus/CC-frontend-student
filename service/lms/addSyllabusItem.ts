import {EXPO_BASE_URL_LMS} from '@env'
interface AddSyllabusRequest {
  description: string;
  parent_item_id: number | null;
  user_id: number;
}

interface AddSyllabusResponse {
  message: string;
  item_id: number;
}

export async function addSyllabusItem(body: AddSyllabusRequest): Promise<AddSyllabusResponse | null> {
  const BASEURL=EXPO_BASE_URL_LMS
  try {
    const res = await fetch(`${BASEURL}/api/exam/syllabus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error('Failed to add syllabus item');

    const data: AddSyllabusResponse = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
