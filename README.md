# Zorbzilla Games: web sitesi

Mobil oyun stüdyosu için tek sayfalık, hızlı ve her cihazda çalışan tanıtım sitesi.
Hiçbir framework ya da derleme adımı yok: düz HTML, CSS ve JavaScript.

## Neler var?

- **Oynanabilir demo:** Giriş bölümündeki telefonun içinde gerçek bir mini oyun (Neon Stack) çalışır.
  Kimse dokunmazsa kendi kendine oynar; dokununca oyun başlar. En iyi skor tarayıcıda saklanır.
- **WebGL arka plan:** Giriş bölümünde fareyi takip eden akışkan renkler.
  Yavaş cihazda önce çözünürlüğü, sonra kare hızını düşürür, gerekirse durur.
  Grafik kartı yoksa hiç açılmaz, yerine CSS degradesi görünür.
- **Türkçe / İngilizce:** Sağ üstteki TR/EN düğmesi. Seçim hatırlanır. `?lang=en` ile İngilizce açılır.
- **Süreç haritası:** Sayfa kaydıkça dolan, oyunlardaki bölüm haritası gibi bir yol.
- **Maskot Zorb:** Gözü imleci takip eder, dokununca konuşur.
- **Erişilebilirlik:** Klavye ile gezinme, ekran okuyucu etiketleri. "Hareketi azalt" ayarı açık olan
  ziyaretçilere animasyonsuz sürüm gösterilir.

## Dosyalar

```
index.html              Sayfanın tamamı (Türkçe metinler burada)
404.html                "Sayfa bulunamadı" sayfası
assets/css/style.css    Tüm stiller (renkler en üstteki :root içinde)
assets/js/main.js       Etkileşimler + İngilizce metinler (EN sözlüğü)
assets/js/neon-stack.js Telefondaki mini oyun
assets/img/             Favicon ve ana ekran simgeleri
site.webmanifest        "Ana ekrana ekle" ayarları
```

## İçerik nasıl değiştirilir?

- **Türkçe metinler:** `index.html` içinde doğrudan düzenle.
- **İngilizce metinler:** `assets/js/main.js` içindeki `EN` nesnesi.
  Her metnin `data-i18n="..."` anahtarı iki tarafta aynı olmalı.
- **E-posta adresi:** `index.html` içinde `merhaba@example.com` geçen iki yeri değiştir
  (`mailAddr` ve `mailto:` bağlantısı).
- **Oyun kartları:** `index.html` içindeki `#oyunlar` bölümü. Durum etiketleri: Yakında, Geliştiriliyor, Prototip, Konsept.
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

- Giriş bölümü ekrandan çıkınca oyun ve WebGL döngüleri durur, sekme gizlenince de durur.
- Ekranda görünmeyen bölümlerin döngüsel CSS animasyonları duraklatılır.
- Kaydırma animasyonları, destekleyen tarayıcılarda ana iş parçacığını meşgul etmeyen
  CSS kaydırma zaman çizelgeleriyle çalışır. Desteklemeyenlerde içerik doğrudan görünür.
- Tarayıcı konsolunda `ZG.fx` yazarak arka plan efektinin o anki kalite seviyesini görebilirsin.
