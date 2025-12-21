import { Request, Response } from 'express';
import { db } from '../../database/db-sqlite.js';
import { marketplacePosts, companies, users } from '../../shared/shared/schema-sqlite.js';
import { eq, desc, and } from 'drizzle-orm';

export async function getPosts(req: Request, res: Response) {
  try {
    const { type, country } = req.query;

    const posts = await db.select({
        id: marketplacePosts.id,
        type: marketplacePosts.type,
        productName: marketplacePosts.productName,
        hsCode: marketplacePosts.hsCode,
        quantity: marketplacePosts.quantity,
        originCountry: marketplacePosts.originCountry,
        details: marketplacePosts.requirements, // We stored title/desc/price here in seed
        createdAt: marketplacePosts.createdAt,
        companyName: companies.name,
        companyCountry: companies.country,
        userName: users.name,
        verified: users.verified
    })
    .from(marketplacePosts)
    .leftJoin(companies, eq(marketplacePosts.companyId, companies.id))
    .leftJoin(users, eq(marketplacePosts.userId, users.id))
    .where(and(
        eq(marketplacePosts.status, 'active'),
        type ? eq(marketplacePosts.type, String(type)) : undefined
    ))
    .orderBy(desc(marketplacePosts.createdAt));

    // Parse JSON details
    const formattedPosts = posts.map(p => {
        let det = {};
        try { det = JSON.parse(p.details || '[]'); } catch (e) {}
        // If it's an array (from seed), take first item, else use as object
        const info = Array.isArray(det) ? det[0] : det;
        
        return { ...p, ...info };
    });

    res.json({ success: true, data: formattedPosts });

  } catch (error: any) {
    console.error('Error fetching marketplace posts:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function createPost(req: Request, res: Response) {
    try {
        const body = req.body;
        // In a real app we'd get userId from session/token
        // For MVP, we'll pick the first user or create one
        const user = await db.select().from(users).limit(1);
        if (!user || user.length === 0) return res.status(400).json({error: 'No users found'});

        const newPost = await db.insert(marketplacePosts).values({
            companyId: user[0].companyId!,
            userId: user[0].id,
            type: body.type,
            hsCode: body.hsCode,
            productName: body.title, // Map title to name or manage fields
            quantity: body.quantity,
            originCountry: body.origin,
            requirements: JSON.stringify([{ title: body.title, description: body.description, price: body.price }]),
            status: 'active'
        }).returning();

        res.json({ success: true, data: newPost[0] });

    } catch (error: any) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: error.message });
    }
}
