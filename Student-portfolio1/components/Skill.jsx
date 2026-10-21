function Skills({ skillList }) {
  return (
    <section className="editorial-section">
      <div className="section-label" style={{ marginBottom: '24px' }}>EXPERTISE</div>
      <div>
        <div className="tag-container">
          {skillList.map((s) => (
            <span key={s} className="tag">
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
