
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from '../../database/db-sqlite';
import { verifications, companies, users } from '../../shared/shared/schema-sqlite';
import { Eq, eq, and, desc } from 'drizzle-orm';

const router = Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'backend/uploads');
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images and PDF files are allowed!'));
  }
});

// POST /api/verifications/request
// Upload documents and create verification request
router.post('/request', upload.array('documents', 3), async (req: any, res) => {
  try {
    const { entityType, entityId, verificationType, notes } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ status: 'error', message: 'No files uploaded' });
    }

    const documentUrls = files.map(file => `/uploads/${file.filename}`);

    const [newVerification] = await db.insert(verifications).values({
      entityType: entityType || 'company',
      entityId, 
      verificationType: verificationType || 'company_documents',
      documents: JSON.stringify(documentUrls),
      notes,
      status: 'pending'
    }).returning();

    res.json(newVerification);
  } catch (error: any) {
    console.error('Verification request error:', error);
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// GET /api/verifications
// List all pending verifications (Admin only)
router.get('/', async (req, res) => {
  try {
    const items = await db.select().from(verifications)
      .where(eq(verifications.status, 'pending'))
      .orderBy(desc(verifications.submittedAt));
    
    // Enhance with entity names if possible
    const enhancedItems = await Promise.all(items.map(async (item) => {
      let entityName = 'Unknown';
      if (item.entityType === 'company') {
        const [comp] = await db.select().from(companies).where(eq(companies.id, item.entityId));
        if (comp) entityName = comp.name;
      } else if (item.entityType === 'employee') {
        const [u] = await db.select().from(users).where(eq(users.id, item.entityId));
        if (u) entityName = u.name;
      }
      return { ...item, entityName };
    }));

    res.json(enhancedItems);
  } catch (error: any) {
     res.status(500).json({ status: 'error', error: error.message });
  }
});

// POST /api/verifications/:id/approve
router.post('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1. Update verification status
    const [updated] = await db.update(verifications)
      .set({ 
        status: 'approved',
        reviewedAt: new Date(),
        reviewedBy: 'admin' // Mock admin ID
      })
      .where(eq(verifications.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'Verification not found' });
    }

    // 2. Update entity status
    if (updated.entityType === 'company') {
      await db.update(companies)
        .set({ verified: true })
        .where(eq(companies.id, updated.entityId));
    } else if (updated.entityType === 'employee') {
      await db.update(users)
        .set({ verified: true })
        .where(eq(users.id, updated.entityId));
    }

    res.json({ status: 'success', verification: updated });
  } catch (error: any) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// POST /api/verifications/:id/reject
router.post('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await db.update(verifications)
      .set({ 
        status: 'rejected',
        reviewedAt: new Date(),
        reviewedBy: 'admin' 
      })
      .where(eq(verifications.id, id))
      .returning();
      
    res.json({ status: 'success', verification: updated });
  } catch (error: any) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

export default router;
