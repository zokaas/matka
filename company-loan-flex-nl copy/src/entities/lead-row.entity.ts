export class LeadRowEntity {
  allowMarketing: boolean;
  amount: string;
  applicantBirthDateField: string;
  applicantBirthday: string;
  applicantEmail: string;
  applicantGivenName: string;
  applicantName: string;
  applicantPhone: string;
  applicantSurname: string;
  campaignCode: string;
  clientApplicationId: string;
  companyAddressCity: string;
  companyAddressStreet: string;
  companyAddressZip: string;
  companyCountry: string;
  companyHouseNumber: string;
  companyId: string;
  companyName: string;
  companyUserSelected: string;
  externalReference: string;
  foundationDate: string;
  gpsLatitude: number;
  gpsLongitude: number;
  intermediaryEmail: string;
  intermediaryPhoneNumber: string;
  legalForm: string;
  privacyCheck: boolean;
  redirectId: string;
  reference: string;
  source: string;
  subsource: string;

  constructor(objData: LeadRowEntity) {
    Object.assign(this, objData);
  }
}
