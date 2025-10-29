import type { Core } from '@strapi/strapi';

interface QuestionData {
  questionParameter: string;
  questionLabel: string;
  componentType:
    | 'Text'
    | 'Textarea'
    | 'Number'
    | 'RadioGroup'
    | 'Select'
    | 'MultiSelectDropdown'
    | 'BeneficialOwner';
  placeholder?: string;
  errorMessages?: any[];
  options?: Array<{ value: number; text: string }>;
  dynamicField?: Array<{
    __component: string;
    [key: string]: any;
  }>;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

interface FieldVisibility {
  placeholder: boolean;
  options: boolean;
  dynamicField: {
    'kyc.info': boolean;
    'kyc.dependent-question': boolean;
    'kyc.country-options': boolean;
    'kyc.beneficial-owner': boolean;
  };
}

const validation = ({ strapi }: { strapi: Core.Strapi }) => ({
  async validateQuestion(data: QuestionData): Promise<ValidationResult> {
    const errors: string[] = [];
    const { componentType, placeholder, options, dynamicField, errorMessages } = data;

    // Rule: errorMessages always required
    if (!errorMessages || errorMessages.length === 0) {
      errors.push('errorMessages is required for all question types');
    }

    // Validate based on componentType
    switch (componentType) {
      case 'Text':
      case 'Textarea':
      case 'Number':
        // Must have placeholder
        if (!placeholder) {
          errors.push(`${componentType} requires a placeholder`);
        }
        // Cannot have options
        if (options && options.length > 0) {
          errors.push(`${componentType} cannot have options`);
        }
        // Cannot have dependent questions
        if (dynamicField) {
          const hasDependentQ = dynamicField.some(
            (f) => f.__component === 'kyc.dependent-question'
          );
          if (hasDependentQ) {
            errors.push(`${componentType} cannot have dependent questions`);
          }
          // Can only have info in dynamicField
          const invalidComponents = dynamicField.filter((f) => f.__component !== 'kyc.info');
          if (invalidComponents.length > 0) {
            errors.push(`${componentType} can only have 'info' in dynamicField`);
          }
        }
        break;

      case 'RadioGroup':
        // Must have options
        if (!options || options.length === 0) {
          errors.push('RadioGroup requires options');
        }
        // Cannot have placeholder
        if (placeholder) {
          errors.push('RadioGroup cannot have a placeholder');
        }
        // Validate dependent questions only with Yes/No options
        if (dynamicField) {
          const dependentQuestions = dynamicField.filter(
            (f) => f.__component === 'kyc.dependent-question'
          );

          if (dependentQuestions.length > 0) {
            const isYesNo =
              options &&
              options.length === 2 &&
              options.some((o) => o.value === 1 && o.text === 'Yes') &&
              options.some((o) => o.value === 2 && o.text === 'No');

            if (!isYesNo) {
              errors.push('dependent-question only allowed with Yes(1)/No(2) options');
            }

            // Check dependent questions don't have their own dependent questions
            for (const depQ of dependentQuestions) {
              if (depQ.dynamicField) {
                const nestedDepQ = (depQ.dynamicField as any[]).filter(
                  (f: any) => f.__component === 'kyc.dependent-question'
                );
                if (nestedDepQ.length > 0) {
                  errors.push('Dependent questions cannot have nested dependent questions');
                }
              }
            }
          }
        }
        break;

      case 'Select':
      case 'MultiSelectDropdown':
        // Must have placeholder
        if (!placeholder) {
          errors.push(`${componentType} requires a placeholder`);
        }

        // Must have EITHER options OR country-options (not both)
        const hasOptions = options && options.length > 0;
        const hasCountryOptions =
          dynamicField && dynamicField.some((f) => f.__component === 'kyc.country-options');

        if (!hasOptions && !hasCountryOptions) {
          errors.push(`${componentType} requires either options or country-options`);
        }
        if (hasOptions && hasCountryOptions) {
          errors.push(`${componentType} cannot have both options and country-options`);
        }

        // Cannot have dependent questions
        if (dynamicField) {
          const hasDependentQ = dynamicField.some(
            (f) => f.__component === 'kyc.dependent-question'
          );
          if (hasDependentQ) {
            errors.push(`${componentType} cannot have dependent questions`);
          }
        }
        break;

      case 'BeneficialOwner':
        // Cannot have placeholder
        if (placeholder) {
          errors.push('BeneficialOwner cannot have a placeholder');
        }
        // Cannot have options
        if (options && options.length > 0) {
          errors.push('BeneficialOwner cannot have options');
        }
        // Must have beneficial-owner in dynamicField
        const hasBeneficialOwner =
          dynamicField && dynamicField.some((f) => f.__component === 'kyc.beneficial-owner');
        if (!hasBeneficialOwner) {
          errors.push('BeneficialOwner must have beneficial-owner component in dynamicField');
        }
        // Cannot have dependent questions
        if (dynamicField) {
          const hasDependentQ = dynamicField.some(
            (f) => f.__component === 'kyc.dependent-question'
          );
          if (hasDependentQ) {
            errors.push('BeneficialOwner cannot have dependent questions');
          }
        }
        break;
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  getFieldVisibility(componentType: QuestionData['componentType']): FieldVisibility {
    return {
      placeholder: ['Text', 'Textarea', 'Number', 'Select', 'MultiSelectDropdown'].includes(
        componentType
      ),
      options: componentType === 'RadioGroup',
      dynamicField: {
        'kyc.info': true,
        'kyc.dependent-question': componentType === 'RadioGroup',
        'kyc.country-options': ['Select', 'MultiSelectDropdown'].includes(componentType),
        'kyc.beneficial-owner': componentType === 'BeneficialOwner',
      },
    };
  },
});

export default validation;
