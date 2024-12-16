import { logger } from '../middlewares/logger.middleware';
import { Membership } from '../models/membership.model';
import { ContributionStatus } from '../types/ContributionStatus';

interface WorkflowContext {
    membership: Membership;
    note?: string;
    validateUserId: number;
}

type WorkflowAction = (context: WorkflowContext) => Promise<void>;

interface WorkflowState {
    status: ContributionStatus;
    onEnter?: WorkflowAction;
}

class Workflow {
    private states: Map<ContributionStatus, WorkflowState> = new Map();

    registerState(state: WorkflowState) {
        this.states.set(state.status, state);
    }

    async transitionTo(status: ContributionStatus, context: WorkflowContext): Promise<Membership> {
        const state = this.states.get(status);
        if (!state) {
            throw new Error(`Unknown state: ${status}`);
        }

        logger.debug(`Transitioning to ${status}`);
        if (state.onEnter) {
            await state.onEnter(context);
        }

        context.membership.contributionStatus = status;
        return context.membership;
    }
}

export const ContributionWorkflow = new Workflow();

// Configuration des transitions
ContributionWorkflow.registerState({
    status: ContributionStatus.ACCEPTED,
    onEnter: async (context) => {
        const { membership, note, validateUserId } = context;
        const now = new Date();
        membership.dateContribution = now;
        membership.endDateContribution = new Date(now);
        membership.endDateContribution.setMonth(now.getMonth() + (membership.contribution?.duration || 0));
        membership.validateUserId = validateUserId;
        if (note) membership.note = note;
    },
});

ContributionWorkflow.registerState({
    status: ContributionStatus.NOT_ACCEPTED,
    onEnter: async (context) => {
        const { membership, note, validateUserId } = context;
        if (!note) throw new Error('Note is required for REJECTED status');
        membership.note = note;
        membership.validateUserId = validateUserId;
        membership.endDateContribution = new Date();
    },
});

ContributionWorkflow.registerState({
    status: ContributionStatus.IN_PROGRESS,
    onEnter: async (context) => {
        const { membership, note, validateUserId } = context;
        if (note) membership.note = note;
        membership.validateUserId = validateUserId;
    },
});
