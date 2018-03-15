'use strict';

module.exports = {
  PORT: process.env.PORT || 8080,

  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',

  DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost/thinkful-backend',

  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'mongodb://localhost/thinkful-backend-test',

  API_ACTIVE_PLAYERS_BASE_URL: process.env.API_ACTIVE_PLAYERS_BASE_URL,

  API_DAILY_STATS_BASE_URL: process.env.API_DAILY_STATS_BASE_URL,

  API_CUMULATIVE_STATS_BASE_URL: process.env.API_CUMULATIVE_STATS_BASE_URL,

  API_USERNAME: process.env.SPORTS_FEED_UN,

  API_PASSWORD: process.env.SPORTS_FEED_PW
};
