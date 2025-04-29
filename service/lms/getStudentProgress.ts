import {EXPO_BASE_URL_LMS} from '@env'

interface StudentProgress {
  progress_id: string;
  student_id: string;
  item_id: string;
  is_completed: boolean;
}

export async function getStudentProgress(studentId: string): Promise<StudentProgress[] | null> {
  const BASEURL=EXPO_BASE_URL_LMS
  console.log('BASEURL : ',BASEURL);
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
