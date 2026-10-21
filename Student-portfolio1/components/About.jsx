function About() {
  return (
    <section className="editorial-section" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div className="section-label" style={{ marginBottom: '24px' }}>ABOUT</div>
      <div>
        <p className="font-body-lg" style={{ color: 'var(--primary)', lineHeight: '1.8' }}>
          Hi, I'm Smit. I'm a full-stack developer using modern web technologies 
          to build products that are intuitive, intelligent, and a pleasure to use. 
          My passion is turning deep user insight into experiences that don't just solve 
          problems — they create delight.
        </p>
      </div>
      <div style={{ marginTop: 'auto', paddingTop: '32px' }}>
        <button className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>View My Work</span>
          <span>↗</span>
        </button>
      </div>
    </section>
  );
}

export default About;
