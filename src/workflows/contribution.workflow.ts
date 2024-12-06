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

        logger.debug(`Setting status to ${status}`);
        context.membership.contributionStatus = status;
        // await context.membership.save();
        logger.debug(`Status saved as ${context.membership.contributionStatus}`);
        return context.membership;
    }
}

export const ContributionWorkflow = new Workflow();

// Configuration des transitions
ContributionWorkflow.registerState({
    status: ContributionStatus.ACCEPTED,
    onEnter: async (context) => {
        const { membership } = context;
        const now = new Date();
        membership.dateContribution = now;
        membership.endDateContribution = new Date(now);
        membership.endDateContribution.setMonth(now.getMonth() + (membership.contribution?.duration || 0));
    },
});

ContributionWorkflow.registerState({
    status: ContributionStatus.NOT_ACCEPTED,
    onEnter: async (context) => {
        const { membership, note, validateUserId } = context;
        if (!note) throw new Error('Note is required for REJECTED status');
        membership.note = note;
        membership.validateUserId = validateUserId;
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
