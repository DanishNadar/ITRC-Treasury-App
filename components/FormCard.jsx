"use client";

export default function FormCard({ title, subtitle, fields, values, onChange, onSubmit, onCancel, submitLabel, secondaryActionLabel }) {
  return (
    <section className="panel">
      <div className="panelHeader">
        <div>
          <p className="eyebrow">{subtitle}</p>
          <h3>{title}</h3>
        </div>
      </div>
      <form className="gridForm" onSubmit={onSubmit}>
        {fields.map((field) => (
          <label key={field.name} className={`field ${field.wide ? "wide" : ""}`}>
            <span>{field.label}</span>
            {field.type === "textarea" ? (
              <textarea
                value={values[field.name] ?? ""}
                onChange={(event) => onChange(field.name, event.target.value)}
                placeholder={field.placeholder || ""}
                required={field.required}
                rows={4}
              />
            ) : (
              <input
                type={field.type}
                value={values[field.name] ?? ""}
                onChange={(event) => onChange(field.name, event.target.value)}
                placeholder={field.placeholder || ""}
                required={field.required}
                step={field.step}
              />
            )}
          </label>
        ))}
        <div className="formActions">
          <button className="primaryButton" type="submit">{submitLabel}</button>
          {onCancel ? (
            <button className="secondaryButton" type="button" onClick={onCancel}>
              {secondaryActionLabel || "Cancel"}
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
