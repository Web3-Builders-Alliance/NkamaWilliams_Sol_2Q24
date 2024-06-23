use anchor_lang::prelude::*;

mod constants;
mod features;
mod state;

use features::*;

declare_id!("9WFWMjBDF32pGEEjP6XHaGUkuQXqcgx1eFjRqLSh2dbA");

#[program]
pub mod solgig {
    use super::*;

    pub fn initialize(ctx: Context<Create>, seed: u64) -> Result<()> {
        ctx.accounts
            .initialize(seed, ctx.bumps.job_state, ctx.bumps.vault)?;
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, seed: u64, amount: u64) -> Result<()> {
        ctx.accounts.deposit(amount)?;
        Ok(())
    }
}
