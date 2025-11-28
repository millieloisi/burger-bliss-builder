(async () => {
  try {
    const r = await fetch('http://127.0.0.1:4000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@burger.dev', password: 'adminpass' }),
      timeout: 5000
    });
    const json = await r.json();
    console.log('status', r.status);
    console.log(json);
  } catch (err) {
    console.error('error', err.message || err);
  }
})();
