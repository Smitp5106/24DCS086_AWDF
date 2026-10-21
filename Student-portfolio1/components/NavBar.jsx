import { NavLink } from 'react-router-dom';
import { useState } from 'react';

function NavBar({ isAuthenticated, onLogout }) {
  // Removing dark mode toggle since it's not prominently featured in the new design,
  // or keeping it as a small pill at the end.
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) document.body.classList.add('dark-theme');
      else document.body.classList.remove('dark-theme');
      return next;
    });
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        SMIT PATEL <span style={{ color: 'var(--neutral)', fontWeight: '400' }}>/ FULL STACK DEVELOPER</span>
      </div>

      <div className="nav-links">
        <NavLink 
          to="/" 
          end 
          className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
        >
          Work
        </NavLink>
        {/* We map "Projects" to "Work" to match screenshot, but route is /projects */}

        <NavLink 
          to="/projects" 
          className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
        >
          Projects
        </NavLink>

        <NavLink 
          to="/tasks" 
          className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
        >
          Tasks
        </NavLink>

        <NavLink 
          to="/contact" 
          className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
        >
          Contact
        </NavLink>

        {!isAuthenticated ? (
          <NavLink 
            to="/auth" 
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            Login
          </NavLink>
        ) : (
          <button className="nav-item" onClick={onLogout} style={{ border: 'none', cursor: 'pointer' }}>
            Logout
          </button>
        )}
        
        <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
          {isDarkMode ? '☼' : '☾'}
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
