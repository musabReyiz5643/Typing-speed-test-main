# SpeedType - Keyboard Typing Test Platform

SpeedType, modern front-end mimarisi ve temiz kod prensipleriyle geliştirilmiş; kullanıcıların yazma hızlarını, doğruluk (accuracy) oranlarını ve WPM (Words Per Minute) değerlerini farklı zorluk dereceleri ve modlarda test etmelerini sağlayan gelişmiş, mobile-first bir web uygulamasıdır.

---

## 🚀 Teknolojiler & Kütüphaneler

- **Framework:** React + Vite + TypeScript
- **Styling:** Tailwindcss v4 (Yeni nesil derleme ve CSS tabanlı konfigürasyon)
- **State Management:** Zustand (Performanslı ve minimal global state yönetimi)
- **Data Fetching:** TanStack Query v5 (React Query ile `data.json` yönetimi)
- **Animation:** Framer Motion (Akıcı state geçişleri ve modern mikro etkileşimler)
- **Typography:** `@fontsource/sora` (400, 600, 700 weight seçenekleriyle)

---

## 🛠️ Sistem Mimarisi & Klasör Yapısı

Proje, ölçeklenebilir ve bakımı kolay **Feature-Driven (Feature-Based) Design** desenine göre yapılandırılması gerekir. Her büyük özellik kendi klasörü altında bağımsız bir dünya olarak yaşar.

Eğerki tekrar eden ve diğer features'larda lazım olan _componentları_ veya _hooks_ gibi klasörleri **shared** klasörü içine koyulması gerekir.

---

## 🎮 Özellikler ve Oyun Modları

### 1. Zorluk Seviyeleri (Difficulty)

- **Easy:** Kısa ve basit kelimeler içeren metinler.
- **Medium:** Noktalama işaretleri içeren standart metinler.
- **Hard:** Sayılar, semboller ve karmaşık kelimeler içeren zorlayıcı metinler.

### 2. Mod Seçenekleri (Mode)

- **Timed (60s):** Geri sayım mantığıyla çalışır. Süre `0:60`'tan geriye sayar. Süre bittiğinde veya metin erken tamamlandığında test otomatik sonlanır.
- **Passage:** Zamana karşı değil, metnin tamamını bitirmeye odaklıdır. Kronometre `0:00`'dan ileriye sayar. Kullanıcı metni tamamen bitirdiği an test sonlanır.

### 3. Dinamik Renklendirme Kuralları

- **Doğru Karakter:** Yeşil (`text-green-500` / `text-success`)
- **Hatalı Karakter:** Kırmızı ve Altı Çizili (`text-red-500 underline decoration-red-500`)
- **Aktif Karakter:** Arka planı hafif gri / imleç odağı (`bg-gray-200/50`)
- **Yazılmamış Karakter:** Standart soluk gri (`text-gray-400` / `text-muted`)

---

## 📈 Skor ve LocalStorage Yönetimi

Kullanıcının yaptığı her test sonrasında hesaplanan **WPM** değeri `localStorage` üzerinde güvenli bir şekilde saklanır. Uygulama açıldığında "Personal Best" alanında en yüksek skor gösterilir. Bitiş ekranı şu 3 senaryoya göre dinamik olarak render edilir:

1. **First Result (`mobile-results-first-test.jpg`):** Kullanıcının sistemdeki ilk testi ise.
2. **High Score (`mobile-results-new-personal-best.jpg`):** Kullanıcı önceki en iyi WPM skorunu kırdıysa.
3. **Test Completed (`mobile-results.jpg`):** Standart bitiş ve skor tablosu ekranı.

---

## ⚡ Etkileşim ve Durum (State) Efektleri

Uygulama genelindeki tüm butonlar, dropdown menüler ve navbar elementleri responsive bağımsız olarak şu iki tasarım dosyasındaki efektleri miras almalıdır:

- **Focus Efektleri:** Element odaklandığında (tab ile gelindiğinde veya tıklandığında) `focus-states.jpg` görselindeki border/shadow kuralları uygulanır.
- **Hover Efektleri:** Elementin üzerine gelindiğinde `hover-states.jpg` görselindeki renk değişimleri ve Framer Motion mikro animasyonları tetiklenir.

## 🎨 Stil ve Temalandırma (Tailwind v4)

Projede Tailwind v4 mimarisine uygun olarak CSS tabanlı yapılandırma kullanılmıştır. Yazı tipi olarak `Sora` tercih edilmiş ve tüm hover/focus state'leri tasarım rehberine (`focus-states.jpg`, `hover-states.jpg`) birebir bağlı kalınarak uygulanmıştır.

---

## 🛠️ Kurulum ve Çalıştırma

1. Proje bağımlılıklarını yükleyin:

```bash
npm install
```

````

2. Geliştirme sunucusunu (Vite) başlatın:

```bash
npm run dev

```

3. Production derlemesi almak için:

```bash
npm run build

```
````
