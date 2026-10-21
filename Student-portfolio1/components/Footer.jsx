function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <span className="footer-label">Contact</span>
        <h2 className="footer-headline">Let's make something people love to use.</h2>
        
        <div className="footer-actions">
          <a href="mailto:patels17072003@gmail.com" className="footer-email-btn">
            ✉ patels17072003@gmail.com
          </a>
          <a href="#" className="footer-social-btn">🌐</a>
          <a href="#" className="footer-social-btn">in</a>
          <a href="#" className="footer-social-btn">gh</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Smit Patel. All rights reserved.</span>
        <span>Gujarat, India</span>
        <span style={{ cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top ↑</span>
      </div>
    </footer>
  );
}

export default Footer;
