import * as pdfjsLib from 'pdfjs-dist';
import type { ParsedFile, Transaction } from '@/lib/types';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

/**
 * Parse PDF file and extract text content
 * Processes first 10 pages to extract transaction-like data
 */
export async function parsePDF(file: File): Promise<ParsedFile> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  const maxPages = Math.min(pdf.numPages, 10); // Limit to first 10 pages for performance
  
  for (let i = 1; i <= maxPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => (item as { str: string }).str)
      .join(' ');
    fullText += pageText + '\n';
  }
  
  return {
    filename: file.name,
    text: fullText,
    fileType: 'pdf',
    uploadedAt: new Date().toISOString(),
  };
}

/**
 * Extract potential transaction data from PDF text
 * Looks for patterns like dates, amounts, merchants
 */
export function extractTransactionsFromPDF(text: string): Transaction[] {
  const transactions: Transaction[] = [];
  const lines = text.split('\n');
  
  // Simple pattern matching for transaction-like lines
  // Format: DD/MM/YYYY or DD-MM-YYYY followed by amount
  const transactionPattern = /(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})\s+.*?(\d+[.,]\d{2})/g;
  
  lines.forEach((line) => {
    const matches = line.matchAll(transactionPattern);
    for (const match of matches) {
      const dateStr = match[1];
      const amountStr = match[2].replace(',', '.');
      
      // Parse date to YYYY-MM-DD format
      const dateParts = dateStr.split(/[-/]/);
      let date = '';
      if (dateParts.length === 3) {
        const day = dateParts[0].padStart(2, '0');
        const month = dateParts[1].padStart(2, '0');
        const year = dateParts[2].length === 2 ? '20' + dateParts[2] : dateParts[2];
        date = `${year}-${month}-${day}`;
      }
      
      if (date && amountStr) {
        transactions.push({
          date,
          amount: parseFloat(amountStr),
          currency: 'INR', // Default to INR, can be enhanced
          merchant: line.substring(0, 50).trim(),
          type: 'expense', // Will be classified by AI
          category: 'uncategorized',
          rawLine: line,
          sourceFile: '',
        });
      }
    }
  });
  
  return transactions;
}
