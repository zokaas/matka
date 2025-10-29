'use strict';

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Only validate on create/update
    if (['POST', 'PUT'].includes(ctx.request.method)) {
      const data = ctx.request.body?.data;

      if (data) {
        try {
          const validationService = strapi.plugin('kyc-questions')?.service('validation');
          
          if (!validationService) {
            strapi.log.warn('kyc-questions plugin validation service not found');
            await next();
            return;
          }

          const validation = await validationService.validateQuestion(data);

          if (!validation.valid) {
            return ctx.badRequest('Question validation failed', {
              errors: validation.errors,
            });
          }

          // Optionally clean up invalid fields
          const visibility = validationService.getFieldVisibility(data.componentType);
          
          if (!visibility.placeholder && data.placeholder) {
            delete ctx.request.body.data.placeholder;
          }
          if (!visibility.options && data.options) {
            delete ctx.request.body.data.options;
          }
          if (data.dynamicField && Array.isArray(data.dynamicField)) {
            ctx.request.body.data.dynamicField = data.dynamicField.filter(
              item => visibility.dynamicField[item.__component] !== false
            );
          }
          
        } catch (error) {
          strapi.log.error('Validation middleware error:', error);
          return ctx.internalServerError('Validation error occurred');
        }
      }
    }

    await next();
  };
};