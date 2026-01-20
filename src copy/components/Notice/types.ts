import { SystemStyleObject } from "@styled-system/css";
import { ReactNode } from "react";

export type NoticeProps = {
    notice: string;
    styleConfig: {
        noticeContainer: SystemStyleObject;
        notice: SystemStyleObject;
    };
    children?: ReactNode;
};
