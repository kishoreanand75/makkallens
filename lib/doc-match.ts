/** Maps the free-text document lines of a service guide to the shared document catalogue (so "My documents" can tick them). */
export function inferDocId(nameEn: string): string | null {
  const n = nameEn.toLowerCase();
  if (/aadhaar/.test(n)) return "aadhaar";
  if (/ration|family card/.test(n)) return "ration";
  if (/photograph|photo\b/.test(n)) return "photo";
  if (/address proof/.test(n)) return "address";
  if (/age proof|proof of date of birth|birth certificate/.test(n)) return "age";
  if (/bank passbook/.test(n)) return "bank";
  if (/income certificate/.test(n)) return "income";
  if (/community certificate/.test(n)) return "community";
  if (/mark sheet|school transfer|school certificate/.test(n)) return "marks";
  if (/mobile number/.test(n)) return "mobile";
  if (/survey|patta|land record/.test(n)) return "land";
  if (/voter/.test(n)) return "voter";
  if (/\bpan\b/.test(n)) return "pan";
  return null;
}
