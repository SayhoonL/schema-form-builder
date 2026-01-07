import type { Field } from "../types/form";

type Props = {
  fields: Field[];
};

export default function FormPreview({ fields }: Props) {
  return (
    <>
      {fields.map((f) => (
        <div key={f.id} className="preview-field">
          <label>
            {f.label}
            {f.required && "*"}
          </label>
          <input placeholder={f.placeholder} />
        </div>
      ))}
    </>
  );
}
