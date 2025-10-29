export default {
  async beforeCreate(event: any) {
    const { data } = event.params;
    
    const validationService = strapi.plugin('kyc-questions').service('validation');
    const validation = await validationService.validateQuestion(data);
    
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
  },

  async beforeUpdate(event: any) {
    const { data } = event.params;
    
    const validationService = strapi.plugin('kyc-questions').service('validation');
    const validation = await validationService.validateQuestion(data);
    
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
  },
};