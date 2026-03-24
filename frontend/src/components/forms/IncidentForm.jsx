function IncidentForm({ formData, onChange, onSubmit }) {
  return (
    <form className="form" onSubmit={onSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Título"
        value={formData.title}
        onChange={onChange}
        required
      />
      <textarea
        name="description"
        placeholder="Descripción"
        value={formData.description}
        onChange={onChange}
        required
      />
      <button type="submit" className="btn">
        Crear
      </button>
    </form>
  );
}

export default IncidentForm;
