import { logger } from '../middlewares/logger.middleware';
import { User } from '../models/user.model';
import { sequelize } from '../db/sequelizeConfig';
import Role from '../types/Role';
import { register } from '../services/user.services';

const initDb = () => {
    return sequelize.sync({ force: true }).then(async () => {
        const jane = await User.create({
            firstName: 'Jane',
            lastName: 'Doe',
            username: 'Jane_D09',
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
            username: 'JDoe',
            email: 'JDoe@outlook.dev',
            walletAddress: '5F1KJU',
            certified: true,
            country: 'BE',
            city: 'Lausanne',
            aboutUs: 'Twitter',
            confidentiality: true,
            beContacted: true,
            roles: JSON.stringify([Role.Member, Role.Moderator]),
            referringUserId: jane.id,
        });

        John.addRoles([Role.Admin]);
        John.addRoles([Role.Admin]);
        logger.debug(`me id with : ${John.id}`, John);
        John.removeRoles([Role.Moderator]);
        John.removeRoles([Role.User]);
        John.removeRoles([Role.Moderator]);
        John.save();

        await register({
            email: 'toto@tatta.titi',
            beContacted: false,
            confidentiality: false,
            password: 'toto',
            username: 'toto',
            referralCode: jane.referralCode,
        });
        logger.debug(`La base de données a bien été synchronisée.`);

        // Récupérer le parrain avec ses filleuls
        const toto = await User.findOne({
            where: { username: 'toto' },
            include: [
                {
                    model: User,
                    as: 'referringUser',
                    attributes: ['username'],
                },
                {
                    model: User,
                    as: 'referrals',
                    attributes: ['username'],
                },
            ],
        });

        console.log('toto est parrain/marraine ? ', !!toto?.referrals?.length);
        console.log('toto est filleul de : ', toto?.referringUser?.dataValues.username);
    });
};

export default initDb;
