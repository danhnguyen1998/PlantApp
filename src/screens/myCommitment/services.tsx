import {configServices} from '@src/utils';

export const uploadPhoto = async (body: FormData) => {
  try {
    const response = await configServices.postService('api/v1/accounts/upload_img_profile', body, true, true);
    return response;
  } catch (error) {
    throw error;
  }
};
