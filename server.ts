import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);

interface PortalUserRecord {
  id: string;
  uid: string;
  fullName: string;
  whatsappNumber: string;
  studentIdCode: string;
  email: string;
  passwordText: string;
  teamLeaderName: string;
  teamTrainerName: string;
  role: 'student' | 'admin';
  status: 'pending' | 'active' | 'blocked';
  assignedJob: string;
  assignedJobs: string[];
  preferredModules: string[];
  courseCompleted: boolean;
  companyJoinDate: string;
  hasExperience: boolean;
  hasSelectedWorkKnowledge: boolean;
  hasCertificate: boolean;
  certificateUrl: string;
  photoUrl?: string;
  balance: number;
  microjobPoints: number;
  createdAt: string;
  updatedAt: string;
}

interface PortalDatabase {
  users: PortalUserRecord[];
}

function normalizePhone(raw: string): string {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.startsWith('880') && digits.length >= 13) {
    return '0' + digits.slice(3);
  }
  if (!digits.startsWith('0') && digits.length === 10 && digits.startsWith('1')) {
    return '0' + digits;
  }
  return digits;
}

function resolveDbPath(): string {
  const primaryDir = path.join(__dirname, 'data');
  const primaryFile = path.join(primaryDir, 'portal-users.json');
  try {
    if (!fs.existsSync(primaryDir)) {
      fs.mkdirSync(primaryDir, { recursive: true });
    }
    fs.accessSync(primaryDir, fs.constants.W_OK);
    return primaryFile;
  } catch {
    return '/tmp/unity-portal-users.json';
  }
}

const DB_FILE = resolveDbPath();

function readDb(): PortalDatabase {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return { users: [] };
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    if (!raw.trim()) return { users: [] };
    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed?.users) ? parsed.users : [],
    };
  } catch {
    return { users: [] };
  }
}

function writeDb(data: PortalDatabase): void {
  const tmpFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmpFile, DB_FILE);
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '5mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  // Register a new user directly without any Firebase quota dependency
  app.post('/api/auth/register', (req, res) => {
    try {
      const body = req.body || {};
      const cleanEmail = String(body.email || '').trim().toLowerCase();
      const cleanPhone = normalizePhone(String(body.whatsappNumber || body.phone || ''));
      const cleanStudentId = String(body.studentIdCode || '').trim();
      const cleanPassword = String(body.passwordText || body.password || '').trim();
      const cleanName = String(body.fullName || '').trim();

      if (!cleanName || !cleanEmail || !cleanPhone || !cleanStudentId || cleanPassword.length < 6) {
        return res.status(400).json({
          error: 'Please fill in all required registration fields with a valid 6+ character password.',
        });
      }

      const dbData = readDb();

      const duplicateEmail = dbData.users.find(
        (u) => u.email.toLowerCase() === cleanEmail
      );
      if (duplicateEmail) {
        return res.status(409).json({
          error: 'This email is already registered. Please sign in or use another email.',
        });
      }

      const duplicatePhone = dbData.users.find(
        (u) => normalizePhone(u.whatsappNumber) === cleanPhone
      );
      if (duplicatePhone) {
        return res.status(409).json({
          error: 'This phone number is already registered. Please sign in with your password.',
        });
      }

      const duplicateStudentId = dbData.users.find(
        (u) => u.studentIdCode === cleanStudentId
      );
      if (duplicateStudentId) {
        return res.status(409).json({
          error: 'This 7-digit Student ID is already registered. Please sign in.',
        });
      }

      const nowIso = new Date().toISOString();
      const uid =
        typeof body.uid === 'string' && body.uid.trim()
          ? body.uid.trim()
          : `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      const selectedModules = Array.isArray(body.assignedJobs) && body.assignedJobs.length > 0
        ? body.assignedJobs.map(String)
        : ['typing'];

      const newUser: PortalUserRecord = {
        id: uid,
        uid,
        fullName: cleanName,
        whatsappNumber: cleanPhone,
        studentIdCode: cleanStudentId,
        email: cleanEmail,
        passwordText: cleanPassword,
        teamLeaderName: String(body.teamLeaderName || '').trim(),
        teamTrainerName: String(body.teamTrainerName || '').trim(),
        role: 'student',
        status: 'active',
        assignedJob: selectedModules[0] || 'typing',
        assignedJobs: selectedModules,
        preferredModules: Array.isArray(body.preferredModules)
          ? body.preferredModules.map(String)
          : selectedModules,
        courseCompleted: Boolean(body.courseCompleted ?? true),
        companyJoinDate: String(body.companyJoinDate || nowIso.split('T')[0]),
        hasExperience: Boolean(body.hasExperience),
        hasSelectedWorkKnowledge: Boolean(body.hasSelectedWorkKnowledge),
        hasCertificate: Boolean(body.hasCertificate),
        certificateUrl: String(body.certificateUrl || ''),
        photoUrl: String(body.photoUrl || ''),
        balance: 0,
        microjobPoints: 0,
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      dbData.users.unshift(newUser);
      writeDb(dbData);

      return res.status(201).json({
        user: {
          uid: newUser.uid,
          email: newUser.email,
          displayName: newUser.fullName,
        },
        profile: newUser,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Registration failed.' });
    }
  });

  // Direct login by Email, Phone, or 7-digit Student ID + Password (zero Firebase limit)
  app.post('/api/auth/login', (req, res) => {
    try {
      const cleanIdent = String(req.body?.identifier || '').trim();
      const cleanPass = String(req.body?.password || '').trim();

      if (!cleanIdent || !cleanPass) {
        return res.status(400).json({ error: 'Please enter your login ID and password.' });
      }

      const dbData = readDb();
      const identLower = cleanIdent.toLowerCase();
      const identPhone = normalizePhone(cleanIdent);

      const matched = dbData.users.find((u) => {
        if (u.email.toLowerCase() === identLower) return true;
        if (u.studentIdCode === cleanIdent) return true;
        if (identPhone.length >= 10 && normalizePhone(u.whatsappNumber) === identPhone) return true;
        return false;
      });

      if (!matched) {
        return res.status(404).json({
          error: 'No registered account found with these credentials.',
          code: 'USER_NOT_FOUND',
        });
      }

      if (matched.passwordText !== cleanPass) {
        return res.status(401).json({
          error: 'Incorrect password. Please verify your password or contact Admin.',
          code: 'WRONG_PASSWORD',
        });
      }

      if (matched.status === 'blocked') {
        return res.status(403).json({
          error: 'Your account has been deactivated by the administrator. Please contact support.',
          code: 'ACCOUNT_BLOCKED',
        });
      }

      return res.json({
        user: {
          uid: matched.uid,
          email: matched.email,
          displayName: matched.fullName,
        },
        profile: matched,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err?.message || 'Login failed.' });
    }
  });

  // Fetch latest session profile for direct user
  app.get('/api/auth/session/:uid', (req, res) => {
    const uid = String(req.params.uid || '').trim();
    const dbData = readDb();
    const matched = dbData.users.find((u) => u.uid === uid || u.id === uid);
    if (!matched) {
      return res.status(404).json({ error: 'Account not found.' });
    }
    return res.json({ profile: matched });
  });

  // Update user's own profile details
  app.patch('/api/users/:uid/profile', (req, res) => {
    const uid = String(req.params.uid || '').trim();
    const dbData = readDb();
    const idx = dbData.users.findIndex((u) => u.uid === uid || u.id === uid);
    if (idx === -1) {
      return res.status(404).json({ error: 'Account not found.' });
    }

    const body = req.body || {};
    const existing = dbData.users[idx];
    const updated: PortalUserRecord = {
      ...existing,
      fullName: typeof body.fullName === 'string' && body.fullName.trim() ? body.fullName.trim() : existing.fullName,
      whatsappNumber:
        typeof body.whatsappNumber === 'string' && body.whatsappNumber.trim()
          ? normalizePhone(body.whatsappNumber) || body.whatsappNumber.trim()
          : existing.whatsappNumber,
      photoUrl: typeof body.photoUrl === 'string' ? body.photoUrl : existing.photoUrl,
      balance: typeof body.balance === 'number' && body.balance >= 0 ? body.balance : existing.balance,
      microjobPoints:
        typeof body.microjobPoints === 'number' && body.microjobPoints >= 0
          ? body.microjobPoints
          : existing.microjobPoints,
      updatedAt: new Date().toISOString(),
    };

    dbData.users[idx] = updated;
    writeDb(dbData);
    return res.json({ profile: updated });
  });

  // Admin: List all registered users
  app.get('/api/admin/users', (_req, res) => {
    const dbData = readDb();
    const sorted = [...dbData.users].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
    return res.json({ users: sorted });
  });

  // Admin: Update a user (status, assignedJobs, passwordText, balance, microjobPoints)
  app.patch('/api/admin/users/:uid', (req, res) => {
    const uid = String(req.params.uid || '').trim();
    const dbData = readDb();
    const idx = dbData.users.findIndex((u) => u.uid === uid || u.id === uid);
    if (idx === -1) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const body = req.body || {};
    const existing = dbData.users[idx];
    const updated: PortalUserRecord = {
      ...existing,
      status: body.status === 'active' || body.status === 'blocked' || body.status === 'pending'
        ? body.status
        : existing.status,
      assignedJobs: Array.isArray(body.assignedJobs) ? body.assignedJobs.map(String) : existing.assignedJobs,
      assignedJob: typeof body.assignedJob === 'string' ? body.assignedJob : existing.assignedJob,
      passwordText:
        typeof body.passwordText === 'string' && body.passwordText.trim().length >= 6
          ? body.passwordText.trim()
          : existing.passwordText,
      balance: typeof body.balance === 'number' && body.balance >= 0 ? body.balance : existing.balance,
      microjobPoints:
        typeof body.microjobPoints === 'number' && body.microjobPoints >= 0
          ? body.microjobPoints
          : existing.microjobPoints,
      updatedAt: new Date().toISOString(),
    };

    dbData.users[idx] = updated;
    writeDb(dbData);
    return res.json({ user: updated });
  });

  // Admin: Delete a single user
  app.delete('/api/admin/users/:uid', (req, res) => {
    const uid = String(req.params.uid || '').trim();
    const dbData = readDb();
    const nextUsers = dbData.users.filter((u) => u.uid !== uid && u.id !== uid);
    writeDb({ users: nextUsers });
    return res.json({ ok: true });
  });

  // Admin: Delete all users
  app.delete('/api/admin/users', (_req, res) => {
    writeDb({ users: [] });
    return res.json({ ok: true });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Unity Portal server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
