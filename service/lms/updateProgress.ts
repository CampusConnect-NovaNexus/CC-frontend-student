import {EXPO_BASE_URL_LMS} from '@env'
interface UpdateProgressRequest {
  student_id: string;
  completed: boolean;
}

interface UpdateProgressResponse {
  completed: boolean;
}

export async function updateProgress(itemId: string , body: UpdateProgressRequest): Promise<UpdateProgressResponse | null> {
  const BASEURL=EXPO_BASE_URL_LMS
  console.log('BASEURL : ',BASEURL);
  try {
    const res = await fetch(`${BASEURL}/api/exam/checklist/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error('Failed to update progress');

    const data: UpdateProgressResponse = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
