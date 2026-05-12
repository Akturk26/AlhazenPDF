import * as FileSystem from 'expo-file-system/legacy';

const PDF_DIR = FileSystem.documentDirectory + 'alhazen_pdfs/';

const ensureDir = async () => {
  const info = await FileSystem.getInfoAsync(PDF_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(PDF_DIR, { intermediates: true });
  }
};

const sanitize = (str) =>
  (str || 'PDF').replace(/[^a-zA-Z0-9\s_-]/g, '').trim().replace(/\s+/g, '_').slice(0, 40);

export const savePDFPermanently = async (tempUri, title = 'PDF') => {
  try {
    await ensureDir();
    const ts = Date.now();
    const name = `${sanitize(title)}_${ts}.pdf`;
    const dest = PDF_DIR + name;
    await FileSystem.copyAsync({ from: tempUri, to: dest });
    return dest;
  } catch (e) {
    console.warn('pdfStorage: kalici kayit basarisiz', e);
    return null;
  }
};

export const pdfFileExists = async (uri) => {
  if (!uri) return false;
  try {
    const info = await FileSystem.getInfoAsync(uri);
    return info.exists;
  } catch {
    return false;
  }
};

export const deletePDFFile = async (uri) => {
  if (!uri) return;
  try {
    const info = await FileSystem.getInfoAsync(uri);
    if (info.exists) await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch {}
};

export const getPDFDirSize = async () => {
  try {
    await ensureDir();
    const files = await FileSystem.readDirectoryAsync(PDF_DIR);
    let total = 0;
    for (const f of files) {
      const info = await FileSystem.getInfoAsync(PDF_DIR + f);
      if (info.exists) total += info.size || 0;
    }
    const kb = Math.round(total / 1024);
    return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
  } catch {
    return '0 KB';
  }
};
