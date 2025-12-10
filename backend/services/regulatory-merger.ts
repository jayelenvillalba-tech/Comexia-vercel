import { countryBaseRequirements, countryRequirements } from '../../shared/shared/schema-sqlite';
import { eq, and } from 'drizzle-orm';

// Interfaces for our layers
interface BaseRequirement {
  baseDocuments: string; // JSON string
  generalCustomsProcess: string;
}

interface SpecificRequirement {
  requiredDocuments: string; // JSON string
  technicalStandards: string; // JSON string
  phytosanitaryReqs: string; // JSON string
  labelingReqs: string; // JSON string
  packagingReqs: string; // JSON string
  estimatedProcessingTime: number;
  additionalFees: string; // JSON string
}

// Legacy Compatible Interface (matches frontend expectations)
export interface CombinedRequirement {
  id?: string;
  countryCode: string;
  hsCode: string;
  requiredDocuments: Array<{ name: string; importance: string; issuer?: string; link?: string }>;
  technicalStandards: string[];
  phytosanitaryReqs: string[];
  labelingReqs: string[];
  packagingReqs: string[];
  estimatedProcessingTime: number;
  additionalFees: any;
  process: string; // New field, frontend might ignore it but good to have
  source: 'SMART_LAYER_V2';
}

export class RegulatoryMerger {
  /**
   * Merges Base Layer (Country) with Specific Layer (Product)
   */
  static merge(
    base: BaseRequirement | null,
    specific: SpecificRequirement | null,
    countryCode: string,
    hsCode: string
  ): CombinedRequirement {
    
    // 1. Parse Base Documents
    let baseDocs: any[] = [];
    if (base?.baseDocuments) {
      try {
        baseDocs = JSON.parse(base.baseDocuments);
      } catch (e) {
        console.error('Error parsing base docs:', e);
      }
    }

    // 2. Parse Specific Documents
    let specificDocs: any[] = [];
    if (specific?.requiredDocuments) {
      try {
        specificDocs = JSON.parse(specific.requiredDocuments);
      } catch (e) {
        console.error('Error parsing specific docs:', e);
      }
    }

    // 3. Combine Documents (Deduplication strategy: Append for now)
    const combinedDocs = [...baseDocs, ...specificDocs];

    // 4. Determine Process Description
    const process = base?.generalCustomsProcess || "Standard Import Procedure";

    // 5. Parse Specific Details
    const parseJson = (str?: string) => {
      if (!str) return [];
      try { return JSON.parse(str); } catch { return []; }
    };
    
    const parseJsonObj = (str?: string) => {
        if (!str) return {};
        try { return JSON.parse(str); } catch { return {}; }
    };

    return {
      countryCode,
      hsCode,
      requiredDocuments: combinedDocs,
      technicalStandards: parseJson(specific?.technicalStandards),
      phytosanitaryReqs: parseJson(specific?.phytosanitaryReqs),
      labelingReqs: parseJson(specific?.labelingReqs),
      packagingReqs: parseJson(specific?.packagingReqs),
      estimatedProcessingTime: specific?.estimatedProcessingTime || 0,
      additionalFees: parseJsonObj(specific?.additionalFees),
      process,
      source: 'SMART_LAYER_V2'
    };
  }
}
