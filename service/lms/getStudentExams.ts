import {EXPO_BASE_URL_LMS} from '@env'

interface Exam {
  course_code: string;
  course_name: string;
  created_by: string;
  exam_date: string;
  exam_id : string;
  exam_type: string;
}

export async function getStudentExams(studentId: string): Promise<Exam[] | null> {
  const BASEURL=EXPO_BASE_URL_LMS
  //console.log('BASEURL in get student exams : ',BASEURL);
  try {
    const res = await fetch(`${BASEURL}/api/exam/students/${studentId}/upcoming-exams`);

    if (!res.ok) throw new Error('Failed to fetch exams');
    //console.log('response in getStudent Exams',res);
    const data: Exam[] = await res.json();
    return data;
  } catch (error) {
    console.error('error in getStudentExams',error);
    return null;
  }
}
