import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

function MyEnrollments() {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [cancelModal, setCancelModal] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (user.id) {
      fetchEnrollments();
    }
  }, [user.id]);

  const fetchEnrollments = async () => {
    try {
      const res = await fetch(`/api/enrollments/my?user_id=${user.id}`);
      const data = await res.json();
      setEnrollments(data);
    } catch (e) {
      console.error('Failed to fetch enrollments');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge badge-pending">审核中</span>;
      case 'approved':
        return <span className="badge badge-approved">已通过</span>;
      case 'rejected':
        return <span className="badge badge-rejected">已拒绝</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const handleLogout = () => {
    navigate('/logout');
  };

  const handleCancel = (e, enrollment) => {
    e.stopPropagation();
    setCancelModal(enrollment);
  };

  const confirmCancel = async () => {
    if (!cancelModal) return;
    try {
      await fetch(`/api/enrollments/${cancelModal.id}`, {
        method: 'DELETE'
      });
      setCancelModal(null);
      fetchEnrollments();
    } catch (e) {
      alert('取消失败');
    }
  };

  return (
    <div className="container">
      <div className="page">
        <h1 style={{ fontFamily: 'Newsreader, serif', fontSize: 28, fontWeight: 500, lineHeight: 1.1, marginBottom: 8 }}>我的报名</h1>
        <p className="page-desc">查看已提交的活动报名记录，并进入详情跟进审核状态。</p>
        
        {enrollments.length === 0 ? (
          <div className="card text-center" style={{ padding: 40 }}>
            <p style={{ color: '#888' }}>暂无报名记录</p>
            <button
              className="btn btn-primary mt-24"
              onClick={() => navigate('/home')}
            >
              去首页看看活动
            </button>
          </div>
        ) : (
          enrollments.map(enrollment => (
            <div
              key={enrollment.id}
              className="list-card"
              onClick={() => navigate(`/enrollment/${enrollment.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div>
                <div className="list-card-title">{enrollment.title}</div>
                <div className="list-card-meta">
                  📅 {enrollment.start_time?.slice(0, 10)}
                </div>
                <div className="list-card-meta">
                  📍 {enrollment.location}
                </div>
                {enrollment.status === 'pending' && (
                  <button
                    onClick={(e) => handleCancel(e, enrollment)}
                    style={{
                      marginTop: 8,
                      padding: '4px 12px',
                      fontSize: 12,
                      borderRadius: 6,
                      border: '1px solid #DC2626',
                      background: 'white',
                      color: '#DC2626',
                      cursor: 'pointer'
                    }}
                  >
                    取消报名
                  </button>
                )}
              </div>
              {getStatusBadge(enrollment.status)}
            </div>
          ))
        )}
        
        <div style={{ marginTop: 24 }}>
          <button className="btn btn-danger" onClick={handleLogout}>
            退出登陆
          </button>
        </div>
      </div>
      
      <div style={{ height: 100 }} />
      
      <BottomNav active="my" />

      {cancelModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: 16,
            padding: 24,
            width: 320,
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>确认取消报名</h3>
            <p style={{ fontSize: 14, color: '#666', marginBottom: 24 }}>
              确定要取消报名"《{cancelModal.title}》"吗？取消后可重新报名。
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setCancelModal(null)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '1px solid #E5E5E5',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                取消
              </button>
              <button
                onClick={confirmCancel}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#DC2626',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyEnrollments;
