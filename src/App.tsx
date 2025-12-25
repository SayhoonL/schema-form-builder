import { useState } from "react";
import "./styles.css";

/* -------------------- DnD imports -------------------- */
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

/* -------------------- Types -------------------- */
type Field = {
  id: string;
  label: string;
  placeholder: string;
  required: boolean;
};

/* -------------------- Sortable Sidebar Item -------------------- */
function SortableFieldItem({
  id,
  label,
  selected,
  onClick,
}: {
  id: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={
        "field-item" + (selected ? " selected" : "")
      }
      onClick={onClick}
    >
      <strong>{label || "New Field"}</strong>
    </div>
  );
}

/* -------------------- App -------------------- */
function App() {
  /* Mode */
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  /* Schema */
  const [fields, setFields] = useState<Field[]>([
    {
      id: crypto.randomUUID(),
      label: "Full Name",
      placeholder: "Enter your full name",
      required: true,
    },
  ]);

  /* Selection */
  const [selectedId, setSelectedId] = useState<string | null>(
    fields[0].id
  );

  /* Published schema (confirmation view) */
  const [publishedForm, setPublishedForm] =
    useState<any | null>(null);

  const selectedField = fields.find((f) => f.id === selectedId);

  /* -------------------- DnD setup -------------------- */
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

  /* -------------------- Handlers -------------------- */

  const addTextField = () => {
    const newField: Field = {
      id: crypto.randomUUID(),
      label: "",
      placeholder: "",
      required: false,
    };
    setFields((prev) => [...prev, newField]);
    setSelectedId(newField.id);
  };

  const updateField = (key: keyof Field, value: any) => {
    setFields((prev) =>
      prev.map((f) =>
        f.id === selectedId ? { ...f, [key]: value } : f
      )
    );
  };

  const handlePublish = () => {
    const schema = {
      formName: "My Form",
      questions: fields.map((field) => ({
        label: field.label || "Untitled Field",
        placeholder: field.placeholder,
        required: field.required,
      })),
    };

    setPublishedForm(schema);
  };

  /* -------------------- UI -------------------- */
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
                  selected={field.id === selectedId}
                  onClick={() => setSelectedId(field.id)}
                />
              ))}
            </SortableContext>
          </DndContext>

          <div className="add-section">
            <h4>Add Field</h4>
            <button onClick={addTextField}>+ Text</button>
          </div>
        </aside>

        {/* Main Panel */}
        <main className="main">
          {/* EDIT MODE */}
          {mode === "edit" && selectedField && (
            <div className="card">
              <h2>Field Configuration</h2>

              <label>Label</label>
              <input
                placeholder="New Field"
                value={selectedField.label}
                onChange={(e) =>
                  updateField("label", e.target.value)
                }
              />

              <label>Placeholder</label>
              <input
                placeholder="Placeholder text"
                value={selectedField.placeholder}
                onChange={(e) =>
                  updateField(
                    "placeholder",
                    e.target.value
                  )
                }
              />

              <div className="toggle-row">
                <span>Required Field</span>
                <input
                  type="checkbox"
                  checked={selectedField.required}
                  onChange={(e) =>
                    updateField("required", e.target.checked)
                  }
                />
              </div>
            </div>
          )}

          {/* PREVIEW MODE */}
          {mode === "preview" && (
            <div className="card">
              {!publishedForm ? (
                <>
                  <h2>Preview</h2>

                  {fields.map((field) => (
                    <div
                      key={field.id}
                      className="preview-field"
                    >
                      <label>
                        {field.label || "Untitled Field"}
                        {field.required && " *"}
                      </label>
                      <input
                        placeholder={field.placeholder}
                        disabled
                      />
                    </div>
                  ))}

                  <button
                    className="submit-btn"
                    onClick={handlePublish}
                  >
                    Publish Form
                  </button>
                </>
              ) : (
                <>
                  <h2> Form Published</h2>
                  <p>This is the published form schema:</p>

                  <pre
                    style={{
                      background: "#f3f4f6",
                      padding: "12px",
                      borderRadius: "6px",
                      marginTop: "12px",
                    }}
                  >
                    {JSON.stringify(
                      publishedForm,
                      null,
                      2
                    )}
                  </pre>
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
