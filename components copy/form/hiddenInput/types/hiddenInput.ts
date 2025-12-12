export type T_HiddenInputProps = {
  fieldName: string;
  value?: unknown;
  onChange: (val: unknown) => void;
  onBlur: () => void;
  sniCode?: string;
};