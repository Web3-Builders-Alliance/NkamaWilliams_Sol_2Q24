use anchor_lang::prelude::*;

mod constants;
mod context;
mod state;
use context::*;
mod error;

declare_id!("9pwhXT4u9cvzsuEbAqoCnjNWjeNodcbFaUzgD9kaBYjC");

#[program]
pub mod amm {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        seed: u64,
        fee: u16,
        authority: Option<Pubkey>,
    ) -> Result<()> {
        ctx.accounts.init(&ctx.bumps, seed, authority, fee);
        Ok(())
    }
}
