import { logger } from '../middlewares/logger.middleware';
import { cache } from '../cache/cacheManager';
import { ISendMail } from '../types/Mail';
import { generateRandomCode } from '../utils/generator';

// Get access for Zoho app.
const getMailToken = async () => {
    logger.info('getMailToken : services');

    try {
        const clientId = process.env.ZOHO_CLIENT_ID;
        const clientSecret = process.env.ZOHO_CLIENT_SECRET;
        const res = await fetch(`https://accounts.zoho.eu/oauth/v2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials&scope=ZohoMail.messages.ALL`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const auth = await res.json();
        if(!res.ok) throw new Error(`Error get Email token : ${auth}`);

        const mailZohoToken = auth.access_token;
        const ttl = auth.expires_in * 1000;

        await cache.set('mailZohoToken', mailZohoToken, ttl);
        logger.info('Zoho mail token cached');
    } catch (e: unknown) {
        logger.error('Get Zoho mail token error', e);
        return e;
    }
};

// Allow to send email.
const sendMail = async (data: ISendMail) => {
    logger.info('sendMail : services');

    try {
        const accountId = process.env.ZOHO_ACCOUNT_ID;
        const fromAddress = process.env.ZOHO_MAIL;
        const token = await cache.get('mailZohoToken');
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
        if(!res.ok) throw new Error(`Error email not sent : ${await res.json()}`);

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
            content: `Bonjour ${username},<br><br>

                   Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte associé à l'adresse e-mail ${email}.<br>
                   Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant :<br><br>
   
                   https://weareswissborg.com/#/reset-password/${slug}<br><br>
   
                   Ce lien est valable pendant 15 minutes. Si vous n'avez pas initié cette demande, veuillez ignorer cet e-mail ou contacter notre service client weareswissborg@gmail.com.<br><br>
   
                   Merci de votre confiance,<br><br>
   
                   L'équipe WeAreSwissborg<br><br>
   
                   weareswissborg@gmail.com`,
            subject: 'Réinitialisation de votre mot de passe',
            lang: 'fr'
        },
        {
            content: `Hello ${username},<br><br>

                   We have received a request to reset the password for your account associated with the email address ${email}.<br>
                   To reset your password, please click on the following link:<br><br>
   
                   https://weareswissborg.com/#/reset-password/${slug}<br><br>
   
                   This link is valid for 15 minutes. If you did not initiate this request, please ignore this email or contact our customer service at weareswissborg@gmail.com.<br><br>
   
                   Thank you for your trust,<br><br>
   
                   The WeAreSwissborg Team<br><br>
   
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

export { sendMail, getMailToken, fortgetMail }