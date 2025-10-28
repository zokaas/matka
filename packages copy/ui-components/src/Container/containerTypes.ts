import React from "react";

export type T_Container = {
    children: React.ReactNode;
    className?: string;
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
    padding?: boolean;
};
