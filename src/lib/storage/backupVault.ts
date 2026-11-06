import { VaultSchemas, type VaultKey, setVaultItem, getAllVaultData } from './studentVault';

function makeCrcTable(): Uint32Array {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c >>> 0;
  }
  return table;
}

const crcTable = makeCrcTable();

export function crc32(str: string): string {
  let crc = 0 ^ (-1);
  const bytes = new TextEncoder().encode(str);
  for (let i = 0; i < bytes.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[i]) & 0xFF];
  }
  return ((crc ^ (-1)) >>> 0).toString(16).padStart(8, '0');
}

export function exportVaultBackup(): string {
  const data = getAllVaultData();
  const jsonStr = JSON.stringify(data);
  const base64 = typeof btoa !== 'undefined' 
    ? btoa(unescape(encodeURIComponent(jsonStr)))
    : Buffer.from(jsonStr, 'utf-8').toString('base64');
  const checksum = crc32(base64);
  return `CAGP1:${base64}.${checksum}`;
}

export function importVaultBackup(token: string): { success: boolean; restoredKeys: number; error?: string } {
  if (!token.startsWith('CAGP1:')) {
    return { success: false, restoredKeys: 0, error: 'Formato de backup inválido. Deve iniciar com CAGP1:' };
  }

  const payload = token.slice(6);
  const dotIndex = payload.lastIndexOf('.');
  if (dotIndex === -1) {
    return { success: false, restoredKeys: 0, error: 'Token corrompido: checksum ausente.' };
  }

  const base64Data = payload.slice(0, dotIndex);
  const expectedCrc = payload.slice(dotIndex + 1);

  const actualCrc = crc32(base64Data);
  if (actualCrc.toLowerCase() !== expectedCrc.toLowerCase()) {
    return { success: false, restoredKeys: 0, error: `Falha de integridade: CRC32 mismatch (${actualCrc} !== ${expectedCrc}).` };
  }

  try {
    const jsonStr = typeof atob !== 'undefined'
      ? decodeURIComponent(escape(atob(base64Data)))
      : Buffer.from(base64Data, 'base64').toString('utf-8');
    const parsedObj = JSON.parse(jsonStr);

    let restoredCount = 0;
    for (const key of Object.keys(VaultSchemas) as VaultKey[]) {
      if (key in parsedObj) {
        const check = VaultSchemas[key].safeParse(parsedObj[key]);
        if (check.success) {
          setVaultItem(key, check.data as never);
          restoredCount++;
        }
      }
    }

    return { success: true, restoredKeys: restoredCount };
  } catch (err) {
    return { success: false, restoredKeys: 0, error: `Erro ao decodificar JSON do cofre: ${String(err)}` };
  }
}
