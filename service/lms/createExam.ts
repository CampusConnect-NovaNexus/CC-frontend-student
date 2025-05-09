// services/createExam.ts
import {EXPO_BASE_URL_LMS} from '@env'
interface CreateExamRequest {
    exam_type: string;
    exam_date: string; // ISO format (e.g., '2023-12-15T09:00:00')
    user_id: string;
  }
  
  interface CreateExamResponse {
    message: string;
    exam_id: string;
  }
  
  export async function createExam(courseCode: string, data: CreateExamRequest): Promise<CreateExamResponse> {
    const BASEURL=EXPO_BASE_URL_LMS
    console.log('BASEURL in create Exam : ',BASEURL);
    const response = await fetch(`${BASEURL}/api/exam/courses/${courseCode.toLowerCase()}/exams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    console.log('response in createExam : ', response)
    if (!response.ok) {
      throw new Error('Error creating exam');
    }
  
    const responseData: CreateExamResponse = await response.json();
    console.log('response data : ', responseData);
    
    return responseData;
  }
  