
import { db } from '../../database/db-sqlite.js';
import { sanctionsList } from '../../shared/shared/schema-sqlite.js';
import { eq, or, and, isNull, inArray } from 'drizzle-orm';

export class SanctionsService {
  /**
   * Checks if a transaction is under international sanctions
   * @param country Destination country code
   * @param hsCode HS Code of the product
   * @returns Array of sanction alerts
   */
  static async checkSanctions(country: string, hsCode: string): Promise<any[]> {
    const chapter = hsCode.substring(0, 2);
    
    try {
      const rules = await db.select().from(sanctionsList).where(
        or(
          // 1. Total Country Sanction
          and(eq(sanctionsList.countryCode, country), isNull(sanctionsList.hsChapter)),
          // 2. Sectoral Sanction in Country
          and(eq(sanctionsList.countryCode, country), eq(sanctionsList.hsChapter, chapter)),
          // 3. Global Sectoral Sanction
          and(eq(sanctionsList.countryCode, 'GLOBAL'), eq(sanctionsList.hsChapter, chapter))
        )
      );

      return rules.map(rule => ({
        type: 'SANCTION-ALERT',
        authority: rule.authority,
        message: rule.message,
        severity: rule.severity,
        isBlocking: rule.severity === 'CRITICAL'
      }));
    } catch (error) {
      console.error('Error checking sanctions:', error);
      return [];
    }
  }
}
