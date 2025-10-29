import type { Core } from '@strapi/strapi';

const questionController = ({ strapi }: { strapi: Core.Strapi }) => ({
  async find(ctx) {
    try {
      const { locale = 'se' } = ctx.query;
      const questions = await strapi.documents(`api::questions-${locale}.questions-${locale}`).findMany({
        populate: {
          errorMessages: true,
          options: true,
          dynamicField: true,
        },
      });
      
      ctx.body = { data: questions };
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async findOne(ctx) {
    try {
      const { id } = ctx.params;
      const { locale = 'se' } = ctx.query;
      
      const question = await strapi.documents(`api::questions-${locale}.questions-${locale}`).findOne({
        documentId: id,
        populate: {
          errorMessages: true,
          options: true,
          dynamicField: true,
        },
      });
      
      ctx.body = { data: question };
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async create(ctx) {
    try {
      const { locale = 'se' } = ctx.query;
      const data = ctx.request.body;
      
      // Validate question structure
      const validationService = strapi.plugin('kyc-question-builder').service('validation');
      const validation = validationService.validateQuestion(data);
      
      if (!validation.valid) {
        return ctx.badRequest('Validation failed', { errors: validation.errors });
      }
      
      const question = await strapi.documents(`api::questions-${locale}.questions-${locale}`).create({
        data,
        populate: {
          errorMessages: true,
          options: true,
          dynamicField: true,
        },
      });
      
      ctx.body = { data: question };
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async update(ctx) {
    try {
      const { id } = ctx.params;
      const { locale = 'se' } = ctx.query;
      const data = ctx.request.body;
      
      // Validate question structure
      const validationService = strapi.plugin('kyc-question-builder').service('validation');
      const validation = validationService.validateQuestion(data);
      
      if (!validation.valid) {
        return ctx.badRequest('Validation failed', { errors: validation.errors });
      }
      
      const question = await strapi.documents(`api::questions-${locale}.questions-${locale}`).update({
        documentId: id,
        data,
        populate: {
          errorMessages: true,
          options: true,
          dynamicField: true,
        },
      });
      
      ctx.body = { data: question };
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async delete(ctx) {
    try {
      const { id } = ctx.params;
      const { locale = 'se' } = ctx.query;
      
      await strapi.documents(`api::questions-${locale}.questions-${locale}`).delete({
        documentId: id,
      });
      
      ctx.body = { data: { id } };
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async getTemplates(ctx) {
    try {
      const templates = strapi
        .plugin('kyc-question-builder')
        .service('question')
        .getTemplates();
      
      ctx.body = { data: templates };
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async getErrorMessages(ctx) {
    try {
      const messages = await strapi.documents('api::error-message.error-message').findMany();
      ctx.body = { data: messages };
    } catch (error) {
      ctx.throw(500, error);
    }
  },
});

export default questionController;