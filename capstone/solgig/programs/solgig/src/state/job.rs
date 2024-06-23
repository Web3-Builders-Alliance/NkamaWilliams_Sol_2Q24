use anchor_lang::prelude::*;

use crate::constants::{BOOL, PUBKEY, U64, U8};

#[account]
pub struct Job {
    pub maker: Pubkey,
    pub developer: Pubkey,
    pub seed: u64,
    pub state_bump: u8,
    pub vault_bump: u8,
    pub task_complete: bool,
    pub task_assigned: bool,
}

impl Space for Job {
    const INIT_SPACE: usize = 8 + (PUBKEY * 2) + (U64 * 2) + (U8 * 2) + (BOOL * 2);
}
