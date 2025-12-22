import { Injectable } from "@nestjs/common";
import { differenceInYears, parse } from "date-fns";
import {
  ACCEPTED_LEGAL_FORMS,
  APPLICATION_ACCEPTED,
  APPLICATION_PENDING,
  APPLICATION_REJECTED,
  COMPANY_ESTABLISHED_FORMAT_DATE,
} from "../constants";
import {
  ApplicationCreatedViljaResponseDto,
  ApplicationDto,
  ApplicationPayloadDto,
  SmeDto,
} from "../dtos";
import { SaveLeadsFlexNlEntity } from "../entities";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { BaseRequest } from "libs/helpers";
import { LoggerService } from "@opr-finance/logger";
import { ViljaApplicationService } from "@opr-finance/vilja-platform";
import { SmeResponseDto } from "../dtos/sme/sme-response.dto";
import { ApplicationCreatedResponseDto } from "../dtos/application-created-response.dto";
import { StrapiService } from "@opr-finance/strapi";

@Injectable()
export class HandleNewApplicationService extends BaseRequest {
  constructor(
    private readonly configService: ConfigService,
    readonly _httpService: HttpService,
    readonly _loggerService: LoggerService,
    private readonly viljaApplicationService: ViljaApplicationService,
    private readonly strapiService: StrapiService
  ) {
    super(_httpService, _loggerService);
  }

  // make Decision
  private makePreliminaryDecision(
    companyLegalForm: string,
    companyDateFounded: string
  ): string {
    if (!ACCEPTED_LEGAL_FORMS.includes(companyLegalForm.toLowerCase()))
      return APPLICATION_REJECTED;

    const companyFoundedDate = parse(
      companyDateFounded,
      COMPANY_ESTABLISHED_FORMAT_DATE,
      new Date()
    );
    const companyFoundedYearsAgo = differenceInYears(
      new Date(),
      companyFoundedDate
    );

    if (companyFoundedYearsAgo < 1) return APPLICATION_PENDING;

    return APPLICATION_ACCEPTED;
  }

  // get mesasge from strapi
  private async getPreliminaryDecisionMessage(
    decision: string
  ): Promise<string> {
    const contentType = "application/json";
    const product = "flex";
    const type = "application";
    const lang = "nl";
    const translations = await this.strapiService.getTranslations(
      contentType,
      product,
      type,
      lang
    );

    const { yourOptionsBlock } = translations.data.attributes;

    if (decision === APPLICATION_ACCEPTED)
      return yourOptionsBlock.title_A1_All_Good;
    if (decision === APPLICATION_PENDING)
      return yourOptionsBlock.title_B2_Warning;

    return yourOptionsBlock.title_C3_Rejected;
  }

  // save leads
  private async saveLeads(data: ApplicationPayloadDto): Promise<void> {
    const { desiredAmount } = data.application;
    const { birthDate, email, givenName, phone, surname, reference } =
      data.guarantor;
    const { organizationNumber, companyName } = data.sme;
    const { applicationInfo, companyInfo, marketingInfo } =
      data.application.dynamicFields;

    const saveLeadsPayload = new SaveLeadsFlexNlEntity({
      allowMarketing: marketingInfo.allowMarketing,
      amount: desiredAmount,
      applicantBirthDateField: birthDate,
      applicantBirthday: birthDate,
      applicantEmail: email,
      applicantGivenName: givenName,
      applicantName: givenName,
      applicantPhone: phone,
      applicantSurname: surname,
      campaignCode: applicationInfo.campaignCode,
      clientApplicationId: applicationInfo.clientApplicationId,
      companyAddressCity: companyInfo.companyCity,
      companyAddressStreet: companyInfo.companyStreet,
      companyAddressZip: companyInfo.companyPostalCode,
      companyCountry: companyInfo.companyCountry,
      companyHouseNumber: companyInfo.companyHouseNumber,
      companyId: organizationNumber,
      companyName: companyName,
      companyUserSelected: companyName,
      externalReference: applicationInfo.externalReference,
      foundationDate: companyInfo.foundationDate,
      gpsLatitude: 0,
      gpsLongitude: 0,
      intermediaryEmail: applicationInfo.intermediaryEmail,
      intermediaryPhoneNumber: applicationInfo.intermediaryPhoneNumber,
      legalForm: companyInfo.legalForm,
      privacyCheck: applicationInfo.creditCheck,
      redirectId: marketingInfo.redirectId,
      reference: reference,
      source: marketingInfo.source,
      subsource: marketingInfo.subsource,
    });

    const url = this.configService.get<string>("saveLeadsUrl");

    const config = this.getRequestConfig<SaveLeadsFlexNlEntity>(
      url,
      "POST",
      "application/json",
      saveLeadsPayload
    );

    await this.makeRequest(config, "", HandleNewApplicationService.name);
  }

  // handle sme
  private async getSmeId(kcClientId: string, smeData: SmeDto): Promise<string> {
    const path: string = "api/customer/v6/smes";
    const contentType: string = "application/json";

    const response = await this.viljaApplicationService.createCompany<
      null,
      SmeResponseDto,
      SmeDto
    >(kcClientId, path, contentType, smeData);

    return response.id;
  }

  // send application
  private async createApplicationInVilja(
    applicationData: ApplicationDto,
    kcClientId: string
  ): Promise<string> {
    const response =
      await this.viljaApplicationService.createOrUpdateApplication<
        never,
        ApplicationCreatedViljaResponseDto,
        ApplicationDto
      >(
        kcClientId,
        "/api/loan/v8/applications",
        "POST",
        "application/json",
        applicationData
      );
    return response.id;
  }

  async handleNewApplication(
    applicationData: ApplicationPayloadDto,
    kcClientId: string
  ): Promise<ApplicationCreatedResponseDto> {
    // create SME or get existing SME id
    const smeId = await this.getSmeId(kcClientId, applicationData.sme);

    // make Decision
    const preliminaryDecision = this.makePreliminaryDecision(
      applicationData.sme.legalForm,
      applicationData.sme.establishmentDate
    );

    // get decision message
    const preliminaryDecisionMessage =
      await this.getPreliminaryDecisionMessage(preliminaryDecision);

    // add message and decision to application data
    applicationData.application.dynamicFields.applicationInfo.suggestedFlow =
      preliminaryDecision;
    applicationData.application.dynamicFields.applicationInfo.suggestionMessage =
      preliminaryDecisionMessage;

    // set application status to rejected if preliminary decision is APPLICATION_REJECTED
    if (preliminaryDecision === APPLICATION_REJECTED) {
      applicationData.application.actualDecision = "REJECTED";
      applicationData.application.suggestion = "REJECTED";
    }

    // add sme id
    applicationData.application.smeId = smeId;

    // send application
    const applicationId = await this.createApplicationInVilja(
      applicationData.application,
      kcClientId
    );

    // save leads
    await this.saveLeads(applicationData);

    // send application id to redis

    return {
      applicationId,
      organizationNumber: applicationData.sme.organizationNumber,
      preliminaryDecision,
      reference: applicationData.reference,
    };
  }
}
