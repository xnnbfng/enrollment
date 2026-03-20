import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutConfirm() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="container" style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingBottom: 548
      }}>
        <div style={{
          width: 388,
          background: 'white',
          borderRadius: 16,
          padding: 20
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
            确认退出登录？
          </h3>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>
            退出后需要重新登录才能使用报名功能。
          </p>
          <div className="row gap-12">
            <button
              className="btn btn-outline"
              onClick={() => navigate('/my')}
            >
              取消
            </button>
            <button
              className="btn btn-primary"
              onClick={handleLogout}
              style={{ background: '#DC2626' }}
            >
              确认退出
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogoutConfirm;
