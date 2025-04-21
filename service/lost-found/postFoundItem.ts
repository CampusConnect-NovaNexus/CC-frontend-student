export interface LostFoundItemInput {
    id: string;
    item_title: string;
    item_description: string;
    item_image?: string; // or File/base64 depending on backend
  }
  
  export const postFoundItem = async (item: LostFoundItemInput) => {
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
      console.log('Response from POST (postFoundItem) :', data);
      return data;
    } catch (error) {
      console.error('Error posting item (postFoundItem) : ', error);
      return null;
    }
  };
  