'use strict';

/**
 * questions-se service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::questions-se.questions-se');
