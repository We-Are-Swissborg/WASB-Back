import { Contribution } from '../src/models/contribution.model';
import { Membership } from '../src/models/membership.model';
import {ContributionStatus} from '../src/types/ContributionStatus';
import {ContributionWorkflow} from '../src/workflows/contribution.workflow';

test('should transition to ACCEPTED and update dates', async () => {
    const contribution = await Contribution.create({ id: 1, title: 'Test', duration: 6, amount: 100, isActive: true });

    const membership = new Membership({
        contributionStatus: ContributionStatus.IN_PROGRESS,
        contribution: contribution,
        contributionId: contribution.id
    });

    const updatedMembership = await ContributionWorkflow.transitionTo(ContributionStatus.ACCEPTED, { membership, validateUserId: 1 });

    expect(updatedMembership.contributionStatus).toBe(ContributionStatus.ACCEPTED);
    expect(updatedMembership.dateContribution).toBeDefined();
    expect(updatedMembership.endDateContribution).toBeDefined();
    expect(updatedMembership.dateContribution).not.toBeNull();
    expect(updatedMembership.endDateContribution).not.toBeNull();
    expect(updatedMembership.dateContribution).toBeInstanceOf(Date);
    expect(updatedMembership.endDateContribution).toBeInstanceOf(Date);
});
