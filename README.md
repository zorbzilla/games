# Detective on Duty · Quup Games: web sitesi

Quup Games'in ilk oyunu **Detective on Duty** için tanıtım sitesi. Stüdyoyu da tanıtır.
Hiçbir framework ya da derleme adımı yok: düz HTML, CSS ve JavaScript.

Yayındaki adres: https://zorbzilla.github.io/games/

## Sayfada neler var?

Yukarıdan aşağıya:

1. **Giriş:**
   - "Detective on Duty" başlığı, kısa tanıtım ve oyunun üç gerçeği: 50 vaka, haftalık sıralama, hesap gerekmez.
   - Sağda altın dedektif rozeti, ortasında Quup'un Q harfi. Fare ile hafif döner.
   - Arka planda fener efekti: fener karanlıkta gezinir ve gizli parmak izlerini aydınlatır.
2. **Olay yeri şeridi:** Kayan sarı şerit ve arkada ilk sekiz vakanın adları.
3. **Oyun:** Yağmurlu noir sokak sahnesi. Büyüteç sahnede gezinir ve gizli ipuçlarını gösterir. Yanında oyunun dosya kartı (vaka sayısı, tür, platform).
4. **Özellikler:** Altı kart: olay yeri, sorgu odası, çıkarım panosu, çelişkiler, kariyer, haftalık sıralama.
   - Kartların küçük animasyonlu çizimleri var.
   - Masaüstünde aynı anda tek kart oynar: fare hangi kartın üstündeyse o, fare yoksa kartlar sırayla.
5. **Nasıl oynanır?:** Brifing → Olay yeri → Sorgu → Çıkarım → Karar. Kaydırdıkça dolan seviye haritası.
6. **Vaka dosyaları:** İlk sekiz vakanın klasörü ve "+42 dosya daha arşivde" kartı.
7. **Stüdyo:** Quup Games tanıtımı, üç kural, gümüş Q amblemi ve "Gizlilik, kısaca" paneli.
8. **İletişim ve bağlantılar:** E-posta (kopyala / gönder), Google Play, gizlilik politikası ve "Bu sayfayı paylaş".

Başlıkta ve altbilgide logo olarak sadece **Q** kullanılır. TR/EN düğmesi dili değiştirir ve seçim hatırlanır. `?lang=en` ile sayfa İngilizce açılır.

## Dosyalar

```
index.html              Ana sayfa (Türkçe metinler burada)
privacy-policy.html     Gizlilik politikası (İngilizce, metni olduğu gibi korunur)
404.html                "Sayfa bulunamadı" sayfası
assets/css/style.css    Tüm stiller (renkler en üstteki :root içinde)
assets/js/main.js       Etkileşimler, İngilizce metinler (EN sözlüğü), mağaza bağlantısı
assets/img/             Favicon, ana ekran simgeleri, paylaşım görseli (og.jpg)
site.webmanifest        "Ana ekrana ekle" ayarları
```

## İçerik nasıl değiştirilir?

- **Google Play bağlantısı:** `assets/js/main.js` dosyasının en üstündeki `STORE_LINKS.googleplay`.
  Bağlantı girilince her yerdeki "Google Play'den indir" düğmeleri ve bağlantı kartı kendiliğinden görünür.
  Girişteki ana düğme de "Oyunu keşfet" yerine indirme düğmesi olur. Boş kalırsa hepsi gizli kalır.
- **Türkçe metinler:** Doğrudan `index.html` içinde düzenlenir.
- **İngilizce metinler:** `assets/js/main.js` içindeki `EN` nesnesinde. Her metnin `data-i18n="..."` anahtarı iki tarafta aynı olmalı.
- **E-posta adresi:** `index.html` içinde `quup.support@` geçen iki yeri değiştir (`mailAddr` ve `mailto:`).
- **Vaka dosyaları:** `index.html` içindeki `.files` listesi.
  Başlıklar oyun kodundaki vaka adlarından alındı (`Case001_TheMissingMan` ...). Oyundaki adlar farklıysa buradan düzelt.
- **Gizlilik politikası:** `privacy-policy.html`. Google Play Console'a verilecek adres:
  `https://zorbzilla.github.io/games/privacy-policy.html`
- **Oyun görselleri:** Noir sahne ve özellik kartlarındaki çizimler illüstrasyondur, oyun ekran görüntüsü değildir.
  Gerçek ekran görüntüleri gelince `.case__scene` SVG'sinin yerine bir `<img>` konabilir.
- **Paylaşım görseli:** `assets/img/og.jpg` (1200×630). Link WhatsApp, X gibi yerlerde paylaşılınca bu görünür.
- **Renkler ve fontlar:** `assets/css/style.css` dosyasının başındaki değişkenler.

## Bilgisayarında çalıştırma

```bash
npx serve .
# ya da
python3 -m http.server 8080
```

Sonra tarayıcıda `http://localhost:3000` (veya `8080`) adresini aç.

## Yayınlama (GitHub Pages)

Site GitHub Pages ile bu dalın kökünden yayınlanıyor. Bu dala gönderilen her değişiklik bir iki dakika içinde yayına çıkar.
Ayar: GitHub'da **Settings → Pages**. Oradan dal ve klasör (`/ (root)`) seçilir.

Bu dalın kökündeki her dosya herkese açık olarak indirilebilir. Oyun projesinin dosyaları buraya konmamalı:
Unity projesi, `firestore.rules`, anahtarlar vb. Keystore dosyaları `.gitignore` ile zaten dışarıda tutulur.

## Performans notları

- Bir bölüm ekrandan çıkınca oradaki efektler durur: fener, yağmur, büyüteç, döngüsel animasyonlar. Sekme gizlenince de durur.
- Fener efekti WebGL ile çalışır. Yavaş cihazda önce çözünürlüğü, sonra kare hızını düşürür, gerekirse durur.
  Grafik hızlandırması yoksa hiç açılmaz, yerine CSS arka planı görünür.
  Tarayıcı konsolunda `ZG.fx` yazarak o anki kalite seviyesini görebilirsin.
- Özellik kartlarında aynı anda tek çizim oynar. Mobilde ekranda görünen kartlar oynar.
- "Hareketi azalt" ayarı açık olan ziyaretçilere animasyonsuz sürüm gösterilir.
