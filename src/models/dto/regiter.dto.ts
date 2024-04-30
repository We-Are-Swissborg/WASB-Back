import { User } from "../user.model";

export class RegisterDto {
    declare wallet: string | null;
    declare firstName: string | null;
    declare lastName: string | null;
    declare fullName: string | null;
    declare pseudo: string | null;

    static fromUser(user: User) {
        const dto = new RegisterDto();
        dto.wallet = user.walletAdress;
        dto.firstName = user.firstName;
        dto.lastName = user.lastName;
        dto.fullName = user.fullName;
        dto.pseudo = user.pseudo;

        return dto;
    }
}