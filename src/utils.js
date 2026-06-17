export const fmt = (n) => new Intl.NumberFormat('th-TH').format(n) + ' ฿';

export function Stars({ r, size = 14 }) {
  return (
    <span style={{ fontSize: size, color: '#f59e0b' }}>
      {'★'.repeat(Math.floor(r))}{'☆'.repeat(5 - Math.floor(r))}
      <span style={{ fontSize: 12, color: '#6b7280', marginLeft: 4 }}>{r}</span>
    </span>
  );
}

export function Badge({ color, children }) {
  const colors = {
    green: { bg: '#d1fae5', c: '#065f46' },
    yellow: { bg: '#fef3c7', c: '#92400e' },
    blue: { bg: '#dbeafe', c: '#1e40af' },
    red: { bg: '#fee2e2', c: '#991b1b' },
    gray: { bg: '#f3f4f6', c: '#374151' },
    purple: { bg: '#ede9fe', c: '#5b21b6' },
  };
  const s = colors[color] || colors.gray;
  return (
    <span style={{ background: s.bg, color: s.c, fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999 }}>
      {children}
    </span>
  );
}

export const STATUS_MAP = {
  pending:    { color: 'yellow', label: 'รอดำเนินการ' },
  processing: { color: 'blue',   label: 'กำลังเตรียม' },
  shipped:    { color: 'purple', label: 'จัดส่งแล้ว' },
  delivered:  { color: 'green',  label: 'ส่งถึงแล้ว' },
  cancelled:  { color: 'red',    label: 'ยกเลิก' },
};

export const StatusBadge = ({ status }) => {
  const s = STATUS_MAP[status] || { color: 'gray', label: status };
  return <Badge color={s.color}>{s.label}</Badge>;
};
