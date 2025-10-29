import React from 'react';
import { Box, Typography, Flex, Badge } from '@strapi/design-system';

interface LivePreviewProps {
  question: any;
}

const LivePreview: React.FC<LivePreviewProps> = ({ question }) => {
  const renderPreview = () => {
    switch (question.componentType) {
      case 'Text':
      case 'Textarea':
      case 'Number':
        return (
          <Box>
            <Typography variant="pi" fontWeight="bold" marginBottom={2}>
              {question.questionLabel}
            </Typography>
            <Box
              padding={3}
              background="neutral100"
              hasRadius
              borderColor="neutral200"
              borderStyle="solid"
              borderWidth="1px"
            >
              <Typography variant="omega" textColor="neutral500">
                {question.placeholder || 'Enter text...'}
              </Typography>
            </Box>
          </Box>
        );

      case 'RadioGroup':
        return (
          <Box>
            <Typography variant="pi" fontWeight="bold" marginBottom={2}>
              {question.questionLabel}
            </Typography>
            <Flex direction="column" gap={2}>
              {question.options?.map((option: any, index: number) => (
                <Flex key={index} gap={2} alignItems="center">
                  <Box
                    width="16px"
                    height="16px"
                    borderRadius="50%"
                    borderColor="neutral300"
                    borderStyle="solid"
                    borderWidth="2px"
                  />
                  <Typography variant="omega">{option.text}</Typography>
                </Flex>
              ))}
            </Flex>
          </Box>
        );

      case 'Select':
      case 'MultiSelectDropdown':
        return (
          <Box>
            <Typography variant="pi" fontWeight="bold" marginBottom={2}>
              {question.questionLabel}
            </Typography>
            <Box
              padding={3}
              background="neutral100"
              hasRadius
              borderColor="neutral200"
              borderStyle="solid"
              borderWidth="1px"
            >
              <Typography variant="omega" textColor="neutral500">
                {question.placeholder || 'Select an option...'}
              </Typography>
            </Box>
            {question.dynamicField?.some(
              (f: any) => f.__component === 'kyc.country-options'
            ) && (
              <Badge marginTop={2}>Using Country List</Badge>
            )}
          </Box>
        );

      case 'BeneficialOwner':
        return (
          <Box>
            <Typography variant="pi" fontWeight="bold" marginBottom={2}>
              {question.questionLabel}
            </Typography>
            <Box
              padding={4}
              background="neutral100"
              hasRadius
            >
              <Typography variant="omega" textColor="neutral600">
                Complex beneficial owner form with multiple fields
              </Typography>
            </Box>
          </Box>
        );

      default:
        return (
          <Typography variant="omega" textColor="neutral500">
            Select a question type to see preview
          </Typography>
        );
    }
  };

  const infoComponent = question.dynamicField?.find(
    (f: any) => f.__component === 'kyc.info'
  );

  const dependentQuestion = question.dynamicField?.find(
    (f: any) => f.__component === 'kyc.dependent-question'
  );

  return (
    <Box>
      <Typography variant="beta" marginBottom={4}>
        Live Preview
      </Typography>

      <Box
        padding={6}
        background="neutral0"
        hasRadius
        borderColor="neutral200"
        borderStyle="solid"
        borderWidth="1px"
      >
        {renderPreview()}

        {infoComponent && (
          <Box marginTop={3} padding={3} background="primary100" hasRadius>
            <Typography variant="pi" fontWeight="bold" textColor="primary600">
              {infoComponent.componentType === 'tooltip' ? '💡 Tooltip' : 'ℹ️ Info'}
            </Typography>
            {infoComponent.infoHeader && (
              <Typography variant="omega" marginTop={1}>
                {infoComponent.infoHeader}
              </Typography>
            )}
            <Typography variant="omega" marginTop={1}>
              {infoComponent.infoDescription}
            </Typography>
          </Box>
        )}

        {dependentQuestion && (
          <Box marginTop={4} paddingLeft={4} borderLeft="3px solid #ddd">
            <Badge marginBottom={2}>
              Shown when: {question.options?.find(
                (o: any) => o.value === dependentQuestion.conditionValue
              )?.text}
            </Badge>
            <Typography variant="pi" fontWeight="bold" marginBottom={2}>
              {dependentQuestion.questionLabel}
            </Typography>
            <Typography variant="omega" textColor="neutral600">
              Type: {dependentQuestion.componentType}
            </Typography>
          </Box>
        )}
      </Box>

      <Box marginTop={4}>
        <Typography variant="sigma" marginBottom={2}>
          Question Data
        </Typography>
        <Box
          padding={3}
          background="neutral100"
          hasRadius
          style={{ fontFamily: 'monospace', fontSize: '12px', overflow: 'auto' }}
        >
          <pre>{JSON.stringify(question, null, 2)}</pre>
        </Box>
      </Box>
    </Box>
  );
};

export default LivePreview;