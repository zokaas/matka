import { useState } from "react";
import { T_FormFields } from "./types";

export const useForm = () => {
    const [fields, setFields] = useState<T_FormFields>({
        organizationNumber: "",
        loanAmount: "",
        repaymentPeriod: "",
        loanPurpose: "",
        loanPurposeDescription: "",
        campaignCode: "",
        businessSector: "",
        streetAddress: "",
        zipCode: "",
        city: "",
        disburismentAccount: "",
        applicantName: "",
        ssn: "",
        emailAddress: "",
        applicantPhone: "",
        PEP: "",
        businessCheck: false,
        allowMarketing: false,
        guarantorName: "",
        guarantorEmail: "",
        guarantorPhone: "",
        selfGuarantor: false,
        otherAsFirstGuarantor: false,
        secondGuarantorName: "",
        secondGuarantorEmail: "",
        secondGuarantorPhone: "",
        attachments: [],
        applicationUuid: "",
        businessId: "",
        source: "",
        companyName: "",
        invoiceDueDate: 0,
        guarantorInfoBlockError: false,
        gaClientId: "",
    });

    const [errs, setErrs] = useState<any>({
        organizationNumber: null,
        loanAmount: null,
        repaymentPeriod: null,
        loanPurpose: null,
        campaignCode: null,
        businessSector: null,
        streetAddress: null,
        zipCode: null,
        city: null,
        disburismentAccount: null,
        applicantName: null,
        ssn: null,
        emailAddress: null,
        applicantPhone: null,
        PEP: null,
        businessCheck: null,
        allowMarketing: null,
        guarantorName: null,
        guarantorEmail: null,
        guarantorPhone: null,
        selfGuarantor: null,
        otherAsFirstGuarantor: null,
        secondGuarantorName: null,
        secondGuarantorEmail: null,
        secondGuarantorPhone: null,
        attachments: null,
        invoiceDueDate: null,
        guarantorInfoBlockError: null,
    });

    const [fieldErrors, setFieldErrors] = useState<any>([
        {
            name: "organizationNumber",
            message: null,
        },
        //Basic info block
        {
            name: "loanAmount",
            message: null,
        },
        {
            name: "repaymentPeriod",
            message: null,
        },
        {
            name: "loanPurpose",
            message: null,
        },
        {
            name: "invoiceDueDate",
            message: null,
        },

        //Company Info block
        {
            name: "streetAddress",
            message: null,
        },
        {
            name: "zipCode",
            message: null,
        },
        {
            name: "city",
            message: null,
        },
        {
            name: "disburismentAccount",
            message: null,
        },

        //Applicant info block
        {
            name: "applicantName",
            message: null,
        },
        {
            name: "ssn",
            message: null,
        },
        {
            name: "emailAddress",
            message: null,
        },
        {
            name: "applicantPhone",
            message: null,
        },
        {
            name: "PEP",
            message: null,
        },
        {
            name: "businessCheck",
            message: null,
        },

        //Guarantor info block
        {
            name: "guarantorName",
            message: null,
        },
        {
            name: "guarantorEmail",
            message: null,
        },
        {
            name: "guarantorPhone",
            message: null,
        },
        {
            name: "guarantorInfoBlockError",
            message: null,
        },
        //Second Guarantor info
        {
            name: "secondGuarantorName",
            message: null,
        },
        {
            name: "secondGuarantorEmail",
            message: null,
        },
        {
            name: "secondGuarantorPhone",
            message: null,
        },

        //Atthments block
        {
            name: "attachment",
            message: null,
        },
    ]);

    return { fields, setFields, fieldErrors, setFieldErrors, errs, setErrs };
};
