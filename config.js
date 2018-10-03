'use strict';

module.exports = {
  PORT: process.env.PORT || 8080,

  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',

  DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost/thinkful-backend',

  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'mongodb://localhost/thinkful-backend-test',

  API_USERNAME: process.env.SPORTS_FEED_UN,

  API_BASE_URL: process.env.API_BASE_URL,

  GET_PLAYERS_FEED: process.env.GET_PLAYERS_FEED,

  JWT_SECRET: process.env.JWT_SECRET,

  JWT_EXPIRY: process.env.JWT_EXPIRY || '3d',

  // API_ROSTER_PLAYERS_BASE_URL: process.env.API_ROSTER_PLAYERS_BASE_URL,

  // API_PLAYER_LOGS_BASE_URL: process.env.API_PLAYER_LOGS_BASE_URL,

  // API_CUMULATIVE_STATS_BASE_URL: process.env.API_CUMULATIVE_STATS_BASE_URL,

  // API_DAILY_GAME_SCHEDULE_BASE_URL: process.env.API_DAILY_GAME_SCHEDULE_BASE_URL,


  // API_PASSWORD: process.env.SPORTS_FEED_PW,


  
};
