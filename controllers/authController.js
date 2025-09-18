const User = require('../models/User');

exports.renderRegister = (req, res) => res.render('register', { errors: [] });
exports.renderLogin = (req, res) => res.render('login', { errors: [] });
exports.renderForgot = (req, res) => res.render('forgot', { message: null });

exports.register = async (req, res) => {
  try {
    const { username, password, email, phone } = req.body;
    if (!username || !password || !email) {
      return res.status(400).render('register', { errors: ['Vui lòng nhập đủ thông tin'] });
    }
    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(400).render('register', { errors: ['Username hoặc email đã tồn tại'] });

    const u = new User({ username, password, email, phone });
    await u.save();

    // KHÔNG tự login
    res.redirect('/auth/login'); 
  } catch (err) {
    console.error(err);
    res.status(500).render('register', { errors: [err.message] });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).render('login', { errors: ['Vui lòng nhập đầy đủ'] });

    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).render('login', { errors: ['Sai username hoặc password'] });
    }

    req.session.userId = user._id;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).render('login', { errors: [err.message] });
  }
};

exports.logout = (req, res) => {
  const sid = req.sessionID;
  req.session.destroy(err => {
    if (err) console.error('Destroy session error', err);
    // try remove from store
    if (req.sessionStore && typeof req.sessionStore.destroy === 'function') {
      req.sessionStore.destroy(sid, e => { if (e) console.error('sessionStore.destroy err', e); });
    }
    res.clearCookie('sid');
    res.clearCookie('connect.sid');
    res.redirect('/auth/login');
  });
};
