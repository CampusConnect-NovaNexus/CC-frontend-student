/// <reference types="nativewind/types" />

declare module '@env' {
  export const EXPO_BASE_URL: string;
  export const EXPO_BASE_URL_GR: string;
}

declare type LostFoundItemInput = {
  title: string;
  user_id: string;
  description: string;
  item_category: string;
  image?: {
    uri: string;
    name: string;
  };
};