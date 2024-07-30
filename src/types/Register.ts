import { Expose } from 'class-transformer';

export default class Register {
    @Expose({ groups: ['register'] })
    declare email: string;

    @Expose({ groups: ['register'] })
    declare username: string;

    @Expose({ groups: ['register'] })
    declare password: string;

    @Expose({ groups: ['register'] })
    declare referralCode?: string;

    @Expose({ groups: ['register'] })
    declare confidentiality: boolean;

    @Expose({ groups: ['register'] })
    declare beContacted: boolean;
}
