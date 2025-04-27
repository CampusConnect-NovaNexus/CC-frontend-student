import {EXPO_BASE_URL_LMS} from '@env'

interface StudentProgress {
  progress_id: number;
  student_id: number;
  item_id: number;
  is_completed: boolean;
}

export async function getStudentProgress(studentId: number): Promise<StudentProgress[] | null> {
  const BASEURL=EXPO_BASE_URL_LMS
  try {
    const res = await fetch(`${BASEURL}/api/exam/students/${studentId}/progress`);

    if (!res.ok) throw new Error('Failed to fetch student progress');

    const data: StudentProgress[] = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
