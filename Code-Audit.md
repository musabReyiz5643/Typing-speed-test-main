# Plan: Typing Test — Bug & Kod Kalitesi Düzeltmeleri

## Context

`/code-review` (high effort, 7 finder açısı) tüm `React-Main-App/src` üzerinde çalıştı.
Uygulama çalışır durumda ama ileride sorun çıkaracak 10 gerçek bulgu çıktı: 2 kritik
davranış hatası, 2 orta (UX/girdi), 5 kod kalitesi (duplikasyon/sihirli sayı/ölü kod),
1 verimlilik. Amaç: bu bulguları doğru _derinlikte_ (bandaj değil) çözmek — özellikle
WPM zamanlama hatasını duvar-saati ölçümüne taşıyarak ve metrik hesaplamasını tek
kaynağa indirerek.

Kullanıcı kararları:

- **Kapsam:** 10 maddenin tamamı.
- **WPM fix:** wall-clock `startedAt` (performance.now) — derin çözüm, duplikasyonu da kapatır.

---

## Bulgular (önem sırası)

| #   | Sev        | Dosya                                        | Sorun                                                                              |
| --- | ---------- | -------------------------------------------- | ---------------------------------------------------------------------------------- |
| 1   | Kritik     | useTypingEngine.ts:45                        | `targetText` boşken (data yüklenmeden) `start()` → boş/bozuk test                  |
| 2   | Kritik     | useTestStore.ts:79,135                       | Tamsayı-saniye `time` → yanlış/şişik WPM, sahte HIGHSCORE                          |
| 3   | Orta       | useTypingEngine.ts:39                        | `e.isComposing` kontrolü yok → IME birleşik karakterleri yazılıyor                 |
| 4   | Orta       | useTestStore.ts:88                           | `setMode/setDifficulty` STARTED'de sessiz no-op; kontrolde disabled affordance yok |
| 5   | Kalite     | useTestStore.ts:133                          | `complete()` ve `updateMetrics()` aynı metrik bloğunu kopyalıyor                   |
| 6   | Kalite     | ResultCard.tsx:33                            | `countCorrect` döngüsü 3. kez yeniden yazılmış (store + TextDisplay + burası)      |
| 7   | Kalite     | useTestStore.ts (×4) + useTypingEngine.ts:21 | Sihirli `60`; `TIMED_DURATION` sabiti yok                                          |
| 8   | Kalite     | useTypingEngine.ts:10                        | `accuracyChanged`/`timeChanged` türetilebilir, useState+effect ile aynalanmış      |
| 9   | Verimlilik | useTypingEngine.ts:53                        | Her tuşta `updateMetrics` tüm string'i O(n) tarar                                  |
| 10  | Kalite     | ResultCard.tsx:20                            | Ölü `console.log("Hello World")`                                                   |

> **Reddedilen aday bulgular** (false positive, uygulanmayacak):
>
> - "bestWPM 0'da takılı kalır" → `FirstResult.tsx:16` zaten `commitBestWPM()` çağırıyor.
> - "`calcAccuracy(0,0)` → NaN" → `metrics.ts:7` guard `totalTyped===0 → 100`.
> - "`useMediaQuery` query değişince stale" → tüm çağrılar literal sabit kullanıyor.
> - "Go Again yeni rastgele metin seçer" → kasıtlı/spec'e uygun.

---

## Değişiklikler

### A. Kritik #1 — Boş `targetText`'te başlamayı engelle

**Dosya:** `src/features/typing-test/hooks/useTypingEngine.ts`

- `handleKeyDown` içinde `getState()`'ten `targetText` de al.
- `if (!targetText) return;` — `start()`/`appendChar()`'tan önce. Metin yüklenmeden hiçbir
  tuş test başlatmasın. (`StartOverlay` "Start" butonu da aynı guard'ı almalı → bkz. D ile
  birlikte: `StartOverlay` `start` çağrısını `targetText` boşsa devre dışı bıraksın.)

### B. Kritik #2 — Wall-clock zamanlama (derin fix) + metrik tek kaynak (#5 ile birleşik)

**Dosya:** `src/features/typing-test/store/useTestStore.ts`

- State'e `startedAt: number | null` ekle (default `null`).
- `start()`: `set({ status: 'STARTED', startedAt: performance.now() })`.
- `reset()`: `startedAt: null` ekle.
- Yeni private helper `computeMetrics(state)`:
  - `elapsedSeconds = startedAt == null ? 0 : (performance.now() - startedAt) / 1000`
  - `correct = countCorrect(...)` (artık `metrics.ts`'ten — bkz. C)
  - return `{ wpm: elapsedSeconds < 1 ? 0 : calcWpm(correct, elapsedSeconds), accuracy: calcAccuracy(correct, typed.length) }`
- `complete()` ve `updateMetrics()` ikisi de `computeMetrics`'i kullansın → duplikasyon (#5) biter,
  kesirli saniye → doğru WPM, "metin erken dolunca şişme" + "tamsayı granülerlik" hataları kapanır.
- `time` alanı yalnız **gösterim** (geri/ileri sayaç) için kalır; WPM artık ona bağlı değil.

### C. Kalite #6/#7 — Paylaşılan yardımcılar

- **`src/shared/lib/metrics.ts`:** `countCorrect(typed, target)`'i buraya taşı + export et.
  `useTestStore` private kopyayı sil, import et.
- **`ResultCard.tsx`:** elle döngü yerine `countCorrect` import; `incorrect = typedCharacters.length - correct`.
- **`src/features/typing-test/constants.ts`:** `export const TIMED_DURATION = 60`. MODE_OPTIONS label
  `` `Timed(${TIMED_DURATION}s)` ``. `useTestStore` (reset/setMode/computeMetrics yok artık ama
  başlangıç `time`) ve `useTypingEngine.ts:21` `60` → `TIMED_DURATION`.

### D. Orta #4 — STARTED'de kontrol disabled affordance

**Dosyalar:** `SegmentedControl.tsx`, `MobileDropdown.tsx`, `TypingTestScreen.tsx`

- İki kontrole opsiyonel `disabled?: boolean` prop ekle.
  - `SegmentedControl`: `disabled` ise buton `disabled`, `opacity-50 cursor-not-allowed`, `onChange` çağırma.
  - `MobileDropdown`: tetik butonu `disabled`, açılma engellenir.
- `TypingTestScreen`: her ikisine `disabled={status === 'STARTED'}` geç. Böylece sessiz no-op
  yerine görsel kilitli durum. (Store guard'ı zaten var, kalsın — savunma katmanı.)

### E. Orta #3 — IME guard

**Dosya:** `useTypingEngine.ts`

- `handleKeyDown` başında: `if (e.isComposing || e.keyCode === 229) return;`

### F. Kalite #8 — Aynalanmış state'i türetilmişe çevir

**Dosya:** `useTypingEngine.ts`

- `accuracyChanged`/`timeChanged` `useState` + ilk `useEffect`'i sil.
- Doğrudan türet ve return et:
  - `accuracyChanged = status === 'STARTED' && accuracy !== 100`
  - `timeChanged = status === 'STARTED' && time !== (mode === 'TIMED' ? TIMED_DURATION : 0)`

### G. Verimlilik #9

- B ile `updateMetrics` zaten `computeMetrics`'e indi. `countCorrect` O(n) taraması kalıyor ama
  metrik hesabı tek yerde; tipik pasaj uzunluğunda kabul edilebilir. **Ekstra optimizasyon
  yapılmayacak** (erken optimizasyon); B sonrası tek O(n) tarama/tuş kalır. Not olarak bırak.

### H. Kalite #10

- `ResultCard.tsx:20` `console.log("Hello World")` sil.

---

## Düzenlenecek dosyalar (özet)

- `src/features/typing-test/store/useTestStore.ts` — startedAt, computeMetrics, countCorrect import, TIMED_DURATION
- `src/features/typing-test/hooks/useTypingEngine.ts` — targetText guard, IME guard, türetilmiş changed flag'ler, TIMED_DURATION
- `src/shared/lib/metrics.ts` — `countCorrect` export
- `src/features/typing-test/constants.ts` — `TIMED_DURATION`
- `src/features/results/components/ResultCard.tsx` — countCorrect reuse, console.log sil
- `src/shared/components/SegmentedControl.tsx` — `disabled` prop
- `src/shared/components/MobileDropdown.tsx` — `disabled` prop
- `src/features/typing-test/components/TypingTestScreen.tsx` — `disabled={status==='STARTED'}`
- `src/features/typing-test/components/StartOverlay.tsx` — `targetText` boşsa Start devre dışı

---

## Doğrulama

```bash
cd React-Main-App
npm run build      # tsc -b && vite build → sıfır hata
npm run lint       # ESLint temiz
npm run dev        # manuel test
```

Manuel senaryolar:

1. **#1:** Yavaş ağ/hard refresh; "Loading…" iken tuşla → test başlamamalı.
2. **#2:** TIMED kısa metni hızlı bitir → WPM makul (şişik değil); birkaç kez koş, sahte HIGHSCORE yok.
   PASSAGE bitir → sonuç ekranı WPM = StatsBar son WPM (tutarlı).
3. **#3:** (varsa) IME ile yaz → birleşim karakterleri sayaca eklenmemeli.
4. **#4:** Test STARTED iken difficulty/mode kontrolleri görsel kilitli, tıklama no-op.
5. **#10:** Konsol "Hello World" basmıyor.
6. Regresyon: Timed 60→0 geri, Passage ileri sayım; 3 sonuç ekranı doğru resultType; "Go Again"
   bestWPM korur (localStorage `speedtype_best_wpm`).
