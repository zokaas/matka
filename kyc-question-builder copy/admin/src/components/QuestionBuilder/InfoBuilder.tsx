import React, { useState } from 'react';
import {
  Box,
  Textarea,
  Flex,
  Typography,
  Field,
} from '@strapi/design-system';
import { SingleSelect, SingleSelectOption } from '@strapi/design-system';

interface InfoBuilderProps {
  info: any;
  onChange: (info: any) => void;
}

const InfoBuilder: React.FC<InfoBuilderProps> = ({ info, onChange }) => {
  const [expanded, setExpanded] = useState(!!info);

  const handleToggle = () => {
    if (!expanded && !info) {
      onChange({
        __component: 'kyc.info',
        infoHeader: null,
        infoDescription: '',
        componentType: 'subHeader',
      });
    } else if (expanded && info) {
      onChange(null);
    }
    setExpanded(!expanded);
  };

  return (
    <Box marginTop={2}>
      <Box 
        padding={4} 
        background="neutral100" 
        hasRadius
        style={{ cursor: 'pointer' }}
        onClick={handleToggle}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="sigma">Info Component</Typography>
            <Typography variant="pi" textColor="neutral600">
              Add help text or tooltip
            </Typography>
          </Box>
          <Typography variant="pi">{expanded ? '−' : '+'}</Typography>
        </Flex>
      </Box>

      {expanded && (
        <Box padding={4} background="neutral0" hasRadius marginTop={2}>
          {info && (
            <Flex direction="column" gap={4}>
              <Field name="componentType">
                <SingleSelect
                  label="Display Type"
                  value={info.componentType}
                  onChange={(value: any) =>
                    onChange({ ...info, componentType: value })
                  }
                >
                  <SingleSelectOption value="tooltip">Tooltip (? icon)</SingleSelectOption>
                  <SingleSelectOption value="subHeader">Sub Header (below question)</SingleSelectOption>
                </SingleSelect>
              </Field>

              <Field name="infoHeader">
                <Textarea
                  label="Info Header (optional)"
                  placeholder="Enter header text"
                  value={info.infoHeader || ''}
                  onChange={(e: any) =>
                    onChange({ ...info, infoHeader: e.target.value || null })
                  }
                />
              </Field>

              <Field name="infoDescription" required>
                <Textarea
                  label="Info Description"
                  placeholder="Enter description text"
                  value={info.infoDescription}
                  onChange={(e: any) =>
                    onChange({ ...info, infoDescription: e.target.value })
                  }
                  required
                />
              </Field>
            </Flex>
          )}
        </Box>
      )}
    </Box>
  );
};

export default InfoBuilder;