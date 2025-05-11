import {EXPO_BASE_URL_LMS} from '@env'

export const getPdf=async(exam_id:string)=>{
    try {
         const res=await fetch(`${EXPO_BASE_URL_LMS}/api/pyq/${exam_id}`)
        const data=await res.json();
        console.log('data in getPdf : ',data)
        return data;
    
    } catch (error) {
        console.log('error in getPdf : ',error)
        return null;
    }
   
}