'use strict';

/**
 * everyday-fi-static service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::everyday-fi-static.everyday-fi-static');
