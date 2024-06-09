use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{transfer, Mint, Token, TokenAccount, Transfer},
    token_2022::spl_token_2022::{
        extension::cpi_guard::instruction, solana_zk_token_sdk::instruction::transfer,
    },
};

use crate::state::Escrow;

#[derive(Accounts)]
#[instruction(seed:u64)]
pub struct Make<'info> {
    #[account(mut)]
    pub maker: Signer<'info>,
    pub mint_a: Account<'info, Mint>,
    pub mint_b: Account<'info, Mint>,

    #[account(init, payer=maker, seeds=[b"escrow", maker.key().as_ref(), seed.to_le_bytes().as_ref()], bump, space=Escrow::INIT_SPACE)]
    pub escrow: Account<'info, Escrow>,

    #[account(mut, associated_token::mint = mint_a, associated_token::authority=maker,)]
    pub maker_ata: Account<'info, TokenAccount>,

    #[account(init, payer=maker, associated_token::mint=mint_a, associated_token::authority = escrow)]
    pub vault: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

impl<'info> Make<'info> {
    pub fn init(&mut self, seed: u64, recieve: u64, bumps: &MakeBumps) -> Result<()> {
        self.escrow.set_inner(Escrow {
            seed,
            maker: self.maker.key(),
            mint_a: self.mint_a.key(),
            mint_b: self.mint_b.key(),
            amount: recieve,
            bump: bumps.escrow,
        });

        Ok(())
    }

    pub fn deposit(&mut self, deposit: u64) -> Result<()> {
        let cpi_program = self.token_program.to_account_info();
        let accounts = Transfer {
            from: self.maker.to_account_info(),
            to: self.vault.to_account_info(),
            authority: self.maker.to_account_info(),
        };

        let ctx = CpiContext::new(cpi_program, accounts);
        transfer(ctx, deposit)?;
        Ok(())
    }
}
