import {EXPO_BASE_URL_LMS} from '@env'

interface EnrollStudentRequest {
  student_id: number;
  roll_no: string;
}

interface EnrollStudentResponse {
  message: string;
}

export async function enrollStudent(courseCode: string, body: EnrollStudentRequest): Promise<EnrollStudentResponse | null> {
  const BASEURL=EXPO_BASE_URL_LMS
  try {
    const res = await fetch(`${BASEURL}/api/exam/courses/${courseCode}/enroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error('Failed to enroll student');

    const data: EnrollStudentResponse = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
