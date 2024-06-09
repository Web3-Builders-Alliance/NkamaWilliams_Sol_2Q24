use anchor_lang::prelude::*;

declare_id!("9rvx9iPWCGnG2LPk4HkodFiooLMJTVH4B2xb6WtiVJEp");

mod contexts;
mod state;

#[program]
pub mod escrow {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
