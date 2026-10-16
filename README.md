# Rimba Waspada

Dashboard publik untuk membantu warga Indonesia memahami risiko karhutla, kualitas udara, dan langkah dukungan yang aman.

## Status

Versi `v0.1` adalah prototipe UX dengan data contoh yang diberi label **simulasi**. Belum ada angka live atau klaim bahwa suatu titik benar-benar sedang terbakar.

## Arah pengembangan

1. Sambungkan ingest hotspot NASA FIRMS (VIIRS/MODIS) dengan cache dan timestamp.
2. Tambahkan data kualitas udara per kota dari provider berlisensi (IQAir atau alternatif resmi), termasuk PM2.5, unit, waktu, dan sumber.
3. Tambahkan layer BMKG: sebaran asap, angin, FFMC/ISI/FWI, serta atribusi yang diwajibkan.
4. Tambahkan verifikasi laporan warga, rate limit, moderation, dan kanal eskalasi BPBD/Manggala Agni.
5. Tambahkan notifikasi lokasi, panduan kesehatan, aksesibilitas, dan ekspor data terbuka.

## Menjalankan

Buka `index.html` di browser. Peta menggunakan Leaflet dan tile OpenStreetMap melalui CDN, sehingga perlu koneksi internet untuk layer peta.

## Prinsip data

- Hotspot satelit adalah sinyal awal, bukan bukti definitif kebakaran.
- Semua kartu produksi harus menampilkan sumber, waktu pembaruan, unit, dan tingkat keyakinan.
- Data demo tidak boleh dipakai untuk keputusan keselamatan atau respons darurat.

## Sumber awal

- [NASA FIRMS Web Services](https://firms.modaps.eosdis.nasa.gov/web-services/)
- [BMKG Peringatan Karhutla](https://www.bmkg.go.id/cuaca/karhutla)
- [IQAir Air Quality Monitors](https://www.iqair.com/air-quality-monitors/)

## Kontribusi & dukungan

Gunakan issue GitHub untuk bug, usulan data, atau usulan provinsi/kota. Untuk laporan warga pada prototipe ini, tombol **Kirim laporan via email** memakai alamat contoh dan harus diganti dengan kanal yang benar sebelum publikasi.
