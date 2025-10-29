export default [
  {
    method: 'GET',
    path: '/questions',
    handler: 'question-controller.find',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/questions/:id',
    handler: 'question-controller.findOne',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/questions',
    handler: 'question-controller.create',
    config: {
      policies: [],
    },
  },
  {
    method: 'PUT',
    path: '/questions/:id',
    handler: 'question-controller.update',
    config: {
      policies: [],
    },
  },
  {
    method: 'DELETE',
    path: '/questions/:id',
    handler: 'question-controller.delete',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/templates',
    handler: 'question-controller.getTemplates',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/error-messages',
    handler: 'question-controller.getErrorMessages',
    config: {
      policies: [],
    },
  },
];