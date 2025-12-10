import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(process.cwd(), 'backend/uploads')));
app.use('/api/verifications', verificationRouter);

// ========== API Routes ==========

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const hsCodesCount = await db.select({ count: sql<number>`count(*)` }).from(hsSubpartidas);
    const companiesCount = await db.select({ count: sql<number>`count(*)` }).from(companies);
    
    res.json({ 
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        hsCodes: hsCodesCount[0].count,
        companies: companiesCount[0].count,
        countries: countries.length
      }
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// ========== Auth API ==========

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, companyName } = req.body;
    
    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    
    if (existingUser && existingUser.length > 0) {
       return res.status(400).json({ status: 'error', message: 'User already exists' });
    }

    let companyId = null;
    
    // Create company if provided
    if (companyName) {
       const [newCompany] = await db.insert(companies).values({
          name: companyName,
          country: 'AR', // Default or from request
          type: 'exporter', // Default
          verified: false
       }).returning();
       companyId = newCompany.id;
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const [newUser] = await db.insert(users).values({
      name,
      email,
      password: hashedPassword, 
      companyId,
      role: 'admin',
      verified: false
    }).returning();

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    res.json(userWithoutPassword);

  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ status: 'error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email only
    const [user] = await db.select().from(users).where(eq(users.email, email));
    
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    // Get company info if exists
    let company = null;
    if (user.companyId) {
       const [comp] = await db.select().from(companies).where(eq(companies.id, user.companyId));
       company = comp;
    }

    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
       ...userWithoutPassword,
       company: company || null
    });

  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// ========== HS Codes API ==========

// Search HS codes
app.get('/api/hs-codes/search', async (req, res) => {
  try {
    const query = req.query.q as string || '';
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    let results: any[] = [];

    if (query) {
      const searchPattern = `%${query.toLowerCase()}%`;
      
      // Use direct SQL to search both tables
      const { sqliteDb } = await import('../database/db-sqlite');
      
      console.log(`🔍 Backend: Searching HS codes with query: "${query}"`);
      console.log(`🔍 Backend: Limit: ${limit}, Offset: ${offset}`);
      
      const partidasResults = sqliteDb.exec(`
        SELECT * FROM hs_partidas 
        WHERE 
          code LIKE '${query}' OR
          lower(description) LIKE '${searchPattern}' OR
          lower(description_en) LIKE '${searchPattern}' OR
          lower(keywords) LIKE '${searchPattern}'
        LIMIT ${limit}
        OFFSET ${offset}
      `);
      console.log(`  - Partidas found: ${partidasResults.length > 0 ? partidasResults[0].values?.length || 0 : 0}`);
      
      const subpartidasResults = sqliteDb.exec(`
        SELECT * FROM hs_subpartidas 
        WHERE 
          code LIKE '${query}' OR
          lower(description) LIKE '${searchPattern}' OR
          lower(description_en) LIKE '${searchPattern}' OR
          lower(keywords) LIKE '${searchPattern}'
        LIMIT ${limit}
        OFFSET ${offset}
      `);
      
      // Convert SQL results to objects
      if (partidasResults.length > 0 && partidasResults[0].values) {
        const columns = partidasResults[0].columns;
        partidasResults[0].values.forEach((row: any[]) => {
          const obj: any = {};
          columns.forEach((col: any, idx: any) => {
            obj[col] = row[idx];
          });
          results.push(obj);
        });
      }
      
      if (subpartidasResults.length > 0 && subpartidasResults[0].values) {
        const columns = subpartidasResults[0].columns;
        subpartidasResults[0].values.forEach((row: any[]) => {
          const obj: any = {};
          columns.forEach((col, idx) => {
            obj[col] = row[idx];
          });
          results.push(obj);
        });
      }
      
      // Limit combined results
      results = results.slice(0, limit);
    } else {
      // No query, return some results from both tables
      const { sqliteDb } = await import('../database/db-sqlite');
      
      const allResults = sqliteDb.exec(`
        SELECT * FROM hs_partidas LIMIT ${limit} OFFSET ${offset}
      `);
      
      if (allResults.length > 0 && allResults[0].values) {
        const columns = allResults[0].columns;
        allResults[0].values.forEach((row: any[]) => {
          const obj: any = {};
          columns.forEach((col, idx) => {
            obj[col] = row[idx];
          });
          results.push(obj);
        });
      }
    }

    res.json({
      success: true,
      total: results.length,
      limit,
      offset,
      results
    });
  } catch (error: any) {
    console.error('Error searching HS codes:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error searching HS codes',
      details: error.message
    });
  }
});

// Get HS code by code
app.get('/api/hs-codes/:code', async (req, res) => {
  try {
    const code = req.params.code;
    
    // Try subpartidas first (6 digits)
    let hsCode = await db.query.hsSubpartidas.findFirst({
        where: eq(hsSubpartidas.code, code)
    });

    // If not found, try partidas (4 digits)
    if (!hsCode) {
        const partida = await db.query.hsPartidas.findFirst({
            where: eq(hsPartidas.code, code)
        });
        if (partida) {
             // Map to similar structure
             hsCode = {
                 ...partida,
                 partidaCode: '',
                 restrictions: null,
                 isActive: true,
                 keywords: null
             } as any;
        }
    }

    if (!hsCode) {
      return res.status(404).json({
        success: false,
        error: 'HS code not found'
      });
    }

    // Compatibility mapping
    const responseData = {
        ...hsCode,
        baseTariff: hsCode.tariffRate || 0,
        section: '', 
        specializations: [] 
    };

    res.json({
      success: true,
      data: responseData
    });
  } catch (error: any) {
    console.error('Error getting HS code:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error getting HS code',
      details: error.message
    });
  }
});

// ========== Country Recommendations API ==========

app.get('/api/country-recommendations', async (req, res) => {
  try {
    const hsCode = req.query.hsCode as string;
    const operation = req.query.operation as string || 'export';
    const originCountry = req.query.originCountry as string;

    if (!hsCode) {
      return res.status(400).json({
        success: false,
        error: 'hsCode parameter is required'
      });
    }

    // Get HS code details from DB (check subpartidas first, then partidas)
    let hsCodeData = await db.query.hsSubpartidas.findFirst({
        where: eq(hsSubpartidas.code, hsCode)
    });

    if (!hsCodeData) {
      // Try finding in partidas (4-digit)
      const partidaData = await db.query.hsPartidas.findFirst({
        where: eq(hsPartidas.code, hsCode)
      });
      
      if (partidaData) {
        hsCodeData = partidaData as any; // Cast to any to match expected structure
      }
    }

    if (!hsCodeData) {
      return res.status(404).json({
        success: false,
        error: 'HS code not found'
      });
    }

    // Mock recommendations for now to fix the build
    const sortedRecommendations = [
        { country: 'China', countryCode: 'CN', score: 0.9, opportunity: 'high', tradeVolume: '$500M', growth: '+15%', treaties: ['TLC Chile-China'] },
        { country: 'USA', countryCode: 'US', score: 0.8, opportunity: 'high', tradeVolume: '$450M', growth: '+12%', treaties: ['TLC Chile-USA'] },
        { country: 'Germany', countryCode: 'DE', score: 0.7, opportunity: 'medium', tradeVolume: '$300M', growth: '+8%', treaties: ['Acuerdo Chile-UE'] },
        { country: 'Brazil', countryCode: 'BR', score: 0.6, opportunity: 'medium', tradeVolume: '$200M', growth: '+5%', treaties: ['ACE Chile-Mercosur'] },
        { country: 'Spain', countryCode: 'ES', score: 0.5, opportunity: 'low', tradeVolume: '$100M', growth: '+2%', treaties: ['Acuerdo Chile-UE'] }
    ];

    res.json({
      success: true,
      hsCode,
      operation,
      originCountry: originCountry || null,
      total: sortedRecommendations.length,
      recommended: sortedRecommendations
    });
  } catch (error: any) {
    console.error('Error generating country recommendations:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error generating country recommendations',
      details: error.message
    });
  }
});

// ========== Companies API ==========

app.get('/api/companies', async (req, res) => {
  try {
    const country = req.query.country as string;
    const type = req.query.type as 'importer' | 'exporter' | 'both';
    const search = req.query.search as string; // Can be HS code or company name
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    let conditions = [];
    
    if (country) {
        conditions.push(eq(companies.country, country));
    }
    
    if (type && type !== 'both') {
        conditions.push(eq(companies.type, type));
    }
    
    if (search) {
        conditions.push(or(
            like(companies.name, `%${search}%`),
            like(companies.products, `%${search}%`)
        ));
    }

    const results = await db.select()
        .from(companies)
        .where(and(...conditions))
        .limit(limit)
        .offset(offset);

    // Fallback: If no results found with specific search, try returning companies for that country only
    // This ensures the demo always shows something relevant to the country/treaty
    if (results.length === 0 && search) {
        console.log('No specific companies found, falling back to country-wide search');
        const fallbackConditions = [];
        if (country) fallbackConditions.push(eq(companies.country, country));
        if (type && type !== 'both') fallbackConditions.push(eq(companies.type, type));
        
        const fallbackResults = await db.select()
            .from(companies)
            .where(and(...fallbackConditions))
            .limit(limit)
            .offset(offset);
            
        return res.json({
            success: true,
            total: fallbackResults.length,
            limit,
            offset,
            source: 'database-fallback',
            companies: fallbackResults
        });
    }

    const totalResult = await db.select({ count: sql<number>`count(*)` })
        .from(companies)
        .where(and(...conditions));

    res.json({
      success: true,
      total: totalResult[0].count,
      limit,
      offset,
      source: 'database',
      companies: results
    });
  } catch (error: any) {
    console.error('Error searching companies:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error searching companies',
      details: error.message
    });
  }
});

// Get company by ID
app.get('/api/companies/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const company = await db.query.companies.findFirst({
        where: eq(companies.id, id)
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        error: 'Company not found'
      });
    }

    res.json({
      success: true,
      data: company
    });
  } catch (error: any) {
    console.error('Error getting company:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error getting company',
      details: error.message
    });
  }
});

// Get country requirements
// News API
import { newsService } from './services/news-service.js';

app.get('/api/news', async (req, res) => {
  try {
    const category = req.query.category as string;
    const news = await newsService.getLatestNews(20, category);
    res.json(news);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/country-requirements/:countryCode/:hsCode', async (req, res) => {
  try {
    const { countryCode, hsCode } = req.params;
    console.log(`[DEBUG] Requesting Requirements (V2 Smart Layers): Country=${countryCode} HS=${hsCode}`);
    
    // 1. Fetch Base Requirements (Layer 1)
    const baseReqs = await db.select().from(countryBaseRequirements)
      .where(eq(countryBaseRequirements.countryCode, countryCode))
      .limit(1);

    // 2. Fetch Specific Requirements (Layer 2)
    // SMART MATCHING: Find rules where the requested HS Code starts with the Rule's HS Code
    // e.g. Request '0201' matches Rule '02' (Meat) or '0201' (Beef Cuts)
    // We order by length(hs_code) DESC to get the most specific rule first
    const specificReqs = await db.select().from(countryRequirements)
      .where(and(
        eq(countryRequirements.countryCode, countryCode),
        sql`${hsCode} LIKE ${countryRequirements.hsCode} || '%'`
      ))
      .orderBy(desc(sql`length(${countryRequirements.hsCode})`))
      .limit(1);

    // 3. Merge Layers
    const merged = RegulatoryMerger.merge(
      baseReqs[0] || null,
      specificReqs[0] || null,
      countryCode,
      hsCode
    );

    // [DEMO OVERRIDE] Keep US Beef Mock if needed, but merge it if possible?
    // For now, if we have specific requirements in DB, we use them.
    // If NOT, and it matches the demo case, we might want to inject.
    // But let's trust the DB first. If DB is empty for specific, merged will just have base.
    
    // Check if we have meaningful specific data. If not, and it's the demo case, inject mock.
    if (!specificReqs[0] && ['US', 'USA'].includes(countryCode.toUpperCase()) && hsCode.startsWith('0201')) {
       console.log('[DEBUG] Injecting Mock Specifics for US Beef demo');
       // We can manually construct a specific object and merge it
       const mockSpecific = {
          requiredDocuments: JSON.stringify([
             { name: "Certificado Sanitario Veterinario (C.S.V.)", issuer: "SENASA", importance: "Mandatory" },
             { name: "FSIS Form 9060-5", issuer: "USDA", importance: "Mandatory" }
          ]),
          technicalStandards: JSON.stringify(["FSIS Directive 9000.1"]),
          phytosanitaryReqs: JSON.stringify(["Libre de Aftosa"]),
          labelingReqs: JSON.stringify(["Country of Origin", "Net Weight"]),
          packagingReqs: JSON.stringify(["Vacuum Packed"]),
          estimatedProcessingTime: 45,
          additionalFees: JSON.stringify({ inspection: "0.05 USD/lb" })
       };
       // Re-merge with mock
       const mergedMock = RegulatoryMerger.merge(baseReqs[0] || null, mockSpecific as any, countryCode, hsCode);
       return res.json(mergedMock);
    }

    res.json(merged);

  } catch (error: any) {
    console.error('Error fetching requirements:', error);
    res.status(500).json({ error: error.message });
  }
});

// ========== Cost Calculator API ==========

app.post('/api/calculate-costs', calculateCosts);

// ========== Market Analysis API ==========

app.get('/api/market-analysis', analyzeMarket);

// ========== MARKETPLACE APIs ==========

// Import marketplace tables


// Get all marketplace posts with filters
app.get('/api/marketplace/posts', async (req, res) => {
  try {
    const { type, hsCode, country, dateRange, verifiedOnly, limit = '50', offset = '0' } = req.query;
    
    let query = db.select().from(marketplacePosts);
    const conditions: any[] = [];
    
    // Apply filters
    if (type && type !== 'all') {
      conditions.push(eq(marketplacePosts.type, type as string));
    }
    
    if (hsCode) {
      conditions.push(like(marketplacePosts.hsCode, `${hsCode}%`));
    }
    
    if (country) {
      conditions.push(
        or(
          eq(marketplacePosts.originCountry, country as string),
          eq(marketplacePosts.destinationCountry, country as string)
        )
      );
    }
    
    // Date range filter
    if (dateRange && dateRange !== 'all') {
      const now = Date.now();
      let cutoffTime = now;
      
      if (dateRange === 'today') cutoffTime = now - (24 * 60 * 60 * 1000);
      else if (dateRange === 'week') cutoffTime = now - (7 * 24 * 60 * 60 * 1000);
      else if (dateRange === 'month') cutoffTime = now - (30 * 24 * 60 * 60 * 1000);
      
      conditions.push(sql`${marketplacePosts.createdAt} >= ${new Date(cutoffTime)}`);
    }
    
    // Only active posts
    conditions.push(eq(marketplacePosts.status, 'active'));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    const posts = await query
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string))
      .orderBy(desc(marketplacePosts.createdAt));
    
    // Get company and user info for each post
    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        const company = await db.select().from(companies).where(eq(companies.id, post.companyId)).limit(1);
        const user = await db.select().from(users).where(eq(users.id, post.userId)).limit(1);
        
        return {
          ...post,
          company: company[0] || null,
          user: user[0] || null,
          requirements: post.requirements ? JSON.parse(post.requirements) : [],
          certifications: post.certifications ? JSON.parse(post.certifications) : []
        };
      })
    );
    
    res.json(enrichedPosts);
  } catch (error: any) {
    console.error('Error fetching marketplace posts:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single post
app.get('/api/marketplace/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await db.select().from(marketplacePosts).where(eq(marketplacePosts.id, id)).limit(1);
    
    if (post.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const company = await db.select().from(companies).where(eq(companies.id, post[0].companyId)).limit(1);
    const user = await db.select().from(users).where(eq(users.id, post[0].userId)).limit(1);
    
    res.json({
      ...post[0],
      company: company[0] || null,
      user: user[0] || null,
      requirements: post[0].requirements ? JSON.parse(post[0].requirements) : [],
      certifications: post[0].certifications ? JSON.parse(post[0].certifications) : []
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create new post
app.post('/api/marketplace/posts', async (req, res) => {
  try {
    const { companyId, userId, type, hsCode, productName, quantity, originCountry, destinationCountry, deadlineDays, requirements, certifications } = req.body;
    
    const newPost = {
      id: crypto.randomUUID(),
      companyId,
      userId,
      type,
      hsCode,
      productName,
      quantity,
      originCountry,
      destinationCountry,
      deadlineDays,
      requirements: requirements ? JSON.stringify(requirements) : null,
      certifications: certifications ? JSON.stringify(certifications) : null,
      status: 'active',
      createdAt: new Date(),
      expiresAt: deadlineDays ? new Date(Date.now() + deadlineDays * 24 * 60 * 60 * 1000) : null
    };
    
    await db.insert(marketplacePosts).values(newPost);
    res.status(201).json(newPost);
  } catch (error: any) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update post
app.put('/api/marketplace/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (updates.requirements) {
      updates.requirements = JSON.stringify(updates.requirements);
    }
    if (updates.certifications) {
      updates.certifications = JSON.stringify(updates.certifications);
    }
    
    await db.update(marketplacePosts).set(updates).where(eq(marketplacePosts.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete post
app.delete('/api/marketplace/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.update(marketplacePosts).set({ status: 'closed' }).where(eq(marketplacePosts.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get company profile
app.get('/api/companies/:id/profile', async (req, res) => {
  try {
    const { id } = req.params;
    const company = await db.select().from(companies).where(eq(companies.id, id)).limit(1);
    
    if (company.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    // Get employees
    const employees = await db.select().from(users).where(eq(users.companyId, id));
    
    // Get subscription
    const subscription = await db.select().from(subscriptions).where(eq(subscriptions.companyId, id)).limit(1);
    
    // Get recent posts
    const recentPosts = await db.select().from(marketplacePosts)
      .where(and(eq(marketplacePosts.companyId, id), eq(marketplacePosts.status, 'active')))
      .limit(10)
      .orderBy(desc(marketplacePosts.createdAt));
    
    res.json({
      ...company[0],
      employees,
      subscription: subscription[0] || null,
      recentPosts,
      products: company[0].products ? JSON.parse(company[0].products) : [],
      certifications: company[0].certifications ? JSON.parse(company[0].certifications) : []
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get user profile
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
    
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const company = await db.select().from(companies).where(eq(companies.id, user[0].companyId!)).limit(1);
    
    res.json({
      ...user[0],
      company: company[0] || null
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ========== CHAT ROUTES ==========

// Get user conversations
app.get('/api/chat/conversations', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'UserId required' });
    
    // Get conversations where user is a participant
    const userConvs = await db.select().from(conversationParticipants)
      .where(eq(conversationParticipants.userId, userId as string));
      
    const convIds = userConvs.map(uc => uc.conversationId);
    
    if (convIds.length === 0) return res.json([]);
    
    const convs = await db.select().from(conversations)
      .where(sql`${conversations.id} IN ${convIds}`)
      .orderBy(desc(conversations.lastMessageAt));
      
    // Enrich with other company info
    const enrichedConvs = await Promise.all(convs.map(async (conv) => {
      const company1 = await db.select().from(companies).where(eq(companies.id, conv.company1Id)).limit(1);
      const company2 = await db.select().from(companies).where(eq(companies.id, conv.company2Id)).limit(1);
      
      return {
        ...conv,
        company1: company1[0],
        company2: company2[0]
      };
    }));
    
    res.json(enrichedConvs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create or get conversation
app.post('/api/chat/conversations', async (req, res) => {
  try {
    const { userId, otherCompanyId, postId, initialMessage } = req.body;
    
    // Get user's company
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (user.length === 0) return res.status(404).json({ error: 'User not found' });
    
    const company1Id = user[0].companyId;
    
    // Check if conversation already exists
    const existingConv = await db.select().from(conversations)
      .where(
        and(
          eq(conversations.postId, postId),
          or(
            and(eq(conversations.company1Id, company1Id!), eq(conversations.company2Id, otherCompanyId)),
            and(eq(conversations.company1Id, otherCompanyId), eq(conversations.company2Id, company1Id!))
          )
        )
      ).limit(1);
      
    if (existingConv.length > 0) {
      return res.json(existingConv[0]);
    }
    
    // Create new conversation
    const newConv = {
      id: crypto.randomUUID(),
      postId,
      company1Id: company1Id!,
      company2Id: otherCompanyId,
      status: 'active',
      createdAt: new Date(),
      lastMessageAt: new Date()
    };
    
    await db.insert(conversations).values(newConv);
    
    // Add participants
    await db.insert(conversationParticipants).values([
      {
        id: crypto.randomUUID(),
        conversationId: newConv.id,
        userId: userId,
        role: user[0].role || 'tecnico',
        accessLevel: 'full',
        addedAt: new Date(),
        isActive: true
      },
      // Add a placeholder participant for the other company (to be claimed)
      // For demo purposes, we'll find a user from that company
      {
        id: crypto.randomUUID(),
        conversationId: newConv.id,
        userId: 'demo-user-very', // Fallback
        role: 'admin',
        accessLevel: 'full',
        addedAt: new Date(),
        isActive: true
      }
    ]);
    
    // Send initial message
    if (initialMessage) {
      await db.insert(messages).values({
        id: crypto.randomUUID(),
        conversationId: newConv.id,
        senderId: userId,
        content: initialMessage,
        messageType: 'text',
        createdAt: new Date(),
        readAt: null
      });
    }
    
    res.status(201).json(newConv);
  } catch (error: any) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get conversation details
app.get('/api/chat/conversations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await db.select().from(conversations).where(eq(conversations.id, id)).limit(1);
    
    if (conversation.length === 0) return res.status(404).json({ error: 'Conversation not found' });
    
    // Get participants
    const participants = await db.select().from(conversationParticipants)
      .where(eq(conversationParticipants.conversationId, id));
      
    // Get messages
    const msgs = await db.select().from(messages)
      .where(eq(messages.conversationId, id))
      .orderBy(messages.createdAt);
      
    res.json({
      ...conversation[0],
      participants,
      messages: msgs
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Send message
app.post('/api/chat/conversations/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const { senderId, content, type = 'text', metadata } = req.body;
    
    const newMessage = {
      id: crypto.randomUUID(),
      conversationId: id,
      senderId,
      content,
      messageType: type,
      metadata: metadata ? JSON.stringify(metadata) : null,
      createdAt: new Date(),
      readAt: null
    };
    
    await db.insert(messages).values(newMessage);
    
    // Update conversation last message
    await db.update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, id));
      
    res.status(201).json(newMessage);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get pending verifications (admin)
app.get('/api/admin/verifications', async (req, res) => {
  try {
    const pending = await db.select().from(verifications)
      .where(eq(verifications.status, 'pending'))
      .orderBy(desc(verifications.submittedAt));
    
    res.json(pending);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Approve/reject verification (admin)
app.put('/api/admin/verifications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    await db.update(verifications).set({
      status,
      notes,
      reviewedAt: new Date(),
      reviewedBy: 'admin' // TODO: Get from auth
    }).where(eq(verifications.id, id));
    
    // If approved, update entity verification status
    if (status === 'approved') {
      const verification = await db.select().from(verifications).where(eq(verifications.id, id)).limit(1);
      if (verification.length > 0) {
        const v = verification[0];
        if (v.entityType === 'company') {
          await db.update(companies).set({ verified: true }).where(eq(companies.id, v.entityId));
        } else if (v.entityType === 'employee') {
          await db.update(users).set({ verified: true }).where(eq(users.id, v.entityId));
        }
      }
    }
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


import { AIService } from './services/ai-service.js';

// ========== CHAT APIs ==========



// Get all conversations for current user (mock user for now)
app.get('/api/chat/conversations', async (req, res) => {
  try {
    // TODO: Get actual user from auth
    const userId = req.query.userId as string || 'mock-user-1';
    
    // Get user's company
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user.length) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userCompanyId = user[0].companyId;
    
    // Get conversations where user's company is involved
    const convos = await db.select()
      .from(conversations)
      .where(
        or(
          eq(conversations.company1Id, userCompanyId!),
          eq(conversations.company2Id, userCompanyId!)
        )
      )
      .orderBy(desc(conversations.lastMessageAt));
    
    // Enrich with company info and last message
    const enriched = await Promise.all(
      convos.map(async (convo) => {
        // Get other company
        const otherCompanyId = convo.company1Id === userCompanyId ? convo.company2Id : convo.company1Id;
        const otherCompany = await db.select().from(companies).where(eq(companies.id, otherCompanyId)).limit(1);
        
        // Get last message
        const lastMsg = await db.select()
          .from(messages)
          .where(eq(messages.conversationId, convo.id))
          .orderBy(desc(messages.createdAt))
          .limit(1);
        
        // Count unread messages
        const unreadCount = await db.select({ count: sql<number>`count(*)` })
          .from(messages)
          .where(
            and(
              eq(messages.conversationId, convo.id),
              sql`${messages.senderId} != ${userId}`,
              sql`${messages.readAt} IS NULL`
            )
          );
        
        return {
          ...convo,
          otherCompany: otherCompany[0] || null,
          lastMessage: lastMsg[0] || null,
          unreadCount: unreadCount[0]?.count || 0
        };
      })
    );
    
    res.json(enriched);
  } catch (error: any) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new conversation
app.post('/api/chat/conversations', async (req, res) => {
  try {
    const { userId, otherCompanyId, postId, initialMessage } = req.body;
    
    // Get user's company
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user.length) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userCompanyId = user[0].companyId;
    
    // Check if conversation already exists
    const existing = await db.select()
      .from(conversations)
      .where(
        or(
          and(
            eq(conversations.company1Id, userCompanyId!),
            eq(conversations.company2Id, otherCompanyId)
          ),
          and(
            eq(conversations.company1Id, otherCompanyId),
            eq(conversations.company2Id, userCompanyId!)
          )
        )
      )
      .limit(1);
    
    if (existing.length > 0) {
      return res.json(existing[0]);
    }
    
    // Create new conversation
    const newConvo = {
      id: crypto.randomUUID(),
      company1Id: userCompanyId!,
      company2Id: otherCompanyId,
      postId: postId || null,
      status: 'active',
      createdAt: new Date(),
      lastMessageAt: new Date()
    };
    
    await db.insert(conversations).values(newConvo);
    
    // Add creator as participant
    // Get user role
    const userRole = user[0].primaryRole || 'tecnico';
    
    await db.insert(conversationParticipants).values({
      id: crypto.randomUUID(),
      conversationId: newConvo.id,
      userId: userId,
      role: userRole,
      accessLevel: 'full',
      addedBy: userId,
      addedAt: new Date(),
      isActive: true
    });
    
    // Send initial message if provided
    if (initialMessage) {
      const newMsg = {
        id: crypto.randomUUID(),
        conversationId: newConvo.id,
        senderId: userId,
        messageType: 'text',
        content: initialMessage,
        createdAt: new Date(),
        readAt: null
      };
      
      await db.insert(messages).values(newMsg);
    }
    
    res.status(201).json(newConvo);
  } catch (error: any) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get messages for a conversation
app.get('/api/chat/conversations/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = '50', offset = '0', since } = req.query;
    const userId = req.query.userId as string || 'mock-user-1';
    
    let query = db.select()
      .from(messages)
      .where(eq(messages.conversationId, id));
    
    // If 'since' timestamp provided, only get newer messages
    if (since) {
      query = query.where(sql`${messages.createdAt} > ${new Date(parseInt(since as string))}`);
    }
    
    const msgs = await query
      .orderBy(messages.createdAt)
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));
    
    // Enrich with sender info
    const enriched = await Promise.all(
      msgs.map(async (msg) => {
        const sender = await db.select().from(users).where(eq(users.id, msg.senderId)).limit(1);
        return {
          ...msg,
          sender: sender[0] || null
        };
      })
    );
    
    // Mark messages as read (except own messages)
    const unreadIds = enriched
      .filter((m: any) => m.senderId !== userId && !m.readAt)
      .map((m: any) => m.id);
    
    if (unreadIds.length > 0) {
      await db.update(messages)
        .set({ readAt: new Date() })
        .where(sql`${messages.id} IN (${sql.join(unreadIds.map((id: any) => sql`${id}`), sql`, `)})`);
    }
    
    res.json(enriched);
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: error.message });
  }
});

// Send new message
app.post('/api/chat/conversations/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, content, messageType = 'text', metadata } = req.body;
    
    const newMsg = {
      id: crypto.randomUUID(),
      conversationId: id,
      senderId: userId,
      messageType,
      content,
      metadata: metadata ? JSON.stringify(metadata) : null,
      createdAt: new Date(),
      readAt: null
    };
    
    await db.insert(messages).values(newMsg);
    
    // Update conversation's lastMessageAt
    await db.update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, id));
    
    // Get sender info
    const sender = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    
    res.status(201).json({
      ...newMsg,
      sender: sender[0] || null
    });
  } catch (error: any) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get unread count
app.get('/api/chat/unread-count', async (req, res) => {
  try {
    const userId = req.query.userId as string || 'mock-user-1';
    
    // Get user's company
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user.length) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userCompanyId = user[0].companyId;
    
    // Get all conversations for user's company
    const convos = await db.select()
      .from(conversations)
      .where(
        or(
          eq(conversations.company1Id, userCompanyId!),
          eq(conversations.company2Id, userCompanyId!)
        )
      );
    
    // Count unread messages across all conversations
    let totalUnread = 0;
    for (const convo of convos) {
      const unread = await db.select({ count: sql<number>`count(*)` })
        .from(messages)
        .where(
          and(
            eq(messages.conversationId, convo.id),
            sql`${messages.senderId} != ${userId}`,
            sql`${messages.readAt} IS NULL`
          )
        );
      
      totalUnread += unread[0]?.count || 0;
    }
    
    res.json({ count: totalUnread });
  } catch (error: any) {
    console.error('Error counting unread messages:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get participants for a conversation
app.get('/api/chat/conversations/:id/participants', async (req, res) => {
  try {
    const { id } = req.params;
    
    const participants = await db.select()
      .from(conversationParticipants)
      .where(and(
        eq(conversationParticipants.conversationId, id),
        eq(conversationParticipants.isActive, true)
      ));
    
    // Enrich with user info
    const enriched = await Promise.all(
      participants.map(async (p) => {
        const user = await db.select().from(users).where(eq(users.id, p.userId)).limit(1);
        return {
          ...p,
          user: user[0] || null
        };
      })
    );
    
    res.json(enriched);
  } catch (error: any) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add participant (Transfer)
app.post('/api/chat/conversations/:id/participants', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role, addedBy, note } = req.body;
    
    // Check if already exists
    const existing = await db.select()
      .from(conversationParticipants)
      .where(and(
        eq(conversationParticipants.conversationId, id),
        eq(conversationParticipants.userId, userId)
      ))
      .limit(1);
      
    if (existing.length > 0) {
      // Reactivate if inactive
      if (!existing[0].isActive) {
        await db.update(conversationParticipants)
          .set({ isActive: true, role, addedBy, addedAt: new Date() })
          .where(eq(conversationParticipants.id, existing[0].id));
        return res.json({ ...existing[0], isActive: true });
      }
      return res.status(400).json({ error: 'User already in conversation' });
    }
    
    const newParticipant = {
      id: crypto.randomUUID(),
      conversationId: id,
      userId,
      role,
      accessLevel: 'full',
      addedBy,
      addedAt: new Date(),
      isActive: true
    };
    
    await db.insert(conversationParticipants).values(newParticipant);
    
    // Create system message
    const adder = await db.select().from(users).where(eq(users.id, addedBy)).limit(1);
    const added = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    
    const systemMsgContent = `${adder[0]?.name} (${adder[0]?.primaryRole || 'User'}) agregó a ${added[0]?.name} (${role})`;
    
    await db.insert(messages).values({
      id: crypto.randomUUID(),
      conversationId: id,
      senderId: addedBy, // System message attributed to adder
      messageType: 'system',
      content: note ? `${systemMsgContent}\nNota: ${note}` : systemMsgContent,
      createdAt: new Date(),
      readAt: null
    });
    
    res.status(201).json(newParticipant);
  } catch (error: any) {
    console.error('Error adding participant:', error);
    res.status(500).json({ error: error.message });
  }
});

// Transfer conversation (Wrapper for add participant)
app.post('/api/chat/conversations/:id/transfer', async (req, res) => {
  try {
    const { id } = req.params;
    const { toUserId, role, fromUserId, note } = req.body;
    
    // Reuse logic from add participant
    // Ideally refactor, but for now calling the logic directly
    
    // Check if already exists
    const existing = await db.select()
      .from(conversationParticipants)
      .where(and(
        eq(conversationParticipants.conversationId, id),
        eq(conversationParticipants.userId, toUserId)
      ))
      .limit(1);
      
    if (existing.length > 0 && existing[0].isActive) {
      return res.status(400).json({ error: 'User already in conversation' });
    }
    
    // Add participant
    const newParticipant = {
      id: crypto.randomUUID(),
      conversationId: id,
      userId: toUserId,
      role,
      accessLevel: 'full',
      addedBy: fromUserId,
      addedAt: new Date(),
      isActive: true
    };
    
    if (existing.length > 0) {
       await db.update(conversationParticipants)
          .set({ isActive: true, role, addedBy: fromUserId, addedAt: new Date() })
          .where(eq(conversationParticipants.id, existing[0].id));
    } else {
       await db.insert(conversationParticipants).values(newParticipant);
    }
    
    // Create system message for transfer
    const fromUser = await db.select().from(users).where(eq(users.id, fromUserId)).limit(1);
    const toUser = await db.select().from(users).where(eq(users.id, toUserId)).limit(1);
    
    const systemMsgContent = `${fromUser[0]?.name} (${fromUser[0]?.primaryRole || 'User'}) trasladó la conversación a ${toUser[0]?.name} (${role})`;
    
    await db.insert(messages).values({
      id: crypto.randomUUID(),
      conversationId: id,
      senderId: fromUserId,
      messageType: 'system',
      content: note ? `${systemMsgContent}\nNota: ${note}` : systemMsgContent,
      createdAt: new Date(),
      readAt: null
    });
    
    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error transferring conversation:', error);
    res.status(500).json({ error: error.message });
  }
});

// AI Smart Replies
app.post('/api/chat/ai/suggest', async (req, res) => {
  try {
    const { conversationId } = req.body;
    
    // Get last few messages for context
    const recentMessages = await db.select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(desc(messages.createdAt))
      .limit(5);
      
    // Reverse to chronological order
    const context = recentMessages.reverse().map(m => ({
      role: 'user', // Simplified for mock
      content: m.content || ''
    }));
    
    const suggestions = await AIService.generateSmartReplies(context);
    res.json({ suggestions });
  } catch (error: any) {
    console.error('Error generating AI suggestions:', error);
    res.status(500).json({ error: error.message });
  }
});

// AI Query
app.post('/api/chat/ai/query', async (req, res) => {
  try {
    const { conversationId, query } = req.body;
    
    // Get context
    const recentMessages = await db.select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(desc(messages.createdAt))
      .limit(10);
      
    const context = recentMessages.reverse().map((m: any) => ({
      role: 'user',
      content: m.content || ''
    }));
    
    const answer = await AIService.analyzeChatQuery(query, context);
    res.json({ answer });
  } catch (error: any) {
    console.error('Error processing AI query:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate Chat Invite
app.post('/api/chat/conversations/:id/invites', async (req, res) => {
  try {
    const { id: conversationId } = req.params;
    const { userId, role = 'logistica', accessLevel = 'limited', expiresInHours = 72 } = req.body;
    
    // Create invite
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);
    
    const invite = await db.insert(chatInvites).values({
      conversationId,
      createdBy: userId,
      role,
      accessLevel,
      expiresAt,
      status: 'pending'
    }).returning();
    
    res.json({
      success: true,
      invite: invite[0],
      inviteUrl: `${req.protocol}://${req.get('host')}/join-chat/${invite[0].token}`
    });
  } catch (error: any) {
    console.error('Error creating invite:', error);
    res.status(500).json({ error: error.message });
  }
});

// Join via Invite Token
app.post('/api/chat/invites/:token/join', async (req, res) => {
  try {
    const { token } = req.params;
    const { userId } = req.body;
    
    // Get invite
    const invites = await db.select()
      .from(chatInvites)
      .where(eq(chatInvites.token, token))
      .limit(1);
      
    if (invites.length === 0) {
      return res.status(404).json({ error: 'Invite not found' });
    }
    
    const invite = invites[0];
    
    // Check if invite is valid
    if (invite.status !== 'pending') {
      return res.status(400).json({ error: 'Invite already used or expired' });
    }
    
    if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
      await db.update(chatInvites)
        .set({ status: 'expired' })
        .where(eq(chatInvites.id, invite.id));
      return res.status(400).json({ error: 'Invite has expired' });
    }
    
    // Add user to conversation participants
    const existingParticipant = await db.select()
      .from(conversationParticipants)
      .where(and(
        eq(conversationParticipants.conversationId, invite.conversationId),
        eq(conversationParticipants.userId, userId)
      ))
      .limit(1);
      
    if (existingParticipant.length === 0) {
      await db.insert(conversationParticipants).values({
        conversationId: invite.conversationId,
        userId,
        role: invite.role,
        accessLevel: invite.accessLevel,
        addedBy: invite.createdBy
      });
    }
    
    // Mark invite as used
    await db.update(chatInvites)
      .set({ 
        status: 'used',
        usedBy: userId,
        usedAt: new Date()
      })
      .where(eq(chatInvites.id, invite.id));
      
    // Create system message
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const systemMsgContent = `${user[0]?.name || 'Usuario externo'} se unió a la conversación como ${invite.role}`;
    
    await db.insert(messages).values({
      conversationId: invite.conversationId,
      senderId: userId,
      content: systemMsgContent,
      messageType: 'system'
    });
    
    res.json({ 
      success: true, 
      conversationId: invite.conversationId 
    });
  } catch (error: any) {
    console.error('Error joining via invite:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve frontend

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, async () => {
  await initializeTables();
  console.log(`Server running on port ${PORT}`);
  console.log(`📁 SQLite Database connected`);
});
