const { created, fail, ok } = require('../utils/http');
const {
  findUserByEmail,
  createUser,
  ensureUserIndex,
  toAuthUser,
} = require('../repositories/auth.repository');

const demoProfiles = {
  customer: {
    id: 'c-demo',
    name: 'Aline',
    email: 'aline@demo.kora',
    role: 'customer',
    preferredCity: 'Kigali',
    interestCategories: ['Salon', 'Spa', 'Barber'],
  },
  business: {
    id: 'b-demo',
    name: 'Amahoro Glow',
    email: 'owner@amahoro.demo',
    role: 'business',
    businessCategory: 'Salon',
    businessWorkerCount: 48,
    preferredCity: 'Kigali',
    interestCategories: ['Salon'],
  },
  admin: {
    id: 'a-demo',
    name: 'Ops Admin',
    email: 'admin@kora.app',
    role: 'admin',
  },
};

function normalizeRole(role) {
  const r = String(role || '').toLowerCase();
  if (r === 'business' || r === 'admin') return r;
  return 'customer';
}

async function login(req, res) {
  const db = req.app.locals.db || null;
  const email = String(req.body?.email || '').trim().toLowerCase();
  const roleHint = normalizeRole(req.body?.role);
  if (!email) return fail(res, 400, 'email is required');

  if (email.includes('@demo.kora') || email === 'owner@amahoro.demo' || email === 'admin@kora.app') {
    const profile =
      email === 'owner@amahoro.demo'
        ? demoProfiles.business
        : email === 'admin@kora.app'
          ? demoProfiles.admin
          : demoProfiles.customer;
    return ok(res, { user: profile });
  }

  const user = await findUserByEmail(db, email);
  if (!user) {
    return fail(res, 404, 'User not found. Create account first or use demo.');
  }

  if (roleHint !== 'customer' && user.role !== roleHint) {
    return fail(res, 403, 'Role mismatch for this account');
  }

  return ok(res, { user: toAuthUser(user) });
}

async function signup(req, res) {
  const db = req.app.locals.db || null;
  const role = normalizeRole(req.body?.role);
  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim().toLowerCase();
  const preferredCity = String(req.body?.preferredCity || 'Kigali').trim();
  if (!name || !email) return fail(res, 400, 'name and email are required');

  await ensureUserIndex(db);
  const exists = await findUserByEmail(db, email);
  if (exists) return fail(res, 409, 'Account already exists');

  const payload = {
    name,
    email,
    role,
    preferredCity,
    businessCategory: role === 'business' ? String(req.body?.businessCategory || 'Salon') : undefined,
    businessWorkerCount:
      role === 'business' ? Math.min(Math.max(Number(req.body?.businessWorkerCount || 1), 1), 100) : undefined,
    interestCategories:
      role === 'business'
        ? [String(req.body?.businessCategory || 'Salon')]
        : ['Salon', 'Barber', 'Spa'],
  };
  const saved = await createUser(db, payload);
  return created(res, { user: toAuthUser(saved) });
}

async function demo(req, res) {
  const role = normalizeRole(req.body?.role || req.query?.role);
  return ok(res, { user: demoProfiles[role] || demoProfiles.customer });
}

module.exports = { login, signup, demo };
