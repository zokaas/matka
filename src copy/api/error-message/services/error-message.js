'use strict';

/**
 * error-message service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::error-message.error-message');
