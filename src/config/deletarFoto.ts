import fs from 'fs';
import path from 'path';

export async function deletarFoto(nomeArquivo: string) {
  const caminhoArquivo = path.join(__dirname, '..', '..', 'tmp', nomeArquivo);
  await fs.promises.unlink(caminhoArquivo);
}