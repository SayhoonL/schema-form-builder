import { useState } from "react";
import "./styles.css";

/* DnD */
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

/* Components */
import SortableFieldItem from "./components/SortableFieldItem";
import FormPreview from "./components/FormPreview";

/* Types */
type FieldType = "text" | "email" | "number";

type Field = {
  id: string;
  type: FieldType;
  label: string;
  placeholder: string;
  required: boolean;
};

function App() {
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  const [fields, setFields] = useState<Field[]>([
    {
      id: crypto.randomUUID(),
      type: "text",
      label: "Full Name",
      placeholder: "Enter your full name",
      required: true,
    },
  ]);

  const [selectedId, setSelectedId] = useState<string | null>(
    fields[0].id
  );

  const [publishedForm, setPublishedForm] =
    useState<any | null>(null);

  const selectedField = fields.find((f) => f.id === selectedId);

  /* DnD setup */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setFields((items) => {
      const oldIndex = items.findIndex(
        (i) => i.id === active.id
      );
      const newIndex = items.findIndex(
        (i) => i.id === over.id
      );
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  /* Handlers */
  const addField = () => {
    const newField: Field = {
      id: crypto.randomUUID(),
      type: "text",
      label: "",
      placeholder: "",
      required: false,
    };
    setFields((prev) => [...prev, newField]);
    setSelectedId(newField.id);
  };

  const updateField = (
    key: keyof Field,
    value: any
  ) => {
    setFields((prev) =>
      prev.map((f) =>
        f.id === selectedId ? { ...f, [key]: value } : f
      )
    );
  };

  const deleteField = () => {
    if (!selectedId || fields.length === 1) return;

    const index = fields.findIndex(
      (f) => f.id === selectedId
    );

    const updated = fields.filter(
      (f) => f.id !== selectedId
    );

    setFields(updated);
    setSelectedId(
      updated[Math.max(index - 1, 0)].id
    );
  };

  const handlePublish = () => {
    if (fields.some((f) => !f.label.trim())) {
      alert("All fields must have a label.");
      return;
    }

    setPublishedForm({
      formName: "My Form",
      questions: fields,
    });
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>Form Builder</h1>
        <div className="mode-toggle">
          <button
            className={mode === "edit" ? "active" : ""}
            onClick={() => {
              setMode("edit");
              setPublishedForm(null);
            }}
          >
            Edit
          </button>
          <button
            className={mode === "preview" ? "active" : ""}
            onClick={() => {
              setMode("preview");
              setPublishedForm(null);
            }}
          >
            Preview
          </button>
        </div>
      </header>

      <div className="layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <h3>Form Fields</h3>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={fields.map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field) => (
                <SortableFieldItem
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  type={field.type}
                  selected={field.id === selectedId}
                  onClick={() =>
                    setSelectedId(field.id)
                  }
                />
              ))}
            </SortableContext>
          </DndContext>

          <div className="add-section">
            <button onClick={addField}>
              + Add Field
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="main">
          {mode === "edit" && selectedField && (
            <div className="card">
              <h2>Field Configuration</h2>

              <label>Field Type</label>
              <select
                value={selectedField.type}
                onChange={(e) =>
                  updateField(
                    "type",
                    e.target.value
                  )
                }
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="number">Number</option>
              </select>

              <label>Label</label>
              <input
                value={selectedField.label}
                onChange={(e) =>
                  updateField(
                    "label",
                    e.target.value
                  )
                }
              />

              <label>Placeholder</label>
              <input
                value={selectedField.placeholder}
                onChange={(e) =>
                  updateField(
                    "placeholder",
                    e.target.value
                  )
                }
              />

              <div className="toggle-row">
                <span>Required</span>
                <input
                  type="checkbox"
                  checked={selectedField.required}
                  onChange={(e) =>
                    updateField(
                      "required",
                      e.target.checked
                    )
                  }
                />
              </div>

              <button
                className="submit-btn"
                style={{ background: "#ef4444" }}
                onClick={() => {
                  if (
                    window.confirm(
                      "Delete this field?"
                    )
                  ) {
                    deleteField();
                  }
                }}
              >
                Delete Field
              </button>
            </div>
          )}

          {mode === "preview" && (
            <div className="card">
              <FormPreview
                fields={fields}
                onPublish={handlePublish}
                publishedForm={publishedForm}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
