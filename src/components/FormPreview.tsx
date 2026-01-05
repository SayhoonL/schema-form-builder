type Field = {
  id: string;
  type: "text" | "email" | "number";
  label: string;
  placeholder: string;
  required: boolean;
};

type Props = {
  fields: Field[];
  onPublish: () => void;
  publishedForm: any | null;
};

function FormPreview({
  fields,
  onPublish,
  publishedForm,
}: Props) {
  if (publishedForm) {
    return (
      <pre>
        {JSON.stringify(publishedForm, null, 2)}
      </pre>
    );
  }

  return (
    <>
      <h2>Preview</h2>

      {fields.map((field) => (
        <div key={field.id} className="preview-field">
          <label>
            {field.label || "Untitled Field"}
            {field.required && " *"}
          </label>
          <input
            type={field.type}
            placeholder={field.placeholder}
            required={field.required}
            disabled
          />
        </div>
      ))}

      <button className="submit-btn" onClick={onPublish}>
        Publish Form
      </button>
    </>
  );
}

export default FormPreview;
