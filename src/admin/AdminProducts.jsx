import { useState, useRef } from 'react';
import { useApp } from '../context';
import { fmt } from '../utils';
import { CATEGORIES } from '../data';
import { uploadToCloudinary, getOptimizedUrl } from '../cloudinary';

const BLANK = { name: '', cat: 'dog', price: '', stock: '', img: '🐾', desc: '', imageUrl: '', imagePublicId: '' };

// ── Upload progress overlay ──────────────────────────────────────────────────
function UploadOverlay({ progress }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(255,255,255,.85)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', borderRadius: 12, zIndex: 10,
    }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>☁️</div>
      <p style={{ fontSize: 13, fontWeight: 700, color: '#ff6b35', marginBottom: 8 }}>
        กำลังอัปโหลด {progress}%
      </p>
      <div style={{ width: 140, height: 6, background: '#f0f0f0', borderRadius: 99 }}>
        <div style={{
          height: '100%', borderRadius: 99,
          background: 'linear-gradient(90deg,#ff6b35,#e55a26)',
          width: `${progress}%`, transition: 'width .2s',
        }} />
      </div>
    </div>
  );
}

export default function AdminProducts() {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [search, setSearch] = useState('');
  const [imgPreview, setImgPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef();

  // ── อัปโหลดไปยัง Cloudinary ─────────────────────────────────────────────
  async function handleImageFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('ไฟล์ขนาดใหญ่เกิน 10MB');
      return;
    }

    setUploadError('');
    setUploading(true);
    setUploadProgress(0);

    // แสดง preview ก่อนอัปโหลด
    const reader = new FileReader();
    reader.onload = (e) => setImgPreview(e.target.result);
    reader.readAsDataURL(file);

    try {
      const { url, publicId } = await uploadToCloudinary(file, setUploadProgress);
      // เมื่ออัปโหลดสำเร็จ ใช้ URL จาก Cloudinary
      setImgPreview(url);
      setForm(f => ({ ...f, imageUrl: url, imagePublicId: publicId }));
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError('อัปโหลดไม่สำเร็จ: ' + err.message);
      setImgPreview('');
      setForm(f => ({ ...f, imageUrl: '', imagePublicId: '' }));
    } finally {
      setUploading(false);
    }
  }

  function save() {
    if (uploading) { alert('กรุณารอให้อัปโหลดรูปเสร็จก่อน'); return; }
    const p = { ...form, price: +form.price, stock: +form.stock };
    if (editing) dispatch({ type: 'UPDATE_PRODUCT', product: { ...editing, ...p } });
    else dispatch({ type: 'ADD_PRODUCT', product: p });
    setShowForm(false); setEditing(null); setForm(BLANK);
    setImgPreview(''); setUploadError('');
  }

  function startEdit(p) {
    setEditing(p);
    setForm({
      name: p.name, cat: p.cat, price: String(p.price),
      stock: String(p.stock), img: p.img, desc: p.desc,
      imageUrl: p.imageUrl || '', imagePublicId: p.imagePublicId || '',
    });
    setImgPreview(p.imageUrl || '');
    setUploadError('');
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false); setEditing(null); setForm(BLANK);
    setImgPreview(''); setUploadError('');
  }

  function removeImage() {
    setImgPreview('');
    setForm(f => ({ ...f, imageUrl: '', imagePublicId: '' }));
    setUploadError('');
  }

  const filtered = state.products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  const iStyle = {
    width: '100%', padding: '9px 12px', border: '2px solid #f0f0f0',
    borderRadius: 10, fontSize: 13, marginTop: 4, outline: 'none',
    fontFamily: 'inherit', transition: 'border-color .2s',
  };
  const focusStyle = { borderColor: '#ff6b35', boxShadow: '0 0 0 3px rgba(255,107,53,.15)' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 8 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8, color: '#1a1a2e' }}>📦 จัดการสินค้า</h1>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setForm(BLANK); setImgPreview(''); setUploadError(''); }}
          style={{ background: 'linear-gradient(135deg,#ff6b35,#e55a26)', color: '#fff', border: 'none', borderRadius: 12, padding: '9px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 3px 12px rgba(255,107,53,.35)', fontFamily: 'inherit' }}>
          + เพิ่มสินค้า
        </button>
      </div>

      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหาสินค้า..."
          style={{ width: '100%', padding: '10px 16px 10px 38px', border: '2px solid #f0f0f0', borderRadius: 12, fontSize: 14, outline: 'none', fontFamily: 'inherit', background: '#fff' }}
          onFocus={e => e.target.style.borderColor = '#ff6b35'}
          onBlur={e => e.target.style.borderColor = '#f0f0f0'} />
      </div>

      {showForm && (
        <div style={{ background: '#fff', border: '2px solid #ff6b35', borderRadius: 16, padding: '1.5rem', marginBottom: '1.25rem', boxShadow: '0 4px 24px rgba(255,107,53,.15)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: '1.25rem', color: '#1a1a2e' }}>
            {editing ? '✏️ แก้ไขสินค้า' : '✨ เพิ่มสินค้าใหม่'}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 20 }}>
            {/* Left: form fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>ชื่อสินค้า *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="ชื่อสินค้า" style={iStyle}
                  onFocus={e => Object.assign(e.target.style, focusStyle)}
                  onBlur={e => { e.target.style.borderColor = '#f0f0f0'; e.target.style.boxShadow = 'none'; }} />
              </div>
              <div className="grid-2" style={{ gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>หมวดหมู่</label>
                  <select value={form.cat} onChange={e => setForm({ ...form, cat: e.target.value })}
                    style={{ ...iStyle, background: '#fff', cursor: 'pointer' }}>
                    {Object.entries(CATEGORIES).filter(([k]) => k !== 'all').map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>ไอคอน Emoji</label>
                  <input value={form.img} onChange={e => setForm({ ...form, img: e.target.value })} style={iStyle} placeholder="🐾" />
                </div>
              </div>
              <div className="grid-2" style={{ gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>ราคา (฿) *</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                    style={iStyle}
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e => { e.target.style.borderColor = '#f0f0f0'; e.target.style.boxShadow = 'none'; }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>สต็อก *</label>
                  <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })}
                    style={iStyle}
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e => { e.target.style.borderColor = '#f0f0f0'; e.target.style.boxShadow = 'none'; }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>รายละเอียด</label>
                <textarea value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })}
                  rows={3} style={{ ...iStyle, resize: 'vertical' }}
                  onFocus={e => Object.assign(e.target.style, focusStyle)}
                  onBlur={e => { e.target.style.borderColor = '#f0f0f0'; e.target.style.boxShadow = 'none'; }} />
              </div>
            </div>

            {/* Right: Cloudinary image upload */}
            <div>
              <label style={{ fontSize: 12, color: '#64748b', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                รูปภาพสินค้า
                <span style={{ fontWeight: 400, color: '#94a3b8', marginLeft: 6 }}>(อัปโหลดผ่าน Cloudinary)</span>
              </label>
              <div
                className={`img-upload-box ${imgPreview ? 'has-img' : ''}`}
                onClick={() => !uploading && fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); if (!uploading) { e.currentTarget.style.borderColor = '#ff6b35'; e.currentTarget.style.background = '#fff3ef'; } }}
                onDragLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.background = ''; }}
                onDrop={e => { e.preventDefault(); if (!uploading) handleImageFile(e.dataTransfer.files[0]); }}
                style={{ cursor: uploading ? 'default' : 'pointer', minHeight: 200, position: 'relative' }}
              >
                {uploading && <UploadOverlay progress={uploadProgress} />}

                {imgPreview ? (
                  <div style={{ position: 'relative' }}>
                    <img
                      src={getOptimizedUrl(imgPreview, { width: 440, height: 400 })}
                      alt="preview"
                      style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block', borderRadius: 12 }}
                    />
                    {!uploading && (
                      <button
                        onClick={e => { e.stopPropagation(); removeImage(); }}
                        style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,.6)', color: '#fff', border: 'none', borderRadius: 999, width: 28, height: 28, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        ✕
                      </button>
                    )}
                    {/* แสดง badge Cloudinary เมื่ออัปโหลดสำเร็จ */}
                    {form.imageUrl && form.imageUrl.includes('cloudinary.com') && !uploading && (
                      <span style={{ position: 'absolute', bottom: 6, left: 6, background: 'rgba(0,0,0,.55)', color: '#fff', fontSize: 10, padding: '2px 7px', borderRadius: 6, fontWeight: 600 }}>
                        ☁️ Cloudinary
                      </span>
                    )}
                  </div>
                ) : (
                  <div style={{ padding: 24, textAlign: 'center' }}>
                    <div style={{ fontSize: 40, marginBottom: 8 }}>☁️</div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>คลิกหรือลากรูปมาวาง</p>
                    <p style={{ fontSize: 12, color: '#94a3b8' }}>JPG, PNG, WEBP (สูงสุด 10MB)</p>
                    <p style={{ fontSize: 11, color: '#cbd5e1', marginTop: 6 }}>รูปจะถูกเก็บบน Cloudinary</p>
                  </div>
                )}
              </div>

              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => handleImageFile(e.target.files[0])} />

              {uploadError && (
                <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                  ⚠️ {uploadError}
                </p>
              )}

              {imgPreview && !uploading && (
                <button onClick={() => fileRef.current?.click()}
                  style={{ marginTop: 8, width: '100%', background: '#f8f9fa', border: '1px solid #f0f0f0', borderRadius: 8, padding: '6px', fontSize: 12, cursor: 'pointer', color: '#64748b', fontFamily: 'inherit' }}>
                  🔄 เปลี่ยนรูป
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button onClick={save} disabled={uploading}
              style={{ background: uploading ? '#ccc' : 'linear-gradient(135deg,#ff6b35,#e55a26)', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 24px', fontSize: 14, fontWeight: 700, cursor: uploading ? 'not-allowed' : 'pointer', boxShadow: uploading ? 'none' : '0 3px 12px rgba(255,107,53,.3)', fontFamily: 'inherit' }}>
              {uploading ? '⏳ กำลังอัปโหลด...' : '💾 บันทึกสินค้า'}
            </button>
            <button onClick={cancelForm} disabled={uploading}
              style={{ background: 'none', border: '2px solid #f0f0f0', borderRadius: 10, padding: '9px 18px', fontSize: 14, cursor: 'pointer', color: '#64748b', fontFamily: 'inherit', fontWeight: 600 }}>
              ยกเลิก
            </button>
          </div>
        </div>
      )}

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="nice-table" style={{ minWidth: 520 }}>
            <thead>
              <tr>
                {['สินค้า', 'ราคา', 'สต็อก', 'ขาย', 'จัดการ'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', background: '#fff9f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #f0f0f0' }}>
                        {p.imageUrl
                          ? <img
                              src={getOptimizedUrl(p.imageUrl, { width: 88, height: 88 })}
                              alt={p.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          : <span style={{ fontSize: 24 }}>{p.img}</span>
                        }
                      </div>
                      <span style={{ fontWeight: 600, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', color: '#1a1a2e' }}>{p.name}</span>
                    </div>
                  </td>
                  <td><span style={{ fontWeight: 700, color: '#ff6b35' }}>{fmt(p.price)}</span></td>
                  <td>
                    <span style={{ fontWeight: 700, color: p.stock === 0 ? '#ef4444' : p.stock < 10 ? '#f59e0b' : '#10b981', background: p.stock === 0 ? '#fef2f2' : p.stock < 10 ? '#fffbeb' : '#ecfdf5', padding: '2px 8px', borderRadius: 999, fontSize: 12 }}>
                      {p.stock}
                    </span>
                  </td>
                  <td style={{ color: '#64748b', fontWeight: 600 }}>{p.sold || 0}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => startEdit(p)}
                        style={{ background: '#fff3ef', color: '#e55a26', border: 'none', borderRadius: 8, padding: '5px 12px', fontSize: 12, cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>
                        ✏️ แก้ไข
                      </button>
                      <button onClick={() => { if (window.confirm('ลบสินค้านี้?')) dispatch({ type: 'DELETE_PRODUCT', id: p.id }); }}
                        style={{ background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: 8, padding: '5px 12px', fontSize: 12, cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>
                        🗑️ ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
