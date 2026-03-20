import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

function EnrollmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState(null);

  useEffect(() => {
    fetchEnrollment();
  }, [id]);

  const fetchEnrollment = async () => {
    try {
      const res = await fetch(`/api/enrollments/${id}`);
      const data = await res.json();
      setEnrollment(data);
    } catch (e) {
      console.error('Failed to fetch enrollment');
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

  if (!enrollment) return <div className="container">加载中...</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', gap: 16 }}>
        <button onClick={() => navigate('/my')} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>←</button>
        <span style={{ fontSize: 11, letterSpacing: 2, color: '#888', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase' }}>详情</span>
      </div>
      <div className="page" style={{ paddingTop: 0 }}>
        <h1 style={{ fontFamily: 'Newsreader, serif', fontSize: 28, fontWeight: 500, lineHeight: 1.1, marginBottom: 8 }}>{enrollment.title}</h1>
        <p className="page-desc">查看已提交资料、活动时间与审核状态。当前记录来自"我的报名"。</p>
        
        <div className="card">
          <div className="form-row">
            <span className="form-row-label">审核状态</span>
            {getStatusBadge(enrollment.status)}
          </div>
          <div className="form-row">
            <span className="form-row-label">活动地点</span>
            <span className="form-row-value">{enrollment.location}</span>
          </div>
          <div className="form-row">
            <span className="form-row-label">活动时间</span>
            <span className="form-row-value">{enrollment.start_time?.slice(0, 10)}</span>
          </div>
        </div>
        
        <div className="card" style={{ marginTop: 12 }}>
          <div className="form-row">
            <span className="form-row-label">姓名</span>
            <span className="form-row-value">{enrollment.name}</span>
          </div>
          <div className="form-row">
            <span className="form-row-label">年龄</span>
            <span className="form-row-value">{enrollment.age}岁</span>
          </div>
          <div className="form-row">
            <span className="form-row-label">性别</span>
            <span className="form-row-value">{enrollment.gender}</span>
          </div>
          <div className="form-row">
            <span className="form-row-label">身份证号</span>
            <span className="form-row-value">{enrollment.id_card}</span>
          </div>
          <div className="form-row">
            <span className="form-row-label">职业</span>
            <span className="form-row-value">{enrollment.occupation}</span>
          </div>
        </div>
        
        <div className="card" style={{ marginTop: 12 }}>
          <p style={{ fontWeight: 600, marginBottom: 8 }}>审核说明</p>
          <p style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>
            {enrollment.remark || '工作人员正在核验您的报名资料。审核通过后将发送活动通知，若资料不完整将提示补充。'}
          </p>
        </div>
        
        <button className="btn btn-primary mt-24" onClick={() => navigate('/my')}>
          返回我的报名
        </button>
      </div>
      
      <div style={{ height: 100 }} />
      
      <BottomNav active="my" />
    </div>
  );
}

export default EnrollmentDetail;
