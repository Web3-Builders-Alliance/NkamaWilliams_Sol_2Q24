use ::anchor_lang::prelude::*;
use ::anchor_spl::{
    associated_token::AssociatedToken,
    token::{transfer, Mint, Token, TokenAccount, Transfer},
};

use crate::state::Escrow;
#[derive(Accounts)]
#[instruction(seed:u64)]
pub struct Take<'info> {
    #[account(mut)]
    pub taker: Signer<'info>,

    pub maker: SystemAccount<'info>,

    pub mint_a: Account<'info, Mint>,
    pub mint_b: Account<'info, Mint>,

    #[account(
        mut,
        has_one = mint_a,
        has_one = mint_b,
        has_one = maker,
        seeds = [b"escrow", escrow.maker.key().as_ref(), escrow.seed.to_le_bytes().as_ref()],
        bump = escrow.bump,
        close = maker,
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(
        mut,
        associated_token::mint = mint_a,
        associated_token::authority = escrow,
    )]
    pub vault: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = taker,
        associated_token::mint = mint_b,
        associated_token::authority = maker,
    )]
    pub maker_ata: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = taker,
        associated_token::mint = mint_a,
        associated_token::authority = taker,
    )]
    pub taker_ata_a: Account<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::mint = mint_b,
        associated_token::authority = taker,
    )]
    pub taker_ata_b: Account<'info, TokenAccount>,

    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

impl<'info> Take<'info> {
    // pub fn take(&mut self, amount: u64) -> Result<()> {
    //     self.escrow.amount = amount;
    //     self.vault.amount = amount;
    //     self.taker_ata_a.amount = self
    //         .taker_ata_a
    //         .amount
    //         .checked_add(self.escrow.amount)
    //         .ok_or(err);
    //     self.taker_ata_b.amount = self.taker_ata_b.amount.checked_add(amount).ok_or(err);
    //     Ok(())
    // }

    pub fn transfer(&mut self) -> Result<()> {
        let cpi_program = self.token_program.to_account_info();
        let accounts = Transfer {
            from: self.taker_ata_b.to_account_info(),
            to: self.maker_ata.to_account_info(),
            authority: self.taker.to_account_info(),
        };

        let ctx = CpiContext::new(cpi_program, accounts);
        transfer(ctx, self.escrow.amount);
        Ok(())
    }

    pub fn withdraw(&mut self) -> Result<()> {
        let cpi_program = self.token_program.to_account_info();

        let seeds = [
            b"escrow",
            self.maker.to_account_info().key.as_ref(),
            &self.escrow.seed.to_le_bytes()[..],
            &[self.escrow.bump],
        ];

        let signer_seeds = &[&seeds[..]];

        let accounts = Transfer {
            from: self.vault.to_account_info(),
            to: self.taker_ata_a.to_account_info(),
            authority: self.escrow.to_account_info(),
        };

        let ctx = CpiContext::new_with_signer(cpi_program, accounts, signer_seeds);
        transfer(ctx, self.escrow.amount);
        Ok(())
    }
}
