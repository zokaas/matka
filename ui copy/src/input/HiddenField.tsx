import React, { useEffect, useMemo } from "react";
import { T_HiddenFieldProps } from "./types";

export const HiddenField: React.FC<T_HiddenFieldProps> = ({ fieldName, value, onChange, onBlur }) => {

  const serialized = useMemo(() => {
    if (value === undefined || value === null) return "";
    if (typeof value === "object") return JSON.stringify(value);
    return JSON.stringify(value);
  }, [value]);

  useEffect(() => {
    onChange(value);
    onBlur();
  }, []);

  return <input type="hidden" name={fieldName} value={serialized} />;
};
