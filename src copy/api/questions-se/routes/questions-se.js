'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::questions-se.questions-se', {
  config: {
    // Apply middleware to specific routes
    create: {
      middlewares: ['api::questions-se.validate-question'],
    },
    update: {
      middlewares: ['api::questions-se.validate-question'],
    },
    // Optionally add to other routes
    // find: {
    //   middlewares: ['some-middleware'],
    // },
    // findOne: {
    //   middlewares: ['some-middleware'],
    // },
    // delete: {
    //   middlewares: ['some-middleware'],
    // },
  },
});