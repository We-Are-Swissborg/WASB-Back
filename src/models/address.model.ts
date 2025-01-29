import { Expose } from 'class-transformer';
import { AutoIncrement, Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

interface IAddress {
    id: number;
    street: string;
    number?: string;
    postalCode: string;
    country: string;
    latitude?: number;
    longitude?: number;
    capacity?: number;
}

@Table
class Address extends Model implements IAddress {
    @Expose({ groups: ['all', 'admin'] })
    @AutoIncrement
    @PrimaryKey
    @Column
    declare id: number;

    @Expose({ groups: ['all', 'admin'] })
    @Column
    declare street: string;

    @Expose({ groups: ['all', 'admin'] })
    @Column
    declare number?: string;

    @Expose({ groups: ['all', 'admin'] })
    @Column
    declare locality?: string;

    @Expose({ groups: ['all', 'admin'] })
    @Column
    declare postalCode: string;

    @Expose({ groups: ['all', 'admin'] })
    @Column
    declare country: string;

    @Expose({ groups: ['all', 'admin'] })
    @Column
    declare latitude?: number;

    @Expose({ groups: ['all', 'admin'] })
    @Column
    declare longitude?: number;

    @Expose({ groups: ['all', 'admin'] })
    @Column
    declare capacity?: number;
}

export { Address, IAddress };
