// services/getAllCourses.ts
import {EXPO_BASE_URL_LMS} from '@env'
interface Course {
    course_code: string;
    course_name: string;
    created_by: string;
  }
  
  export async function getAllCourses(): Promise<Course[]> {
    const BASEURL= EXPO_BASE_URL_LMS
    
    let response:any;
    try {
      response = await fetch(`${BASEURL}/api/exam/courses`)
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.log('error in catch of getAllCOurses : ', error);
      return []
    }
    
  }
  