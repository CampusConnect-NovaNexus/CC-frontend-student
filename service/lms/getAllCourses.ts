// services/getAllCourses.ts
import {EXPO_BASE_URL_LMS} from '@env'
import { fetchUser } from '../fetchUserById';
import userProfileScreen from '@/app/userPostProfile';
import { useAuth } from '@/context/AuthContext';
interface Course {
    course_code: string;
    course_name: string;
    created_by: string;
    created_by_name: string;
  }
  
  export async function getAllCourses(user): Promise<Course[]> {
    try {  
      
      const BASEURL= EXPO_BASE_URL_LMS
      let response:any;
    
      response = await fetch(`${BASEURL}/api/exam/students/${user?.id}/enrollments`)
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
  