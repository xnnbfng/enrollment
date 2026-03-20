import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

function AdminActivities() {
  const [activities, setActivities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    organizer: '',
    start_time: '',
    end_time: '',
    capacity: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [enrollmentModal, setEnrollmentModal] = useState(null);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await fetch('/api/activities?status=');
      const data = await res.json();
      setActivities(data);
    } catch (e) {
      console.error('Failed to fetch activities');
    }
  };

  const handleShowEnrollments = async (activity) => {
    try {
      const res = await fetch(`/api/admin/activities/${activity.id}/enrollments`);
      const data = await res.json();
      setEnrollments(data);
      setEnrollmentModal(activity);
    } catch (e) {
      console.error('Failed to fetch enrollments');
    }
  };

const handleSubmit = async () => {
    if (!form.title) {
      alert('请填写活动标题');
      return;
    }
    const formatForBackend = (dt) => {
      if (!dt) return '';
      return dt.replace('T', ' ') + ':00';
    };
    const payload = {
      ...form,
      start_time: formatForBackend(form.start_time),
      end_time: formatForBackend(form.end_time)
    };
    if (form.start_time && form.end_time && new Date(form.end_time) < new Date(form.start_time)) {
      alert('结束时间不能早于开始时间');
      return;
    }
    try {
      if (editingId) {
        await fetch(`/api/admin/activities/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch('/api/admin/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      setShowForm(false);
      setForm({ title: '', description: '', location: '', organizer: '', start_time: '', end_time: '', capacity: '' });
      setEditingId(null);
      fetchActivities();
    } catch (e) {
      alert('操作失败');
    }
  };

  const handleStartTimeChange = (e) => {
    const newStartTime = e.target.value;
    setForm({...form, start_time: newStartTime});
    if (form.end_time && new Date(form.end_time) < new Date(newStartTime)) {
      setForm({...form, start_time: newStartTime, end_time: newStartTime});
    }
  };

  const handleEdit = (activity) => {
    const formatDateTime = (dt) => {
      if (!dt) return '';
      return dt.replace(' ', 'T').slice(0, 16);
    };
    setForm({
      ...activity,
      start_time: formatDateTime(activity.start_time),
      end_time: formatDateTime(activity.end_time)
    });
    setEditingId(activity.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('确认删除？')) return;
    try {
      await fetch(`/api/admin/activities/${id}`, { method: 'DELETE' });
      fetchActivities();
    } catch (e) {
      alert('删除失败');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>活动管理</h1>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ title: '', description: '', location: '', organizer: '', start_time: '', end_time: '', capacity: '' }); }}
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
          + 新建活动
        </button>
      </div>

      {showForm && (
        <div style={{
          background: 'white',
          borderRadius: 16,
          padding: 24,
          border: '1px solid #E5EAF3',
          marginBottom: 24
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
            {editingId ? '编辑活动' : '新建活动'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input
              placeholder="活动标题"
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              style={{ padding: 12, borderRadius: 8, border: '1px solid #E5EAF3' }}
            />
            <input
              placeholder="主办方"
              value={form.organizer}
              onChange={e => setForm({...form, organizer: e.target.value})}
              style={{ padding: 12, borderRadius: 8, border: '1px solid #E5EAF3' }}
            />
            <input
              placeholder="活动地点"
              value={form.location}
              onChange={e => setForm({...form, location: e.target.value})}
              style={{ padding: 12, borderRadius: 8, border: '1px solid #E5EAF3' }}
            />
            <input
              type="number"
              placeholder="名额"
              value={form.capacity}
              onChange={e => setForm({...form, capacity: e.target.value})}
              style={{ padding: 12, borderRadius: 8, border: '1px solid #E5EAF3' }}
            />
            <input
              type="datetime-local"
              placeholder="开始时间"
              value={form.start_time}
              onChange={handleStartTimeChange}
              style={{ padding: 12, borderRadius: 8, border: '1px solid #E5EAF3' }}
            />
            <input
              type="datetime-local"
              placeholder="结束时间"
              value={form.end_time}
              min={form.start_time}
              onChange={e => setForm({...form, end_time: e.target.value})}
              style={{ padding: 12, borderRadius: 8, border: '1px solid #E5EAF3' }}
            />
          </div>
          <textarea
            placeholder="活动描述"
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #E5EAF3', marginTop: 12, minHeight: 80 }}
          />
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button
              onClick={handleSubmit}
              style={{
                padding: '12px 24px',
                background: '#2563EB',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              保存
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{
                padding: '12px 24px',
                background: 'white',
                border: '1px solid #E5EAF3',
                borderRadius: 8,
                cursor: 'pointer'
              }}
            >
              取消
            </button>
          </div>
        </div>
      )}

      <div style={{
        background: 'white',
        borderRadius: 16,
        border: '1px solid #E5EAF3',
        overflow: 'hidden'
      }}>
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 280px)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', textAlign: 'left', position: 'sticky', top: 0, zIndex: 1 }}>
                <th style={{ padding: '16px 20px', fontWeight: 600 }}>活动名称</th>
                <th style={{ padding: '16px 20px', fontWeight: 600 }}>开始时间</th>
                <th style={{ padding: '16px 20px', fontWeight: 600 }}>结束时间</th>
                <th style={{ padding: '16px 20px', fontWeight: 600 }}>地点</th>
                <th style={{ padding: '16px 20px', fontWeight: 600 }}>名额</th>
                <th style={{ padding: '16px 20px', fontWeight: 600 }}>状态</th>
                <th style={{ padding: '16px 20px', fontWeight: 600 }}>操作</th>
              </tr>
            </thead>
            <tbody>
            {activities.map(activity => {
            const now = new Date();
            const startTime = new Date(activity.start_time);
            const endTime = new Date(activity.end_time);
            let displayStatus = '已结束';
            if (now < startTime) displayStatus = '未开始';
            else if (now >= startTime && now <= endTime) displayStatus = '报名中';
            
            return (
              <tr key={activity.id} style={{ borderBottom: '1px solid #EEF2F7' }}>
                <td style={{ padding: '20px 20px' }}>
                  <div style={{ fontWeight: 600, marginBottom: 4, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={activity.title}>{activity.title.length > 8 ? activity.title.slice(0, 8) + '...' : activity.title}</div>
                  <div style={{ fontSize: 13, color: '#888' }}>{activity.organizer}</div>
                </td>
                <td style={{ padding: '20px 20px', fontSize: 14 }}>{activity.start_time?.slice(0, 16).replace(' ', ' ')}</td>
                <td style={{ padding: '20px 20px', fontSize: 14 }}>{activity.end_time?.slice(0, 16).replace(' ', ' ')}</td>
                <td style={{ padding: '20px 20px', fontSize: 14, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={activity.location}>{activity.location.length > 6 ? activity.location.slice(0, 6) + '...' : activity.location}</td>
                <td style={{ padding: '20px 20px', fontSize: 14, whiteSpace: 'nowrap' }}>{activity.capacity}</td>
                <td style={{ padding: '20px 20px' }}>
                  <span className={`badge ${displayStatus === '报名中' ? 'badge-pending' : displayStatus === '未开始' ? 'badge-approved' : 'badge-rejected'}`}>
                    {displayStatus}
                  </span>
                </td>
                <td style={{ padding: '20px 20px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => handleEdit(activity)} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #E5EAF3', background: 'white', cursor: 'pointer', fontSize: 13 }}>编辑</button>
                    <button onClick={() => handleShowEnrollments(activity)} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #E5EAF3', background: 'white', cursor: 'pointer', fontSize: 13 }}>已报名</button>
                    <button onClick={() => handleDelete(activity.id)} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #FEE2E2', background: '#FEF2F2', color: '#DC2626', cursor: 'pointer', fontSize: 13 }}>删除</button>
                  </div>
                </td>
              </tr>
            );
            })}
            </tbody>
          </table>
        </div>
      </div>

      {enrollmentModal && (
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
            width: 700,
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>报名列表 - {enrollmentModal.title}</h2>
              <button
                onClick={() => setEnrollmentModal(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>
            
            {enrollments.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#888', padding: 40 }}>暂无报名</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'left' }}>姓名</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'left' }}>年龄</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'left' }}>性别</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'left' }}>电话</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'left' }}>登录手机号</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, textAlign: 'left' }}>状态</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map(e => (
                    <tr key={e.id} style={{ borderBottom: '1px solid #EEF2F7' }}>
                      <td style={{ padding: '12px 16px' }}>{e.name}</td>
                      <td style={{ padding: '12px 16px' }}>{e.age}</td>
                      <td style={{ padding: '12px 16px' }}>{e.gender}</td>
                      <td style={{ padding: '12px 16px' }}>{e.phone || '-'}</td>
                      <td style={{ padding: '12px 16px' }}>{e.login_phone}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span className={`badge ${e.status === 'approved' ? 'badge-approved' : e.status === 'rejected' ? 'badge-rejected' : 'badge-pending'}`}>
                          {e.status === 'pending' ? '待审核' : e.status === 'approved' ? '已通过' : '已拒绝'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminActivities;
