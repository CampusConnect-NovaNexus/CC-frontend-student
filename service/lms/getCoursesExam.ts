import {EXPO_BASE_URL_LMS} from '@env'
interface Exam {
    exam_id: string;
    course_code: string;
    exam_type: string;
    exam_date: string;
    created_by: string;
  }
  
  export async function getCourseExams(courseCode: string): Promise<Exam[]> {
    const BASEURL=EXPO_BASE_URL_LMS
    console.log('BASEURL : ',BASEURL);
    const response = await fetch(`${BASEURL}/api/exam/courses/${courseCode}/exams`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error('Error fetching course exams');
    }
    
    const responseData: Exam[] = await response.json();
    console.log('response Data in get Course Exam : ', responseData);
    
    return responseData;
  }
  