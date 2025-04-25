import {EXPO_BASE_URL} from '@env';
import { LostFoundItem } from '@/types';

export const LFData = async(): Promise<LostFoundItem[]> => {
  
    const BASEURL = EXPO_BASE_URL
    try{
        const result= await fetch(`${BASEURL}/api/v1/item`,{method:'GET'});
        if (!result.ok) {
            console.error('API Error:', result.status, result.statusText);
            throw new Error(`Failed to fetch items. Status: ${result.status}`);
        }
    
        const data=await result.json();
    
        if (!Array.isArray(data)) {
            console.error('Unexpected API response format:', data);
            throw new Error('Data is not in expected format');
        }
    
        return data as LostFoundItem[];
    }catch(error) {
        console.error('Error fetching lost and found data:', error);
        throw error;
    }
}