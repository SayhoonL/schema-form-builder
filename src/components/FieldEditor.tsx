import type { Field } from "../types/form";

type Props = {
  field: Field;
  onUpdate: (field: Field) => void;
};

function FieldEditor({ field, onUpdate }: Props) {
  return (
    <div style={{ border: "1px solid #ccc", padding: 16 }}>
      <h3>Edit Field</h3>

      <div style={{ marginBottom: 12 }}>
        <label>
          Label:
          <br />
          <input
            type="text"
            value={field.label}
            onChange={(e) =>
              onUpdate({ ...field, label: e.target.value })
            }
          />
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e) =>
              onUpdate({ ...field, required: e.target.checked })
            }
          />
          Required
        </label>
      </div>
    </div>
  );
}

export default FieldEditor;
