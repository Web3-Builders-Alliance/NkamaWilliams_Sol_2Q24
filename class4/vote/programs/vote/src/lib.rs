use anchor_lang::prelude::*;

declare_id!("FZNg89Lo9GbtH2A1NNFASS5M4iSKYxkSHxNZwk8MWqJZ");

#[program]
pub mod vote {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, _url:String) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(_url:String)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(init, payer=payer, seeds=[_url.as_bytes().as_ref()], bump, space = VoteState::INIT_SPACE)]
    pub vote_state: Account<'info, VoteState>,
    pub system_program: Program<'info, System>,
}

impl<'info> Initialize<'info>{
    pub fn initialize(&mut self, bumps: &InitializeBumps, url:String) -> Result<()>{
        self.vote_state.score = 0;
        self.vote_state.bump = bumps.vote_state;
    }
}

#[account]
pub struct VoteState{
    pub score: i64,
    pub bump: u8,
}

impl Space for VoteState{
    const INIT_SPACE:usize = 8 + 8 + 1;
}

#[derive(Accounts)]