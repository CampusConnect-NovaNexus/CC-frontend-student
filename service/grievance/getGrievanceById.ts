import {EXPO_BASE_URL_GR} from '@env'

export const  getGrievanceById =async(c_id:string)=>{
    const BASEURL=EXPO_BASE_URL_GR//base url for the backend server
    console.log('BASEURL : ',BASEURL);
    try{
        const response=await fetch (`${BASEURL}/complaint/${c_id}`)
        const data=await response.json();
        console.log('GrievanceById : ',data)
        return data;
    }catch(error){
        console.log(`GrievanceById error`,error)
    }
}