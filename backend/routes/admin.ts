import { Request, Response } from 'express';
import { db } from '../../database/db-sqlite.js';
import { users, companies, subscriptions, verifications, marketplacePosts } from '../../shared/shared/schema-sqlite.js';
import { eq, sql, desc } from 'drizzle-orm';

// Helper to check admin role
const isAdmin = (user: any) => {
    return user && (user.role === 'Admin' || user.role === 'SuperAdmin');
};

export async function getAdminStats(req: Request, res: Response) {
    try {
        const user = (req as any).user;
        if (!isAdmin(user)) return res.status(403).json({ error: 'Access denied' });

        // 1. Total Users
        const userCount = await db.select({ count: sql<number>`count(*)` }).from(users);
        
        // 2. Total Companies
        const companyCount = await db.select({ count: sql<number>`count(*)` }).from(companies);
        
        // 3. Active Subscriptions
        const subCount = await db.select({ count: sql<number>`count(*)` })
            .from(subscriptions)
            .where(eq(subscriptions.status, 'active'));

        // 4. Pending Verifications
        const verificationCount = await db.select({ count: sql<number>`count(*)` })
            .from(verifications)
            .where(eq(verifications.status, 'pending'));

        // 5. Total Revenue (Sum of monthly prices of active subs)
        // Simple approximation
        const revenue = await db.select({ total: sql<number>`sum(${subscriptions.monthlyPrice})` })
            .from(subscriptions)
            .where(eq(subscriptions.status, 'active'));

        // 6. Active Posts
        const postCount = await db.select({ count: sql<number>`count(*)` })
            .from(marketplacePosts)
            .where(eq(marketplacePosts.status, 'active'));

        res.json({
            totalUsers: userCount[0].count,
            totalCompanies: companyCount[0].count,
            activeSubscriptions: subCount[0].count,
            pendingVerifications: verificationCount[0].count,
            totalRevenue: revenue[0].total || 0,
            activePosts: postCount[0].count
        });

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function getVerifications(req: Request, res: Response) {
    try {
        const user = (req as any).user;
        if (!isAdmin(user)) return res.status(403).json({ error: 'Access denied' });

        const list = await db.select().from(verifications)
            .where(eq(verifications.status, 'pending'))
            .orderBy(desc(verifications.submittedAt));

        res.json(list);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function approveVerification(req: Request, res: Response) {
    try {
        const user = (req as any).user;
        if (!isAdmin(user)) return res.status(403).json({ error: 'Access denied' });

        const { id } = req.params;

        // 1. Update Verification
        const verification = await db.update(verifications)
            .set({ 
                status: 'approved', 
                reviewedAt: new Date(),
                reviewedBy: user.id 
            })
            .where(eq(verifications.id, id))
            .returning();

        if (!verification.length) return res.status(404).json({ error: 'Verification not found' });

        const v = verification[0];

        // 2. Update Entity (Company/User)
        if (v.entityType === 'company') {
            await db.update(companies)
                .set({ verified: true })
                .where(eq(companies.id, v.entityId));
        } else if (v.entityType === 'employee' || v.entityType === 'user') {
            await db.update(users)
                .set({ verified: true })
                .where(eq(users.id, v.entityId));
        }

        res.json({ success: true });

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function rejectVerification(req: Request, res: Response) {
    try {
        const user = (req as any).user;
        if (!isAdmin(user)) return res.status(403).json({ error: 'Access denied' });

        const { id } = req.params;
        
        await db.update(verifications)
            .set({ 
                status: 'rejected', 
                reviewedAt: new Date(),
                reviewedBy: user.id 
            })
            .where(eq(verifications.id, id));

        res.json({ success: true });

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
