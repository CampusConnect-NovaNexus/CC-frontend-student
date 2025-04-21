import {EXPO_BASE_URL} from '@env';
export const LFData =async()=>{
    const BASEURL = EXPO_BASE_URL
    try{
        console.log("BASEURL : ",BASEURL)
        console.log(`${BASEURL}/api/v1/item`);
        
        const result= await fetch(`${BASEURL}/api/v1/item`,{method:'GET'});
        // const result= await fetch(`http://localhost:5000/api/v1/item`);
        // const result= await fetch(`http://192.168.3.101:5000/api/v1/item`);
        console.log("result fetched fron LFAPI : ",result);
        
        const data=await result.json();
        console.log("Data parsed fron LFAPI : ",data);
        return data;
    }catch(error){
        console.log('Error in LFAPI : ',error);
        return null
    }
}