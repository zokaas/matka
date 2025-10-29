export default [
  {
    method: 'POST',
    path: '/validate',
    handler: 'validation.validate',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/field-visibility/:componentType',
    handler: 'validation.getFieldVisibility',
    config: {
      policies: [],
      auth: false,
    },
  },
];