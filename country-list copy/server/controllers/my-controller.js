'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('country-list')
      .service('myService')
      .getWelcomeMessage();
  },
});
