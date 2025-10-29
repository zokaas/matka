import React from 'react';
import {
  Box,
  TextInput,
  Button,
  Flex,
  Typography,
  IconButton,
  Field,
} from '@strapi/design-system';
import { Plus, Trash } from '@strapi/icons';

interface OptionsBuilderProps {
  options: Array<{ text: string; value: number }>;
  onChange: (options: Array<{ text: string; value: number }>) => void;
}

const OptionsBuilder: React.FC<OptionsBuilderProps> = ({ options, onChange }) => {
  const handleAddOption = () => {
    const newValue = options.length > 0 
      ? Math.max(...options.map(o => o.value)) + 1 
      : 1;
    
    onChange([
      ...options,
      { text: '', value: newValue },
    ]);
  };

  const handleRemoveOption = (index: number) => {
    onChange(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, field: 'text' | 'value', value: any) => {
    const updated = [...options];
    updated[index] = {
      ...updated[index],
      [field]: field === 'value' ? parseInt(value, 10) : value,
    };
    onChange(updated);
  };

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Typography variant="sigma">Options</Typography>
        <Button
          startIcon={<Plus />}
          variant="secondary"
          size="S"
          onClick={handleAddOption}
        >
          Add Option
        </Button>
      </Flex>

      <Flex direction="column" gap={2}>
        {options.map((option, index) => (
          <Flex key={index} gap={2} alignItems="flex-end">
            <Box style={{ flex: 3 }}>
              <Field name={`option-text-${index}`}>
                <TextInput
                  label={index === 0 ? 'Text' : undefined}
                  placeholder="Option text"
                  value={option.text}
                  onChange={(e: any) => 
                    handleOptionChange(index, 'text', e.target.value)
                  }
                />
              </Field>
            </Box>
            <Box style={{ flex: 1 }}>
              <Field name={`option-value-${index}`}>
                <TextInput
                  label={index === 0 ? 'Value' : undefined}
                  placeholder="Value"
                  type="number"
                  value={option.value}
                  onChange={(e: any) => 
                    handleOptionChange(index, 'value', e.target.value)
                  }
                />
              </Field>
            </Box>
            <IconButton
              onClick={() => handleRemoveOption(index)}
              label="Remove option"
              icon={<Trash />}
            />
          </Flex>
        ))}
      </Flex>

      {options.length === 0 && (
        <Box padding={4} background="neutral100" hasRadius>
          <Typography variant="omega" textColor="neutral600">
            No options added. Click "Add Option" to create options.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default OptionsBuilder;