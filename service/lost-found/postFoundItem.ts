import { LostFoundItemInput, prepareItemFormData, submitItemToAPI } from '../../utils/lostFoundHelper';

export const postFoundItem = async (item: LostFoundItemInput) => {
  const formData = await prepareItemFormData(item, 0.1, 500);
  return submitItemToAPI(formData, 'found');
};
