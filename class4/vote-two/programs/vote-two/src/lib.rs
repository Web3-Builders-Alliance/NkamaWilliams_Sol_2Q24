use anchor_lang::prelude::*;

declare_id!("ELYN9fcwdLFDehJnq1SWN9CRJgrishc31wwKB3SsE6jV");

#[program]
pub mod vote_two {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, _url: String) -> Result<()> {
        ctx.accounts.initialize(&ctx.bumps)?;
        Ok(())
    }

    pub fn upvote(ctx: Context<Vote>, _url: String) -> Result<()> {
        ctx.accounts.upvote()?;
        Ok(())
    }

    pub fn downvote(ctx: Context<Vote>, _url: String) -> Result<()> {
        ctx.accounts.downvote()?;
        Ok(())
    }

    pub fn clear(ctx: Context<Vote>, _url: String) -> Result<()> {
        ctx.accounts.clear()?;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(_url: String)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(init, payer=payer, seeds=[_url.as_bytes().as_ref()], bump, space=VoteState::INIT_SPACE)]
    pub vote: Account<'info, VoteState>,
    pub system_program: Program<'info, System>,
}

impl<'info> Initialize<'info> {
    pub fn initialize(&mut self, bump: &InitializeBumps) -> Result<()> {
        self.vote.votes = 0;
        self.vote.bump = bump.vote;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(_url: String)]
pub struct Vote<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut, seeds=[_url.as_bytes().as_ref()], bump=vote.bump)]
    pub vote: Account<'info, VoteState>,
}

impl<'info> Vote<'info> {
    pub fn upvote(&mut self) -> Result<()> {
        self.vote.votes += 1;
        Ok(())
    }

    pub fn downvote(&mut self) -> Result<()> {
        self.vote.votes -= 1;
        Ok(())
    }

    pub fn clear(&mut self) -> Result<()> {
        self.vote.votes = 0;
        Ok(())
    }
}

#[account]
pub struct VoteState {
    pub votes: u64,
    pub bump: u8,
}

impl Space for VoteState {
    const INIT_SPACE: usize = 8 + 8 + 1;
}
