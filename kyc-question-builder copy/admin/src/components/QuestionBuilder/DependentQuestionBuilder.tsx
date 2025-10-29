import React, { useState } from 'react';
import { Box, TextInput, Textarea, Button, Flex, Typography, Field } from '@strapi/design-system';
import {
  SingleSelect,
  SingleSelectOption,
  MultiSelect,
  MultiSelectOption,
} from '@strapi/design-system';
import OptionsBuilder from './OptionsBuilder';

interface DependentQuestionBuilderProps {
  dependent: any;
  parentOptions: Array<{ text: string; value: number }>;
  onChange: (dependent: any) => void;
  errorMessages: any[];
}

const DependentQuestionBuilder: React.FC<DependentQuestionBuilderProps> = ({
  dependent,
  parentOptions,
  onChange,
  errorMessages,
}) => {
  const [expanded, setExpanded] = useState(!!dependent);

  const hasYesNo =
    parentOptions.some((opt) => opt.value === 1) &&
    parentOptions.some((opt) => opt.value === 0 || opt.value === 2);

  if (!hasYesNo) {
    return (
      <Box marginTop={2} padding={4} background="warning100" hasRadius>
        <Typography variant="omega" textColor="warning700">
          Dependent questions are only available for Yes/No radio groups. Add options with values 1
          (Yes) and 0 or 2 (No).
        </Typography>
      </Box>
    );
  }

  const handleToggle = () => {
    if (!expanded && !dependent) {
      onChange({
        __component: 'kyc.dependent-question',
        conditionValue: 1,
        questionParameter: '',
        questionLabel: '',
        componentType: 'Text',
        placeholder: '',
        questionDescription: null,
        useCountryList: false,
        countryNameLang: null,
        options: [],
        errorMessages: [],
      });
    } else if (expanded && dependent) {
      onChange(null);
    }
    setExpanded(!expanded);
  };

  return (
    <Box marginTop={4}>
      <Box
        padding={4}
        background="neutral100"
        hasRadius
        style={{ cursor: 'pointer' }}
        onClick={handleToggle}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="sigma">Dependent Question</Typography>
            <Typography variant="pi" textColor="neutral600">
              Show additional question based on answer
            </Typography>
          </Box>
          <Typography variant="pi">{expanded ? '−' : '+'}</Typography>
        </Flex>
      </Box>

      {expanded && (
        <Box padding={4} background="neutral0" hasRadius marginTop={2}>
          {dependent && (
            <Flex direction="column" gap={4}>
              <Field name="conditionValue" required>
                <SingleSelect
                  label="Show when answer is"
                  value={dependent.conditionValue}
                  onChange={(value: any) =>
                    onChange({ ...dependent, conditionValue: parseInt(value, 10) })
                  }
                  required
                >
                  {parentOptions.map((option) => (
                    <SingleSelectOption key={option.value} value={option.value}>
                      {option.text} ({option.value})
                    </SingleSelectOption>
                  ))}
                </SingleSelect>
              </Field>

              <Field name="componentType" required>
                <SingleSelect
                  label="Question Type"
                  value={dependent.componentType}
                  onChange={(value: any) => {
                    const updated = {
                      ...dependent,
                      componentType: value,
                    };

                    if (value === 'RadioGroup') {
                      delete updated.placeholder;
                      updated.options = updated.options || [
                        { text: 'Yes', value: 1 },
                        { text: 'No', value: 0 },
                      ];
                    } else {
                      updated.options = [];
                    }

                    onChange(updated);
                  }}
                  required
                >
                  <SingleSelectOption value="Text">Text Input</SingleSelectOption>
                  <SingleSelectOption value="Textarea">Text Area</SingleSelectOption>
                  <SingleSelectOption value="Number">Number Input</SingleSelectOption>
                  <SingleSelectOption value="RadioGroup">
                    Radio Group (No nesting!)
                  </SingleSelectOption>
                  <SingleSelectOption value="Select">Dropdown</SingleSelectOption>
                  <SingleSelectOption value="MultiSelectDropdown">Multi-Select</SingleSelectOption>
                </SingleSelect>
              </Field>

              <Field name="questionParameter" required>
                <TextInput
                  label="Question Parameter"
                  placeholder="e.g., operatingCountries"
                  value={dependent.questionParameter}
                  onChange={(e: any) =>
                    onChange({ ...dependent, questionParameter: e.target.value })
                  }
                  required
                />
              </Field>

              <Field name="questionLabel" required>
                <Textarea
                  label="Question Label"
                  placeholder="Enter the question text"
                  value={dependent.questionLabel}
                  onChange={(e: any) => onChange({ ...dependent, questionLabel: e.target.value })}
                  required
                />
              </Field>

              {['Text', 'Textarea', 'Number', 'Select', 'MultiSelectDropdown'].includes(
                dependent.componentType
              ) && (
                <Field name="placeholder">
                  <TextInput
                    label="Placeholder"
                    placeholder="Enter placeholder text"
                    value={dependent.placeholder || ''}
                    onChange={(e: any) => onChange({ ...dependent, placeholder: e.target.value })}
                  />
                </Field>
              )}

              {dependent.componentType === 'RadioGroup' && (
                <Box>
                  <Typography variant="omega" textColor="danger600" marginBottom={2}>
                    Warning: Dependent RadioGroup questions cannot have their own dependent
                    questions!
                  </Typography>
                  <OptionsBuilder
                    options={dependent.options || []}
                    onChange={(options: Array<{ text: string; value: number }>) =>
                      onChange({ ...dependent, options })
                    }
                  />
                </Box>
              )}

              {['Select', 'MultiSelectDropdown'].includes(dependent.componentType) && (
                <Field name="useCountryList">
                  <Box>
                    <label>
                      <input
                        type="checkbox"
                        checked={dependent.useCountryList || false}
                        onChange={(e) =>
                          onChange({
                            ...dependent,
                            useCountryList: e.target.checked,
                            countryNameLang: e.target.checked ? 'en' : null,
                          })
                        }
                      />
                      <span style={{ marginLeft: '8px' }}>Use Country List</span>
                    </label>

                    {dependent.useCountryList && (
                      <Box marginTop={2}>
                        <SingleSelect
                          label="Country List Language"
                          value={dependent.countryNameLang || 'en'}
                          onChange={(value: any) =>
                            onChange({ ...dependent, countryNameLang: value })
                          }
                        >
                          <SingleSelectOption value="en">English</SingleSelectOption>
                          <SingleSelectOption value="sv">Swedish</SingleSelectOption>
                          <SingleSelectOption value="fi">Finnish</SingleSelectOption>
                        </SingleSelect>
                      </Box>
                    )}
                  </Box>
                </Field>
              )}

              <Field name="errorMessages" required>
                <MultiSelect
                  label="Error Messages"
                  placeholder="Select error messages"
                  value={dependent.errorMessages?.map((msg: any) => msg.documentId || msg.id) || []}
                  onChange={(value: any) => {
                    const selected = errorMessages.filter((msg: any) =>
                      value.includes(msg.documentId || msg.id)
                    );
                    onChange({ ...dependent, errorMessages: selected });
                  }}
                  withTags
                  required
                >
                  {errorMessages.map((msg: any) => (
                    <MultiSelectOption
                      key={msg.documentId || msg.id}
                      value={msg.documentId || msg.id}
                    >
                      {msg.error}: {msg.message}
                    </MultiSelectOption>
                  ))}
                </MultiSelect>
              </Field>
            </Flex>
          )}
        </Box>
      )}
    </Box>
  );
};

export default DependentQuestionBuilder;
