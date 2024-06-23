use crate::error::AmmErr;
use crate::state::config::Config;
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_2022::spl_token_2022::extension::cpi_guard::instruction,
    token_interface::{
        mint_to, transfer_checked, Mint, MintTo, TokenAccount, TokenInterface, TransferChecked,
    },
};

#[derive(Accounts)]
#[instruction(seed: u64)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub initializer: Signer<'info>,
    pub mint_x: Box<InterfaceAccount<'info, Mint>>,
    pub mint_y: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        init,
        payer = initializer,
        seeds = [b"lp", config.key.as_ref()],
        bump,
        mint::decimals = 6,
        mint::authority = auth
    )]
    pub mint_lp: Box<InterfaceAccount<'info, Mint>>,
    #[account(
        init,
        payer=initializer,
        associated_token::mint = mint_x,
        associated_token::authority = auth,
    )]
    pub vault_x: Box<InterfaceAccount<'info, TokenAccount>>,
    #[account(
        init,
        payer=initializer,
        associated_token::mint = mint_y,
        associated_token::authority = auth,
    )]
    pub vault_y: Box<InterfaceAccount<'info, TokenAccount>>,
    /// CHECK: this is safe
    #[account(
        seeds = [b"auth"],
        bump
    )]
    pub auth: UncheckedAccount<'info>,
    #[account(
        init,
        payer = initializer,
        seeds = [b"config", seed.to_le_bytes().as_ref()],
        bump,
        space = Config::LEN,
    )]
    pub config: Box<Account<'info, Config>>,
    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

impl<'info> Initialize<'info> {
    pub fn init(
        &mut self,
        bumps: &InitializeBumps,
        seed: u64,
        authority: Option<Pubkey>,
        fee: u16,
    ) -> Result<()> {
        require!(fee <= 10000, AmmErr::FeePercentError);
        self.config.init(
            seed,
            authority,
            self.mint_x.key(),
            self.mint_y.key(),
            fee,
            bumps.auth,
            bumps.config,
            bumps.mint_lp,
        );
        Ok(())
    }
}
