// ===================================
// Firestore Service — CRUD ทุก collection
// ===================================
import {
  collection, doc, getDocs, getDoc,
  addDoc, setDoc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp, writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';

// ── helpers ───────────────────────────────────────────────────────────────────
const col = (name) => collection(db, name);
const ref = (name, id) => doc(db, name, String(id));

// ── PRODUCTS ──────────────────────────────────────────────────────────────────
export async function getProducts() {
  const snap = await getDocs(query(col('products'), orderBy('id')));
  return snap.docs.map(d => ({ ...d.data(), _docId: d.id }));
}

export async function addProduct(product) {
  const docRef = await addDoc(col('products'), {
    ...product,
    sold: 0,
    rating: 4.0,
    reviews: 0,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProduct(product) {
  await updateDoc(ref('products', product.id), {
    name:     product.name,
    cat:      product.cat,
    price:    product.price,
    stock:    product.stock,
    img:      product.img,
    desc:     product.desc,
    imageUrl: product.imageUrl || '',
    imagePublicId: product.imagePublicId || '',
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(id) {
  await deleteDoc(ref('products', id));
}

// ── ORDERS ────────────────────────────────────────────────────────────────────
export async function getOrders() {
  const snap = await getDocs(query(col('orders'), orderBy('date', 'desc')));
  return snap.docs.map(d => ({ ...d.data(), _docId: d.id }));
}

export async function placeOrder(order) {
  const docRef = await addDoc(col('orders'), {
    ...order,
    date: new Date().toISOString().slice(0, 10),
    status: 'pending',
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateOrderStatus(id, status) {
  await updateDoc(ref('orders', id), { status, updatedAt: serverTimestamp() });
}

// ── USERS ─────────────────────────────────────────────────────────────────────
export async function getUsers() {
  const snap = await getDocs(col('users'));
  return snap.docs.map(d => ({ ...d.data(), _docId: d.id }));
}

export async function createUser(user) {
  // ใช้ id เป็น document key เพื่อให้ค้นหาง่าย
  await setDoc(ref('users', user.id), {
    ...user,
    createdAt: serverTimestamp(),
  });
}

export async function updateUser(user) {
  await updateDoc(ref('users', user.id), {
    name: user.name,
    active: user.active,
    updatedAt: serverTimestamp(),
  });
}

// ── SEED (เพิ่มข้อมูลตั้งต้นเข้า Firestore ครั้งเดียว) ─────────────────────
export async function seedDatabase(products, orders, users) {
  // ตรวจว่า seed แล้วยัง
  const existSnap = await getDocs(col('products'));
  if (!existSnap.empty) {
    console.log('🌱 Database already seeded, skipping.');
    return false;
  }

  const batch = writeBatch(db);

  // seed products
  products.forEach((p) => {
    const d = doc(db, 'products', String(p.id));
    batch.set(d, { ...p, createdAt: serverTimestamp() });
  });

  // seed users
  users.forEach((u) => {
    const d = doc(db, 'users', String(u.id));
    batch.set(d, { ...u, createdAt: serverTimestamp() });
  });

  // seed orders
  orders.forEach((o) => {
    const d = doc(db, 'orders', o.id);
    batch.set(d, { ...o, createdAt: serverTimestamp() });
  });

  await batch.commit();
  console.log('✅ Database seeded successfully!');
  return true;
}
