import {
    buildDataTrackingPayload,
    extractBirthdateFromSsn,
    T_TrackingPayload,
} from "@opr-finance/utils";
import { T_Application } from "../types/general";
import { T_BrokerProxyApplication, T_BrokerApplication } from "../types/partner";
import { extractBrokerProxyApplication } from "../api/brokerProxyApplication";

export type T_TrackingPayloadClean = Omit<T_TrackingPayload, "allowMarketing">;

const getCleanTracking = async (): Promise<T_TrackingPayloadClean> => {
    const trackingData: T_TrackingPayload = await buildDataTrackingPayload();
    const { allowMarketing, ...publicTracking } = trackingData;
    return publicTracking;
};

export const normalizeAmount = (amount: string): string =>
    parseInt(amount.replace(/\s+/g, "")).toString();

export const buildBaseApplicantName = (given: string, surname?: string) =>
    surname ? `${given} ${surname}` : given;

export const mapGeneralApplication = async (
    data: T_Application
): Promise<T_Application & T_TrackingPayloadClean> => {
    const tracking = await getCleanTracking();
    return {
        ...data,
        ssn: data.ssn.toUpperCase(),
        applicantBirthday: extractBirthdateFromSsn(data.ssn),
        applicantName: buildBaseApplicantName(data.applicantGivenName, data.applicantSurname),
        amount: normalizeAmount(data.amount),
        ...tracking,
    };
};

export const mapBrokerApplication = async (
    data: T_BrokerApplication
): Promise<T_BrokerProxyApplication & T_TrackingPayload> => {
    const tracking = await buildDataTrackingPayload();
    const partnerData: T_BrokerProxyApplication = extractBrokerProxyApplication({
        ...data,
        amount: normalizeAmount(data.amount),
    });
    return {
        ...partnerData,
        ...tracking,
    };
};

export const mapRescoringApplication = async (
    data: T_Application
): Promise<T_Application & T_TrackingPayloadClean> => {
    const tracking = await getCleanTracking();
    return {
        ...data,
        applicantBirthday: extractBirthdateFromSsn(data.ssn),
        applicantName: buildBaseApplicantName(data.applicantGivenName, data.applicantSurname),
        amount: normalizeAmount(data.amount),
        ...tracking,
    };
};
