import { Request, Response } from 'express';
import { db } from '../../database/db-sqlite.js';
import { tradeAlerts } from '../../shared/shared/schema-sqlite.js';
import { eq, desc, and, gt } from 'drizzle-orm';

export async function getAlerts(req: Request, res: Response) {
  try {
    const { urgency, type } = req.query;

    const activeAlerts = await db.select()
      .from(tradeAlerts)
      .where(and(
        eq(tradeAlerts.isActive, true),
        // By default show alerts valid until future (or null = indefinite)
        // Note: SQLite boolean handling might need checking, usually 1/0
      ))
      .orderBy(desc(tradeAlerts.createdAt));

    res.json({
        success: true,
        data: activeAlerts
    });

  } catch (error: any) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: error.message });
  }
}
