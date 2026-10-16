# RimbaKita

Dashboard publik untuk membantu warga Indonesia memahami risiko karhutla, kualitas udara, dan langkah dukungan yang aman.

## Status

Versi `v0.2` sudah memakai beberapa halaman dan mengambil data kualitas udara live dari Open-Meteo Air Quality API. AQI yang ditampilkan adalah US AQI berbasis model CAMS, bukan pembacaan sensor IQAir.

Peta hotspot sudah memiliki adapter NASA FIRMS. Untuk mengaktifkannya, salin `config.example.js` menjadi `config.js`, isi `window.FIRMS_MAP_KEY`, lalu buka ulang `pantauan.html`. MAP_KEY gratis dapat diminta di [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/api/map_key/). Jangan commit `config.js` ke repo publik.

## Arah pengembangan

1. Pindahkan adapter FIRMS ke backend/proxy agar MAP_KEY tidak terekspos di browser.
2. Tambahkan data kualitas udara per kota dari provider berlisensi (IQAir atau alternatif resmi), termasuk PM2.5, unit, waktu, dan sumber.
3. Tambahkan layer BMKG: sebaran asap, angin, FFMC/ISI/FWI, serta atribusi yang diwajibkan.
4. Tambahkan verifikasi laporan warga, rate limit, moderation, dan kanal eskalasi BPBD/Manggala Agni.
5. Tambahkan notifikasi lokasi, panduan kesehatan, aksesibilitas, dan ekspor data terbuka.

## Menjalankan

Buka `index.html` di browser. Halaman: `index.html`, `pantauan.html`, `udara.html`, dan `aksi.html`. Peta dan feed live membutuhkan koneksi internet. Untuk fetch API di sebagian browser, jalankan server lokal sederhana seperti `python3 -m http.server` dari folder repo.

## Prinsip data

- Hotspot satelit adalah sinyal awal, bukan bukti definitif kebakaran.
- Semua kartu produksi harus menampilkan sumber, waktu pembaruan, unit, dan tingkat keyakinan.
- Model kualitas udara bukan pengganti sensor lapangan atau arahan petugas.

## Sumber awal

- [NASA FIRMS Web Services](https://firms.modaps.eosdis.nasa.gov/web-services/)
- [BMKG Peringatan Karhutla](https://www.bmkg.go.id/cuaca/karhutla)
- [IQAir Air Quality Monitors](https://www.iqair.com/air-quality-monitors/)

## Kontribusi & dukungan

Gunakan issue GitHub untuk bug, usulan data, atau usulan provinsi/kota. Untuk laporan warga pada prototipe ini, tombol **Kirim laporan via email** memakai alamat contoh dan harus diganti dengan kanal yang benar sebelum publikasi.
