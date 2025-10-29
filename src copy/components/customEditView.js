import React, { useMemo } from 'react';
import { useCMEditViewDataManager } from '@strapi/helper-plugin';

const CustomEditView = ({ children }) => {
  const { modifiedData, onChange } = useCMEditViewDataManager();
  const componentType = modifiedData?.componentType;

  // Define visibility rules
  const fieldVisibility = useMemo(() => {
    const rules = {
      placeholder: ['Text', 'Textarea', 'Number', 'Select', 'MultiSelectDropdown'].includes(componentType),
      options: componentType === 'RadioGroup',
      dynamicField: {
        'kyc.info': true, // Always allowed
        'kyc.dependent-question': componentType === 'RadioGroup',
        'kyc.country-options': ['Select', 'MultiSelectDropdown'].includes(componentType),
        'kyc.beneficial-owner': componentType === 'BeneficialOwner',
      }
    };

    return rules;
  }, [componentType]);

  // Auto-clear fields when they become invisible
  React.useEffect(() => {
    const updates = {};
    
    // Clear placeholder if not visible
    if (!fieldVisibility.placeholder && modifiedData.placeholder) {
      updates.placeholder = null;
    }
    
    // Clear options if not visible
    if (!fieldVisibility.options && modifiedData.options?.length > 0) {
      updates.options = [];
    }

    // Clear incompatible dynamicField components
    if (modifiedData.dynamicField?.length > 0) {
      const filtered = modifiedData.dynamicField.filter(item => {
        const allowed = fieldVisibility.dynamicField[item.__component];
        return allowed !== false;
      });
      
      if (filtered.length !== modifiedData.dynamicField.length) {
        updates.dynamicField = filtered;
      }
    }

    if (Object.keys(updates).length > 0) {
      onChange(updates);
    }
  }, [componentType, fieldVisibility, modifiedData, onChange]);

  return <>{children}</>;
};

export default CustomEditView;