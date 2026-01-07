import type { Field } from "../types/form";

type Props = {
  fields: Field[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAddField: () => void;
};

export default function FieldList({ fields, selectedId, onSelect, onAddField }: Props) {
  return (
    <aside className="sidebar">
      <h3>Form Fields</h3>

      {/* Field Items */}
      {fields.map((field) => (
        <div
          key={field.id}
          className={`field-item ${selectedId === field.id ? "selected" : ""}`}
          onClick={() => onSelect(field.id)}
        >
          <strong>{field.label || "(No Label)"}</strong>
          <br />
          <span>{field.type}</span>
        </div>
      ))}

      {/* Add Button */}
      <div className="add-section">
        <button onClick={onAddField}>+ Add Field</button>
      </div>
    </aside>
  );
}
