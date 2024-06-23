use anchor_lang::prelude::*;

declare_id!("9rvx9iPWCGnG2LPk4HkodFiooLMJTVH4B2xb6WtiVJEp");

mod contexts;
mod state;

use contexts::*;

#[program]
pub mod escrow {
    use super::*;

    pub fn make(ctx: Context<Make>, seed: u64, recieve: u64, deposit: u64) -> Result<()> {
        ctx.accounts.init(seed, recieve, &ctx.bumps);
        ctx.accounts.deposit(deposit);
        Ok(())
    }

    pub fn take(ctx: Context<Take>) -> Result<()> {
        ctx.accounts.transfer();
        ctx.accounts.withdraw();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
