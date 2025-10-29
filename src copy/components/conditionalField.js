import React from 'react';
import { useCMEditViewDataManager } from '@strapi/helper-plugin';
import { Box } from '@strapi/design-system';

const ConditionalField = ({ fieldName, allowedTypes, children }) => {
  const { modifiedData } = useCMEditViewDataManager();
  const componentType = modifiedData?.componentType;

  const isVisible = allowedTypes.includes(componentType);

  if (!isVisible) {
    return null;
  }

  return <Box>{children}</Box>;
};

export default ConditionalField;