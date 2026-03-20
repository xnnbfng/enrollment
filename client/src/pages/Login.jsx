import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');

  const handleLogin = async () => {
    if (!phone) return alert('请输入手机号');
    if (!code) return alert('请输入验证码');
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/home');
      }
    } catch (e) {
      alert('登录失败');
    }
  };

  return (
    <div className="container">
      <div className="page" style={{ paddingTop: 32 }}>
        <p className="page-label">FRONT DESK ACCESS</p>
        <h1 className="page-title">活动报名系统</h1>
        <p className="page-desc">使用手机号与验证码登录，快速进入活动报名与个人中心。</p>
        
        <div className="card">
          <div className="input-group">
            <label className="input-label">手机号</label>
            <input
              type="tel"
              className="input-field"
              placeholder="请输入手机号"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              maxLength={11}
            />
          </div>
          
          <div className="input-group">
            <label className="input-label">验证码</label>
            <div className="row">
              <input
                type="text"
                className="input-field"
                placeholder="请输入验证码"
                value={code}
                onChange={e => setCode(e.target.value)}
                maxLength={6}
              />
              <button className="btn btn-outline" style={{ width: 'auto', padding: '0 16px' }}>
                获取验证码
              </button>
            </div>
          </div>
          
          <p style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
            未注册手机号将自动创建前台账号。
          </p>
        </div>
        
        <button className="btn btn-primary mt-24" onClick={handleLogin}>
          登录并进入活动首页
        </button>
        
        <p style={{ fontSize: 12, color: '#888', marginTop: 16, textAlign: 'center' }}>
          登录后可查看报名中活动、进入报名页，并在"我的"中管理报名记录。
        </p>
      </div>
    </div>
  );
}

export default Login;
