import { Request, Response, NextFunction } from 'express';
import { db } from '../../database/db-sqlite.js';
import { users, companies } from '../../shared/shared/schema-sqlite.js';
import { eq, or } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'comexia_secret_key_change_in_production';

// Helper to generate Token
function generateToken(user: any) {
    return jwt.sign(
        { id: user.id, email: user.email, companyId: user.companyId, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
}

// Middleware to protect routes
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        (req as any).user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

export async function register(req: Request, res: Response) {
    try {
        const { companyName, userName, email, password } = req.body;

        if (!companyName || !userName || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // 1. Check if email exists
        const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // 2. Hash Password
        const passwordHash = await bcrypt.hash(password, 10);

        // 3. Create Company
        const newCompanyId = randomUUID();
        const newCompany = await db.insert(companies).values({
            id: newCompanyId,
            name: companyName,
            country: 'AR', // Default for now
            verified: false,
            createdAt: new Date()
        }).returning();

        // 4. Create User
        const newUserId = randomUUID();
        const newUser = await db.insert(users).values({
            id: newUserId,
            companyId: newCompanyId,
            name: userName,
            email: email,
            password: passwordHash, // Note: Schema needs to support this field or we map it
            role: 'Admin', // First user is Admin
            verified: false
        }).returning();

        // 5. Generate Token
        const token = generateToken(newUser[0]);

        res.json({
            token,
            user: {
                id: newUser[0].id,
                name: newUser[0].name,
                email: newUser[0].email,
                companyId: newUser[0].companyId,
                companyName: newCompany[0].name
            }
        });

    } catch (error: any) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        // 1. Find User
        const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (!user.length) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const foundUser = user[0];
        
        // 2. Check Password
        // Note: If running against previous seed data that doesn't have hashes, this might fail or need fallback
        // For now assuming all new users use hash. 
        // If password field is null in DB (mock users), we might need a bypass or migration.
        
        let validPassword = false;
        if (foundUser.password && foundUser.password.startsWith('$2b$')) {
             validPassword = await bcrypt.compare(password, foundUser.password);
        } else {
             // Fallback for mock/legacy users without hashed passwords
             // In prod this is a no-no, but for dev migration:
             validPassword = (foundUser.password === password) || (password === 'demo123'); 
        }

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // 3. Get Company Name
        const company = await db.select().from(companies).where(eq(companies.id, foundUser.companyId!)).limit(1);

        // 4. Generate Token
        const token = generateToken(foundUser);

        res.json({
            token,
            user: {
                id: foundUser.id,
                name: foundUser.name,
                email: foundUser.email,
                companyId: foundUser.companyId,
                companyName: company[0]?.name || 'Unknown Company'
            }
        });

    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
}

export async function getMe(req: Request, res: Response) {
    try {
        const userId = (req as any).user.id;
        
        const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        if (!user.length) return res.status(404).json({ error: 'User not found' });

        const company = await db.select().from(companies).where(eq(companies.id, user[0].companyId!)).limit(1);

        res.json({
            id: user[0].id,
            name: user[0].name,
            email: user[0].email,
            companyId: user[0].companyId,
            companyName: company[0]?.name || 'Unknown',
            role: user[0].role
        });

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
