import type { Core } from '@strapi/strapi';

const questionService = ({ strapi }: { strapi: Core.Strapi }) => ({
  getTemplates() {
    return [
      {
        id: 'business-plan',
        name: 'Business Plan',
        category: 'business',
        template: {
          componentType: 'Textarea',
          placeholder: 'Explain your business plan',
          errorMessages: [],
        },
      },
      {
        id: 'yes-no',
        name: 'Yes/No Question',
        category: 'general',
        template: {
          componentType: 'RadioGroup',
          options: [
            { text: 'Yes', value: 1 },
            { text: 'No', value: 0 },
          ],
          errorMessages: [],
        },
      },
      {
        id: 'country-select',
        name: 'Country Selection',
        category: 'location',
        template: {
          componentType: 'Select',
          placeholder: 'Choose a country',
          dynamicField: [
            {
              __component: 'kyc.country-options',
              useCountryList: true,
              countryListLang: 'en',
            },
          ],
          errorMessages: [],
        },
      },
      {
        id: 'beneficial-owners',
        name: 'Beneficial Owners',
        category: 'ownership',
        template: {
          componentType: 'BeneficialOwner',
          dynamicField: [
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
          ],
          errorMessages: [],
        },
      },
    ];
  },
});

export default questionService;