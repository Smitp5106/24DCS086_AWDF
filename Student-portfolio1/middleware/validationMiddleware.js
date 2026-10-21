export const validateTask = (req, res, next) => {
  const { title } = req.body;

  // Only require title on creation (POST). For PUT, it might just be a status update.
  if (req.method === 'POST') {
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Task title is required' });
    }
  } else if (req.method === 'PUT') {
    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({ message: 'Task title cannot be empty' });
    }
  }

  // Description is optional, so we remove the strict check for it.
  next();
};

export const validateRegister = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || email.trim() === '') {
    return res.status(400).json({ message: 'Email is required' });
  }
  
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || email.trim() === '') {
    return res.status(400).json({ message: 'Email is required' });
  }

  if (!password || password.trim() === '') {
    return res.status(400).json({ message: 'Password is required' });
  }

  next();
};
