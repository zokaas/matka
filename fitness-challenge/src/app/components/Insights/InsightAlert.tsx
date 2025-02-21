import React from "react";

interface Props {
  title: string;
  description: React.ReactNode;
}

const InsightAlert = ({ title, description }: Props) => (
  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
    <h4 className="font-medium text-purple-800">{title}</h4>
    <p className="text-sm text-purple-600 mt-1">{description}</p>
  </div>
);

export default InsightAlert;
