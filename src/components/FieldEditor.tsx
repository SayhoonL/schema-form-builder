import type { Field, FieldType } from "../types/form";

interface Props {
  field: Field;
  updateField: (key: keyof Field, value: any) => void;
  deleteField: () => void;
}

export default function FieldEditor({ field, updateField, deleteField }: Props) {
  return (
    <div className="card">
      <h2>Field Configuration</h2>

      {/* Field Type */}
      <label>Field Type</label>
      <select
        value={field.type}
        onChange={(e) => updateField("type", e.target.value as FieldType)}
      >
        <option value="text">Text</option>
        <option value="email">Email</option>
        <option value="number">Number</option>
      </select>

      {/* Label */}
      <label>Label</label>
      <input
        value={field.label}
        onChange={(e) => updateField("label", e.target.value)}
      />

      {/* Placeholder */}
      <label>Placeholder</label>
      <input
        value={field.placeholder}
        onChange={(e) => updateField("placeholder", e.target.value)}
      />

      {/* Required */}
      <div className="toggle-row">
        <span>Required</span>
        <input
          type="checkbox"
          checked={field.required}
          onChange={(e) => updateField("required", e.target.checked)}
        />
      </div>

      {/* Delete */}
      <button
        className="submit-btn"
        style={{ background: "#ef4444", marginTop: "16px" }}
        onClick={() => {
          if (window.confirm("Delete this field?")) deleteField();
        }}
      >
        Delete Field
      </button>
    </div>
  );
}
