process.env.NODE_ENV = 'test';
import test from 'node:test';
import assert from 'node:assert';
import http from 'http';

test('AutoRent SaaS API Integration Test Suite', async (t) => {
  const { default: app } = await import('../app.js');
  let server: http.Server;
  let baseUrl: string;

  // Spin up Express server on a random port
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const address = server.address() as any;
      baseUrl = `http://localhost:${address.port}/api`;
      resolve();
    });
  });

  await t.test('GET / (App status)', async () => {
    const res = await fetch(baseUrl.replace('/api', '/'));
    assert.strictEqual(res.status, 200);
    const data = await res.json() as any;
    assert.strictEqual(data.success, true);
    assert.match(data.message, /AutoRent SaaS API/);
  });

  await t.test('GET /api/health (Database & Process check)', async () => {
    const res = await fetch(`${baseUrl}/health`);
    const data = await res.json() as any;
    if (res.status === 200) {
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.status, 'UP');
      assert.strictEqual(data.services.database, 'UP');
    } else {
      assert.strictEqual(res.status, 500);
      assert.strictEqual(data.success, false);
      assert.strictEqual(data.status, 'DOWN');
    }
  });

  await t.test('POST /auth/login error handling', async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'wrongemail@autorent.vn', password: 'wrongpassword' }),
    });
    const data = await res.json() as any;
    assert.strictEqual(data.success, false);
    if (res.status === 401) {
      assert.match(data.message, /không chính xác/);
    } else {
      assert.strictEqual(res.status, 503);
      assert.match(data.message, /cơ sở dữ liệu/);
    }
  });

  // Tear down server
  await new Promise<void>((resolve) => {
    server.close(() => {
      resolve();
    });
  });
});
