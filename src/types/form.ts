export type FieldType = "text" | "email" | "number";

export type Field = {
  id: string;
  type: FieldType;
  label: string;
  placeholder: string;
  required: boolean;
};