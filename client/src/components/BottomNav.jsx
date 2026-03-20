import React from 'react';
import { useNavigate } from 'react-router-dom';
import { House, User } from 'lucide-react';

const BottomNav = ({ active }) => {
  const navigate = useNavigate();
  
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 420,
      background: 'white',
      borderRadius: 32,
      padding: 4,
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      border: '1px solid #E5E5E5'
    }}>
      <div style={{ display: 'flex', borderRadius: 26, overflow: 'hidden' }}>
        <div
          onClick={() => navigate('/home')}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px 0',
            gap: 4,
            background: active === 'home' ? '#0D6E6E' : 'transparent',
            borderRadius: 26,
            cursor: 'pointer'
          }}
        >
          <House size={18} color={active === 'home' ? '#FFFFFF' : '#AAAAAA'} />
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            color: active === 'home' ? '#FFFFFF' : '#AAAAAA'
          }}>首页</span>
        </div>
        <div
          onClick={() => navigate('/my')}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px 0',
            gap: 4,
            background: active === 'my' ? '#0D6E6E' : 'transparent',
            borderRadius: 26,
            cursor: 'pointer'
          }}
        >
          <User size={18} color={active === 'my' ? '#FFFFFF' : '#AAAAAA'} />
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            color: active === 'my' ? '#FFFFFF' : '#AAAAAA'
          }}>我的</span>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
