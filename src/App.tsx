import { useState } from "react";
import "./styles.css";

/* Types */
type Field = {
  id: string;
  type: "text" | "email" | "number";
  label: string;
  placeholder: string;
  required: boolean;
};

function App() {
  const [mode, setMode] = useState<
    "edit" | "preview" | "schema" | "import" | "take" | "results"
  >("edit");

  const [fields, setFields] = useState<Field[]>([
    {
      id: crypto.randomUUID(),
      type: "text",
      label: "Full Name",
      placeholder: "Enter your full name",
      required: true,
    },
  ]);

  const [selectedId, setSelectedId] = useState(fields[0].id);
  const selectedField = fields.find((f) => f.id === selectedId);

  /* Track answers for Take Form */
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [submittedData, setSubmittedData] = useState<any>(null);

  /* Add field */
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

  /* Update field */
  const updateField = (key: keyof Field, value: any) => {
    setFields((prev) =>
      prev.map((f) => (f.id === selectedId ? { ...f, [key]: value } : f))
    );
  };

  /* Delete field */
  const deleteField = () => {
    if (!selectedId || fields.length === 1) return;

    const index = fields.findIndex((f) => f.id === selectedId);
    const updated = fields.filter((f) => f.id !== selectedId);

    setFields(updated);
    setSelectedId(updated[Math.max(index - 1, 0)].id);
  };

  /* Publish (go to schema mode) */
  const handlePublish = () => {
    if (fields.some((f) => !f.label.trim())) {
      alert("All fields must have labels.");
      return;
    }
    setMode("schema");
  };

  /* Import schema */
  const [importText, setImportText] = useState("");

  const handleSchemaImport = () => {
    try {
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed)) throw new Error("Schema must be an array");

      setFields(parsed);
      setMode("take");
    } catch {
      alert("Invalid schema JSON.");
    }
  };

  /* Submit form */
  const handleSubmit = () => {
    setSubmittedData(answers);
    setMode("results");
  };

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header" style={{ display: "flex", alignItems: "center" }}>
        {/* All buttons share style */}
        <div
          className="mode-toggle"
          style={{ display: "flex", alignItems: "center", width: "100%", gap: "8px" }}
        >
          {/* Left buttons */}
          <button className={mode === "edit" ? "active" : ""} onClick={() => setMode("edit")}>
            Edit
          </button>

          <button className={mode === "preview" ? "active" : ""} onClick={() => setMode("preview")}>
            Preview
          </button>

          {/* Right aligned Take Forms */}
          <button
            className={mode === "import" ? "active" : ""}
            onClick={() => setMode("import")}
            style={{ marginLeft: "auto" }}
          >
            Take Forms
          </button>
        </div>
      </header>

      {/* EDIT MODE */}
      {mode === "edit" && (
        <div className="layout">
          <aside className="sidebar">
            <h3>Form Fields</h3>

            {fields.map((field) => (
              <div
                key={field.id}
                className={`field-item ${selectedId === field.id ? "selected" : ""}`}
                onClick={() => setSelectedId(field.id)}
              >
                <strong>{field.label || "(No Label)"}</strong>
                <br />
                <span>{field.type}</span>
              </div>
            ))}

            <div className="add-section">
              <button onClick={addField}>+ Add Field</button>
            </div>
          </aside>

          <main className="main">
            {selectedField && (
              <div className="card">
                <h2>Field Configuration</h2>

                <label>Field Type</label>
                <select
                  value={selectedField.type}
                  onChange={(e) => updateField("type", e.target.value)}
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="number">Number</option>
                </select>

                <label>Label</label>
                <input
                  value={selectedField.label}
                  onChange={(e) => updateField("label", e.target.value)}
                />

                <label>Placeholder</label>
                <input
                  value={selectedField.placeholder}
                  onChange={(e) => updateField("placeholder", e.target.value)}
                />

                <div className="toggle-row">
                  <span>Required</span>
                  <input
                    type="checkbox"
                    checked={selectedField.required}
                    onChange={(e) => updateField("required", e.target.checked)}
                  />
                </div>

                <button
                  className="submit-btn"
                  style={{ background: "#ef4444" }}
                  onClick={() => window.confirm("Delete this field?") && deleteField()}
                >
                  Delete Field
                </button>
              </div>
            )}
          </main>
        </div>
      )}

      {/* PREVIEW MODE */}
      {mode === "preview" && (
        <div className="main">
          <div className="card">
            <h2>Preview Form</h2>

            {fields.map((f) => (
              <div key={f.id} className="preview-field">
                <label>
                  {f.label}
                  {f.required && "*"}
                </label>
                <input placeholder={f.placeholder} />
              </div>
            ))}

            <button className="submit-btn" onClick={handlePublish}>
              Publish Form
            </button>
          </div>
        </div>
      )}

      {/* SCHEMA MODE */}
      {mode === "schema" && (
        <div className="main">
          <div className="card">
            <h2>Generated Schema</h2>

            <button
              className="submit-btn"
              style={{ marginBottom: "16px" }}
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(fields, null, 2));
                alert("Copied to clipboard!");
              }}
            >
              📋 Copy JSON
            </button>

            <pre>{JSON.stringify(fields, null, 2)}</pre>
          </div>
        </div>
      )}

      {/* IMPORT MODE */}
      {mode === "import" && (
        <div className="main">
          <div className="card">
            <h2>Import Schema</h2>

            <textarea
              rows={10}
              style={{ width: "100%" }}
              placeholder="Paste schema JSON here..."
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
            />

            <button className="submit-btn" onClick={handleSchemaImport}>
              Load Form
            </button>
          </div>
        </div>
      )}

      {/* TAKE FORM MODE */}
      {mode === "take" && (
        <div className="main">
          <div className="card">
            <h2>Fill Out Form</h2>

            {fields.map((f) => (
              <div key={f.id} className="preview-field">
                <label>
                  {f.label}
                  {f.required && "*"}
                </label>

                <input
                  placeholder={f.placeholder}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [f.id]: e.target.value,
                    }))
                  }
                />
              </div>
            ))}

            <button className="submit-btn" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      )}

      {/* RESULTS MODE */}
      {mode === "results" && (
        <div className="main">
          <div className="card">
            <h2>Submission Results</h2>

            <pre>{JSON.stringify(submittedData, null, 2)}</pre>

            <button className="submit-btn" onClick={() => setMode("take")}>
              Back to Form
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
