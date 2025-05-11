// services/getAllCourses.ts
import {EXPO_BASE_URL_LMS} from '@env'
import { fetchUser } from '../fetchUserById';
interface Course {
    course_code: string;
    course_name: string;
    created_by: string;
    created_by_name: string;
  }
  
  export async function getAllCourses(): Promise<Course[]> {
    console.log('getAllCourses Called');
    
    const BASEURL= EXPO_BASE_URL_LMS
    console.log('BASEURL : ',BASEURL);
    let response:any;
    try {
      response = await fetch(`${BASEURL}/api/exam/courses`)
      const responseData = await response.json();
      const resWithName = await Promise.all(
        responseData.map(async (exam: Course)=> {
          const user = await fetchUser(exam.created_by); 
          return {
            ...exam, 
            created_by_name: user.name,
          };
        })
      )
      return resWithName;
    } catch (error) {
      console.log('error in catch of getAllCOurses : ', error);
      return []
    }
    
  }
  