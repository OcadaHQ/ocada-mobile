export const APP_NAME = 'Ocada';

export const SECURE_USER_TOKEN_KEY = 'app.snips.user_token';
export const ACTIVE_PORTFOLIO_KEY = '@snips.activePortfolio';
export const LAST_REVIEW_KEY = '@snips.lastReviewDetails';

export const API_BASE_URL = 'https://api.ocada.ai';
export const STATIC_BASE_URL = 'https://api.ocada.ai/static';
export const PRIVACY_POLICY_URL = 'https://api.ocada.ai/static/policies/privacy.html';
export const TOS_POLICY_URL = 'https://api.ocada.ai/static/policies/terms.html';

export const DISCORD_URL = 'https://discord.gg/zwPwA8aZFc';
export const TELEGRAM_URL = 'https://t.me/Ocada_AI'
export const X_URL = 'https://x.com/ocada_ai';

export const CONTACT_EMAIL = 'hello@ocada.ai';
export const HTTP_TIMEOUT = 30; // seconds
export const HTTP_TIMEOUT_AI = 60; // seconds
export const API_TIMEZONE = ''

export const TEMP_CHARACTER_NAME_REGEX = /^[0-9A-Za-z.!@?#"$%&:;() *\+,\/;\-=[\\\]\^_{|}<>\u0400-\u04FF]{0,15}$/;
export const CHARACTER_NAME_REGEX = /^[0-9A-Za-z.!@?#"$%&:;() *\+,\/;\-=[\\\]\^_{|}<>\u0400-\u04FF]{1,15}$/;

export const GOOGLE_AUTH_EXPO_CLIENT_ID = '702957360843-mmfener83i89nj82ch0gtjp8dcqcjgqp.apps.googleusercontent.com';
export const GOOGLE_AUTH_IOS_CLIENT_ID = '501912182353-8tafa5p5aqnrj7tsf1jdj8gci401ufin.apps.googleusercontent.com';
export const GOOGLE_AUTH_ANDROID_CLIENT_ID = '501912182353-a5p49pslosksm4jddr5nme7brfkf5jaj.apps.googleusercontent.com';
export const GOOGLE_AUTH_WEB_CLIENT_ID = '501912182353-2mpe9hbpj6gt52292tv49qagi5siqrb0.apps.googleusercontent.com';

export const APP_URL_IOS = 'https://apps.apple.com/app/snips/id1617156912';
export const APP_URL_ANDROID = 'https://play.google.com/store/apps/details?id=app.snips';
export const APP_URL_WEB = 'https://ocada.ai';
export const APP_URL_DOWNLOAD = 'https://ocada.ai/download'

export const MAX_ASSETS_IN_PORTFOLIO = 15; // how many assets you can hold in a portfolio

// daily and weekly reward eligibility: how many hours should pass
export const REWARD_ELIGIBILITY_HOURS_INTRADAY = 2;
export const REWARD_ELIGIBILITY_HOURS_DAILY = 18;
export const REWARD_ELIGIBILITY_HOURS_WEEKLY = 160;

// reward amount
export const REWARD_AMOUNT_INTRADAY = 50;
export const REWARD_AMOUNT_DAILY = 100;
export const REWARD_AMOUNT_WEEKLY = 1000;

// RevenueCat public keys
export const REVENUECAT_PUBLIC_SDK_KEY_IOS = 'appl_VXwXORmwULLPRBuyFOygSIWaWiq'
export const REVENUECAT_PUBLIC_SDK_KEY_ANDROID = 'goog_rrBpuBhwWERviGrNGoGvFDOtXXN'
export const REVENUECAT_ENTITLEMENT_ID = 'Premium'

// forms
export const FORM_SUGGEST_NEW_INSTRUMENT = 'https://docs.google.com/forms/d/e/1FAIpQLScq4Had4-Toud9XZsw_wvnM2if2YNwPlNH1ZeMpPQfCeCKN_A/viewform?usp=pp_url&entry.1691504563=Solana';

// AI Chat
export const AI_DAILY_FREE_MESSAGE_LIMIT = 10;

// external links
// export const WEBINAR_URL = 'https://lu.ma/m9b07nld'

// solana
export const SOLANA_PHANTOM_CONNECT_URL = 'https://phantom.app/ul/v1/connect';
export const SOLANA_PHANTOM_SIGN_MESSAGE_URL = 'https://phantom.app/ul/v1/signMessage';
export const SOLANA_SOLFLARE_CONNECT_URL = 'https://solflare.com/ul/v1/connect';
export const SOLANA_SOLFLARE_SIGN_MESSAGE_URL = 'https://solflare.com/ul/v1/signMessage'
export const SOLANA_CLUSTER = 'mainnet-beta';
export const SOLANA_SIGN_IN_MESSAGE = "Sign the message to confirm your ownership of the wallet. You will not be charged.";

export const SOLANA_RUG_CHECK_BASE_URL = 'https://rugcheck.xyz/tokens';

export const DEFAULT_MAX_ELEMENTS_PER_PAGE = 100;