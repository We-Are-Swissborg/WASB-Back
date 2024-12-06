import { Expose } from 'class-transformer';
import { ContributionStatus } from './ContributionStatus';

export class UpdatedStatusMembership {
    @Expose({ groups: ['admin'] })
    id: number;

    @Expose({ groups: ['admin'] })
    contributionStatus: ContributionStatus;

    @Expose({ groups: ['admin'] })
    note: string;

    @Expose({ groups: ['admin'] })
    validatedBy: number;
}
