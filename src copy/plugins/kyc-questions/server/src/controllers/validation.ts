import type { Core } from '@strapi/strapi';

const validation = ({ strapi }: { strapi: Core.Strapi }) => ({
  async validate(ctx: any) {
    try {
      const { questionData } = ctx.request.body;
      
      if (!questionData) {
        return ctx.badRequest('questionData is required');
      }
      
      const validationService = strapi.plugin('kyc-questions').service('validation');
      const result = await validationService.validateQuestion(questionData);
      
      ctx.body = {
        data: {
          valid: result.valid,
          errors: result.errors,
        },
      };
    } catch (err: any) {
      strapi.log.error('Validation error:', err);
      ctx.throw(500, err.message || 'Internal server error');
    }
  },

  async getFieldVisibility(ctx: any) {
    try {
      const { componentType } = ctx.params;
      
      const validTypes = ['Text', 'Textarea', 'Number', 'RadioGroup', 'Select', 'MultiSelectDropdown', 'BeneficialOwner'];
      if (!validTypes.includes(componentType)) {
        return ctx.badRequest('Invalid componentType');
      }
      
      const validationService = strapi.plugin('kyc-questions').service('validation');
      const visibility = validationService.getFieldVisibility(componentType);
      
      ctx.body = { 
        data: visibility 
      };
    } catch (err: any) {
      strapi.log.error('Field visibility error:', err);
      ctx.throw(500, err.message || 'Internal server error');
    }
  },
});

export default validation;