import React from 'react';
import { SingleSelect, SingleSelectOption, Field } from '@strapi/design-system';

interface QuestionTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const QUESTION_TYPES = [
  { value: 'Text', label: 'Text Input', description: 'Single line text input' },
  { value: 'Textarea', label: 'Text Area', description: 'Multi-line text input' },
  { value: 'Number', label: 'Number Input', description: 'Numeric input only' },
  { value: 'RadioGroup', label: 'Radio Group', description: 'Multiple choice (single selection)' },
  { value: 'Select', label: 'Dropdown', description: 'Select from dropdown list' },
  { value: 'MultiSelectDropdown', label: 'Multi-Select', description: 'Select multiple options' },
  { value: 'BeneficialOwner', label: 'Beneficial Owner', description: 'Complex owner information form' },
];

const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <Field name="componentType">
      <SingleSelect
        label="Question Type"
        placeholder="Select a question type"
        value={value}
        onChange={onChange}
        required
      >
        {QUESTION_TYPES.map((type) => (
          <SingleSelectOption key={type.value} value={type.value}>
            <div>
              <div style={{ fontWeight: 'bold' }}>{type.label}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {type.description}
              </div>
            </div>
          </SingleSelectOption>
        ))}
      </SingleSelect>
    </Field>
  );
};

export default QuestionTypeSelector;