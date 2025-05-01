import {EXPO_BASE_URL_GR} from '@env';


export const deleteGrievance = async (c_id: string) => {
    const BASEURL=EXPO_BASE_URL_GR
    console.log('BASEURL : ',BASEURL);
    try {
        const response = await fetch(`${BASEURL}/delete_complaint/${c_id}`{
          method: 'DELETE',
        });
        const data=response.json();
        console.log('Complaint Deleted:', data);
        return data;
  } catch (error) {
    console.error('Delete Complaint Error:', error);
  }
};
