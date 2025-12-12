import React, { useMemo } from "react";
import { HiddenField } from "@ui/input";
import { T_HiddenInputProps } from "./types";

export const HiddenInput: React.FC<T_HiddenInputProps> = (props) => {
  const { fieldName, value, onChange, onBlur } = props;
  const computedValue = useMemo(() => {
    const key = fieldName.toLowerCase();
    //predefined special cases
    if (key.includes("distanceagreement")) return true;
    if (key.includes("snicode")) return getSNICode();
    return value;
  }, [fieldName, value]);

  return (
    <HiddenField
      fieldName={fieldName}
      value={computedValue}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};
