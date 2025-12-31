import { T_EngagementReducerState } from "../types";
export declare const engagementReducer: import("typesafe-actions").Reducer<T_EngagementReducerState, import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
    engagementType?: "BUSINESS_INDIVIDUAL";
    smeId?: string;
    organizationNumber?: string;
    companyName?: string;
    createDateTime?: string;
    updateDateTime?: string;
    applicationId?: string;
    accountId?: string;
    accountNumber?: string;
    businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
}[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>> & {
    handlers: Record<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER | import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS | import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, (state: T_EngagementReducerState, action: import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
        engagementType?: "BUSINESS_INDIVIDUAL";
        smeId?: string;
        organizationNumber?: string;
        companyName?: string;
        createDateTime?: string;
        updateDateTime?: string;
        applicationId?: string;
        accountId?: string;
        accountNumber?: string;
        businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
    }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>) => T_EngagementReducerState>;
    handleAction: <TActionCreator extends (...args: any[]) => import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError>, THandledAction extends ReturnType<TActionCreator>, TOutputAction extends Exclude<import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER>, THandledAction> | Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError>, THandledAction>>(singleOrMultipleCreatorsAndTypes: TActionCreator | TActionCreator[], reducer: (state: T_EngagementReducerState, action: THandledAction) => T_EngagementReducerState) => [TOutputAction] extends [import("typesafe-actions").Action] ? import("typesafe-actions").Reducer<T_EngagementReducerState, import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
        engagementType?: "BUSINESS_INDIVIDUAL";
        smeId?: string;
        organizationNumber?: string;
        companyName?: string;
        createDateTime?: string;
        updateDateTime?: string;
        applicationId?: string;
        accountId?: string;
        accountNumber?: string;
        businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
    }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>> & {
        handlers: Record<(Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config>, TOutputAction> | Exclude<import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER>, TOutputAction> | Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
            engagementType?: "BUSINESS_INDIVIDUAL";
            smeId?: string;
            organizationNumber?: string;
            companyName?: string;
            createDateTime?: string;
            updateDateTime?: string;
            applicationId?: string;
            accountId?: string;
            accountNumber?: string;
            businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
        }[]>, TOutputAction> | Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError>, TOutputAction> | Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>, TOutputAction>)["type"], (state: T_EngagementReducerState, action: import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
            engagementType?: "BUSINESS_INDIVIDUAL";
            smeId?: string;
            organizationNumber?: string;
            companyName?: string;
            createDateTime?: string;
            updateDateTime?: string;
            applicationId?: string;
            accountId?: string;
            accountNumber?: string;
            businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
        }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>) => T_EngagementReducerState>;
        handleAction: <TActionCreator_1 extends (...args: any[]) => TOutputAction, THandledAction_1 extends ReturnType<TActionCreator_1>, TOutputAction_1 extends Exclude<TOutputAction, THandledAction_1>>(singleOrMultipleCreatorsAndTypes: TActionCreator_1 | TActionCreator_1[], reducer: (state: T_EngagementReducerState, action: THandledAction_1) => T_EngagementReducerState) => [TOutputAction_1] extends [import("typesafe-actions").Action] ? import("typesafe-actions").Reducer<T_EngagementReducerState, import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
            engagementType?: "BUSINESS_INDIVIDUAL";
            smeId?: string;
            organizationNumber?: string;
            companyName?: string;
            createDateTime?: string;
            updateDateTime?: string;
            applicationId?: string;
            accountId?: string;
            accountNumber?: string;
            businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
        }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>> & {
            handlers: Record<(Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config>, TOutputAction_1> | Exclude<import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER>, TOutputAction_1> | Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                engagementType?: "BUSINESS_INDIVIDUAL";
                smeId?: string;
                organizationNumber?: string;
                companyName?: string;
                createDateTime?: string;
                updateDateTime?: string;
                applicationId?: string;
                accountId?: string;
                accountNumber?: string;
                businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
            }[]>, TOutputAction_1> | Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError>, TOutputAction_1> | Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>, TOutputAction_1>)["type"], (state: T_EngagementReducerState, action: import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                engagementType?: "BUSINESS_INDIVIDUAL";
                smeId?: string;
                organizationNumber?: string;
                companyName?: string;
                createDateTime?: string;
                updateDateTime?: string;
                applicationId?: string;
                accountId?: string;
                accountNumber?: string;
                businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
            }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>) => T_EngagementReducerState>;
            handleAction: <TActionCreator_2 extends (...args: any[]) => TOutputAction_1, THandledAction_2 extends ReturnType<TActionCreator_2>, TOutputAction_2 extends Exclude<TOutputAction_1, THandledAction_2>>(singleOrMultipleCreatorsAndTypes: TActionCreator_2 | TActionCreator_2[], reducer: (state: T_EngagementReducerState, action: THandledAction_2) => T_EngagementReducerState) => [TOutputAction_2] extends [import("typesafe-actions").Action] ? import("typesafe-actions").Reducer<T_EngagementReducerState, import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                engagementType?: "BUSINESS_INDIVIDUAL";
                smeId?: string;
                organizationNumber?: string;
                companyName?: string;
                createDateTime?: string;
                updateDateTime?: string;
                applicationId?: string;
                accountId?: string;
                accountNumber?: string;
                businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
            }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>> & {
                handlers: Record<(Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config>, TOutputAction_2> | Exclude<import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER>, TOutputAction_2> | Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                    engagementType?: "BUSINESS_INDIVIDUAL";
                    smeId?: string;
                    organizationNumber?: string;
                    companyName?: string;
                    createDateTime?: string;
                    updateDateTime?: string;
                    applicationId?: string;
                    accountId?: string;
                    accountNumber?: string;
                    businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                }[]>, TOutputAction_2> | Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError>, TOutputAction_2> | Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>, TOutputAction_2>)["type"], (state: T_EngagementReducerState, action: import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                    engagementType?: "BUSINESS_INDIVIDUAL";
                    smeId?: string;
                    organizationNumber?: string;
                    companyName?: string;
                    createDateTime?: string;
                    updateDateTime?: string;
                    applicationId?: string;
                    accountId?: string;
                    accountNumber?: string;
                    businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>) => T_EngagementReducerState>;
                handleAction: <TActionCreator_3 extends (...args: any[]) => TOutputAction_2, THandledAction_3 extends ReturnType<TActionCreator_3>, TOutputAction_3 extends Exclude<TOutputAction_2, THandledAction_3>>(singleOrMultipleCreatorsAndTypes: TActionCreator_3 | TActionCreator_3[], reducer: (state: T_EngagementReducerState, action: THandledAction_3) => T_EngagementReducerState) => [TOutputAction_3] extends [import("typesafe-actions").Action] ? import("typesafe-actions").Reducer<T_EngagementReducerState, import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                    engagementType?: "BUSINESS_INDIVIDUAL";
                    smeId?: string;
                    organizationNumber?: string;
                    companyName?: string;
                    createDateTime?: string;
                    updateDateTime?: string;
                    applicationId?: string;
                    accountId?: string;
                    accountNumber?: string;
                    businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>> & {
                    handlers: Record<(Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config>, TOutputAction_3> | Exclude<import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER>, TOutputAction_3> | Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                        engagementType?: "BUSINESS_INDIVIDUAL";
                        smeId?: string;
                        organizationNumber?: string;
                        companyName?: string;
                        createDateTime?: string;
                        updateDateTime?: string;
                        applicationId?: string;
                        accountId?: string;
                        accountNumber?: string;
                        businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                    }[]>, TOutputAction_3> | Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError>, TOutputAction_3> | Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>, TOutputAction_3>)["type"], (state: T_EngagementReducerState, action: import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                        engagementType?: "BUSINESS_INDIVIDUAL";
                        smeId?: string;
                        organizationNumber?: string;
                        companyName?: string;
                        createDateTime?: string;
                        updateDateTime?: string;
                        applicationId?: string;
                        accountId?: string;
                        accountNumber?: string;
                        businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                    }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>) => T_EngagementReducerState>;
                    handleAction: <TActionCreator_4 extends (...args: any[]) => TOutputAction_3, THandledAction_4 extends ReturnType<TActionCreator_4>, TOutputAction_4 extends Exclude<TOutputAction_3, THandledAction_4>>(singleOrMultipleCreatorsAndTypes: TActionCreator_4 | TActionCreator_4[], reducer: (state: T_EngagementReducerState, action: THandledAction_4) => T_EngagementReducerState) => [TOutputAction_4] extends [import("typesafe-actions").Action] ? import("typesafe-actions").Reducer<T_EngagementReducerState, import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                        engagementType?: "BUSINESS_INDIVIDUAL";
                        smeId?: string;
                        organizationNumber?: string;
                        companyName?: string;
                        createDateTime?: string;
                        updateDateTime?: string;
                        applicationId?: string;
                        accountId?: string;
                        accountNumber?: string;
                        businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                    }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>> & {
                        handlers: Record<(Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config>, TOutputAction_4> | Exclude<import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER>, TOutputAction_4> | Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                            engagementType?: "BUSINESS_INDIVIDUAL";
                            smeId?: string;
                            organizationNumber?: string;
                            companyName?: string;
                            createDateTime?: string;
                            updateDateTime?: string;
                            applicationId?: string;
                            accountId?: string;
                            accountNumber?: string;
                            businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                        }[]>, TOutputAction_4> | Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError>, TOutputAction_4> | Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>, TOutputAction_4>)["type"], (state: T_EngagementReducerState, action: import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                            engagementType?: "BUSINESS_INDIVIDUAL";
                            smeId?: string;
                            organizationNumber?: string;
                            companyName?: string;
                            createDateTime?: string;
                            updateDateTime?: string;
                            applicationId?: string;
                            accountId?: string;
                            accountNumber?: string;
                            businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                        }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>) => T_EngagementReducerState>;
                        handleAction: <TActionCreator_5 extends (...args: any[]) => TOutputAction_4, THandledAction_5 extends ReturnType<TActionCreator_5>, TOutputAction_5 extends Exclude<TOutputAction_4, THandledAction_5>>(singleOrMultipleCreatorsAndTypes: TActionCreator_5 | TActionCreator_5[], reducer: (state: T_EngagementReducerState, action: THandledAction_5) => T_EngagementReducerState) => [TOutputAction_5] extends [import("typesafe-actions").Action] ? import("typesafe-actions").Reducer<T_EngagementReducerState, import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                            engagementType?: "BUSINESS_INDIVIDUAL";
                            smeId?: string;
                            organizationNumber?: string;
                            companyName?: string;
                            createDateTime?: string;
                            updateDateTime?: string;
                            applicationId?: string;
                            accountId?: string;
                            accountNumber?: string;
                            businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                        }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>> & {
                            handlers: Record<(Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config>, TOutputAction_5> | Exclude<import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER>, TOutputAction_5> | Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                                engagementType?: "BUSINESS_INDIVIDUAL";
                                smeId?: string;
                                organizationNumber?: string;
                                companyName?: string;
                                createDateTime?: string;
                                updateDateTime?: string;
                                applicationId?: string;
                                accountId?: string;
                                accountNumber?: string;
                                businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                            }[]>, TOutputAction_5> | Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError>, TOutputAction_5> | Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>, TOutputAction_5>)["type"], (state: T_EngagementReducerState, action: import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                                engagementType?: "BUSINESS_INDIVIDUAL";
                                smeId?: string;
                                organizationNumber?: string;
                                companyName?: string;
                                createDateTime?: string;
                                updateDateTime?: string;
                                applicationId?: string;
                                accountId?: string;
                                accountNumber?: string;
                                businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                            }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>) => T_EngagementReducerState>;
                            handleAction: <TActionCreator_6 extends (...args: any[]) => TOutputAction_5, THandledAction_6 extends ReturnType<TActionCreator_6>, TOutputAction_6 extends Exclude<TOutputAction_5, THandledAction_6>>(singleOrMultipleCreatorsAndTypes: TActionCreator_6 | TActionCreator_6[], reducer: (state: T_EngagementReducerState, action: THandledAction_6) => T_EngagementReducerState) => [TOutputAction_6] extends [import("typesafe-actions").Action] ? import("typesafe-actions").Reducer<T_EngagementReducerState, import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                                engagementType?: "BUSINESS_INDIVIDUAL";
                                smeId?: string;
                                organizationNumber?: string;
                                companyName?: string;
                                createDateTime?: string;
                                updateDateTime?: string;
                                applicationId?: string;
                                accountId?: string;
                                accountNumber?: string;
                                businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                            }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>> & {
                                handlers: Record<(Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config>, TOutputAction_6> | Exclude<import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER>, TOutputAction_6> | Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                                    engagementType?: "BUSINESS_INDIVIDUAL";
                                    smeId?: string;
                                    organizationNumber?: string;
                                    companyName?: string;
                                    createDateTime?: string;
                                    updateDateTime?: string;
                                    applicationId?: string;
                                    accountId?: string;
                                    accountNumber?: string;
                                    businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                                }[]>, TOutputAction_6> | Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError>, TOutputAction_6> | Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>, TOutputAction_6>)["type"], (state: T_EngagementReducerState, action: import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                                    engagementType?: "BUSINESS_INDIVIDUAL";
                                    smeId?: string;
                                    organizationNumber?: string;
                                    companyName?: string;
                                    createDateTime?: string;
                                    updateDateTime?: string;
                                    applicationId?: string;
                                    accountId?: string;
                                    accountNumber?: string;
                                    businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                                }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>) => T_EngagementReducerState>;
                                handleAction: <TActionCreator_7 extends (...args: any[]) => TOutputAction_6, THandledAction_7 extends ReturnType<TActionCreator_7>, TOutputAction_7 extends Exclude<TOutputAction_6, THandledAction_7>>(singleOrMultipleCreatorsAndTypes: TActionCreator_7 | TActionCreator_7[], reducer: (state: T_EngagementReducerState, action: THandledAction_7) => T_EngagementReducerState) => [TOutputAction_7] extends [import("typesafe-actions").Action] ? import("typesafe-actions").Reducer<T_EngagementReducerState, import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                                    engagementType?: "BUSINESS_INDIVIDUAL";
                                    smeId?: string;
                                    organizationNumber?: string;
                                    companyName?: string;
                                    createDateTime?: string;
                                    updateDateTime?: string;
                                    applicationId?: string;
                                    accountId?: string;
                                    accountNumber?: string;
                                    businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                                }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>> & {
                                    handlers: Record<(Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config>, TOutputAction_7> | Exclude<import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER>, TOutputAction_7> | Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                                        engagementType?: "BUSINESS_INDIVIDUAL";
                                        smeId?: string;
                                        organizationNumber?: string;
                                        companyName?: string;
                                        createDateTime?: string;
                                        updateDateTime?: string;
                                        applicationId?: string;
                                        accountId?: string;
                                        accountNumber?: string;
                                        businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                                    }[]>, TOutputAction_7> | Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError>, TOutputAction_7> | Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>, TOutputAction_7>)["type"], (state: T_EngagementReducerState, action: import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                                        engagementType?: "BUSINESS_INDIVIDUAL";
                                        smeId?: string;
                                        organizationNumber?: string;
                                        companyName?: string;
                                        createDateTime?: string;
                                        updateDateTime?: string;
                                        applicationId?: string;
                                        accountId?: string;
                                        accountNumber?: string;
                                        businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                                    }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>) => T_EngagementReducerState>;
                                    handleAction: <TActionCreator_8 extends (...args: any[]) => TOutputAction_7, THandledAction_8 extends ReturnType<TActionCreator_8>, TOutputAction_8 extends Exclude<TOutputAction_7, THandledAction_8>>(singleOrMultipleCreatorsAndTypes: TActionCreator_8 | TActionCreator_8[], reducer: (state: T_EngagementReducerState, action: THandledAction_8) => T_EngagementReducerState) => [TOutputAction_8] extends [import("typesafe-actions").Action] ? import("typesafe-actions").Reducer<T_EngagementReducerState, import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                                        engagementType?: "BUSINESS_INDIVIDUAL";
                                        smeId?: string;
                                        organizationNumber?: string;
                                        companyName?: string;
                                        createDateTime?: string;
                                        updateDateTime?: string;
                                        applicationId?: string;
                                        accountId?: string;
                                        accountNumber?: string;
                                        businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                                    }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>> & {
                                        handlers: Record<(Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config>, TOutputAction_8> | Exclude<import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER>, TOutputAction_8> | Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                                            engagementType?: "BUSINESS_INDIVIDUAL";
                                            smeId?: string;
                                            organizationNumber?: string;
                                            companyName?: string;
                                            createDateTime?: string;
                                            updateDateTime?: string;
                                            applicationId?: string;
                                            accountId?: string;
                                            accountNumber?: string;
                                            businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                                        }[]>, TOutputAction_8> | Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError>, TOutputAction_8> | Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>, TOutputAction_8>)["type"], (state: T_EngagementReducerState, action: import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                                            engagementType?: "BUSINESS_INDIVIDUAL";
                                            smeId?: string;
                                            organizationNumber?: string;
                                            companyName?: string;
                                            createDateTime?: string;
                                            updateDateTime?: string;
                                            applicationId?: string;
                                            accountId?: string;
                                            accountNumber?: string;
                                            businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                                        }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>) => T_EngagementReducerState>;
                                        handleAction: <TActionCreator_9 extends (...args: any[]) => TOutputAction_8, THandledAction_9 extends ReturnType<TActionCreator_9>, TOutputAction_9 extends Exclude<TOutputAction_8, THandledAction_9>>(singleOrMultipleCreatorsAndTypes: TActionCreator_9 | TActionCreator_9[], reducer: (state: T_EngagementReducerState, action: THandledAction_9) => T_EngagementReducerState) => [TOutputAction_9] extends [import("typesafe-actions").Action] ? import("typesafe-actions").Reducer<T_EngagementReducerState, import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                                            engagementType?: "BUSINESS_INDIVIDUAL";
                                            smeId?: string;
                                            organizationNumber?: string;
                                            companyName?: string;
                                            createDateTime?: string;
                                            updateDateTime?: string;
                                            applicationId?: string;
                                            accountId?: string;
                                            accountNumber?: string;
                                            businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                                        }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>> & {
                                            handlers: Record<(Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config>, TOutputAction_9> | Exclude<import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER>, TOutputAction_9> | Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                                                engagementType?: "BUSINESS_INDIVIDUAL";
                                                smeId?: string;
                                                organizationNumber?: string;
                                                companyName?: string;
                                                createDateTime?: string;
                                                updateDateTime?: string;
                                                applicationId?: string;
                                                accountId?: string;
                                                accountNumber?: string;
                                                businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                                            }[]>, TOutputAction_9> | Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError>, TOutputAction_9> | Exclude<import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>, TOutputAction_9>)["type"], (state: T_EngagementReducerState, action: import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                                                engagementType?: "BUSINESS_INDIVIDUAL";
                                                smeId?: string;
                                                organizationNumber?: string;
                                                companyName?: string;
                                                createDateTime?: string;
                                                updateDateTime?: string;
                                                applicationId?: string;
                                                accountId?: string;
                                                accountNumber?: string;
                                                businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                                            }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>) => T_EngagementReducerState>;
                                            handleAction: <TActionCreator_10 extends (...args: any[]) => TOutputAction_9, THandledAction_10 extends ReturnType<TActionCreator_10>, TOutputAction_10 extends Exclude<TOutputAction_9, THandledAction_10>>(singleOrMultipleCreatorsAndTypes: TActionCreator_10 | TActionCreator_10[], reducer: (state: T_EngagementReducerState, action: THandledAction_10) => T_EngagementReducerState) => [TOutputAction_10] extends [import("typesafe-actions").Action] ? import("typesafe-actions").Reducer<T_EngagementReducerState, import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                                                engagementType?: "BUSINESS_INDIVIDUAL";
                                                smeId?: string;
                                                organizationNumber?: string;
                                                companyName?: string;
                                                createDateTime?: string;
                                                updateDateTime?: string;
                                                applicationId?: string;
                                                accountId?: string;
                                                accountNumber?: string;
                                                businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                                            }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>> & any : import("typesafe-actions").Reducer<T_EngagementReducerState, import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                                                engagementType?: "BUSINESS_INDIVIDUAL";
                                                smeId?: string;
                                                organizationNumber?: string;
                                                companyName?: string;
                                                createDateTime?: string;
                                                updateDateTime?: string;
                                                applicationId?: string;
                                                accountId?: string;
                                                accountNumber?: string;
                                                businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                                            }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>> & {
                                                handlers: Record<import("../types").E_EngagementActionConstants, (state: T_EngagementReducerState, action: import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                                                    engagementType?: "BUSINESS_INDIVIDUAL";
                                                    smeId?: string;
                                                    organizationNumber?: string;
                                                    companyName?: string;
                                                    createDateTime?: string;
                                                    updateDateTime?: string;
                                                    applicationId?: string;
                                                    accountId?: string;
                                                    accountNumber?: string;
                                                    businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                                                }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>) => T_EngagementReducerState>;
                                            };
                                        } : import("typesafe-actions").Reducer<T_EngagementReducerState, import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                                            engagementType?: "BUSINESS_INDIVIDUAL";
                                            smeId?: string;
                                            organizationNumber?: string;
                                            companyName?: string;
                                            createDateTime?: string;
                                            updateDateTime?: string;
                                            applicationId?: string;
                                            accountId?: string;
                                            accountNumber?: string;
                                            businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                                        }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>> & {
                                            handlers: Record<import("../types").E_EngagementActionConstants, (state: T_EngagementReducerState, action: import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                                                engagementType?: "BUSINESS_INDIVIDUAL";
                                                smeId?: string;
                                                organizationNumber?: string;
                                                companyName?: string;
                                                createDateTime?: string;
                                                updateDateTime?: string;
                                                applicationId?: string;
                                                accountId?: string;
                                                accountNumber?: string;
                                                businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                                            }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>) => T_EngagementReducerState>;
                                        };
                                    } : import("typesafe-actions").Reducer<T_EngagementReducerState, import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                                        engagementType?: "BUSINESS_INDIVIDUAL";
                                        smeId?: string;
                                        organizationNumber?: string;
                                        companyName?: string;
                                        createDateTime?: string;
                                        updateDateTime?: string;
                                        applicationId?: string;
                                        accountId?: string;
                                        accountNumber?: string;
                                        businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                                    }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>> & {
                                        handlers: Record<import("../types").E_EngagementActionConstants, (state: T_EngagementReducerState, action: import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                                            engagementType?: "BUSINESS_INDIVIDUAL";
                                            smeId?: string;
                                            organizationNumber?: string;
                                            companyName?: string;
                                            createDateTime?: string;
                                            updateDateTime?: string;
                                            applicationId?: string;
                                            accountId?: string;
                                            accountNumber?: string;
                                            businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                                        }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>) => T_EngagementReducerState>;
                                    };
                                } : import("typesafe-actions").Reducer<T_EngagementReducerState, import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                                    engagementType?: "BUSINESS_INDIVIDUAL";
                                    smeId?: string;
                                    organizationNumber?: string;
                                    companyName?: string;
                                    createDateTime?: string;
                                    updateDateTime?: string;
                                    applicationId?: string;
                                    accountId?: string;
                                    accountNumber?: string;
                                    businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                                }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>> & {
                                    handlers: Record<import("../types").E_EngagementActionConstants, (state: T_EngagementReducerState, action: import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                                        engagementType?: "BUSINESS_INDIVIDUAL";
                                        smeId?: string;
                                        organizationNumber?: string;
                                        companyName?: string;
                                        createDateTime?: string;
                                        updateDateTime?: string;
                                        applicationId?: string;
                                        accountId?: string;
                                        accountNumber?: string;
                                        businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                                    }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>) => T_EngagementReducerState>;
                                };
                            } : import("typesafe-actions").Reducer<T_EngagementReducerState, import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                                engagementType?: "BUSINESS_INDIVIDUAL";
                                smeId?: string;
                                organizationNumber?: string;
                                companyName?: string;
                                createDateTime?: string;
                                updateDateTime?: string;
                                applicationId?: string;
                                accountId?: string;
                                accountNumber?: string;
                                businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                            }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>> & {
                                handlers: Record<import("../types").E_EngagementActionConstants, (state: T_EngagementReducerState, action: import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                                    engagementType?: "BUSINESS_INDIVIDUAL";
                                    smeId?: string;
                                    organizationNumber?: string;
                                    companyName?: string;
                                    createDateTime?: string;
                                    updateDateTime?: string;
                                    applicationId?: string;
                                    accountId?: string;
                                    accountNumber?: string;
                                    businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                                }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>) => T_EngagementReducerState>;
                            };
                        } : import("typesafe-actions").Reducer<T_EngagementReducerState, import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                            engagementType?: "BUSINESS_INDIVIDUAL";
                            smeId?: string;
                            organizationNumber?: string;
                            companyName?: string;
                            createDateTime?: string;
                            updateDateTime?: string;
                            applicationId?: string;
                            accountId?: string;
                            accountNumber?: string;
                            businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                        }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>> & {
                            handlers: Record<import("../types").E_EngagementActionConstants, (state: T_EngagementReducerState, action: import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                                engagementType?: "BUSINESS_INDIVIDUAL";
                                smeId?: string;
                                organizationNumber?: string;
                                companyName?: string;
                                createDateTime?: string;
                                updateDateTime?: string;
                                applicationId?: string;
                                accountId?: string;
                                accountNumber?: string;
                                businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                            }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>) => T_EngagementReducerState>;
                        };
                    } : import("typesafe-actions").Reducer<T_EngagementReducerState, import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                        engagementType?: "BUSINESS_INDIVIDUAL";
                        smeId?: string;
                        organizationNumber?: string;
                        companyName?: string;
                        createDateTime?: string;
                        updateDateTime?: string;
                        applicationId?: string;
                        accountId?: string;
                        accountNumber?: string;
                        businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                    }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>> & {
                        handlers: Record<import("../types").E_EngagementActionConstants, (state: T_EngagementReducerState, action: import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                            engagementType?: "BUSINESS_INDIVIDUAL";
                            smeId?: string;
                            organizationNumber?: string;
                            companyName?: string;
                            createDateTime?: string;
                            updateDateTime?: string;
                            applicationId?: string;
                            accountId?: string;
                            accountNumber?: string;
                            businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                        }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>) => T_EngagementReducerState>;
                    };
                } : import("typesafe-actions").Reducer<T_EngagementReducerState, import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                    engagementType?: "BUSINESS_INDIVIDUAL";
                    smeId?: string;
                    organizationNumber?: string;
                    companyName?: string;
                    createDateTime?: string;
                    updateDateTime?: string;
                    applicationId?: string;
                    accountId?: string;
                    accountNumber?: string;
                    businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>> & {
                    handlers: Record<import("../types").E_EngagementActionConstants, (state: T_EngagementReducerState, action: import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                        engagementType?: "BUSINESS_INDIVIDUAL";
                        smeId?: string;
                        organizationNumber?: string;
                        companyName?: string;
                        createDateTime?: string;
                        updateDateTime?: string;
                        applicationId?: string;
                        accountId?: string;
                        accountNumber?: string;
                        businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                    }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>) => T_EngagementReducerState>;
                };
            } : import("typesafe-actions").Reducer<T_EngagementReducerState, import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                engagementType?: "BUSINESS_INDIVIDUAL";
                smeId?: string;
                organizationNumber?: string;
                companyName?: string;
                createDateTime?: string;
                updateDateTime?: string;
                applicationId?: string;
                accountId?: string;
                accountNumber?: string;
                businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
            }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>> & {
                handlers: Record<import("../types").E_EngagementActionConstants, (state: T_EngagementReducerState, action: import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                    engagementType?: "BUSINESS_INDIVIDUAL";
                    smeId?: string;
                    organizationNumber?: string;
                    companyName?: string;
                    createDateTime?: string;
                    updateDateTime?: string;
                    applicationId?: string;
                    accountId?: string;
                    accountNumber?: string;
                    businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
                }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>) => T_EngagementReducerState>;
            };
        } : import("typesafe-actions").Reducer<T_EngagementReducerState, import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
            engagementType?: "BUSINESS_INDIVIDUAL";
            smeId?: string;
            organizationNumber?: string;
            companyName?: string;
            createDateTime?: string;
            updateDateTime?: string;
            applicationId?: string;
            accountId?: string;
            accountNumber?: string;
            businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
        }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>> & {
            handlers: Record<import("../types").E_EngagementActionConstants, (state: T_EngagementReducerState, action: import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
                engagementType?: "BUSINESS_INDIVIDUAL";
                smeId?: string;
                organizationNumber?: string;
                companyName?: string;
                createDateTime?: string;
                updateDateTime?: string;
                applicationId?: string;
                accountId?: string;
                accountNumber?: string;
                businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
            }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>) => T_EngagementReducerState>;
        };
    } : import("typesafe-actions").Reducer<T_EngagementReducerState, import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
        engagementType?: "BUSINESS_INDIVIDUAL";
        smeId?: string;
        organizationNumber?: string;
        companyName?: string;
        createDateTime?: string;
        updateDateTime?: string;
        applicationId?: string;
        accountId?: string;
        accountNumber?: string;
        businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
    }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>> & {
        handlers: Record<import("../types").E_EngagementActionConstants, (state: T_EngagementReducerState, action: import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_INITIALIZEER, import("../types").T_Config> | import("typesafe-actions").EmptyAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_TRIGGER> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_SUCCESS, {
            engagementType?: "BUSINESS_INDIVIDUAL";
            smeId?: string;
            organizationNumber?: string;
            companyName?: string;
            createDateTime?: string;
            updateDateTime?: string;
            applicationId?: string;
            accountId?: string;
            accountNumber?: string;
            businessIndividual?: import("packages/api-definitions/src").components["schemas"]["EngagementBusinessIndividual"];
        }[]> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.GET_ENGAGEMENT_ERROR, import("../types").T_ResponseError> | import("typesafe-actions").PayloadAction<import("../types").E_EngagementActionConstants.SAVE_ACTIVE_SMEID_SUCCESS, string>) => T_EngagementReducerState>;
    };
};
