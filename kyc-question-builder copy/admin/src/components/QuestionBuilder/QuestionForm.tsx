import React, { useState, useEffect } from 'react';
import { Box, TextInput, Textarea, Field, Flex, Button, Typography } from '@strapi/design-system';
import {
  MultiSelect,
  MultiSelectOption,
  SingleSelect,
  SingleSelectOption,
} from '@strapi/design-system';
import QuestionTypeSelector from './QuestionTypeSelector';
import OptionsBuilder from './OptionsBuilder';
import DependentQuestionBuilder from './DependentQuestionBuilder';
import InfoBuilder from './InfoBuilder';
import { fetchErrorMessages, fetchTemplates } from '../../api/questions';

interface QuestionFormProps {
  data: any;
  onChange: (data: any) => void;
  locale: string;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ data, onChange, locale }) => {
  const [errorMessages, setErrorMessages] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    loadErrorMessages();
    loadTemplates();
  }, []);

  const loadErrorMessages = async () => {
    try {
      const messages = await fetchErrorMessages();
      setErrorMessages(messages);
    } catch (error) {
      console.error('Failed to load error messages:', error);
    }
  };

  const loadTemplates = async () => {
    try {
      const templateData = await fetchTemplates();
      setTemplates(templateData);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleTypeChange = (newType: string) => {
    const resetData = { ...data, componentType: newType };

    switch (newType) {
      case 'Text':
      case 'Textarea':
      case 'Number':
        resetData.options = [];
        resetData.dynamicField =
          data.dynamicField?.filter((field: any) => field.__component === 'kyc.info') || [];
        break;

      case 'RadioGroup':
        if (!resetData.options || resetData.options.length === 0) {
          resetData.options = [
            { text: 'Yes', value: 1 },
            { text: 'No', value: 0 },
          ];
        }
        delete resetData.placeholder;
        break;

      case 'Select':
      case 'MultiSelectDropdown':
        resetData.dynamicField =
          data.dynamicField?.filter(
            (field: any) =>
              field.__component === 'kyc.info' || field.__component === 'kyc.country-options'
          ) || [];
        break;

      case 'BeneficialOwner':
        resetData.options = [];
        delete resetData.placeholder;
        const hasBOComponent = resetData.dynamicField?.some(
          (field: any) => field.__component === 'kyc.beneficial-owner'
        );
        if (!hasBOComponent) {
          resetData.dynamicField = [
            ...(resetData.dynamicField || []),
            {
              __component: 'kyc.beneficial-owner',
              useCountryList: true,
              countryListLang: 'en',
              addBObutton: 'Add new owner',
              nameParameter: 'boName',
              nameQuestion: 'Name?',
              namePlaceholder: 'John Doe',
              ssnParameter: 'boSsn',
              ssnQuestion: 'SSN?',
              ssnPlaceholder: '1234-5678',
              ownershipParameter: 'boOwnership',
              ownershipQuestion: 'Ownership %',
              ownershipPlaceholder: '%',
              countryParameter: 'boCountry',
              countryQuestion: 'Country of residence?',
              countryPlaceholder: 'Choose a country',
              errorMessages: [],
            },
          ];
        }
        break;
    }

    onChange(resetData);
  };

  const handleApplyTemplate = (template: any) => {
    onChange({
      ...data,
      ...template.template,
      questionParameter: data.questionParameter,
      questionLabel: data.questionLabel,
    });
    setShowTemplates(false);
  };

  const shouldShowField = (fieldName: string) => {
    const { componentType } = data;

    switch (fieldName) {
      case 'placeholder':
        return ['Text', 'Textarea', 'Number', 'Select', 'MultiSelectDropdown'].includes(
          componentType
        );
      case 'options':
        return componentType === 'RadioGroup';
      case 'dependentQuestion':
        return componentType === 'RadioGroup';
      case 'countryOptions':
        return ['Select', 'MultiSelectDropdown'].includes(componentType);
      case 'beneficialOwner':
        return componentType === 'BeneficialOwner';
      default:
        return true;
    }
  };

  return (
    <Flex direction="column" gap={4}>
      {/* Template Selector */}
      <Box>
        <Button variant="secondary" onClick={() => setShowTemplates(!showTemplates)}>
          {showTemplates ? 'Hide Templates' : 'Use Template'}
        </Button>

        {showTemplates && templates.length > 0 && (
          <Box marginTop={2} padding={4} background="neutral100" hasRadius>
            <Flex direction="column" gap={2}>
              {templates.map((template: any) => (
                <Box
                  key={template.id}
                  padding={3}
                  background="neutral0"
                  hasRadius
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleApplyTemplate(template)}
                >
                  <Typography variant="omega" fontWeight="bold">
                    {template.name}
                  </Typography>
                  <Typography variant="pi" textColor="neutral600">
                    {template.category}
                  </Typography>
                </Box>
              ))}
            </Flex>
          </Box>
        )}
      </Box>

      <QuestionTypeSelector value={data.componentType} onChange={handleTypeChange} />

      <Field name="questionParameter">
        <TextInput
          label="Question Parameter"
          placeholder="e.g., businessPlan, loanPurpose"
          value={data.questionParameter || ''}
          onChange={(e: any) => handleFieldChange('questionParameter', e.target.value)}
          hint="Unique identifier for this question (camelCase)"
          required
        />
      </Field>

      <Field name="questionLabel">
        <Textarea
          label="Question Label"
          placeholder="Enter the question text"
          value={data.questionLabel || ''}
          onChange={(e: any) => handleFieldChange('questionLabel', e.target.value)}
          required
        />
      </Field>

      {shouldShowField('placeholder') && (
        <Field name="placeholder">
          <TextInput
            label="Placeholder"
            placeholder="Enter placeholder text"
            value={data.placeholder || ''}
            onChange={(e: any) => handleFieldChange('placeholder', e.target.value)}
          />
        </Field>
      )}

      {shouldShowField('options') && (
        <OptionsBuilder
          options={data.options || []}
          onChange={(options: Array<{ text: string; value: number }>) =>
            handleFieldChange('options', options)
          }
        />
      )}

      <Field name="errorMessages">
        <MultiSelect
          label="Error Messages"
          placeholder="Select error messages"
          value={data.errorMessages?.map((msg: any) => msg.documentId || msg.id) || []}
          onChange={(value: string[]) => {
            const selected = errorMessages.filter((msg: any) =>
              value.includes(msg.documentId || msg.id)
            );
            handleFieldChange('errorMessages', selected);
          }}
          withTags
          required
        >
          {errorMessages.map((msg: any) => (
            <MultiSelectOption key={msg.documentId || msg.id} value={msg.documentId || msg.id}>
              {msg.error}: {msg.message}
            </MultiSelectOption>
          ))}
        </MultiSelect>
      </Field>

      <Box>
        <Typography variant="sigma" marginBottom={2}>
          Additional Components
        </Typography>

        <InfoBuilder
          info={data.dynamicField?.find((f: any) => f.__component === 'kyc.info')}
          onChange={(info: any) => {
            const filtered =
              data.dynamicField?.filter((f: any) => f.__component !== 'kyc.info') || [];
            if (info) {
              handleFieldChange('dynamicField', [...filtered, info]);
            } else {
              handleFieldChange('dynamicField', filtered);
            }
          }}
        />

        {shouldShowField('countryOptions') && (
          <Box marginTop={2}>
            <Field name="useCountryOptions">
              <Box>
                <label>
                  <input
                    type="checkbox"
                    checked={data.dynamicField?.some(
                      (f: any) => f.__component === 'kyc.country-options'
                    )}
                    onChange={(e) => {
                      const filtered =
                        data.dynamicField?.filter(
                          (f: any) => f.__component !== 'kyc.country-options'
                        ) || [];

                      if (e.target.checked) {
                        handleFieldChange('dynamicField', [
                          ...filtered,
                          {
                            __component: 'kyc.country-options',
                            useCountryList: true,
                            countryListLang: locale === 'se' ? 'sv' : locale,
                          },
                        ]);
                        handleFieldChange('options', []);
                      } else {
                        handleFieldChange('dynamicField', filtered);
                      }
                    }}
                  />
                  <span style={{ marginLeft: '8px' }}>Use Country List</span>
                </label>
              </Box>
            </Field>
          </Box>
        )}

        {shouldShowField('dependentQuestion') && (
          <DependentQuestionBuilder
            dependent={data.dynamicField?.find(
              (f: any) => f.__component === 'kyc.dependent-question'
            )}
            parentOptions={data.options || []}
            onChange={(dependent: any) => {
              const filtered =
                data.dynamicField?.filter((f: any) => f.__component !== 'kyc.dependent-question') ||
                [];
              if (dependent) {
                handleFieldChange('dynamicField', [...filtered, dependent]);
              } else {
                handleFieldChange('dynamicField', filtered);
              }
            }}
            errorMessages={errorMessages}
          />
        )}
      </Box>
    </Flex>
  );
};

export default QuestionForm;
