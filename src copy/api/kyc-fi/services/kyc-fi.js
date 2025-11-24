'use strict';

/**
 * kyc-fi service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::kyc-fi.kyc-fi');
