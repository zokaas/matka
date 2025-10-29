export default (config) => {
  // Extend the Questions SE content type
  config.contentTypes['api::questions-se.questions-se'] = {
    ...config.contentTypes['api::questions-se.questions-se'],
    layouts: {
      edit: [
        // Row 1: Always visible
        [
          { name: 'questionParameter', size: 6 },
          { name: 'componentType', size: 6 },
        ],
        // Row 2: Always visible
        [
          { name: 'questionLabel', size: 12 },
        ],
        // Row 3: Always visible
        [
          { name: 'errorMessages', size: 12 },
        ],
        // Row 4: Conditional placeholder
        [
          {
            name: 'placeholder',
            size: 12,
            // This field visibility will be handled by custom logic
          },
        ],
        // Row 5: Conditional options
        [
          {
            name: 'options',
            size: 12,
          },
        ],
        // Row 6: Dynamic field
        [
          { name: 'dynamicField', size: 12 },
        ],
      ],
    },
  };

  return config;
};