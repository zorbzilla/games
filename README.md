# QuUp Games: web sitesi

QuUp Games için tek sayfalık, hızlı ve her cihazda çalışan tanıtım sitesi.
Hiçbir framework ya da derleme adımı yok: düz HTML, CSS ve JavaScript.

## Neler var?

- **Q amblemi:** Logodaki Q harfi vektöre çevrildi (`#q-path`). Favicon, uygulama simgeleri,
  menü ve dekorlar bu tek şekli kullanır.
- **El feneri efekti:** Giriş bölümünde fener imleci takip eder ve karanlıkta gizli parmak izlerini
  aydınlatır. Dokunmatik ekranlarda fener kendi kendine gezinir, dokunulan yere yönelir.
  Bu bir WebGL efekti. Yavaş cihazda önce çözünürlüğünü, sonra kare hızını düşürür, gerekirse durur.
  Grafik kartı yoksa hiç açılmaz, yerine CSS arka planı görünür.
- **Detective on Duty:** Yağmurlu, noir bir sokak sahnesi. Büyüteç sahnede gezinir ve gizli
  ipuçlarını (parmak izi, ayak izi) gösterir.
- **The Ascendants:** Yükselen ışık parçacıklarıyla "Yakında" bölümü.
- **Oyun sırası:** Kaydırdıkça dolan seviye haritası (Detective on Duty, The Ascendants, kilitli seviye).
- **Türkçe / İngilizce:** Sağ üstteki TR/EN düğmesi. Seçim hatırlanır. `?lang=en` ile İngilizce açılır.
- **Erişilebilirlik:** Klavye ile gezinme, ekran okuyucu etiketleri. "Hareketi azalt" ayarı açık olan
  ziyaretçilere animasyonsuz sürüm gösterilir.

## Dosyalar

```
index.html              Sayfanın tamamı (Türkçe metinler burada)
404.html                "Sayfa bulunamadı" sayfası
assets/css/style.css    Tüm stiller (renkler en üstteki :root içinde)
assets/js/main.js       Etkileşimler, İngilizce metinler (EN sözlüğü), mağaza bağlantıları
assets/img/             Favicon ve ana ekran simgeleri
site.webmanifest        "Ana ekrana ekle" ayarları
```

## İçerik nasıl değiştirilir?

- **Türkçe metinler:** `index.html` içinde doğrudan düzenle.
- **İngilizce metinler:** `assets/js/main.js` içindeki `EN` nesnesi.
  Her metnin `data-i18n="..."` anahtarı iki tarafta aynı olmalı.
- **Mağaza bağlantıları:** `assets/js/main.js` dosyasının en üstündeki `STORE_LINKS`.
  Bağlantı girilen düğme (App Store / Google Play) otomatik görünür, boş olan gizli kalır.
- **E-posta adresi:** `index.html` içinde `merhaba@example.com` geçen iki yeri değiştir
  (`mailAddr` ve `mailto:` bağlantısı).
- **Oyun görselleri:** Detective on Duty bölümündeki sahne şimdilik çizimdir
  (`.case__scene`). Gerçek oyun görseli geldiğinde bu SVG'nin yerine bir `<img>` konabilir.
- **Renkler ve fontlar:** `assets/css/style.css` dosyasının başındaki değişkenler.

## Bilgisayarında çalıştırma

```bash
npx serve .
# ya da
python3 -m http.server 8080
```

Sonra tarayıcıda `http://localhost:3000` (veya `8080`) adresini aç.

## GitHub Pages ile ücretsiz yayınlama

1. GitHub'da depoya gir: **Settings → Pages**.
2. **Source:** "Deploy from a branch".
3. **Branch:** sitenin bulunduğu dalı seç, klasör olarak `/ (root)` bırak, **Save**'e bas.
4. Bir iki dakika sonra site şu adreste açılır: `https://zorbzilla.github.io/games/`

## Performans notları

- Bir bölüm ekrandan çıkınca oradaki efektler (fener, yağmur, büyüteç, parçacıklar) durur.
  Sekme gizlenince de durur.
- Ekranda görünmeyen bölümlerin döngüsel CSS animasyonları duraklatılır.
- Kaydırma animasyonları, destekleyen tarayıcılarda ana iş parçacığını meşgul etmeyen
  CSS kaydırma zaman çizelgeleriyle çalışır. Desteklemeyenlerde içerik doğrudan görünür.
- Tarayıcı konsolunda `ZG.fx` yazarak fener efektinin o anki kalite seviyesini görebilirsin.
