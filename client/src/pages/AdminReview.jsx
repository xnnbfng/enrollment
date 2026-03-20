import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

function AdminReview() {
  const [enrollments, setEnrollments] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [selectedIds, setSelectedIds] = useState([]);
  const [detailModal, setDetailModal] = useState(null);

  const isAllSelected = enrollments.length > 0 && selectedIds.length === enrollments.length;

  useEffect(() => {
    fetchEnrollments();
  }, [filter]);

  const fetchEnrollments = async () => {
    try {
      const url = filter ? `/api/admin/enrollments?status=${filter}` : '/api/admin/enrollments';
      const res = await fetch(url);
      const data = await res.json();
      setEnrollments(data);
    } catch (e) {
      console.error('Failed to fetch enrollments');
    }
  };

  const handleReview = async (id, status) => {
    try {
      await fetch(`/api/admin/enrollments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, remark: '' })
      });
      fetchEnrollments();
      if (detailModal?.id === id) {
        setDetailModal(null);
      }
    } catch (e) {
      alert('操作失败');
    }
  };

  const handleBatchReview = async (status) => {
    if (selectedIds.length === 0) return;
    for (const id of selectedIds) {
      await handleReview(id, status);
    }
    setSelectedIds([]);
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(enrollments.map(e => e.id));
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

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return '待审核';
      case 'approved': return '已通过';
      case 'rejected': return '已拒绝';
      default: return status;
    }
  };

  const handleExport = () => {
    const headers = ['姓名', '年龄', '性别', '电话', '身份证号', '职业', '登录手机号', '紧急联系人', '紧急联系电话'];
    const rows = enrollments.map(e => [
      e.name,
      e.age,
      e.gender,
      e.phone || '-',
      e.id_card,
      e.occupation || '-',
      e.login_phone,
      e.emergency_contact,
      e.emergency_phone
    ]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const filterText = filter === '' ? '全部' : getStatusText(filter);
    link.download = `报名审核_${filterText}_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.csv`;
    link.click();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>审核管理</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          {selectedIds.length > 0 && (
            <>
              <button
                onClick={() => handleBatchReview('approved')}
                style={{
                  padding: '12px 16px',
                  background: '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: 12,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                批量通过 ({selectedIds.length})
              </button>
              <button
                onClick={() => handleBatchReview('rejected')}
                style={{
                  padding: '12px 16px',
                  background: '#EF4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: 12,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                批量拒绝
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{
        background: 'white',
        borderRadius: 16,
        padding: 20,
        border: '1px solid #E5EAF3',
        marginBottom: 16,
        display: 'flex',
        gap: 12
      }}>
        <button
          onClick={() => setFilter('pending')}
          style={{
            padding: '12px 16px',
            borderRadius: 12,
            border: filter === 'pending' ? 'none' : '1px solid #E5EAF3',
            background: filter === 'pending' ? '#2563EB' : 'white',
            color: filter === 'pending' ? 'white' : '#333',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          待审核
        </button>
        <button
          onClick={() => setFilter('approved')}
          style={{
            padding: '12px 16px',
            borderRadius: 12,
            border: filter === 'approved' ? 'none' : '1px solid #E5EAF3',
            background: filter === 'approved' ? '#2563EB' : 'white',
            color: filter === 'approved' ? 'white' : '#333',
            cursor: 'pointer'
          }}
        >
          已通过
        </button>
        <button
          onClick={() => setFilter('rejected')}
          style={{
            padding: '12px 16px',
            borderRadius: 12,
            border: filter === 'rejected' ? 'none' : '1px solid #E5EAF3',
            background: filter === 'rejected' ? '#2563EB' : 'white',
            color: filter === 'rejected' ? 'white' : '#333',
            cursor: 'pointer'
          }}
        >
          已拒绝
        </button>
        <button
          onClick={() => setFilter('')}
          style={{
            padding: '12px 16px',
            borderRadius: 12,
            border: filter === '' ? 'none' : '1px solid #E5EAF3',
            background: filter === '' ? '#2563EB' : 'white',
            color: filter === '' ? 'white' : '#333',
            cursor: 'pointer'
          }}
        >
          全部
        </button>
        <button
          onClick={handleExport}
          style={{
            padding: '12px 16px',
            borderRadius: 12,
            border: '1px solid #10B981',
            background: '#10B981',
            color: 'white',
            cursor: 'pointer',
            marginLeft: 'auto'
          }}
        >
          导出
        </button>
      </div>

      {selectedIds.length > 0 && (
        <div style={{
          background: '#EFF6FF',
          borderRadius: 12,
          padding: '12px 16px',
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '1px solid #BFDBFE'
        }}>
          <span>已选择 {selectedIds.length} 项</span>
          <button
            onClick={() => setSelectedIds([])}
            style={{
              padding: '8px 12px',
              borderRadius: 10,
              border: '1px solid #BFDBFE',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            清除选择
          </button>
        </div>
      )}

      <div style={{
        background: 'white',
        borderRadius: 16,
        border: '1px solid #E5EAF3',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', textAlign: 'left', position: 'sticky', top: 0, zIndex: 1 }}>
              <th style={{ padding: '16px 20px', fontWeight: 600, width: 60 }}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  style={{ width: 18, height: 18, cursor: 'pointer' }}
                />
              </th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>报名人</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>活动</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>手机号</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>状态</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>报名时间</th>
              <th style={{ padding: '16px 20px', fontWeight: 600 }}>操作</th>
            </tr>
          </thead>
        </table>
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 350px)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <tbody>
            {enrollments.map(enrollment => (
              <tr key={enrollment.id} style={{ borderBottom: '1px solid #EEF2F7' }}>
                <td style={{ padding: '18px 20px', width: 60 }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(enrollment.id)}
                    onChange={() => toggleSelect(enrollment.id)}
                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                  />
                </td>
                <td style={{ padding: '18px 20px' }}>
                  <div style={{ fontWeight: 600 }}>{enrollment.name}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>{enrollment.id_card}</div>
                </td>
                <td style={{ padding: '18px 20px' }}>{enrollment.activity_title}</td>
                <td style={{ padding: '18px 20px' }}>{enrollment.phone}</td>
                <td style={{ padding: '18px 20px' }}>{getStatusBadge(enrollment.status)}</td>
                <td style={{ padding: '18px 20px' }}>{enrollment.created_at?.slice(0, 10)}</td>
                <td style={{ padding: '18px 20px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => setDetailModal(enrollment)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: '1px solid #E5EAF3',
                        background: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      详情
                    </button>
                    {enrollment.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleReview(enrollment.id, 'approved')}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 6,
                            border: 'none',
                            background: '#10B981',
                            color: 'white',
                            cursor: 'pointer'
                          }}
                        >
                          通过
                        </button>
                        <button
                          onClick={() => handleReview(enrollment.id, 'rejected')}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 6,
                            border: 'none',
                            background: '#EF4444',
                            color: 'white',
                            cursor: 'pointer'
                          }}
                        >
                          拒绝
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {detailModal && (
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
            width: 500,
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>报名详情</h2>
              <button
                onClick={() => setDetailModal(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: '#2563EB' }}>活动信息</h3>
              <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 12 }}>
                <div style={{ display: 'flex', marginBottom: 8 }}>
                  <span style={{ width: 100, color: '#666' }}>活动名称</span>
                  <span style={{ fontWeight: 500 }}>{detailModal.activity_title}</span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: '#2563EB' }}>报名信息</h3>
              <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 12 }}>
                <div style={{ display: 'flex', marginBottom: 8 }}>
                  <span style={{ width: 100, color: '#666' }}>姓名</span>
                  <span style={{ fontWeight: 500 }}>{detailModal.name}</span>
                </div>
                <div style={{ display: 'flex', marginBottom: 8 }}>
                  <span style={{ width: 100, color: '#666' }}>年龄</span>
                  <span style={{ fontWeight: 500 }}>{detailModal.age}岁</span>
                </div>
                <div style={{ display: 'flex', marginBottom: 8 }}>
                  <span style={{ width: 100, color: '#666' }}>性别</span>
                  <span style={{ fontWeight: 500 }}>{detailModal.gender}</span>
                </div>
                <div style={{ display: 'flex', marginBottom: 8 }}>
                  <span style={{ width: 100, color: '#666' }}>电话</span>
                  <span style={{ fontWeight: 500 }}>{detailModal.phone || '-'}</span>
                </div>
                <div style={{ display: 'flex', marginBottom: 8 }}>
                  <span style={{ width: 100, color: '#666' }}>身份证号</span>
                  <span style={{ fontWeight: 500 }}>{detailModal.id_card}</span>
                </div>
                <div style={{ display: 'flex', marginBottom: 8 }}>
                  <span style={{ width: 100, color: '#666' }}>职业</span>
                  <span style={{ fontWeight: 500 }}>{detailModal.occupation || '-'}</span>
                </div>
                <div style={{ display: 'flex', marginBottom: 8 }}>
                  <span style={{ width: 100, color: '#666' }}>登录手机号</span>
                  <span style={{ fontWeight: 500 }}>{detailModal.login_phone}</span>
                </div>
                <div style={{ display: 'flex', marginBottom: 8 }}>
                  <span style={{ width: 100, color: '#666' }}>紧急联系人</span>
                  <span style={{ fontWeight: 500 }}>{detailModal.emergency_contact}</span>
                </div>
                <div style={{ display: 'flex' }}>
                  <span style={{ width: 100, color: '#666' }}>紧急联系电话</span>
                  <span style={{ fontWeight: 500 }}>{detailModal.emergency_phone}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              {detailModal.status === 'pending' ? (
                <>
                  <button
                    onClick={() => handleReview(detailModal.id, 'approved')}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: 'none',
                      background: '#10B981',
                      color: 'white',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    通过
                  </button>
                  <button
                    onClick={() => handleReview(detailModal.id, 'rejected')}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: 8,
                      border: 'none',
                      background: '#EF4444',
                      color: 'white',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    拒绝
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setDetailModal(null)}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: '1px solid #E5EAF3',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  关闭
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminReview;
