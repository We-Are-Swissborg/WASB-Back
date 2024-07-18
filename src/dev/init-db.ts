import { logger } from '../middlewares/logger.middleware';
import { User } from '../models/user.model';
import { sequelize } from '../db/sequelizeConfig';
import Role from '../types/Role';

const initDb = () => {
    return sequelize.sync({ force: true }).then(async () => {
        const jane = await User.create({
            firstName: 'Jane',
            lastName: 'Doe',
            pseudo: 'Jane_D09',
            email: 'jane@doe.dev',
            walletAddress: '5F1JU',
            certified: true,
            country: 'Suisse',
            city: 'Lausanne',
            referral: '',
            aboutUs: 'Twitter',
            confidentiality: true,
            beContacted: true,
        });
        logger.debug(`jane id with : ${jane.id}`, jane);

        const John = await User.create({
            firstName: 'John',
            lastName: 'Doe',
            pseudo: 'JDoe',
            email: 'JDoe@outlook.dev',
            walletAddress: '5F1KJU',
            certified: true,
            country: 'BE',
            city: 'Lausanne',
            referral: 'Jane_D09',
            aboutUs: 'Twitter',
            confidentiality: true,
            beContacted: true,
            roles: JSON.stringify([Role.Member, Role.Moderator]),
        });

        John.addRoles([Role.Admin]);
        John.addRoles([Role.Admin]);
        logger.debug(`me id with : ${John.id}`, John);
        John.removeRoles([Role.Moderator]);
        John.removeRoles([Role.User]);
        John.removeRoles([Role.Moderator]);
        John.save();
        logger.debug(`La base de données a bien été synchronisée.`);
    });
};

export default initDb;
