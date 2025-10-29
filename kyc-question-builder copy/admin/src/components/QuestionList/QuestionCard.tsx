import React from 'react';
import {
  Box,
  Flex,
  Typography,
  IconButton,
  Badge,
  Card,
  CardBody,
  CardContent,
  CardBadge,
  CardAsset,
  CardHeader,
  CardAction,
} from '@strapi/design-system';
import { Pencil, Trash } from '@strapi/icons';

interface QuestionCardProps {
  question: any;
  onEdit: () => void;
  onDelete: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onEdit,
  onDelete,
}) => {
  const getComponentTypeBadge = (type: string) => {
    const colors: any = {
      Text: 'primary',
      Textarea: 'primary',
      Number: 'secondary',
      RadioGroup: 'success',
      Select: 'warning',
      MultiSelectDropdown: 'warning',
      BeneficialOwner: 'danger',
    };

    return (
      <Badge backgroundColor={colors[type] || 'neutral'}>
        {type}
      </Badge>
    );
  };

  const hasDependent = question.dynamicField?.some(
    (f: any) => f.__component === 'kyc.dependent-question'
  );

  const hasInfo = question.dynamicField?.some(
    (f: any) => f.__component === 'kyc.info'
  );

  return (
    <Box
      padding={4}
      background="neutral0"
      hasRadius
      borderColor="neutral200"
      borderStyle="solid"
      borderWidth="1px"
      shadow="tableShadow"
    >
      <Flex justifyContent="space-between" alignItems="flex-start">
        <Box flex="1">
          <Flex gap={2} alignItems="center" marginBottom={2}>
            {getComponentTypeBadge(question.componentType)}
            {hasDependent && <Badge>Has Dependent</Badge>}
            {hasInfo && <Badge backgroundColor="primary100">Has Info</Badge>}
          </Flex>

          <Typography variant="beta" marginBottom={2}>
            {question.questionLabel}
          </Typography>

          <Typography
            variant="omega"
            textColor="neutral600"
            style={{ fontFamily: 'monospace' }}
          >
            Parameter: {question.questionParameter}
          </Typography>

          {question.placeholder && (
            <Typography variant="pi" textColor="neutral500" marginTop={2}>
              Placeholder: {question.placeholder}
            </Typography>
          )}

          {question.options && question.options.length > 0 && (
            <Box marginTop={2}>
              <Typography variant="pi" textColor="neutral600">
                Options: {question.options.map((o: any) => o.text).join(', ')}
              </Typography>
            </Box>
          )}
        </Box>

        <Flex gap={2}>
          <IconButton
            onClick={onEdit}
            label="Edit question"
            icon={<Pencil />}
          />
          <IconButton
            onClick={onDelete}
            label="Delete question"
            icon={<Trash />}
            variant="danger"
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default QuestionCard;