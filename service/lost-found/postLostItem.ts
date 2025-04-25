import { LostFoundItemInput, prepareItemFormData, submitItemToAPI } from '../../utils/lostFoundHelper';

export const postLostItem = async (item: LostFoundItemInput) => {
  const formData = await prepareItemFormData(item, 0.1, 500);
  return submitItemToAPI(formData, 'lost');
};
