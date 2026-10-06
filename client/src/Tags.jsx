import React, { useState, useEffect } from 'react';
import { Plus, X, Tag, Edit2, Trash2 } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

export default function Tags() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTag, setEditingTag] = useState(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const res = await fetch(`${API_URL}/tags`);
      const data = await res.json();
      setTags(data || []);
    } catch (err) {
      console.error('Failed to fetch tags:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const tagData = {
      name: formData.get('name'),
      color: formData.get('color') || '#9ca3af'
    };

    try {
      const url = editingTag
        ? `${API_URL}/tags/${editingTag.id}`
        : `${API_URL}/tags`;
      const method = editingTag ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tagData)
      });

      if (res.ok) {
        setShowModal(false);
        setEditingTag(null);
        fetchTags();
      }
    } catch (err) {
      console.error('Failed to save tag:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this tag?')) return;
    try {
      const res = await fetch(`${API_URL}/tags/${id}`, { method: 'DELETE' });
      if (res.ok) fetchTags();
    } catch (err) {
      console.error('Failed to delete tag:', err);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="tags-page">
      <div className="flex items-center justify-between mb-4">
        <p className="text-muted">Organize trades with custom tags</p>
        <button className="btn btn-primary" onClick={() => { setEditingTag(null); setShowModal(true); }}>
          <Plus size={16} />
          Add Tag
        </button>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
        {tags.map((tag) => (
          <div key={tag.id} className="card" style={{ borderLeft: `3px solid ${tag.color}` }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Tag size={20} style={{ color: tag.color }} />
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{tag.name}</h3>
                  <p className="text-muted" style={{ fontSize: '12px' }}>
                    Used in {tag.usage_count || 0} trades
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => { setEditingTag(tag); setShowModal(true); }}
                >
                  <Edit2 size={14} />
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => handleDelete(tag.id)}
                  style={{ color: '#ef4444' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tags.length === 0 && (
        <div className="empty-state card">
          <Tag className="empty-state-icon" size={48} />
          <h3 className="empty-state-title">No Tags Yet</h3>
          <p className="empty-state-text">Create tags to categorize your trades</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} />
            Create First Tag
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingTag ? 'Edit Tag' : 'New Tag'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="label">Tag Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="input"
                    placeholder="High Confidence"
                    defaultValue={editingTag?.name}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="label">Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      name="color"
                      defaultValue={editingTag?.color || '#00d4ff'}
                      style={{ width: '50px', height: '40px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      className="input"
                      defaultValue={editingTag?.color || '#00d4ff'}
                      pattern="^#[0-9A-Fa-f]{6}$"
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTag ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}