import type { ParsedFile } from '@/lib/types';

/**
 * Parse plain text file
 */
export async function parseTXT(file: File): Promise<ParsedFile> {
  const text = await file.text();
  
  return {
    filename: file.name,
    text,
    fileType: 'txt',
    uploadedAt: new Date().toISOString(),
  };
}

/**
 * Parse all supported file types
 */
export async function parseFile(file: File): Promise<ParsedFile> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'txt':
      return parseTXT(file);
    case 'pdf':
      const { parsePDF } = await import('./pdfParser');
      return parsePDF(file);
    case 'csv':
      const { parseCSV } = await import('./csvParser');
      return parseCSV(file);
    case 'xlsx':
    case 'xls':
      const { parseExcel } = await import('./excelParser');
      return parseExcel(file);
    default:
      throw new Error(`Unsupported file type: ${extension}`);
  }
}
