# QuUp Games: web sitesi

QuUp Games'in sitesi. İlk oyun **Detective on Duty**'yi tanıtır; ileride gelecek oyunlar için de hazırdır.
Hiçbir framework ya da derleme adımı yok: düz HTML, CSS ve JavaScript.

Yayındaki adres: https://zorbzilla.github.io/games/

## Sayfalar

Her sayfa ayrı bir dosya ve tek ekrana sığar. Üst menü ve alt bilgi sabit durur.
İçerik küçük bir ekrana sığmazsa sadece aradaki alan kayar.

| Dosya | Menüde | İçerik |
|---|---|---|
| `index.html` | Logo | **Ana sayfa:** "Yeni çıktı" etiketi, oyunun adı, "Oyunu keşfet", Google Play ve App Store düğmeleri.<br>Sağda oyunun gerçek ekranlarını sırayla gösteren telefon ve oyunun ikonu. Altta olay yeri şeridi. |
| `oyunlar.html` | OYUNLAR | **Oyunlar:** her oyun için bir kart. Tek oyun varken kart geniş durur, oyun sayısı artınca kartlar yan yana dizilir. |
| `detective-on-duty.html` | OYUNLAR altında | **Detective on Duty:** ikonun mor tonlarıyla. Sekmeler: Oynanış, Vakalar, Gizlilik.<br>Adresin sonuna `#vakalar` ya da `#gizlilik` eklenirse o sekme açılır. |
| `privacy-policy.html` | Oyun sayfasının içinde | **Detective on Duty gizlilik politikası** (İngilizce). Google Play Console'a verilen adres bu olduğu için adı değişmedi. |
| `biz-kimiz.html` | BİZ KİMİZ? | QuUp Games tanıtımı ve üç kural. |
| `iletisim.html` | İLETİŞİM | E-posta adresleri (kopyala / e-posta yaz) ve siteyi paylaşma düğmesi. Belirli bir oyuna bağlı değildir. |
| `404.html` | Yok | Bulunamayan adreslerde açılan sayfa. |

- Fare OYUNLAR'ın üstüne gelince oyunlar alt alta listelenir. Tıklanınca Oyunlar sayfası açılır.
- TR/EN düğmesi dili değiştirir ve seçim hatırlanır. Adresin sonuna `?lang=en` eklenirse sayfa İngilizce açılır.
- Sitede vaka sayısı geçmez. Vakalar sekmesinin son kartı "Yeni dosyalar yolda" der.

## Yayından önce yapılacaklar

1. **Google Play bağlantısı:**
   - `assets/js/main.js` dosyasının en üstündeki `STORE_LINKS.googleplay` alanına yazılır.
   - Bu tek satır bütün sayfalardaki Google Play düğmelerini çalıştırır.
   - Boşken düğme görünür ve tıklanınca "Google Play bağlantısı çok yakında burada." der.
2. **App Store:**
   - Şimdilik soluk görünür. Üstüne gelince "Yakında" yazar.
   - iPhone sürümü çıkınca aynı yerdeki `STORE_LINKS.appstore` alanına bağlantı yazılır. Düğmeler kendiliğinden gerçek bağlantıya dönüşür.
3. **quupgames.com:**
   - Sitede `support@quupgames.com` ve `hello@quupgames.com` kullanılıyor.
   - Alan adı alınınca bu iki adres için posta kutusu ya da yönlendirme kurulmalı. Kurulmazsa gelen e-postalar geri döner.
   - Yönlendirmeyi alan adı firması, Cloudflare Email Routing, Google Workspace, Zoho vb. yapabilir.
   - Gizlilik politikasındaki iletişim adresi de `support@quupgames.com`.
4. **Siteyi quupgames.com'a taşımak (isteğe bağlı):**
   - GitHub'da **Settings → Pages → Custom domain** alanına alan adı yazılır. DNS kayıtları GitHub'ın gösterdiği gibi girilir.
   - Sayfalardaki `https://zorbzilla.github.io/games/` adresleri yeni adresle değiştirilir: `canonical`, `og:url`, `og:image`.
   - Aynı değişiklik `sitemap.xml` ve `robots.txt` dosyalarında da yapılır.
   - Google Play Console'daki gizlilik politikası adresi de güncellenir.

## İçerik nasıl değiştirilir?

- **Türkçe metinler:** Doğrudan HTML dosyalarında.
- **İngilizce metinler:** `assets/js/main.js` içindeki `EN` nesnesinde.
  - Her metnin `data-i18n="..."` anahtarı iki tarafta aynı olmalı.
  - Sayfa başlıklarının İngilizcesi aynı dosyadaki `META_EN` içinde.
- **Üst menü ve alt bilgi:** Altı sayfanın hepsinde aynı kod tekrarlanıyor: ana sayfa, Oyunlar, oyun sayfası, gizlilik, Biz kimiz? ve İletişim. Bir değişiklik altı dosyada da yapılmalı.
- **Vaka adları:**
  - Türkçesi `detective-on-duty.html` ve `index.html` içinde, İngilizcesi `main.js` içindeki `case.1` ... `case.8` anahtarlarında.
  - İngilizce adlar oyunun vaka dosyalarından alındı (`Case001_TheMissingMan` ...).
  - Türkçe adlar oyundaki çeviri tarzıyla yazıldı. Örneğin oyunda "The Inside Man", "İçerideki Adam" olarak geçiyor. Oyundaki adlar farklıysa buradan düzeltilir.
- **Oyun ekranları:**
  - Dosyalar: `assets/img/games/detective-on-duty/shots/` (540×960 WebP).
  - Kariyer ekranındaki sicil numarası yayından önce bulanıklaştırıldı.
  - Yeni bir ekran eklemek için dosyayı bu klasöre koy.
    - Oyun sayfası için Oynanış listesine bir adım (`.pstep`) ve telefona bir `<img>` ekle.
    - Ana sayfa için `#phone .shots` içine bir `<img>` ekle.
- **Oyun ikonu:** `assets/img/games/detective-on-duty/icon-128.webp`, `icon-256.webp`, `icon-512.webp`.
- **Paylaşım görseli:** `assets/img/og.jpg` (1200×630). Bağlantı WhatsApp, X gibi yerlerde paylaşılınca bu görünür.
- **Renkler ve fontlar:** `assets/css/style.css` dosyasının başı.
  - Stüdyonun ana rengi polis mavisi: `--accent: #4d7cff`.
  - Detective on Duty sayfaları `[data-theme="dod"]` bloğundaki mor tonları kullanır. Bu renkler oyunun ikonundan ve ekranlarından alındı.

## Yeni bir oyun eklemek

1. İkonu ve ekranları `assets/img/games/<oyun-adi>/` klasörüne koy.
2. `detective-on-duty.html` dosyasını kopyalayıp yeni oyunun sayfasını yap.
   - İsterse kendi renk teması olur. `style.css` içinde `[data-theme="dod"]` bloğunu örnek al.
   - Sonra sayfanın `<html>` etiketine `data-theme` yaz.
3. `oyunlar.html` içindeki `<li class="gcard">` kartını kopyala. İki kart olunca sayfa kendiliğinden iki sütuna geçer.
4. Altı sayfadaki üst menüde iki yere birer satır ekle:
   - `.menu__list`: fare OYUNLAR'ın üstüne gelince açılan liste.
   - `.mnav__games`: telefon menüsü.
5. `sitemap.xml` dosyasına yeni sayfanın adresini ekle.

## Dosyalar

```
index.html, oyunlar.html, detective-on-duty.html, privacy-policy.html, biz-kimiz.html, iletisim.html, 404.html
assets/css/style.css          Tüm stiller
assets/js/main.js             Etkileşimler, İngilizce metinler, mağaza bağlantıları (STORE_LINKS)
assets/img/                   Favicon, ana ekran simgeleri, paylaşım görseli (og.jpg)
assets/img/games/<oyun>/      Oyunun ikonu ve ekran görüntüleri
site.webmanifest              "Ana ekrana ekle" ayarları
sitemap.xml, robots.txt       Arama motorları için
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

- **Ana sayfa:**
  - UV fener efekti WebGL ile çalışır, yalnızca cihazda grafik hızlandırma varsa açılır. Yoksa yerine CSS arka planı görünür.
  - Yavaş cihazda önce çözünürlüğü, sonra kare hızını düşürür. Gerekirse durur.
  - Tarayıcı konsolunda `QG.fx` yazılırsa o anki kalite seviyesi görünür.
- **Siren ışıkları ve telefon parlaması:** Yalnızca grafik hızlandırması olan cihazlarda hareket eder.
- **Telefondaki ekranlar:** Yumuşak bir geçişle değişir. Resimler sırası gelmeden hemen önce yüklenir.
- **Oyun sayfası:** Oynanış adımları sekme açıkken kendiliğinden ilerler. Bir adıma tıklanınca durup okumaya zaman tanır.
- **Genel:**
  - Efektler ekrandan çıkınca ya da sekme gizlenince durur.
  - "Hareketi azalt" ayarı açık olan ziyaretçilere animasyonsuz sürüm gösterilir.
