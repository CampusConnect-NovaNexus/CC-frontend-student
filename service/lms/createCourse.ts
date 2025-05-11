import {EXPO_BASE_URL_LMS} from '@env'
interface CreateCourseRequest {
    course_code: string;
    course_name: string;
    user_id: string;
  }
  
  interface CreateCourseResponse {
    message: string;
  }
  
  export async function createCourse(data: CreateCourseRequest): Promise<CreateCourseResponse> {
    
    const BASEURL=EXPO_BASE_URL_LMS
    console.log('BASEURL : ',BASEURL);
    console.log('data in createCourse : ', data);
    const response = await fetch(`${BASEURL}/api/exam/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    console.log('response of create course ',response);
    
    if (!response.ok) {
      throw new Error('Error creating course');
    }
    
    const responseData: CreateCourseResponse = await response.json();
    return responseData;
  }
  