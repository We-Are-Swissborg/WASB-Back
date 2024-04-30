import { User } from "../user.model";

export class UserDto {
    declare firstName: string | null;
    declare lastName: string | null;
    declare fullName: string | null;
    declare pseudo: string | null;

    static fromUser(user: User) {
        const dto = new UserDto();
        dto.firstName = user.firstName;
        dto.lastName = user.lastName;
        dto.fullName = user.fullName;
        dto.pseudo = user.pseudo;

        return dto;
    }
}