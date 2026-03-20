import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

function Enroll() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '男',
    phone: '',
    id_card: '',
    occupation: '',
    emergency_contact: '',
    emergency_phone: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchActivity();
  }, [id]);

  const fetchActivity = async () => {
    try {
      const res = await fetch(`/api/activities/${id}`);
      const data = await res.json();
      setActivity(data);
    } catch (e) {
      console.error('Failed to fetch activity');
    }
  };

  const validate = () => {
    const newErrors = {};
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!form.name.trim()) newErrors.name = true;
    if (!form.age.trim()) newErrors.age = true;
    if (!form.phone.trim()) {
      newErrors.phone = true;
    } else if (!phoneRegex.test(form.phone.trim())) {
      newErrors.phone = true;
    }
    if (!form.id_card.trim()) newErrors.id_card = true;
    if (!form.emergency_contact.trim()) newErrors.emergency_contact = true;
    if (!form.emergency_phone.trim()) {
      newErrors.emergency_phone = true;
    } else if (!phoneRegex.test(form.emergency_phone.trim())) {
      newErrors.emergency_phone = true;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) return navigate('/');
    
    if (!validate()) {
      alert('请填写必填字段或检查手机号格式');
      return;
    }
    
    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          activity_id: parseInt(id),
          ...form
        })
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        navigate('/my');
      }
    } catch (e) {
      alert('提交失败');
    }
  };

  const getFieldStyle = (fieldName) => ({
    ...(['name', 'age', 'phone', 'id_card', 'emergency_contact', 'emergency_phone'].includes(fieldName)
      ? { borderColor: errors[fieldName] ? '#DC2626' : undefined }
      : {})
  });

  if (!activity) return <div className="container">加载中...</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', gap: 16 }}>
        <button onClick={() => navigate('/home')} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>←</button>
        <span style={{ fontSize: 11, letterSpacing: 2, color: '#888', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase' }}>活动详情 / 报名</span>
      </div>
      <div className="page" style={{ paddingTop: 0 }}>
        <h1 style={{ fontFamily: 'Newsreader, serif', fontSize: 28, fontWeight: 500, lineHeight: 1.1, marginBottom: 8 }}>{activity.title}</h1>
        <p className="page-desc">{activity.description}</p>
        
        <div className="card">
          <div className="input-group">
            <label className="input-label">姓名</label>
            <input
              type="text"
              className="input-field"
              placeholder="请输入真实姓名"
              value={form.name}
              onChange={e => { setForm({...form, name: e.target.value}); setErrors({...errors, name: false}); }}
              style={getFieldStyle('name')}
            />
          </div>
          
          <div className="row">
            <div className="input-group">
              <label className="input-label">年龄</label>
              <input
                type="number"
                className="input-field"
                placeholder="年龄"
                value={form.age}
                onChange={e => { setForm({...form, age: e.target.value}); setErrors({...errors, age: false}); }}
                style={getFieldStyle('age')}
              />
            </div>
            <div className="input-group">
              <label className="input-label">性别</label>
              <select
                className="input-field"
                value={form.gender}
                onChange={e => setForm({...form, gender: e.target.value})}
              >
                <option>男</option>
                <option>女</option>
              </select>
            </div>
          </div>
          
          <div className="input-group">
            <label className="input-label">电话</label>
            <input
              type="tel"
              className="input-field"
              placeholder="请输入手机号"
              value={form.phone}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, '');
                setForm({...form, phone: val.slice(0, 11)});
                setErrors({...errors, phone: false});
              }}
              style={getFieldStyle('phone')}
            />
          </div>

          <div className="input-group">
            <label className="input-label">身份证号</label>
            <input
              type="text"
              className="input-field"
              placeholder="请输入身份证号"
              value={form.id_card}
              onChange={e => { setForm({...form, id_card: e.target.value}); setErrors({...errors, id_card: false}); }}
              style={getFieldStyle('id_card')}
            />
          </div>
          
          <div className="input-group">
            <label className="input-label">职业</label>
            <input
              type="text"
              className="input-field"
              placeholder="请输入职业"
              value={form.occupation}
              onChange={e => setForm({...form, occupation: e.target.value})}
            />
          </div>
          
          <div className="row">
            <div className="input-group">
              <label className="input-label">紧急联系人</label>
              <input
                type="text"
                className="input-field"
                placeholder="姓名"
                value={form.emergency_contact}
                onChange={e => { setForm({...form, emergency_contact: e.target.value}); setErrors({...errors, emergency_contact: false}); }}
                style={getFieldStyle('emergency_contact')}
              />
            </div>
            <div className="input-group">
              <label className="input-label">紧急联系电话</label>
              <input
                type="tel"
                className="input-field"
                placeholder="电话"
                value={form.emergency_phone}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '');
                  setForm({...form, emergency_phone: val.slice(0, 11)});
                  setErrors({...errors, emergency_phone: false});
                }}
                style={getFieldStyle('emergency_phone')}
              />
            </div>
          </div>
        </div>
        
        <button className="btn btn-primary mt-24" onClick={handleSubmit}>
          提交报名
        </button>
      </div>
      
      <div style={{ height: 100 }} />
      
      <BottomNav active="home" />
    </div>
  );
}

export default Enroll;
