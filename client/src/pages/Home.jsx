import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

function Home() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [enrollments, setEnrollments] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchActivities();
    if (user.id) {
      fetchEnrollments();
    }
  }, []);

  const fetchActivities = async (searchTerm = '') => {
    try {
      const url = searchTerm 
        ? `/api/activities?search=${encodeURIComponent(searchTerm)}`
        : '/api/activities';
      const res = await fetch(url);
      const data = await res.json();
      setActivities(data);
    } catch (e) {
      console.error('Failed to fetch activities');
    }
  };

  const fetchEnrollments = async () => {
    try {
      const res = await fetch(`/api/enrollments/my?user_id=${user.id}`);
      const data = await res.json();
      setEnrollments(data);
    } catch (e) {
      console.error('Failed to fetch enrollments');
    }
  };

  const handleActivityClick = (activity) => {
    if (activity.status === 'closed') {
      alert('此活动已结束，您无法报名');
      return;
    }
    if (activity.status === 'upcoming') {
      alert('此活动报名未开始，请耐心等待');
      return;
    }
    const alreadyEnrolled = enrollments.some(e => e.activity_id === activity.id);
    if (alreadyEnrolled) {
      alert('您已经报名无法再次报名');
      return;
    }
    navigate(`/enroll/${activity.id}`);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchActivities(value);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const filteredActivities = statusFilter === 'all' 
    ? activities 
    : activities.filter(a => a.status === statusFilter);

  return (
    <div className="container">
      <div className="page">
        <div style={{ height: 8 }} />
        
        <div className="search-box">
          <span style={{ color: '#AAA' }}>🔍</span>
          <input
            type="text"
            placeholder="搜索活动名称 / 地点 / 主办方"
            value={search}
            onChange={handleSearch}
          />
        </div>
        
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button
            onClick={() => setStatusFilter('all')}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              border: 'none',
              background: statusFilter === 'all' ? '#0D6E6E' : '#F0F0F0',
              color: statusFilter === 'all' ? 'white' : '#666',
              fontSize: 13,
              cursor: 'pointer'
            }}
          >
            全部
          </button>
          <button
            onClick={() => setStatusFilter('upcoming')}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              border: 'none',
              background: statusFilter === 'upcoming' ? '#0D6E6E' : '#F0F0F0',
              color: statusFilter === 'upcoming' ? 'white' : '#666',
              fontSize: 13,
              cursor: 'pointer'
            }}
          >
            未开始
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              border: 'none',
              background: statusFilter === 'active' ? '#0D6E6E' : '#F0F0F0',
              color: statusFilter === 'active' ? 'white' : '#666',
              fontSize: 13,
              cursor: 'pointer'
            }}
          >
            报名中
          </button>
          <button
            onClick={() => setStatusFilter('closed')}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              border: 'none',
              background: statusFilter === 'closed' ? '#0D6E6E' : '#F0F0F0',
              color: statusFilter === 'closed' ? 'white' : '#666',
              fontSize: 13,
              cursor: 'pointer'
            }}
          >
            已结束
          </button>
        </div>
        
        <p style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>
          共 {filteredActivities.length} 个活动
        </p>
        
        {filteredActivities.map(activity => {
            const formatTime = (time) => {
              if (!time) return '-';
              return time.slice(0, 16).replace(' ', ' ');
            };
            return (
              <div
                key={activity.id}
                className="activity-card"
                onClick={() => handleActivityClick(activity)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="activity-card-title">{activity.title}</div>
                  <span className={`badge ${activity.status === 'active' ? 'badge-pending' : activity.status === 'upcoming' ? 'badge-approved' : 'badge-rejected'}`}>
                    {activity.status === 'active' ? '报名中' : activity.status === 'upcoming' ? '未开始' : '已结束'}
                  </span>
                </div>
                <div className="activity-card-meta">
                  <span>🏢 {activity.organizer}</span>
                </div>
                <div className="activity-card-meta">
                  <span>📍 {activity.location}</span>
                </div>
                <div className="activity-card-time">
                  <span>🕐 {formatTime(activity.start_time)}</span>
                  <span>至</span>
                  <span>{formatTime(activity.end_time)}</span>
                </div>
              </div>
            );
          })}
      </div>
      
      <div style={{ height: 100 }} />
      
      <BottomNav active="home" />
    </div>
  );
}

export default Home;
