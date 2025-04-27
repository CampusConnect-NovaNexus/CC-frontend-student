// services/createCourse.ts
import {EXPO_BASE_URL_LMS} from '@env'
interface CreateCourseRequest {
    course_code: string;
    course_name: string;
    description: string;
    user_id: number;
  }
  
  interface CreateCourseResponse {
    message: string;
  }
  
  export async function createCourse(data: CreateCourseRequest): Promise<CreateCourseResponse> {
    const BASEURL=EXPO_BASE_URL_LMS
    const response = await fetch(`${BASEURL}/api/exam/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      throw new Error('Error creating course');
    }
  
    const responseData: CreateCourseResponse = await response.json();
    return responseData;
  }
  