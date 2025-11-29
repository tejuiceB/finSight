import Papa from 'papaparse';
import type { ParsedFile, Transaction } from '@/lib/types';

/**
 * Parse CSV file and extract transaction data
 */
export async function parseCSV(file: File): Promise<ParsedFile> {
  const text = await file.text();
  
  return {
    filename: file.name,
    text,
    fileType: 'csv',
    uploadedAt: new Date().toISOString(),
  };
}

/**
 * Extract transactions from CSV data
 * Automatically detects common column names for dates, amounts, merchants
 */
export function extractTransactionsFromCSV(text: string, filename: string): Transaction[] {
  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
  const transactions: Transaction[] = [];
  
  if (!parsed.data || parsed.data.length === 0) {
    return transactions;
  }
  
  const data = parsed.data as Array<Record<string, string>>;
  const headers = Object.keys(data[0] || {});
  
  // Detect column mappings (case-insensitive matching)
  const dateCol = headers.find(h => 
    /date|txn.*date|transaction.*date|posting.*date/i.test(h)
  );
  const amountCol = headers.find(h => 
    /amount|value|debit|credit|transaction.*amount/i.test(h)
  );
  const merchantCol = headers.find(h => 
    /merchant|description|narration|particulars|payee|vendor/i.test(h)
  );
  const typeCol = headers.find(h => 
    /type|transaction.*type|dr.*cr|debit.*credit/i.test(h)
  );
  
  data.forEach((row, index) => {
    try {
      const dateStr = dateCol ? row[dateCol] : '';
      const amountStr = amountCol ? row[amountCol] : '';
      const merchant = merchantCol ? row[merchantCol] : `Transaction ${index + 1}`;
      const typeStr = typeCol ? row[typeCol]?.toLowerCase() : '';
      
      if (!dateStr || !amountStr) return;
      
      // Parse date to YYYY-MM-DD format
      const date = parseDate(dateStr);
      const amount = parseAmount(amountStr);
      
      // Determine transaction type
      let type: 'expense' | 'income' | 'transfer' = 'expense';
      if (typeStr.includes('credit') || typeStr.includes('cr') || amount < 0) {
        type = 'income';
      } else if (typeStr.includes('debit') || typeStr.includes('dr')) {
        type = 'expense';
      } else if (typeStr.includes('transfer')) {
        type = 'transfer';
      }
      
      transactions.push({
        date,
        amount: Math.abs(amount),
        currency: 'INR',
        merchant: merchant.trim(),
        type,
        category: 'uncategorized',
        rawLine: JSON.stringify(row),
        sourceFile: filename,
      });
    } catch (error) {
      console.warn(`Failed to parse CSV row ${index}:`, error);
    }
  });
  
  return transactions;
}

/**
 * Parse various date formats to YYYY-MM-DD
 */
function parseDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  
  // Try multiple date formats
  const formats = [
    /(\d{4})-(\d{1,2})-(\d{1,2})/, // YYYY-MM-DD
    /(\d{1,2})\/(\d{1,2})\/(\d{4})/, // DD/MM/YYYY or MM/DD/YYYY
    /(\d{1,2})-(\d{1,2})-(\d{4})/, // DD-MM-YYYY
    /(\d{1,2})\/(\d{1,2})\/(\d{2})/, // DD/MM/YY
  ];
  
  for (const format of formats) {
    const match = dateStr.match(format);
    if (match) {
      if (match[0].startsWith('20') || match[0].startsWith('19')) {
        // YYYY-MM-DD format
        const [, year, month, day] = match;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      } else {
        // DD/MM/YYYY or DD-MM-YYYY format
        const [, day, month, year] = match;
        const fullYear = year.length === 2 ? '20' + year : year;
        return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }
  }
  
  // Fallback: try to parse as Date
  const parsedDate = new Date(dateStr);
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate.toISOString().split('T')[0];
  }
  
  return new Date().toISOString().split('T')[0];
}

/**
 * Parse amount string to number
 */
function parseAmount(amountStr: string): number {
  if (!amountStr) return 0;
  
  // Remove currency symbols and commas
  const cleaned = amountStr.replace(/[₹$€£,\s]/g, '');
  
  // Handle negative amounts in parentheses: (123.45) -> -123.45
  if (cleaned.startsWith('(') && cleaned.endsWith(')')) {
    return -parseFloat(cleaned.slice(1, -1)) || 0;
  }
  
  return parseFloat(cleaned) || 0;
}
