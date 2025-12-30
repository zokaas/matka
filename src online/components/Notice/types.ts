import { SystemStyleObject } from "@styled-system/css";

export type NoticeProps = {
    notice: string;
    styleConfig: {
        noticeContainer: SystemStyleObject;
        notice: SystemStyleObject;
    };
};
