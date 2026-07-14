# Unreal Plugin Vault

Repository ini dibuat untuk mengelola banyak plugin Unreal Engine agar versi **latest**, **stable**, **favorite**, **testing**, dan **archived** tidak bercampur.

## Tujuan

- File ZIP plugin tersusun per plugin dan per versi.
- Halaman GitHub Pages menjadi interface untuk user.
- Satu manifest `docs/data/plugins.json` menjadi sumber data utama.
- Versi terbaru tidak otomatis dianggap stabil.
- Versi favorit bisa berbeda dari versi stabil atau versi terbaru.

## Struktur folder

```text
unreal-plugin-vault/
├─ docs/
│  ├─ index.html
│  ├─ assets/
│  │  ├─ styles.css
│  │  └─ app.js
│  ├─ data/
│  │  └─ plugins.json
│  └─ downloads/
│     ├─ _incoming/
│     ├─ combat-framework/
│     ├─ player-profile/
│     ├─ player-locomotion/
│     ├─ player-map/
│     ├─ smart-drone-camera/
│     └─ gpt-bridge-ue/
├─ templates/
│  ├─ plugin-entry-template.json
│  └─ release-notes-template.md
└─ .github/
   └─ ISSUE_TEMPLATE/
      └─ version_review.yml
```

## Cara publish GitHub Pages

1. Buat repository baru di GitHub, misalnya `unreal-plugin-vault`.
2. Upload semua isi folder ini ke repository.
3. Buka **Settings → Pages**.
4. Pilih **Deploy from a branch**.
5. Pilih branch `main` dan folder `/docs`.
6. Simpan.

GitHub Pages bisa dipublish dari branch tertentu, dan folder source yang umum dipakai adalah root `/` atau `/docs`. Di template ini halaman dipasang di `/docs` supaya file manajemen repo tetap rapi di luar halaman publik.

## Cara menambahkan versi plugin

1. Taruh ZIP ke folder:
   ```text
   docs/downloads/<plugin-id>/<plugin-id>_v<version>.zip
   ```

2. Edit:
   ```text
   docs/data/plugins.json
   ```

3. Tambahkan data versi:
   ```json
   {
     "version": "1.0.150",
     "label": "hotfix montage",
     "date": "2026-07-14",
     "status": "testing",
     "unreal": "UE 5.7",
     "file": "downloads/combat-framework/combat-framework_v1.0.150.zip",
     "size": "12 MB",
     "checksum": "",
     "summary": "Fix montage target ke Player Mesh.",
     "knownIssues": [],
     "changelog": [
       "Fix target montage.",
       "Tambah validasi mesh tag."
     ]
   }
   ```

4. Kalau sudah aman, ubah:
   ```json
   "stableVersion": "1.0.150"
   ```

## Status versi

- `latest`: versi paling baru.
- `stable`: versi aman untuk dipakai project.
- `favorite`: versi yang paling nyaman dipakai, meskipun bukan terbaru.
- `candidate`: kandidat rilis, perlu test.
- `testing`: masih eksperimen.
- `deprecated`: jangan dipakai untuk project baru.
- `archived`: arsip lama.

## Rekomendasi nama file

```text
<plugin-id>_v<major.minor.patch>_<short-note>.zip
```

Contoh:

```text
combat-framework_v1.0.149_action-warp-rms-gate.zip
player-profile_v1.5.20_local-presentation-fix.zip
player-map_v1.4_bound-indicator.zip
```

## Catatan file besar

Kalau ZIP plugin besar, lebih aman memakai **GitHub Releases** sebagai tempat file. Di manifest, isi field `file` dengan link release asset.
