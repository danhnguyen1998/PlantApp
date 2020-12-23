import {configServices} from '@src/utils';

export const uploadPhoto = async (plant_image) => {
  try {
    const body = {
      plant_image,
    };
    const response = await configServices.postService('get_plants', body, false, false);
    return response;
  } catch (error) {
    throw error;
  }
};
