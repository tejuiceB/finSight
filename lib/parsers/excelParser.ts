import * as XLSX from 'xlsx';
import type { ParsedFile, Transaction } from '@/lib/types';

/**
 * Parse Excel file (.xlsx, .xls) and extract data
 */
export async function parseExcel(file: File): Promise<ParsedFile> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  
  // Read all sheets and combine into text
  let combinedText = '';
  
  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    const csvData = XLSX.utils.sheet_to_csv(worksheet);
    combinedText += `\n--- Sheet: ${sheetName} ---\n${csvData}\n`;
  });
  
  return {
    filename: file.name,
    text: combinedText,
    fileType: 'xlsx',
    uploadedAt: new Date().toISOString(),
  };
}

/**
 * Extract transactions from Excel data
 */
export function extractTransactionsFromExcel(
  file: ArrayBuffer,
  filename: string
): Transaction[] {
  const workbook = XLSX.read(file, { type: 'array' });
  const transactions: Transaction[] = [];
  
  // Process first sheet (typically contains transaction data)
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet);
  
  if (data.length === 0) return transactions;
  
  // Detect column mappings
  const headers = Object.keys(data[0]);
  const dateCol = headers.find(h => 
    /date|txn.*date|transaction.*date/i.test(String(h))
  );
  const amountCol = headers.find(h => 
    /amount|value|debit|credit/i.test(String(h))
  );
  const merchantCol = headers.find(h => 
    /merchant|description|narration|particulars/i.test(String(h))
  );
  
  data.forEach((row, index) => {
    try {
      const dateVal = dateCol ? row[dateCol] : null;
      const amountVal = amountCol ? row[amountCol] : null;
      const merchantVal = merchantCol ? row[merchantCol] : `Transaction ${index + 1}`;
      
      if (!dateVal || !amountVal) return;
      
      // Convert Excel date serial to YYYY-MM-DD
      let date: string;
      if (typeof dateVal === 'number') {
        // Excel date serial number
        const excelDate = XLSX.SSF.parse_date_code(dateVal);
        date = `${excelDate.y}-${String(excelDate.m).padStart(2, '0')}-${String(excelDate.d).padStart(2, '0')}`;
      } else {
        date = parseDateString(String(dateVal));
      }
      
      const amount = typeof amountVal === 'number' 
        ? amountVal 
        : parseFloat(String(amountVal).replace(/[^\d.-]/g, ''));
      
      transactions.push({
        date,
        amount: Math.abs(amount),
        currency: 'INR',
        merchant: String(merchantVal).trim(),
        type: amount < 0 ? 'income' : 'expense',
        category: 'uncategorized',
        rawLine: JSON.stringify(row),
        sourceFile: filename,
      });
    } catch (error) {
      console.warn(`Failed to parse Excel row ${index}:`, error);
    }
  });
  
  return transactions;
}

function parseDateString(dateStr: string): string {
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0];
  }
  return new Date().toISOString().split('T')[0];
}
