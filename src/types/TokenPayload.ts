import { JwtPayload } from 'jsonwebtoken';

export interface TokenPayload extends JwtPayload {
    exp: number;
    roles: string[];
    wallet: string;
    name: string;
    userId: number;
}
