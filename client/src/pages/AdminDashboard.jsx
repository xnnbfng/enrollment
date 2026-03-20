import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalActivities: 0,
    totalEnrollments: 0,
    pendingEnrollments: 0
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error('Failed to fetch stats');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch (e) {
      console.error('Failed to fetch users');
    }
  };

  const statCards = [
    { label: '总用户数', value: stats.totalUsers, color: '#3B82F6' },
    { label: '进行中活动', value: stats.totalActivities, color: '#10B981' },
    { label: '总报名数', value: stats.totalEnrollments, color: '#F59E0B' },
    { label: '待审核', value: stats.pendingEnrollments, color: '#EF4444' }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>数据概览</h1>
        <button
          onClick={() => navigate('/admin/review')}
          style={{
            padding: '12px 18px',
            background: '#2563EB',
            color: 'white',
            border: 'none',
            borderRadius: 12,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          待审核 ({stats.pendingEnrollments})
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {statCards.map((card, i) => (
          <div key={i} style={{
            background: 'white',
            borderRadius: 16,
            padding: 20,
            border: '1px solid #E5EAF3'
          }}>
            <p style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>{card.label}</p>
            <p style={{ fontSize: 32, fontWeight: 700, color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>

      <div style={{
        background: 'white',
        borderRadius: 16,
        padding: 20,
        border: '1px solid #E5EAF3'
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>最新用户</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', textAlign: 'left' }}>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>手机号</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>报名次数</th>
              <th style={{ padding: '12px 16px', fontWeight: 600 }}>注册时间</th>
            </tr>
          </thead>
          <tbody>
            {users.slice(0, 5).map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #EEF2F7' }}>
                <td style={{ padding: '14px 16px' }}>{user.phone}</td>
                <td style={{ padding: '14px 16px' }}>{user.enrollment_count}</td>
                <td style={{ padding: '14px 16px' }}>{user.created_at?.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
