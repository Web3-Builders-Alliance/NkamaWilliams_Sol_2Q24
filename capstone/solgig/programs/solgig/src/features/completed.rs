use crate::{errors::Errors, state::Job};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(seed: u64)]

pub struct Completed<'info> {
    pub maker: Signer<'info>,
    #[account(
        mut,
        constraint = job_state.maker == maker.key() @ Errors::NotCreator,
        seeds = [b"job", maker.key().as_ref(), seed.to_le_bytes().as_ref()],
        bump = job_state.state_bump
    )]
    pub job_state: Account<'info, Job>,
    pub system_program: Program<'info, System>,
}

impl<'info> Completed<'info> {
    pub fn completed(&mut self) -> Result<()> {
        require!(
            self.job_state.milestone_completed < self.job_state.milestones,
            Errors::MilestonesCompleted
        );
        self.job_state.milestone_completed += 1;
        Ok(())
    }
}
