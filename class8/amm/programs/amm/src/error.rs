use anchor_lang::error_code;

#[error_code]
pub enum AmmErr {
    #[msg("Fees cannot be more than 100% (10,000 basis points)")]
    FeePercentError,
}
