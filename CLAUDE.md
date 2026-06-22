# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Caveman

Mode: ultra. No revert.

## Proje Özeti

Mobile-first yazma hızı testi. React 19 + Vite + TypeScript. Kod `React-Main-App/` altında. Uygulama tam inşa edildi, çalışır durumda.

---

## Komutlar

```bash
cd React-Main-App
npm install       # bağımlılık kur
npm run dev       # geliştirme sunucusu
npm run build     # tsc -b && vite build
npm run lint      # ESLint
```

---

## Tech Stack

| Paket              | Amaç                              |
| ------------------ | --------------------------------- |
| React 19           | UI                                |
| Vite 8             | Build (`@tailwindcss/vite` plugin)|
| TypeScript 6       | Tip güvenliği                     |
| Tailwind CSS v4    | Stil                              |
| Zustand            | Global state                      |
| TanStack Query v5  | `data.json` fetch                 |
| Framer Motion      | Animasyon                         |
| `@fontsource/sora` | Font (400/600/700)                |

---

## Klasör Yapısı (Feature-Based)

```
React-Main-App/
├─ public/
│  ├─ data.json
│  └─ assets/                      # svg/png asset'ler
├─ src/
│  ├─ main.tsx                     # QueryClientProvider sarmalayıcı
│  ├─ App.tsx                      # status'a göre TypingTestScreen | ResultsRouter
│  ├─ assets/index.ts              # asset import'ları
│  ├─ styles/tailwind.css          # @theme token'ları + Sora font import
│  ├─ shared/
│  │  ├─ components/
│  │  │  ├─ Header.tsx             # logo + "Personal best: X WPM"
│  │  │  ├─ SegmentedControl.tsx   # desktop difficulty/mode butonları
│  │  │  ├─ MobileDropdown.tsx     # mobil dropdown
│  │  │  └─ IconButton.tsx
│  │  ├─ hooks/useMediaQuery.ts
│  │  └─ lib/
│  │     ├─ metrics.ts             # calcWpm, calcAccuracy
│  │     └─ format.ts              # formatTime
│  └─ features/
│     ├─ typing-test/
│     │  ├─ constants.ts
│     │  ├─ store/useTestStore.ts  # Zustand store (tek gerçek kaynak)
│     │  ├─ hooks/
│     │  │  ├─ usePassages.ts      # React Query → /data.json
│     │  │  ├─ useTargetText.ts    # difficulty değişince yeni metin seç
│     │  │  ├─ useTimer.ts         # timed (geri) / passage (ileri)
│     │  │  └─ useTypingEngine.ts  # window keydown + metrik güncelle
│     │  └─ components/
│     │     ├─ TypingTestScreen.tsx # typing-test ekranı koordinatörü
│     │     ├─ StatsBar.tsx
│     │     ├─ TextDisplay.tsx
│     │     ├─ Character.tsx
│     │     ├─ StartOverlay.tsx
│     │     └─ RestartButton.tsx
│     └─ results/
│        └─ components/
│           ├─ ResultsRouter.tsx   # 3 senaryoyu yönlendirir
│           ├─ ResultCard.tsx      # WPM / Accuracy / Characters
│           ├─ FirstResult.tsx     # "Baseline Established!"
│           ├─ HighScore.tsx       # "High Score Smashed!" + confetti
│           └─ TestCompleted.tsx   # "Test Complete!"
```

---

## Zustand Store (`useTestStore.ts`)

| Alan              | Tip                                         | Açıklama                                    |
| ----------------- | ------------------------------------------- | ------------------------------------------- |
| `status`          | `'NOT_STARTED' \| 'STARTED' \| 'COMPLETED'` | Test akış durumu                            |
| `mode`            | `'TIMED' \| 'PASSAGE'`                      | Oyun modu                                   |
| `difficulty`      | `'EASY' \| 'MEDIUM' \| 'HARD'`              | Zorluk seviyesi                             |
| `wpm`             | `number`                                    |                                             |
| `accuracy`        | `number`                                    | Doğruluk %                                  |
| `time`            | `number`                                    | Kalan (TIMED) / geçen (PASSAGE) saniye      |
| `typedCharacters` | `string`                                    | Ham tuş girdisi                             |
| `targetText`      | `string`                                    | React Query'den senkron metin               |
| `bestWPM`         | `number`                                    | `localStorage` `speedtype_best_wpm` senkron |
| `resultType`      | `'FIRST' \| 'HIGHSCORE' \| 'COMPLETED' \| null` | Bitiş ekranı seçimi                    |

**Aksiyonlar:** `start()`, `reset()`, `complete()`, `setMode()`, `setDifficulty()`, `setTargetText()`, `appendChar()`, `backspace()`, `tick()`, `updateMetrics()`, `commitBestWPM()`

- Bileşenler **selector** ile sadece gerekli alanı okur (re-render önlemi).
- `complete()` içinde `resultType` hesaplanır: `bestWPM===0 → FIRST`, `wpm>bestWPM → HIGHSCORE`, diğer → `COMPLETED`.
- `setMode()` / `setDifficulty()` → `STARTED` iken bloke; sonra `reset()` çağırır.

---

## Veri Katmanı

- `usePassages()` → `useQuery` ile `GET /data.json`; sonuç `{ easy: [...], medium: [...], hard: [...] }`.
- `useTargetText()` → `status === 'NOT_STARTED'` ve `difficulty` değişince ilgili diziden rastgele metin → `setTargetText()`.

---

## Test Motoru Mantığı

1. `NOT_STARTED` → ilk tuş → `start()` → `STARTED`.
2. **TIMED:** `time` 60 → 0; `time === 0` veya metin dolunca → `complete()`.
3. **PASSAGE:** `time` 0 → ileri sayar; `typedCharacters.length === targetText.length` → `complete()`.
4. **WPM** = `(doğruKarakter / 5) / (geçenSüreDakika)`.
5. **Accuracy** = `(doğruKarakter / toplamYazılan) * 100`.
6. Klavye: `window keydown` → `appendChar()` / `backspace()` → `updateMetrics()`.

---

## Bitiş Ekranı Yönlendirme (`ResultsRouter`)

| `resultType`  | Bileşen             | Başlık                           |
| ------------- | ------------------- | -------------------------------- |
| `FIRST`       | `<FirstResult />`   | "Baseline Established!"          |
| `HIGHSCORE`   | `<HighScore />`     | "High Score Smashed!" + confetti |
| `COMPLETED`   | `<TestCompleted />` | "Test Complete!"                 |

- 3 ekranda da `ResultCard`: **WPM**, **Accuracy**, **Characters**.
- "Go Again" → `reset()` (**`bestWPM` silinmez**, `commitBestWPM()` sadece HIGHSCORE'da çağrılır).

---

## Stil Kuralları

### Renk Tokenları (`@theme` — `tailwind.css`)

```css
--color-neutral-900  --color-neutral-800  --color-neutral-500
--color-neutral-400  --color-neutral-0    --color-blue-600
--color-blue-400     --color-red-500      --color-green-500
--color-yellow-400
```

### Karakter Durum Renkleri

| Durum      | Tailwind sınıfı                             |
| ---------- | ------------------------------------------- |
| Doğru      | `text-green-500`                            |
| Yanlış     | `text-red-500 underline decoration-red-500` |
| Aktif      | `bg-gray-200/50`                            |
| Yazılmamış | `text-gray-400`                             |

### Responsive

- Mobile breakpoint: 375px → `MobileDropdown`.
- Desktop: `SegmentedControl`, seçili = mavi border.
- Tasarım referansları: `design/` klasörü.

---

## Definition of Done

- `npm run dev` + `tsc -b` → sıfır hata/uyarı.
- Timed (60s geri) + Passage (ileri) doğru çalışıyor.
- 3 sonuç ekranı doğru `resultType`'a göre render.
- "Go Again" `bestWPM` koruyarak sıfırla.
- Mobile-first responsive (320px → geniş ekran).
