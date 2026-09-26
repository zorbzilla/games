# QuUp Games: web sitesi

QuUp Games'in sitesi. İlk oyun **Detective on Duty**'yi tanıtır.
Hiçbir framework ya da derleme adımı yok: düz HTML, CSS ve JavaScript.

Yayındaki adres: https://zorbzilla.github.io/games/

## Sayfalar

Her sayfa ayrı bir dosya ve tek ekrana sığar. Üst menü ve alt bilgi sabit durur.
İçerik küçük bir ekrana sığmazsa sadece aradaki alan kayar.

| Dosya | Menüde | İçerik |
|---|---|---|
| `index.html` | Logo | **Ana sayfa:** "Yeni çıktı" etiketi, oyunun adı, "Oyunu keşfet", Google Play ve App Store düğmeleri.<br>Sağda vaka listesini gösteren hareketli bir telefon, altta olay yeri şeridi. |
| `detective-on-duty.html` | OYUNLAR | **Oyun sayfası.** Sekmeler: Genel bakış, Özellikler, Nasıl oynanır, Vakalar.<br>Adresin sonuna `#ozellikler`, `#nasil-oynanir` ya da `#vakalar` eklenirse o sekme açılır. |
| `biz-kimiz.html` | BİZ KİMİZ? | QuUp Games tanıtımı ve üç kural. |
| `privacy-policy.html` | GİZLİLİK | Gizlilik politikası (İngilizce). |
| `iletisim.html` | İLETİŞİM | E-posta adresleri (kopyala / e-posta yaz) ve "Paylaş" düğmesi. |
| `404.html` | Yok | Bulunamayan adreslerde açılan sayfa. |

Fare OYUNLAR'ın üstüne gelince Detective on Duty kartı açılır.
TR/EN düğmesi dili değiştirir ve seçim hatırlanır. Adresin sonuna `?lang=en` eklenirse sayfa İngilizce açılır.

## Yayından önce yapılacaklar

1. **Google Play bağlantısı:**
   - `assets/js/main.js` dosyasının en üstündeki `STORE_LINKS.googleplay` alanına yazılır.
   - Bu tek satır bütün sayfalardaki Google Play düğmelerini çalıştırır.
   - Boşken düğme görünür ve tıklanınca "Google Play bağlantısı çok yakında burada." der.
2. **App Store:**
   - Şimdilik soluk görünür. Üstüne gelince "Yakında" yazar.
   - iPhone sürümü çıkınca aynı yerdeki `STORE_LINKS.appstore` alanına bağlantı yazılır ve düğmeler kendiliğinden gerçek bağlantıya dönüşür.
3. **quupgames.com:**
   - Sitede `support@quupgames.com` ve `hello@quupgames.com` kullanılıyor.
   - Alan adı alınınca bu iki adres için posta kutusu ya da yönlendirme kurulmalı. Olmazsa gelen e-postalar geri döner.
   - Yönlendirmeyi alan adı firması, Cloudflare Email Routing, Google Workspace, Zoho vb. yapabilir.
   - Gizlilik politikasındaki iletişim adresi de `support@quupgames.com`.
4. **Siteyi quupgames.com'a taşımak (isteğe bağlı):**
   - GitHub'da **Settings → Pages → Custom domain** alanına alan adı yazılır. DNS kayıtları GitHub'ın gösterdiği gibi girilir.
   - Sonra sayfalardaki `https://zorbzilla.github.io/games/` adresleri yeni adresle değiştirilir: `canonical`, `og:url`, `og:image`.
   - Aynı değişiklik `sitemap.xml` ve `robots.txt` dosyalarında da yapılır.
   - Google Play Console'daki gizlilik politikası adresi de güncellenir.

## İçerik nasıl değiştirilir?

- **Türkçe metinler:** Doğrudan HTML dosyalarında.
- **İngilizce metinler:** `assets/js/main.js` içindeki `EN` nesnesinde.
  - Her metnin `data-i18n="..."` anahtarı iki tarafta aynı olmalı.
  - Sayfa başlıklarının İngilizcesi aynı dosyadaki `META_EN` içinde.
- **Üst menü ve alt bilgi:** Beş sayfanın hepsinde aynı kod tekrarlanıyor. Bir değişiklik beş dosyada da yapılmalı.
- **Vakalar:**
  - Oyun sayfasındaki klasörler: `detective-on-duty.html` içindeki `.files` listesi.
  - Ana sayfadaki telefonun listesi: `index.html` içindeki `.app__track`.
  - Telefon listesi kesintisiz dönsün diye iki kez yazılı. İkisi birlikte değiştirilmeli.
- **E-posta adresleri:** Şu dosyalarda geçer:
  - `iletisim.html`
  - `privacy-policy.html`
  - `index.html` (arama motorları için kurum bilgisi)
  - `assets/js/main.js` (İngilizce sayfa açıklaması)
- **Oyun görselleri:**
  - Noir sokak sahnesi ve özellik kartlarındaki çizimler illüstrasyondur, oyunun ekran görüntüsü değildir.
  - Gerçek ekran görüntüleri gelince bunların yerine `<img>` konabilir.
- **Paylaşım görseli:** `assets/img/og.jpg` (1200×630). Bağlantı WhatsApp, X gibi yerlerde paylaşılınca bu görünür.
- **Renkler ve fontlar:** `assets/css/style.css` dosyasının başındaki `:root` değişkenleri. Ana renk polis mavisi `--blue: #4d7cff`.

## Dosyalar

```
index.html, detective-on-duty.html, biz-kimiz.html, iletisim.html, privacy-policy.html, 404.html
assets/css/style.css    Tüm stiller
assets/js/main.js       Etkileşimler, İngilizce metinler, mağaza bağlantıları (STORE_LINKS)
assets/img/             Favicon, ana ekran simgeleri, paylaşım görseli (og.jpg)
site.webmanifest        "Ana ekrana ekle" ayarları
sitemap.xml, robots.txt Arama motorları için
```

## Bilgisayarında çalıştırma

```bash
python3 -m http.server 8080
```

Sonra tarayıcıda `http://localhost:8080` adresini aç.

## Yayınlama (GitHub Pages)

- Site GitHub Pages ile bu dalın kökünden yayınlanıyor. Bu dala gönderilen her değişiklik bir iki dakika içinde yayına çıkar.
- Ayar yeri: GitHub'da **Settings → Pages**. Dal ve klasör (`/ (root)`) oradan seçilir.
- Bu dalın kökündeki her dosya herkese açık olarak indirilebilir. Oyun projesinin dosyaları buraya konmamalı: Unity projesi, `firestore.rules`, anahtarlar vb.
- Keystore dosyaları `.gitignore` ile zaten dışarıda tutulur.

## Performans notları

- **Ana sayfadaki UV fener efekti:**
  - WebGL ile çalışır, yalnızca cihazda grafik hızlandırma varsa açılır. Yoksa yerine CSS arka planı görünür.
  - Yavaş cihazda önce çözünürlüğü, sonra kare hızını düşürür. Gerekirse durur.
  - Tarayıcı konsolunda `QG.fx` yazılırsa o anki kalite seviyesi görünür.
- **Büyük ışık animasyonları:** Siren ışıkları ve telefon ekranındaki parlama yalnızca grafik hızlandırması olan cihazlarda hareket eder. Diğerlerinde sabit durur.
- **Oyun sayfası:**
  - Büyüteç sahnenin tamamını değil, sadece kendi küçük penceresini hareket ettirir.
  - Yağmur hafif bir tuval üzerinde çizilir.
  - Özellik kartlarında aynı anda tek çizim oynar. Mobilde ekranda görünen kartlar oynar.
- **Genel:**
  - Efektler ekrandan çıkınca ya da sekme gizlenince durur.
  - "Hareketi azalt" ayarı açık olan ziyaretçilere animasyonsuz sürüm gösterilir.
