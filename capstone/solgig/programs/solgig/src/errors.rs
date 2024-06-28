use anchor_lang::error_code;

#[error_code]
pub enum Errors {
    #[msg("Default error!")]
    DefaultError,
    #[msg("Insufficient funds!")]
    InsufficientFunds,
    #[msg("Cannot deposit nothing!")]
    InvalidDeposit,
    #[msg("All Milestones Completed!")]
    MilestonesCompleted,
    #[msg("Account requesting withdrawal not recognized!")]
    InvalidAccount,
    #[msg("Job not completed!")]
    TaskIncomplete,
    #[msg("Insufficient balance!")]
    InsufficientBalance,
    #[msg("Requires a minimum of 1 Milestone")]
    NotEnoughMilestones,
    #[msg("Not the creator!")]
    NotCreator,
    #[msg("Developer still has unwithdrawn funds!")]
    DeveloperFundsUnwithdrawn,
}
