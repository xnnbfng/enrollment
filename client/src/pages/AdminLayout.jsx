import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

function AdminLayout() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const admin = localStorage.getItem('admin');
    if (admin) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('admin', JSON.stringify(data.admin));
        setIsLoggedIn(true);
      } else {
        alert('登录失败');
      }
    } catch (e) {
      alert('登录失败');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F5F7FB'
      }}>
        <div style={{
          background: 'white',
          padding: 40,
          borderRadius: 16,
          width: 400
        }}>
          <h2 style={{ marginBottom: 24, textAlign: 'center' }}>活动报名后台</h2>
          <div style={{ marginBottom: 16 }}>
            <input
              type="text"
              placeholder="用户名"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                border: '1px solid #E5EAF3',
                marginBottom: 12
              }}
            />
            <input
              type="password"
              placeholder="密码"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                border: '1px solid #E5EAF3'
              }}
            />
          </div>
          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              padding: 12,
              background: '#2563EB',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F7FB' }}>
      <aside style={{
        width: 240,
        background: 'white',
        padding: '24px 20px',
        borderRight: '1px solid #E5EAF3',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>活动报名后台</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          <NavLink
            to="/admin/dashboard"
            style={({ isActive }) => ({
              padding: '14px 16px',
              borderRadius: 12,
              textDecoration: 'none',
              color: isActive ? '#2563EB' : '#333',
              background: isActive ? '#EAF2FF' : 'transparent'
            })}
          >
            📊 数据概览
          </NavLink>
          <NavLink
            to="/admin/activities"
            style={({ isActive }) => ({
              padding: '14px 16px',
              borderRadius: 12,
              textDecoration: 'none',
              color: isActive ? '#2563EB' : '#333',
              background: isActive ? '#EAF2FF' : 'transparent'
            })}
          >
            🎯 活动管理
          </NavLink>
          <NavLink
            to="/admin/review"
            style={({ isActive }) => ({
              padding: '14px 16px',
              borderRadius: 12,
              textDecoration: 'none',
              color: isActive ? '#2563EB' : '#333',
              background: isActive ? '#EAF2FF' : 'transparent'
            })}
          >
            ✅ 审核管理
          </NavLink>
        </nav>
        <button
          onClick={handleLogout}
          style={{
            padding: '14px 16px',
            borderRadius: 12,
            border: '1px solid #E5EAF3',
            background: 'white',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'center',
            marginTop: 16
          }}
        >
          退出登录
        </button>
      </aside>
      <main style={{ flex: 1, padding: 28, overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
