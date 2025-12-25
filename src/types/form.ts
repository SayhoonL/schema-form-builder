export type FieldType = "text" | "email" | "select" | "checkbox";

export type Field = {
  id: string;
  type: "text";
  label: string;
  required: boolean;
};

export interface FormSchema {
  fields: Field[];
}