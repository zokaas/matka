'use strict';

/**
 * kyc-se service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::kyc-se.kyc-se');
