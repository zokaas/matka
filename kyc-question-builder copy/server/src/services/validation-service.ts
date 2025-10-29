import type { Core } from '@strapi/strapi';

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const validationService = ({ strapi }: { strapi: Core.Strapi }) => ({
  validateQuestion(data: any): ValidationResult {
    const errors: string[] = [];
    
    // Base validation
    if (!data.questionParameter) {
      errors.push('questionParameter is required');
    }
    if (!data.questionLabel) {
      errors.push('questionLabel is required');
    }
    if (!data.componentType) {
      errors.push('componentType is required');
    }
    
    const componentType = data.componentType;
    
    // Component-specific validation
    switch (componentType) {
      case 'Text':
      case 'Textarea':
      case 'Number':
        if (!data.placeholder) {
          errors.push(`placeholder is required for ${componentType}`);
        }
        if (!data.errorMessages || data.errorMessages.length === 0) {
          errors.push(`errorMessages is required for ${componentType}`);
        }
        // These types should NOT have options
        if (data.options && data.options.length > 0) {
          errors.push(`${componentType} cannot have options`);
        }
        // Can only have info in dynamicField
        if (data.dynamicField && data.dynamicField.length > 0) {
          const invalidComponents = data.dynamicField.filter(
            (field: any) => field.__component !== 'kyc.info'
          );
          if (invalidComponents.length > 0) {
            errors.push(`${componentType} can only have kyc.info in dynamicField`);
          }
        }
        break;
        
      case 'RadioGroup':
        if (!data.options || data.options.length === 0) {
          errors.push('RadioGroup must have options');
        }
        if (!data.errorMessages || data.errorMessages.length === 0) {
          errors.push('errorMessages is required for RadioGroup');
        }
        // Check if options are Yes(1)/No(0 or 2) for dependent questions
        if (data.dynamicField && data.dynamicField.length > 0) {
          const hasDependent = data.dynamicField.some(
            (field: any) => field.__component === 'kyc.dependent-question'
          );
          
          if (hasDependent) {
            const hasYesNo = data.options.some((opt: any) => opt.value === 1) &&
                            data.options.some((opt: any) => opt.value === 0 || opt.value === 2);
            if (!hasYesNo) {
              errors.push('RadioGroup with dependent questions must have Yes(1)/No(0 or 2) options');
            }
            
            // Validate dependent question doesn't have its own dependent
            const dependentQuestions = data.dynamicField.filter(
              (field: any) => field.__component === 'kyc.dependent-question'
            );
            
            dependentQuestions.forEach((dep: any) => {
              if (dep.componentType === 'RadioGroup' && dep.options) {
                errors.push('Dependent questions cannot have their own dependent questions');
              }
            });
          }
        }
        // Placeholder should not exist
        if (data.placeholder) {
          errors.push('RadioGroup cannot have placeholder');
        }
        break;
        
      case 'Select':
      case 'MultiSelectDropdown':
        if (!data.placeholder) {
          errors.push(`placeholder is required for ${componentType}`);
        }
        if (!data.errorMessages || data.errorMessages.length === 0) {
          errors.push(`errorMessages is required for ${componentType}`);
        }
        
        // Must have either options OR country-options
        const hasOptions = data.options && data.options.length > 0;
        const hasCountryOptions = data.dynamicField?.some(
          (field: any) => field.__component === 'kyc.country-options'
        );
        
        if (!hasOptions && !hasCountryOptions) {
          errors.push(`${componentType} must have either options or country-options`);
        }
        if (hasOptions && hasCountryOptions) {
          errors.push(`${componentType} cannot have both options and country-options`);
        }
        
        // Cannot have dependent questions
        const hasDependent = data.dynamicField?.some(
          (field: any) => field.__component === 'kyc.dependent-question'
        );
        if (hasDependent) {
          errors.push(`${componentType} cannot have dependent questions`);
        }
        break;
        
      case 'BeneficialOwner':
        // Must have beneficial-owner component
        const hasBOComponent = data.dynamicField?.some(
          (field: any) => field.__component === 'kyc.beneficial-owner'
        );
        if (!hasBOComponent) {
          errors.push('BeneficialOwner must have kyc.beneficial-owner component in dynamicField');
        }
        
        // Should not have placeholder, options, or dependent questions
        if (data.placeholder) {
          errors.push('BeneficialOwner cannot have placeholder');
        }
        if (data.options && data.options.length > 0) {
          errors.push('BeneficialOwner cannot have options');
        }
        const hasBODependent = data.dynamicField?.some(
          (field: any) => field.__component === 'kyc.dependent-question'
        );
        if (hasBODependent) {
          errors.push('BeneficialOwner cannot have dependent questions');
        }
        break;
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  },
  
  getFieldVisibility(componentType: string) {
    const visibility: any = {
      placeholder: false,
      options: false,
      dynamicField: {
        'kyc.info': true,
        'kyc.dependent-question': false,
        'kyc.country-options': false,
        'kyc.beneficial-owner': false,
      },
    };
    
    switch (componentType) {
      case 'Text':
      case 'Textarea':
      case 'Number':
        visibility.placeholder = true;
        break;
        
      case 'RadioGroup':
        visibility.options = true;
        visibility.dynamicField['kyc.dependent-question'] = true;
        break;
        
      case 'Select':
      case 'MultiSelectDropdown':
        visibility.placeholder = true;
        visibility.dynamicField['kyc.country-options'] = true;
        break;
        
      case 'BeneficialOwner':
        visibility.dynamicField['kyc.beneficial-owner'] = true;
        break;
    }
    
    return visibility;
  },
});

export default validationService;