import {EXPO_BASE_URL_LMS} from '@env''

interface Enrollment {
  course_code: string;
  course_name: string;
  created_by: string;
}

export async function getStudentEnrollments(studentId: string): Promise<Enrollment[] | null> {
  const BASEURL=EXPO_BASE_URL_LMS
  try {
    const res = await fetch(`${BASEURL}/api/exam/students/${studentId}/enrollments`);

    if (!res.ok) throw new Error('Failed to fetch enrollments');

    const data: Enrollment[] = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
