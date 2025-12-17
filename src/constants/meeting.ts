/**
 * Meeting Constants
 * Configuration values for meeting behavior
 */

export const MEETING_CONFIG = {
  DEFAULT_PARTICIPANT_NAME: 'TestUser',
  MULTI_STREAM_ENABLED: true,
  REINITIALIZE_ON_CONFIG_CHANGE: true,
  JOIN_WITHOUT_USER_INTERACTION: true,
} as const;

export const ERROR_CODES = {
  JOINING_ERRORS: [4001, 4002, 4003, 4004, 4005, 4006, 4007, 4008, 4009, 4010],
  CRITICAL_ERROR_PREFIX: '500',
} as const;

export const TIMEOUTS = {
  PARTICIPANT_DEBOUNCE: 500,
  RAISED_HAND_DURATION: 15000, // 15 seconds
  DENIED_ENTRY_REDIRECT: 3000, // 3 seconds
} as const;

export const LAYOUT = {
  BOTTOM_BAR_HEIGHT: 60,
  SIDEBAR_WIDTH: {
    XL_DESKTOP: 400,
    LG_DESKTOP: 360,
    TABLET: 320,
    MOBILE: 280,
    DEFAULT: 240,
  },
} as const;

export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET_MIN: 768,
  TABLET_MAX: 1023,
  LG_DESKTOP_MIN: 1024,
  LG_DESKTOP_MAX: 1439,
  XL_DESKTOP_MIN: 1440,
} as const;
