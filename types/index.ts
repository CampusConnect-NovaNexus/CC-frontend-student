export interface LostFoundItem {
  id: string;
  item_title: string;
  item_description: string;
  item_image?: string;
  item_category: "LOST" | "FOUND";
  item_date: string;
  item_reporter_name: string;
  user_id: string;
}

export interface LostFoundItemInput {
  title: string;
  user_id: string;
  description: string;
  item_category: string;
  image?: {
    uri: string;
    name: string;
    type?: string;
  };
}