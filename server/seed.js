import db from './db.js';

db.exec(`
  DELETE FROM enrollments;
  DELETE FROM activities;
  DELETE FROM users;
  DELETE FROM admin_users;
`);

const insertUser = db.prepare('INSERT INTO users (phone, name) VALUES (?, ?)');
insertUser.run('13800138000', '张三');
insertUser.run('13900139000', '李四');
insertUser.run('13700137000', '王五');

const insertActivity = db.prepare(`
  INSERT INTO activities (title, description, location, organizer, start_time, end_time, capacity, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

insertActivity.run(
  '2025 城市青年志愿服务',
  '面向社区服务、会务支持与路线引导岗位开放报名，支持在线填写信息后提交审核。',
  '北京市朝阳区文化中心',
  '朝阳区团委',
  '2025-04-15 09:00:00',
  '2025-04-15 17:00:00',
  100,
  'active'
);

insertActivity.run(
  '社区公益徒步活动',
  '周末徒步，穿越城市绿道，感受自然之美。',
  '上海市浦东新区世纪公园',
  '上海户外运动协会',
  '2025-05-01 08:00:00',
  '2025-05-01 12:00:00',
  200,
  'active'
);

insertActivity.run(
  '乡村教育支教计划',
  '前往偏远山区学校进行教育支援。',
  '云南省昆明市',
  '中国青年志愿者协会',
  '2025-06-01 07:00:00',
  '2025-06-10 18:00:00',
  50,
  'active'
);

const insertEnrollment = db.prepare(`
  INSERT INTO enrollments (user_id, activity_id, name, age, gender, id_card, occupation, emergency_contact, emergency_phone, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertEnrollment.run(1, 1, '张三', 28, '男', '110101199001011234', '软件工程师', '张小红', '13800138001', 'pending');
insertEnrollment.run(2, 2, '李四', 25, '女', '110101199501011234', '产品经理', '李大明', '13900139001', 'approved');

const insertAdmin = db.prepare('INSERT INTO admin_users (username, password) VALUES (?, ?)');
insertAdmin.run('admin', 'admin123');

console.log('Seed data inserted successfully');
