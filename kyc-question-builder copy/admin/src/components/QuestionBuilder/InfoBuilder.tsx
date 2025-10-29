import React, { useState } from 'react';
import {
  Box,
  Textarea,
  Flex,
  Typography,
  Field,
  Accordion,
  AccordionToggle,
  AccordionContent,
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
      <Accordion expanded={expanded} onToggle={handleToggle}>
        <AccordionToggle
          title="Info Component"
          description="Add help text or tooltip"
          togglePosition="left"
        />
        <AccordionContent>
          <Box padding={4}>
            {info && (
              <Flex direction="column" gap={4}>
                <Field name="componentType">
                  <Select
                    label="Display Type"
                    value={info.componentType}
                    onChange={(value: any) =>
                      onChange({ ...info, componentType: value })
                    }
                  >
                    <Option value="tooltip">Tooltip (? icon)</Option>
                    <Option value="subHeader">Sub Header (below question)</Option>
                  </Select>
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
        </AccordionContent>
      </Accordion>
    </Box>
  );
};

export default InfoBuilder;