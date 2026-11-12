export function formatarData(ms: number): string {
  const d = new Date(ms);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}/${d.getFullYear()}`;
}

export function descreverTempo(ms: number): string {
  const inicioHoje = new Date();
  inicioHoje.setHours(0, 0, 0, 0);
  const dias = Math.floor((inicioHoje.getTime() - new Date(ms).setHours(0, 0, 0, 0)) / 86400000);
  if (dias <= 0) return 'hoje';
  if (dias === 1) return 'ontem';
  return `há ${dias} dias`;
}
