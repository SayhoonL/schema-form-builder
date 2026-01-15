import { useState } from "react";
import "./styles.css";

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

  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [submittedData, setSubmittedData] = useState<any>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

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

  const updateField = (key: keyof Field, value: any) => {
    setFields((prev) =>
      prev.map((f) => (f.id === selectedId ? { ...f, [key]: value } : f))
    );
  };

  const deleteField = () => {
    if (!selectedId || fields.length === 1) return;

    const index = fields.findIndex((f) => f.id === selectedId);
    const updated = fields.filter((f) => f.id !== selectedId);

    setFields(updated);
    setSelectedId(updated[Math.max(index - 1, 0)].id);
  };

  const handlePublish = () => {
    if (fields.some((f) => !f.label.trim())) {
      alert("All fields must have labels.");
      return;
    }
    setMode("schema");
  };

  const [importText, setImportText] = useState("");

  const handleSchemaImport = () => {
    try {
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed)) throw new Error("Schema must be an array");
      if (parsed.length === 0) throw new Error("Schema cannot be empty");

      setFields(parsed);
      setSelectedId(parsed[0].id);
      setAnswers({});
      setErrors({});
      setAttemptedSubmit(false);
      setSubmittedData(null);
      setMode("take");
    } catch {
      alert("Invalid schema JSON.");
    }
  };

  const validateField = (field: Field, valueRaw: string): string => {
    const value = valueRaw ?? "";
    const trimmed = value.trim();

    if (field.required && trimmed.length === 0) return "This field is required.";

    if (trimmed.length === 0) return "";

    if (field.type === "email") {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
      if (!emailOk) return "Enter a valid email.";
    }

    if (field.type === "number") {
      const n = Number(trimmed);
      if (!Number.isFinite(n)) return "Enter a valid number.";
    }

    return "";
  };

  const validateAll = () => {
    const next: Record<string, string> = {};
    for (const f of fields) {
      const msg = validateField(f, answers[f.id] ?? "");
      if (msg) next[f.id] = msg;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    setAttemptedSubmit(true);
    const ok = validateAll();
    if (!ok) return;

    setSubmittedData(answers);
    setMode("results");
  };

  const handleAnswerChange = (field: Field, value: string) => {
    setAnswers((prev) => ({ ...prev, [field.id]: value }));

    const shouldValidate = attemptedSubmit || !!errors[field.id];
    if (!shouldValidate) return;

    const msg = validateField(field, value);
    setErrors((prev) => {
      const next = { ...prev };
      if (msg) next[field.id] = msg;
      else delete next[field.id];
      return next;
    });
  };

  return (
    <div className="app">
      <header className="header" style={{ display: "flex", alignItems: "center" }}>
        <div
          className="mode-toggle"
          style={{ display: "flex", alignItems: "center", width: "100%", gap: "8px" }}
        >
          <button className={mode === "edit" ? "active" : ""} onClick={() => setMode("edit")}>
            Edit
          </button>

          <button className={mode === "preview" ? "active" : ""} onClick={() => setMode("preview")}>
            Preview
          </button>

          <button
            className={mode === "import" ? "active" : ""}
            onClick={() => setMode("import")}
            style={{ marginLeft: "auto" }}
          >
            Take Forms
          </button>
        </div>
      </header>

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
                <input type={f.type} placeholder={f.placeholder} />
              </div>
            ))}

            <button className="submit-btn" onClick={handlePublish}>
              Publish Form
            </button>
          </div>
        </div>
      )}

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

      {mode === "take" && (
        <div className="main">
          <div className="card">
            <h2>Fill Out Form</h2>

            {fields.map((f) => {
              const msg = errors[f.id];
              return (
                <div key={f.id} className="preview-field">
                  <label>
                    {f.label}
                    {f.required && "*"}
                  </label>

                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={answers[f.id] ?? ""}
                    onChange={(e) => handleAnswerChange(f, e.target.value)}
                    aria-invalid={msg ? "true" : "false"}
                    aria-describedby={msg ? `${f.id}-error` : undefined}
                  />

                  {msg && (
                    <div
                      id={`${f.id}-error`}
                      style={{ marginTop: "6px", fontSize: "12px", color: "#ef4444" }}
                    >
                      {msg}
                    </div>
                  )}
                </div>
              );
            })}

            <button className="submit-btn" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      )}

      {mode === "results" && (
        <div className="main">
          <div className="card">
            <h2>Submission Results</h2>

            <pre>{JSON.stringify(submittedData, null, 2)}</pre>

            <button
              className="submit-btn"
              onClick={() => {
                setMode("take");
                setAttemptedSubmit(false);
                setErrors({});
              }}
            >
              Back to Form
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
