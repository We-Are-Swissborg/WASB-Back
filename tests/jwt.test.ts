import { describe, expect, test} from '@jest/globals';
import { User } from '../src/models/user'
import { JWTsign, JWTverify } from '../src/services/jwt.services'

describe('JWT test', () => {
    test('sign ok', () => {
        const user: User = User.build({
            firstName: "Jane",
            lastName: "Doe",
            pseudo:"Pseudo",
            email: "mail@test.dev",
            walletAdress: "5F1JU",
            certified: true
        });
        const token: string = JWTsign(user);

        const isTrue: boolean = JWTverify(token);
        expect(isTrue).toBeTruthy();
    })

    test('sign -> wallet modified', () => {
        const user: User = User.build({
            firstName: "Jane",
            lastName: "Doe",
            pseudo:"Pseudo",
            email: "mail@test.dev",
            walletAdress: "5F1JU",
            certified: true
        });
        let token: string = JWTsign(user);

        //Change token with wallet "wallet": "5F1JU" -> "5F1GU"
        token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ3YWxsZXQiOiI1RjFHVSIsImlhdCI6MTcxNTA4Nzg1NCwiZXhwIjoxNzE1MDkxNDU0fQ.lGL8iV60GG_F25V5iZb_dpDiTwiKJRNm0-YfNejCtfC11ljMRRzwvFV1CFL2M4cJptRHAJuAgNwmZlLuxb8Jbg";

        const isTrue: boolean = JWTverify(token);
        expect(isTrue).toBeFalsy();
    })
})