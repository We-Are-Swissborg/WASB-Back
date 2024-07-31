import { ISocialMedias, SocialMedias } from '../models/socialmedias.model';

const setSocialMedias = async (id: number, data: ISocialMedias): Promise<boolean | null> => {
    const socialMediasUser = await SocialMedias.findOrCreate({
      where: { userId: id },
      defaults: {...data}
    });

    // If an user already has social medias update social media
    if(!socialMediasUser[1]) { 
      await SocialMedias.update(
        data,
        {
          where: {userId: id} 
        },
      );
    }

    return !!socialMediasUser;
};

export { setSocialMedias };
