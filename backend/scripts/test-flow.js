/*
  Test flow script for local verification:
  1) Login as admin (admin@burger.dev / adminpass)
  2) Fetch dishes
  3) Create a test customer via /auth/register
  4) Login as customer and create a new order using one dish

  Usage: node backend/scripts/test-flow.js
*/

(async () => {
  const base = process.env.BASE_URL || 'http://localhost:4000';
  const fetchJson = async (url, opts = {}) => {
    const r = await fetch(url, opts);
    const t = await r.text();
    try { return { status: r.status, data: JSON.parse(t) } } catch { return { status: r.status, text: t } }
  }

  console.log('Testing backend flows against', base);

  // admin login
  const adminLogin = await fetchJson(`${base}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'admin@burger.dev', password: 'adminpass' }) });
  console.log('admin login:', adminLogin.status, adminLogin.data || adminLogin.text);
  const adminToken = adminLogin.data?.token;

  // get platos
  const platos = await fetchJson(`${base}/platos`);
  console.log('GET /platos', platos.status, Array.isArray(platos.data) ? `${platos.data.length} items` : platos.data);

  // register customer
  const randomEmail = `testuser+${Date.now()}@example.com`;
  const reg = await fetchJson(`${base}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre: 'Demo', apellido: 'User', email: randomEmail, password: 'testpass' }) });
  console.log('register:', reg.status, reg.data || reg.text);
  const userToken = reg.data?.token;

  // place order as user
  if (userToken && platos.data && platos.data.length > 0) {
    const dish = platos.data[0];
    const createOrder = await fetchJson(`${base}/pedidos`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` }, body: JSON.stringify({ platos: [{ id: dish.id, cantidad: 1 }], tipo_entrega: 'takeaway' }) });
    console.log('create order:', createOrder.status, createOrder.data || createOrder.text);
  }

  // admin: create a coupon (if logged in)
  if (adminToken) {
    const coupon = await fetchJson(`${base}/coupons`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` }, body: JSON.stringify({ codigo: 'TEST10', descuento_porcentaje: 10, activo: true }) });
    console.log('create coupon:', coupon.status, coupon.data || coupon.text);
  }

  console.log('Test script finished. If any step failed, ensure backend is running and reachable at', base);
})();
