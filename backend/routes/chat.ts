import { Request, Response } from 'express';
import { db } from '../../database/db-sqlite.js';
import { conversations, messages, users, companies, marketplacePosts } from '../../shared/shared/schema-sqlite.js';
import { eq, and, or, desc, asc } from 'drizzle-orm';
import { randomUUID } from 'crypto';

// Helpe type for frontend
type ConversationWithDetails = typeof conversations.$inferSelect & {
    otherCompany: { name: string, country: string, verified: boolean | null };
    lastMessage: { content: string | null, createdAt: Date | null, type: string | null };
};

export async function getConversations(req: Request, res: Response) {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ error: 'Missing userId' });

        // For MVP, we assume the user belongs to a company and we fetch conversations for that COMPANY
        // Creating a "Room" between two companies.
        
        // 1. Get User's Company
        const user = await db.select().from(users).where(eq(users.id, String(userId))).limit(1);
        if (!user.length) return res.status(404).json({ error: 'User not found' });
        
        const companyId = user[0].companyId;
        if (!companyId) return res.status(400).json({ error: 'User has no company' });

        // 2. Fetch conversations where company is either party
        const userConversations = await db.select()
            .from(conversations)
            .where(or(
                eq(conversations.company1Id, companyId),
                eq(conversations.company2Id, companyId)
            ))
            .orderBy(desc(conversations.lastMessageAt));

        // 3. Enrich with "Other Company" details and last message
        const enriched: any[] = [];
        
        for (const conv of userConversations) {
            const isComp1 = conv.company1Id === companyId;
            const otherCompId = isComp1 ? conv.company2Id : conv.company1Id;
            
            const otherComp = await db.select().from(companies).where(eq(companies.id, otherCompId)).limit(1);
            
            // Get last message content if needed (stored in lastMessageAt, but content is in messages table)
            // Optimization: We could store lastMessageSnippet in conversation table usually, but query is fine for now.
            const lastMsg = await db.select().from(messages)
                .where(eq(messages.conversationId, conv.id))
                .orderBy(desc(messages.createdAt))
                .limit(1);

            enriched.push({
                ...conv,
                otherCompany: otherComp[0] ? {
                    name: otherComp[0].name,
                    country: otherComp[0].country,
                    verified: otherComp[0].verified
                } : { name: 'Unknown', country: 'Unknown', verified: false },
                lastMessage: lastMsg[0] ? {
                    content: lastMsg[0].content,
                    createdAt: lastMsg[0].createdAt,
                    type: lastMsg[0].messageType
                } : null
            });
        }

        res.json(enriched);

    } catch (error: any) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ error: error.message });
    }
}

export async function createConversation(req: Request, res: Response) {
    try {
        const { userId, postId } = req.body;
        
        if (!userId || !postId) return res.status(400).json({ error: 'Missing userId or postId' });

        // 1. Get participants
        const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        if (!user.length) return res.status(404).json({ error: 'User not found' });
        
        const post = await db.select().from(marketplacePosts).where(eq(marketplacePosts.id, postId)).limit(1);
        if (!post.length) return res.status(404).json({ error: 'Post not found' });

        const buyerCompanyId = user[0].companyId!;
        const sellerCompanyId = post[0].companyId;
        
        if (buyerCompanyId === sellerCompanyId) {
             return res.status(400).json({ error: 'Cannot start conversation with yourself' });
        }

        // 2. Check if conversation already exists
        const existing = await db.select().from(conversations)
            .where(and(
                eq(conversations.postId, postId),
                or(
                    and(eq(conversations.company1Id, buyerCompanyId), eq(conversations.company2Id, sellerCompanyId)),
                    and(eq(conversations.company1Id, sellerCompanyId), eq(conversations.company2Id, buyerCompanyId))
                )
            ))
            .limit(1);

        if (existing.length > 0) {
            return res.json({ id: existing[0].id, isNew: false });
        }

        // 3. Create new conversation
        const newConv = await db.insert(conversations).values({
            postId: postId,
            company1Id: buyerCompanyId,
            company2Id: sellerCompanyId,
            status: 'active',
            lastMessageAt: new Date()
        }).returning();

        // 4. Add initial system message
        await db.insert(messages).values({
            conversationId: newConv[0].id,
            senderId: userId,
            messageType: 'system',
            content: `Inició una negociación por: ${post[0].productName} (${post[0].quantity})`
        });

        res.json({ id: newConv[0].id, isNew: true });

    } catch (error: any) {
        console.error('Error creating conversation:', error);
        res.status(500).json({ error: error.message });
    }
}

export async function getMessages(req: Request, res: Response) {
    try {
        const { conversationId } = req.params;
        
        if (conversationId.startsWith('demo-')) return res.json([]); // Simple extraction if mixed

        const msgs = await db.select({
            id: messages.id,
            content: messages.content,
            senderId: messages.senderId,
            messageType: messages.messageType,
            createdAt: messages.createdAt,
            metadata: messages.metadata,
            senderName: users.name,
            senderRole: users.role,
            senderPrimaryRole: users.primaryRole
        })
        .from(messages)
        .leftJoin(users, eq(messages.senderId, users.id))
        .where(eq(messages.conversationId, conversationId))
        .orderBy(asc(messages.createdAt));

        // Format for frontend
        const formatted = msgs.map(m => ({
            id: m.id,
            content: m.content,
            senderId: m.senderId,
            messageType: m.messageType,
            createdAt: m.createdAt,
            sender: {
                name: m.senderName || 'Unknown',
                role: m.senderRole || '',
                primaryRole: m.senderPrimaryRole
            }
        }));

        res.json(formatted);

    } catch (error: any) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: error.message });
    }
}

export async function sendMessage(req: Request, res: Response) {
    try {
        const { conversationId } = req.params;
        const { userId, content, messageType = 'text', metadata } = req.body;

        const newMsg = await db.insert(messages).values({
            conversationId,
            senderId: userId,
            content,
            messageType,
            metadata: metadata ? JSON.stringify(metadata) : null,
            createdAt: new Date()
        }).returning();

        // Update conversation last activity
        await db.update(conversations)
            .set({ lastMessageAt: new Date() })
            .where(eq(conversations.id, conversationId));

        res.json(newMsg[0]);

// AI Suggestions Endpoint
export async function getSuggestions(req: Request, res: Response) {
    try {
        const { conversationId } = req.body;
        
        // Fetch context (last 5 messages)
        const chatContext = await db.select({
            content: messages.content,
            senderId: messages.senderId
        })
        .from(messages)
        .where(eq(messages.conversationId, conversationId))
        .orderBy(desc(messages.createdAt))
        .limit(5);

        // Reverse to chronological order for AI
        const context = chatContext.reverse();

        const { AIService } = await import('../services/ai-service.js');
        const suggestions = await AIService.generateSmartReplies(context);

        res.json({ suggestions });

    } catch (error: any) {
        console.error('Error generating suggestions:', error);
        res.status(500).json({ error: error.message });
    }
}
