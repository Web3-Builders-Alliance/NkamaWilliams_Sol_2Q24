use crate::state::Job;
use anchor_lang::{
    prelude::*,
    system_program::{transfer, Transfer},
};

#[derive(Accounts)]
#[instruction(seed: u64)]

pub struct Withdraw<'info> {
    #[account(mut)]
    pub developer: Signer<'info>,
    pub maker: SystemAccount<'info>,
    #[account(
        mut,
        seeds = [b"job", maker.key().as_ref(), seed.to_le_bytes().as_ref()],
        bump = job_state.state_bump,
    )]
    pub job_state: Account<'info, Job>,
    #[account(
        mut,
        seeds = [b"vault", job_state.key().as_ref()],
        bump = job_state.vault_bump,
    )]
    pub vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> Withdraw<'info> {
    pub fn withdraw(&mut self) -> Result<()> {
        let program = self.system_program.to_account_info();
        let accounts = Transfer {
            from: self.vault.to_account_info(),
            to: self.developer.to_account_info(),
        };
        let seeds = &[
            b"vault",
            self.job_state.to_account_info().key.as_ref(),
            &[self.job_state.vault_bump],
        ];
        let signer_seeds = &[&seeds[..]];
        let ctx = CpiContext::new_with_signer(program, accounts, signer_seeds);

        if self.job_state.task_complete && self.job_state.developer == self.developer.key() {
            transfer(ctx, self.vault.lamports())?;
        }
        Ok(())
    }
}
