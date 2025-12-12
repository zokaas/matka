import React, { useMemo } from "react";
import { HiddenField } from "@ui/input";
import { T_HiddenInputProps } from "./types";

export const HiddenInput: React.FC<T_HiddenInputProps> = (props) => {
  const { fieldName, value, onChange, onBlur, sniCode } = props;
  
  const computedValue = useMemo(() => {
    const key = fieldName.toLowerCase();
    

    if (key.includes("distanceagreement")) return true;
    if (key.includes("snicode")) return getSNICode(sniCode);
    
    return value;
  }, [fieldName, value, sniCode]);

  return (
    <HiddenField
      fieldName={fieldName}
      value={computedValue}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};