use crate::state::Job;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(seed: u64)]

pub struct Completed<'info> {
    pub maker: Signer<'info>,
    #[account(
        mut,
        seeds = [b"job", maker.key().as_ref(), seed.to_le_bytes().as_ref()],
        bump = job_state.state_bump
    )]
    pub job_state: Account<'info, Job>,
    pub system_program: Program<'info, System>,
}

impl<'info> Completed<'info> {
    pub fn completed(&mut self) -> Result<()> {
        self.job_state.task_complete = true;
        Ok(())
    }
}
