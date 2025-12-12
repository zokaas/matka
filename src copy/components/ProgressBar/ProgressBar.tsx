import { css } from "@styled-system/css";

import { Container, Font, Icon } from "@opr-finance/styled-components";
import { componentStyles } from "@opr-finance/themes/sweden-foretagslan-application";
import { applicationSteps, applicationStepsTitle } from "../../types";

import { T_ProgressBarProps } from "./types";
const { progressBarStyles } = componentStyles;

const steps: string[] = Object.keys(applicationSteps);

export const ProgressBar = ({ title, currentStep }: T_ProgressBarProps) => {
    return (
        <Container styles={progressBarStyles.statusContainer}>
            <Font styles={progressBarStyles.progressBarHeading}>{title}</Font>
            <Container styles={progressBarStyles.statusBarContainer}>
                <Container styles={progressBarStyles.statusBarBox}>
                    <Container styles={progressBarStyles.statusBar}>
                        <Container
                            styles={progressBarStyles.statusBarFilled(currentStep)}></Container>
                    </Container>
                    {steps.map((step, index) => {
                        const stepKey = step as keyof typeof applicationSteps;
                        if (applicationSteps[stepKey] <= currentStep) {
                            return (
                                <Container
                                    key={`step-${index + 1}`}
                                    styles={progressBarStyles.statusCircleFilled(
                                        applicationSteps[stepKey]
                                    )}>
                                    <Icon
                                        style={css(progressBarStyles.checkIcon)()}
                                        size="1x"
                                        icon={["fas", "check"]}
                                    />
                                </Container>
                            );
                        } else {
                            return (
                                <Container
                                    key={`step-${index + 1}`}
                                    styles={progressBarStyles.statusCircleEmpty(
                                        applicationSteps[stepKey]
                                    )}
                                />
                            );
                        }
                    })}
                </Container>
            </Container>

            <Container styles={progressBarStyles.statusTitleLine}>
                {steps.map((step, index) => {
                    const stepKeyTitle = step as keyof typeof applicationStepsTitle;
                    return (
                        <Container
                            key={`step-${index + 1}`}
                            styles={progressBarStyles.statusTitleContainer}>
                            <Font styles={progressBarStyles.statusTitle}>
                                {applicationStepsTitle[stepKeyTitle]}
                            </Font>
                        </Container>
                    );
                })}
            </Container>
        </Container>
    );
};
