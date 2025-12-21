import { Request, Response } from 'express';
import { db } from '../../database/db-sqlite.js';
import { subscriptions, companies } from '../../shared/shared/schema-sqlite.js';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

// Types for Plans
const PLANS = {
    'pyme': {
        name: 'Plan Pyme',
        price: 49,
        maxEmployees: 5,
        currency: 'usd'
    },
    'corporate': {
        name: 'Plan Corporativo',
        price: 199,
        maxEmployees: 100,
        currency: 'usd'
    }
};

/**
 * Creates a Checkout Session 
 * In a real app, this calls Stripe/MercadoPago API.
 * Here it creates a simulation link.
 */
export async function createCheckoutSession(req: Request, res: Response) {
    try {
        const { planId } = req.body;
        const user = (req as any).user; // From isAuthenticated middleware

        if (!user || !user.companyId) {
            return res.status(400).json({ error: 'User must belong to a company' });
        }

        const plan = PLANS[planId as keyof typeof PLANS];
        if (!plan) {
            return res.status(400).json({ error: 'Invalid plan ID' });
        }

        // SIMULATION MODE
        // We return a "success" URL that the frontend can redirect to immediately
        // In real Stripe, this would be `session.url`
        
        // We can actually create the subscription record now as "pending" 
        // Or handle it in a "confirm payment" step. 
        // For this MVP, let's auto-activate on "success" endpoint mostly.
        
        // But to make the flow feel real, we'll return a URL that the frontend "visits"
        // For the simulation, we can just return success: true and let frontend handle the UI of "Processing..."
        
        // However, let's do it properly:
        // 1. Create a Pending Subscription
        const subId = randomUUID();
        
        // 2. Return a checkout link (Simulated)
        const successUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/success?session_id=${subId}&plan=${planId}`;
        const cancelUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/pricing`;

        res.json({
            checkoutUrl: successUrl, // In simulation, we might skip the external redirect or simulate it
            sessionId: subId
        });

    } catch (error: any) {
        console.error('Checkout error:', error);
        res.status(500).json({ error: error.message });
    }
}

/**
 * Confirm Payment (Webhook Simulation)
 * Called by the "Success Page" to finalize the deal
 */
export async function confirmSubscription(req: Request, res: Response) {
    try {
        const { sessionId, planId } = req.body;
        const user = (req as any).user;

        if (!user || !user.companyId) return res.status(401).json({ error: 'Unauthorized' });

        const plan = PLANS[planId as keyof typeof PLANS];
        if (!plan) return res.status(400).json({ error: 'Invalid plan' });

        // 1. Deactivate old subscriptions
        // (Optional: Implement upgrade logic)
        
        // 2. Create New Active Subscription
        await db.insert(subscriptions).values({
            id: sessionId || randomUUID(), // Use the ID we generated or new one
            companyId: user.companyId,
            planType: planId,
            status: 'active',
            maxEmployees: plan.maxEmployees,
            monthlyPrice: plan.price,
            startDate: new Date(),
            nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 days
        });

        // 3. Update Company verification status if Corporate
        if (planId === 'corporate') {
             await db.update(companies)
                .set({ verified: true }) // Auto-verify corporate for now?
                .where(eq(companies.id, user.companyId));
        }

        res.json({ success: true, message: 'Subscription activated' });

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export async function getSubscription(req: Request, res: Response) {
    try {
        const user = (req as any).user;
        if (!user || !user.companyId) return res.status(401).json({ error: 'Unauthorized' });

        const sub = await db.select().from(subscriptions)
            .where(eq(subscriptions.companyId, user.companyId))
            .limit(1); // Get latest? Sort by date needed ideally

        // Simple logic: just return the first one found for now or null
        res.json(sub[0] || null);

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
