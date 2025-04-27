// services/createExam.ts
import {EXPO_BASE_URL_LMS} from '@env'
interface CreateExamRequest {
    exam_type: string;
    exam_date: string; // ISO format (e.g., '2023-12-15T09:00:00')
    user_id: number;
  }
  
  interface CreateExamResponse {
    message: string;
    exam_id: number;
  }
  
  export async function createExam(courseCode: string, data: CreateExamRequest): Promise<CreateExamResponse> {
    const BASEURL=EXPO_BASE_URL_LMS
    const response = await fetch(`${BASEURL}/api/exam/courses/${courseCode}/exams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      throw new Error('Error creating exam');
    }
  
    const responseData: CreateExamResponse = await response.json();
    return responseData;
  }
  