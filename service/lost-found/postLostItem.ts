export interface LostFoundItemInput {
    id: string;
    item_title: string;
    item_description: string;
    item_image?: string; // or File/base64 depending on backend
    item_category:string;
    item_date:string,
    item_reporter_name:string;
  }
  
  export const postLostItem = async (item: LostFoundItemInput) => {
    const BASEURL = process.env.EXPO_BASE_URL
  
    try {
      const response = await fetch(`${BASEURL}/api/v1/item/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });
  
      const data = await response.json();
      console.log('Response from postLostItem: ', data);
      return data;
    } catch (error) {
      console.error('Error posting lost item: ', error);
      return null;
    }
  };
  