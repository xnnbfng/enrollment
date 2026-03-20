import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/auth/login', (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) {
    return res.status(400).json({ error: '手机号和验证码必填' });
  }
  let user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
  if (!user) {
    const result = db.prepare('INSERT INTO users (phone) VALUES (?)').run(phone);
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
  }
  res.json({ success: true, user });
});

app.get('/api/activities', (req, res) => {
  const { search, status } = req.query;
  let sql = 'SELECT * FROM activities WHERE 1=1';
  const params = [];
  if (status && status !== '') {
    sql += ' AND status = ?';
    params.push(status);
  }
  if (search) {
    sql += ' AND (title LIKE ? OR location LIKE ? OR organizer LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  sql += ' ORDER BY created_at DESC';
  let activities = db.prepare(sql).all(...params);
  
  const now = new Date();
  activities = activities.map(activity => {
    const startTime = new Date(activity.start_time);
    const endTime = new Date(activity.end_time);
    if (now < startTime) {
      activity.status = 'upcoming';
    } else if (now >= startTime && now <= endTime) {
      activity.status = 'active';
    } else {
      activity.status = 'closed';
    }
    return activity;
  });
  
  res.json(activities);
});

app.get('/api/activities/:id', (req, res) => {
  const activity = db.prepare('SELECT * FROM activities WHERE id = ?').get(req.params.id);
  if (!activity) {
    return res.status(404).json({ error: '活动不存在' });
  }
  res.json(activity);
});

app.get('/api/enrollments/my', (req, res) => {
  const { user_id } = req.query;
  if (!user_id) {
    return res.status(400).json({ error: 'user_id 必填' });
  }
  const enrollments = db.prepare(`
    SELECT e.*, a.title, a.start_time, a.location
    FROM enrollments e
    JOIN activities a ON e.activity_id = a.id
    WHERE e.user_id = ?
    ORDER BY e.created_at DESC
  `).all(user_id);
  res.json(enrollments);
});

app.post('/api/enrollments', (req, res) => {
  const { user_id, activity_id, name, age, gender, phone, id_card, occupation, emergency_contact, emergency_phone } = req.body;
  if (!user_id || !activity_id || !name) {
    return res.status(400).json({ error: '必填字段缺失' });
  }
  const existing = db.prepare('SELECT * FROM enrollments WHERE user_id = ? AND activity_id = ?').get(user_id, activity_id);
  if (existing) {
    return res.status(400).json({ error: '已报名该活动' });
  }
  const result = db.prepare(`
    INSERT INTO enrollments (user_id, activity_id, name, age, gender, phone, id_card, occupation, emergency_contact, emergency_phone)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(user_id, activity_id, name, age, gender, phone, id_card, occupation, emergency_contact, emergency_phone);
  const enrollment = db.prepare('SELECT * FROM enrollments WHERE id = ?').get(result.lastInsertRowid);
  res.json(enrollment);
});

app.get('/api/enrollments/:id', (req, res) => {
  const enrollment = db.prepare(`
    SELECT e.*, a.title, a.start_time, a.location, a.description
    FROM enrollments e
    JOIN activities a ON e.activity_id = a.id
    WHERE e.id = ?
  `).get(req.params.id);
  if (!enrollment) {
    return res.status(404).json({ error: '报名记录不存在' });
  }
  res.json(enrollment);
});

app.delete('/api/enrollments/:id', (req, res) => {
  const enrollment = db.prepare('SELECT * FROM enrollments WHERE id = ?').get(req.params.id);
  if (!enrollment) {
    return res.status(404).json({ error: '报名记录不存在' });
  }
  db.prepare('DELETE FROM enrollments WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.get('/api/admin/activities/:id/enrollments', (req, res) => {
  const enrollments = db.prepare(`
    SELECT e.*, u.phone as login_phone
    FROM enrollments e
    JOIN users u ON e.user_id = u.id
    WHERE e.activity_id = ?
    ORDER BY e.created_at DESC
  `).all(req.params.id);
  res.json(enrollments);
});

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const admin = db.prepare('SELECT * FROM admin_users WHERE username = ? AND password = ?').get(username, password);
  if (!admin) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }
  res.json({ success: true, admin: { id: admin.id, username: admin.username } });
});

app.get('/api/admin/users', (req, res) => {
  const users = db.prepare(`
    SELECT u.*, COUNT(e.id) as enrollment_count
    FROM users u
    LEFT JOIN enrollments e ON u.id = e.user_id
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `).all();
  res.json(users);
});

app.get('/api/admin/enrollments', (req, res) => {
  const { status, activity_id } = req.query;
  let sql = `
    SELECT e.*, u.phone as login_phone, u.name as user_name, a.title as activity_title
    FROM enrollments e
    JOIN users u ON e.user_id = u.id
    JOIN activities a ON e.activity_id = a.id
    WHERE 1=1
  `;
  const params = [];
  if (status) {
    sql += ' AND e.status = ?';
    params.push(status);
  }
  if (activity_id) {
    sql += ' AND e.activity_id = ?';
    params.push(activity_id);
  }
  sql += ' ORDER BY e.created_at DESC';
  const enrollments = db.prepare(sql).all(...params);
  res.json(enrollments);
});

app.patch('/api/admin/enrollments/:id', (req, res) => {
  const { status, remark } = req.body;
  db.prepare('UPDATE enrollments SET status = ?, remark = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .run(status, remark, req.params.id);
  const enrollment = db.prepare('SELECT * FROM enrollments WHERE id = ?').get(req.params.id);
  res.json(enrollment);
});

app.post('/api/admin/activities', (req, res) => {
  const { title, description, location, organizer, start_time, end_time, capacity } = req.body;
  if (!title) {
    return res.status(400).json({ error: '活动标题必填' });
  }
  const result = db.prepare(`
    INSERT INTO activities (title, description, location, organizer, start_time, end_time, capacity)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(title, description, location, organizer, start_time, end_time, capacity);
  const activity = db.prepare('SELECT * FROM activities WHERE id = ?').get(result.lastInsertRowid);
  res.json(activity);
});

app.patch('/api/admin/activities/:id', (req, res) => {
  const { title, description, location, organizer, start_time, end_time, capacity, status } = req.body;
  db.prepare(`
    UPDATE activities SET title=?, description=?, location=?, organizer=?, start_time=?, end_time=?, capacity=?, status=?
    WHERE id=?
  `).run(title, description, location, organizer, start_time, end_time, capacity, status, req.params.id);
  const activity = db.prepare('SELECT * FROM activities WHERE id = ?').get(req.params.id);
  res.json(activity);
});

app.delete('/api/admin/activities/:id', (req, res) => {
  db.prepare('DELETE FROM activities WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.get('/api/admin/stats', (req, res) => {
  const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  const totalActivities = db.prepare('SELECT COUNT(*) as count FROM activities WHERE status = ?').get('active').count;
  const totalEnrollments = db.prepare('SELECT COUNT(*) as count FROM enrollments').get().count;
  const pendingEnrollments = db.prepare('SELECT COUNT(*) as count FROM enrollments WHERE status = ?').get('pending').count;
  res.json({
    totalUsers,
    totalActivities,
    totalEnrollments,
    pendingEnrollments
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
