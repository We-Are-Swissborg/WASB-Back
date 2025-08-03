import { logger } from '../middlewares/logger.middleware';
import { cache } from '../cache/cacheManager';
import { ISendMail } from '../types/Mail';
import { generateRandomCode } from '../utils/generator';

// Get access for Zoho app.
const getToken = async () => {
    logger.info('getToken : services');

    try {
        const clientId = process.env.ZOHO_CLIENT_ID;
        const clientSecret = process.env.ZOHO_CLIENT_SECRET;
        const idOrganization = process.env.ZOHO_ORGANIZATION_ID;
        const res = await fetch(`https://accounts.zoho.eu/oauth/v2/token?
                                      client_id=${clientId}&
                                      client_secret=${clientSecret}&
                                      grant_type=client_credentials&
                                      scope=ZohoCRM.settings.READ&
                                      soid=ZohoCRM.${idOrganization}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const auth = await res.json();
        const zohoToken = auth.access_token;
        const ttl = auth.expires_in * 1000;

        await cache.set('zohoToken', zohoToken, ttl);
        logger.info('Zoho token cached');
    } catch (e: unknown) {
        logger.error('Get Zoho token error', e);
        return e;
    }
};

// Allow to send email.
const sendMail = async (data: ISendMail) => {
    logger.info('sendMail : services');

    try {
        const accountId = process.env.ZOHO_ACCOUNT_ID;
        const fromAddress = process.env.ZOHO_MAIL;
        const token = await cache.get('zohoToken');
        const res = await fetch(`https://mail.zoho.eu/api/accounts/${accountId}/messages`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Zoho-oauthtoken ${token}`
            },
            body: JSON.stringify({
                "fromAddress": fromAddress,
                "toAddress": data.toAddress,
                "subject": data.subject,
                "content": data.content,
                "askReceipt" : data.userReadOrNot
            }),
        });
        if(!res.ok) throw new Error(`Email not sent, ${res.status} code error`);

        logger.info('Email sent');
    } catch (e: unknown) {
        logger.error('Email sending error :', e);
        return e;
    }
};

// Function to set a forgot-password message for an email.
const fortgetMail = async (lang: string, email: string, username: string) => {
    logger.info('fortgetMail : services');

    let isUnique: boolean = false;
    let slug: string | undefined = undefined;

    while(!isUnique) {
        slug = generateRandomCode();
        isUnique = !await cache.get(slug);

        if(isUnique) await cache.set(slug, email, 900000);
    }

    const arrayDataMail = [
        {
            content: `Bonjour ${username},\n\n

                   Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte associé à l'adresse e-mail ${email}.\n
                   Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant :\n\n
   
                   ${process.env.CORS_ORIGIN}/reset-password/${slug}\n\n
   
                   Ce lien est valable pendant 15 minutes. Si vous n'avez pas initié cette demande, veuillez ignorer cet e-mail ou contacter notre service client weareswissborg@gmail.com.\n\n
   
                   Merci de votre confiance,\n\n
   
                   L'équipe WeAreSwissborg\n\n
   
                   weareswissborg@gmail.com`,
            subject: 'Réinitialisation de votre mot de passe',
            lang: 'fr'
        },
        {
            content: `Hello ${username},\n\n

                   We have received a request to reset the password for your account associated with the email address ${email}.\n
                   To reset your password, please click on the following link:\n\n
   
                   ${process.env.CORS_ORIGIN}/reset-password/${slug}\n\n
   
                   This link is valid for 15 minutes. If you did not initiate this request, please ignore this email or contact our customer service at weareswissborg@gmail.com.\n\n
   
                   Thank you for your trust,\n\n
   
                   The WeAreSwissborg Team\n\n
   
                   weareswissborg@gmail.com`,
            subject: 'Resetting your password',
            lang: 'en'
        },
    ]

    const dataMail = arrayDataMail.find(e => e.lang === lang);

    const data: ISendMail = {
        toAddress: email,
        subject: dataMail?.subject || arrayDataMail[0].subject,
        content: dataMail?.content || arrayDataMail[0].content,
        userReadOrNot: 'no',
    };

    return data;
};

export { sendMail, getToken, fortgetMail }