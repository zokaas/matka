'use strict';

/**
 * error-message router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::error-message.error-message');
