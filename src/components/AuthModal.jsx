import { useState } from 'react';
import { useApp } from '../context';

export default function AuthModal() {
  const { state, dispatch } = useApp();
  const [form, setForm] = useState({ name: '', email: '', pass: '', pass2: '' });
  const [err, setErr] = useState('');
  const isLogin = state.authView === 'login';

  function submit() {
    setErr('');
    if (isLogin) {
      const u = state.users.find(u => u.email === form.email);
      if (!u) { setErr('ไม่พบอีเมลนี้'); return; }
      if (form.pass !== u.password) { setErr('รหัสผ่านไม่ถูกต้อง'); return; }
      dispatch({ type: 'LOGIN', user: u });
    } else {
      if (!form.name || !form.email || !form.pass) { setErr('กรุณากรอกข้อมูลให้ครบ'); return; }
      if (form.pass !== form.pass2) { setErr('รหัสผ่านไม่ตรงกัน'); return; }
      if (state.users.find(u => u.email === form.email)) { setErr('อีเมลนี้ถูกใช้แล้ว'); return; }
      dispatch({ type: 'REGISTER', user: { name: form.name, email: form.email, password: form.pass } });
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb',
    borderRadius: 8, fontSize: 14, background: '#f9fafb', outline: 'none',
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
      onClick={e => e.target === e.currentTarget && dispatch({ type: 'SET_AUTH_VIEW', view: null })}
    >
      <div style={{ background: '#fff', borderRadius: 16, padding: '2rem', width: 'min(420px,92vw)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>{isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}</h2>
          <button onClick={() => dispatch({ type: 'SET_AUTH_VIEW', view: null })} style={{ background: 'none', border: 'none', fontSize: 20, color: '#6b7280', cursor: 'pointer' }}>✕</button>
        </div>

        {!isLogin && (
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 4 }}>ชื่อ-นามสกุล</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="ชื่อ นามสกุล" style={inputStyle} />
          </div>
        )}

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 4 }}>อีเมล</label>
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" style={inputStyle} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 4 }}>รหัสผ่าน</label>
          <input type="password" value={form.pass} onChange={e => setForm({ ...form, pass: e.target.value })} placeholder="รหัสผ่าน" style={inputStyle} />
        </div>

        {!isLogin && (
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 4 }}>ยืนยันรหัสผ่าน</label>
            <input type="password" value={form.pass2} onChange={e => setForm({ ...form, pass2: e.target.value })} placeholder="ยืนยันรหัสผ่าน" style={inputStyle} />
          </div>
        )}

        {err && (
          <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 12, background: '#fef2f2', padding: '8px 12px', borderRadius: 8 }}>{err}</p>
        )}

        {isLogin && (
          <div style={{ marginBottom: 12, fontSize: 12, color: '#6b7280', background: '#f0fdf4', padding: '8px 12px', borderRadius: 8 }}>
            💡 ทดสอบ: admin@petmart.com (รหัส: admin1234) หรือ somchai@gmail.com (รหัส: 1234)
          </div>
        )}

        <button onClick={submit} style={{ width: '100%', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: 12 }}>
          {isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280' }}>
          {isLogin ? 'ยังไม่มีบัญชี? ' : 'มีบัญชีแล้ว? '}
          <button
            onClick={() => dispatch({ type: 'SET_AUTH_VIEW', view: isLogin ? 'register' : 'login' })}
            style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
          >
            {isLogin ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
          </button>
        </p>
      </div>
    </div>
  );
}
