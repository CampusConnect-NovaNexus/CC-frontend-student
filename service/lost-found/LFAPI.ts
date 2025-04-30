import {EXPO_BASE_URL} from '@env';
export const LFData =async()=>{
    const BASEURL = EXPO_BASE_URL
    console.log('BASEURL : ',BASEURL);
    try{
        const result= await fetch(`${BASEURL}/api/v1/item`,{method:'GET'});
        console.log(BASEURL);
        const data=await result.json();
        
        return data;
    }catch(error){
        console.log('Error in LFAPI : ',error);
        return null
    }
}