import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  DEFAULT_COURSES,
  DEFAULT_INSTITUTIONS,
  DEFAULT_PLACEMENTS,
} from './src/data/iiserInstitutionsData.ts';
import {
  DEFAULT_NEWS,
  DEFAULT_SALARIES,
  DEFAULT_SCHOLARSHIPS,
  DEFAULT_VACANCIES,
} from './src/data/iatAndCareersData.ts';
import type { CmsPayload } from './src/types/portal.ts';

const PORT = 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const CMS_FILE = path.join(DATA_DIR, 'cms-store.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');

function getDefaultCms(): CmsPayload {
  return {
    news: DEFAULT_NEWS,
    vacancies: DEFAULT_VACANCIES,
    scholarships: DEFAULT_SCHOLARSHIPS,
    placements: DEFAULT_PLACEMENTS,
    salaries: DEFAULT_SALARIES,
    courses: DEFAULT_COURSES,
    institutions: DEFAULT_INSTITUTIONS,
    lastUpdated: new Date().toISOString().split('T')[0],
  };
}

function ensureStore(): CmsPayload {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(CMS_FILE)) {
    const initial = getDefaultCms();
    fs.writeFileSync(CMS_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(CMS_FILE, 'utf-8');
    return JSON.parse(raw) as CmsPayload;
  } catch {
    const fallback = getDefaultCms();
    fs.writeFileSync(CMS_FILE, JSON.stringify(fallback, null, 2), 'utf-8');
    return fallback;
  }
}

function saveStore(payload: CmsPayload): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  payload.lastUpdated = new Date().toISOString().split('T')[0];
  fs.writeFileSync(CMS_FILE, JSON.stringify(payload, null, 2), 'utf-8');
}

type CollectionKey = 'news' | 'vacancies' | 'scholarships' | 'placements' | 'salaries' | 'courses' | 'institutions';
const VALID_COLLECTIONS: CollectionKey[] = [
  'news',
  'vacancies',
  'scholarships',
  'placements',
  'salaries',
  'courses',
  'institutions',
];

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'IISER GUIDE CMS API' });
  });

  app.get('/api/cms', (_req, res) => {
    const data = ensureStore();
    res.json(data);
  });

  app.post('/api/cms/reset', (_req, res) => {
    const fresh = getDefaultCms();
    saveStore(fresh);
    res.json(fresh);
  });

  app.post('/api/cms/:collection', (req, res) => {
    const collection = req.params.collection as CollectionKey;
    if (!VALID_COLLECTIONS.includes(collection)) {
      res.status(400).json({ error: 'Invalid collection name.' });
      return;
    }
    const item = req.body;
    if (!item || typeof item !== 'object') {
      res.status(400).json({ error: 'Invalid item payload.' });
      return;
    }
    const store = ensureStore();
    const newItem = {
      ...item,
      id: item.id || `${collection}-${Date.now()}`,
    };
    // Prepend new announcements/vacancies so latest appear first
    if (collection === 'news' || collection === 'vacancies') {
      (store[collection] as unknown[]).unshift(newItem);
    } else {
      (store[collection] as unknown[]).push(newItem);
    }
    saveStore(store);
    res.status(201).json({ item: newItem, cms: store });
  });

  app.put('/api/cms/:collection/:id', (req, res) => {
    const collection = req.params.collection as CollectionKey;
    const id = req.params.id;
    if (!VALID_COLLECTIONS.includes(collection)) {
      res.status(400).json({ error: 'Invalid collection name.' });
      return;
    }
    const store = ensureStore();
    const list = store[collection] as Array<{ id: string }>;
    const idx = list.findIndex((entry) => entry.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Record not found.' });
      return;
    }
    list[idx] = { ...list[idx], ...req.body, id };
    saveStore(store);
    res.json({ item: list[idx], cms: store });
  });

  app.delete('/api/cms/:collection/:id', (req, res) => {
    const collection = req.params.collection as CollectionKey;
    const id = req.params.id;
    if (!VALID_COLLECTIONS.includes(collection)) {
      res.status(400).json({ error: 'Invalid collection name.' });
      return;
    }
    const store = ensureStore();
    const list = store[collection] as Array<{ id: string }>;
    const filtered = list.filter((entry) => entry.id !== id);
    if (filtered.length === list.length) {
      res.status(404).json({ error: 'Record not found.' });
      return;
    }
    (store[collection] as Array<{ id: string }>) = filtered;
    saveStore(store);
    res.json({ cms: store });
  });

  app.post('/api/contact', (req, res) => {
    const { name, email, role, message } = req.body || {};
    if (!name || typeof name !== 'string' || !name.trim() || !email || typeof email !== 'string' || !email.includes('@') || !message || typeof message !== 'string' || message.trim().length < 8) {
      res.status(400).json({ error: 'Please provide a valid name, email address, and message (minimum 8 characters).' });
      return;
    }
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    let existing: unknown[] = [];
    if (fs.existsSync(CONTACTS_FILE)) {
      try {
        existing = JSON.parse(fs.readFileSync(CONTACTS_FILE, 'utf-8')) as unknown[];
      } catch {
        existing = [];
      }
    }
    const submission = {
      id: `msg-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role: typeof role === 'string' ? role : 'Student / Aspirant',
      message: message.trim(),
      submittedAt: new Date().toISOString(),
    };
    existing.unshift(submission);
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(existing, null, 2), 'utf-8');
    res.status(201).json({ ok: true, submission });
  });

  const isProd = process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve(process.cwd(), 'dist'));
  if (isProd) {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`IISER GUIDE full-stack portal listening on http://localhost:${PORT}`);
  });
}

startServer();
