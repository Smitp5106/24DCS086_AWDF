import Header from './Header';
import About from './About';
import Skills from './Skill';

function Home() {
  const mySkills = [
    'HTML5', 'CSS3', 'JavaScript (ES6+)', 'React.js', 
    'React Router', 'Node.js', 'Python', 'SQL', 
    'Git & GitHub', 'NumPy', 'Pandas', 'MongoDB'
  ];

  return (
    <div className="page-container home-page">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="home-hero-card">
            <h1 className="font-display">Designing Digital Products</h1>
            <p className="font-body-lg" style={{ color: 'var(--neutral)', marginTop: '16px' }}>
              Explore my journey, technical skills, and featured web development projects.
            </p>
          </div>
          
          <Skills skillList={mySkills} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <About />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="editorial-section" style={{ background: 'var(--accent-orange)', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>▶</div>
              <h3 className="font-headline-md" style={{ color: '#fff', fontSize: '20px' }}>Designing for Calm</h3>
              <p style={{ opacity: 0.8, fontSize: '14px' }}>Listen to my interview</p>
            </div>
            <div className="editorial-section" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <h3 className="font-display" style={{ fontSize: '48px', color: 'var(--primary)' }}>CV</h3>
              <button className="btn-secondary" style={{ width: '100%', marginTop: '16px' }}>Download</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
