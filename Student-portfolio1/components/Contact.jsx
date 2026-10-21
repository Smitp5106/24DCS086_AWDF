import { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      subject: 'General Inquiry',
      message: ''
    });
    setSubmitted(false);
  };

  return (
    <div className="page-container contact-page">
      <div className="projects-header">
        <span className="font-label-mono">04 / CONNECT</span>
        <h2 className="font-headline-md">CONTACT ME</h2>
        <p className="font-body-md" style={{ color: 'var(--neutral)' }}>
          Feel free to send a message. Watch your inputs update in real-time in the editorial view.
        </p>
      </div>

      <div className="contact-layout">
        <form className="contact-form" onSubmit={handleSubmit} style={{ background: 'transparent', border: '1px solid var(--border)', padding: '32px' }}>
          <div className="form-group">
            <label htmlFor="name-input" className="font-label-mono">Your Name</label>
            <input
              id="name-input"
              type="text"
              name="name"
              className="input-bottom-border"
              placeholder="e.g. Smit Patel"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email-input" className="font-label-mono">Email Address</label>
            <input
              id="email-input"
              type="email"
              name="email"
              className="input-bottom-border"
              placeholder="e.g. smit@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject-input" className="font-label-mono">Subject</label>
            <select
              id="subject-input"
              name="subject"
              className="input-bottom-border"
              value={formData.subject}
              onChange={handleChange}
            >
              <option value="General Inquiry">General Inquiry</option>
              <option value="Project Collaboration">Project Collaboration</option>
              <option value="Job Opportunity">Job Opportunity</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message-input" className="font-label-mono">Message</label>
            <textarea
              id="message-input"
              name="message"
              rows="4"
              className="input-bottom-border"
              placeholder="Write your message here..."
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="form-actions" style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>Send Message</button>
            <button type="button" className="btn-secondary" onClick={handleReset}>Clear Form</button>
          </div>

          {submitted && (
            <div className="success-banner">
              [ SUCCESS ] Thank you, <strong>{formData.name}</strong>. Your message has been recorded.
            </div>
          )}
        </form>

        <div className="live-preview-card">
          <div className="preview-header">
            <span className="live-indicator">[ LIVE PREVIEW ]</span>
            <h3 className="font-headline-md" style={{ fontSize: '20px' }}>ARCHIVE DATA</h3>
          </div>
          <div className="preview-body">
            <div className="preview-field">
              <span className="field-label font-label-mono">Name</span>
              <span className="field-value">{formData.name || <em className="placeholder-text">Waiting for input...</em>}</span>
            </div>

            <div className="preview-field">
              <span className="field-label font-label-mono">Email</span>
              <span className="field-value">{formData.email || <em className="placeholder-text">Waiting for input...</em>}</span>
            </div>

            <div className="preview-field">
              <span className="field-label font-label-mono">Subject</span>
              <span className="field-value">{formData.subject}</span>
            </div>

            <div className="preview-field">
              <span className="field-label font-label-mono">Message</span>
              <p className="field-message">{formData.message || <em className="placeholder-text">Waiting for input...</em>}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
