'use strict';

/**
 * questions-fi service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::questions-fi.questions-fi');
