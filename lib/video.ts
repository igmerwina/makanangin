/** Ga ada API key YouTube di sesi ini, jadi cuma link keluar ke hasil pencarian — bukan video/thumbnail spesifik. */
export function youtubeSearchUrl(nama: string, daerah: string): string {
  const q = encodeURIComponent(`resep ${nama} ${daerah}`);
  return `https://www.youtube.com/results?search_query=${q}`;
}
