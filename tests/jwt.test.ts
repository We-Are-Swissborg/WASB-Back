import { beforeAll, describe, expect, test} from '@jest/globals';
import { User } from '../src/models/user.model'
import { generateToken, validateToken } from '../src/services/jwt.services'
import { sequelize, testConnection } from "../src/db/sequelizeConfig";


describe('JWT test', () => {
    beforeAll(() => {
        return sequelize.sync();
      });

    test('validateToken ok', () => {
        const user: User = User.build({
            firstName: "Jane",
            lastName: "Doe",
            pseudo:"Pseudo",
            email: "mail@test.dev",
            walletAddress: "5F1JU",
            certified: true
        });
        const token: string = generateToken(user);
        const decodedToken = validateToken(token);

        expect(token.length > 10).toBeTruthy();
        expect(!!decodedToken).toBeTruthy();
    })

    test('validateToken -> wallet modified', () => {
        const user: User = User.build({
            firstName: "Jane",
            lastName: "Doe",
            pseudo:"Pseudo",
            email: "mail@test.dev",
            walletAddress: "5F1JU",
            certified: true
        });
        let token: string = generateToken(user);

        //Change token with wallet "wallet": "5F1JU" -> "5F1GU"
        token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ3YWxsZXQiOiI1RjFHVSIsImlhdCI6MTcxNTA4Nzg1NCwiZXhwIjoxNzE1MDkxNDU0fQ.lGL8iV60GG_F25V5iZb_dpDiTwiKJRNm0-YfNejCtfC11ljMRRzwvFV1CFL2M4cJptRHAJuAgNwmZlLuxb8Jbg";
        expect(() => { validateToken(token); }).toThrow();
    })
})