# QuUp Games: web sitesi

QuUp Games'in sitesi. İlk oyun **Detective on Duty**'yi tanıtır; ileride gelecek oyunlar için de hazırdır.

Yayındaki adres: https://zorbzilla.github.io/games/

## Klasör düzeni

Depoda sitenin iki hali var:

| Nerede | Ne | Yayında mı? |
|---|---|---|
| `src/` | **Okunabilir kaynak:** sayfa üretici (`build.py`), stiller (`css/style.css`), betik (`js/main.js`), 404 sayfası, gizlilik metni | Hayır. `_config.yml` bu klasörü GitHub Pages'in dışında tutar. |
| Kök klasör | **Derlenmiş site:** sıkıştırılmış HTML, CSS ve karartılmış JavaScript | Evet. Ziyaretçiler yalnızca bunu görür. |

**Kural:** Her değişiklik `src/` içinde yapılır, sonra site yeniden derlenir. Kökteki dosyalar elle düzenlenmez; bir sonraki derlemede üzerlerine yazılır.

## Derleme

Gerekenler: Python 3 ve Node.js 18 ya da üstü.

```bash
npm install      # ilk seferde: sıkıştırma araçlarını kurar
npm run build    # sayfaları üretir, sıkıştırır, karartır
```

`npm run build` şunları yapar:

1. `src/build.py`, sayfaları (`index.html`, `games.html`, `detective-on-duty.html`, `about.html`, `contact.html`, `privacy-policy.html`) kök klasöre yazar.
2. `src/tools/minify.mjs` sırayla:
   - HTML'i sıkıştırır.
   - Sayfa gövdesini şifreli bir blok olarak yazar. Tarayıcı açarken çözer.
   - CSS'i küçültür.
   - JavaScript'i karartır.

## Kaynak kod koruması

- Tarayıcıda "kaynağı görüntüle" denince sayfa içeriği yerine şifreli bir blok görünür.
- JavaScript okunamaz halde, CSS sıkıştırılmış tek satır.
- Sağ tık menüsü ve kaynak/geliştirici araçları kısayolları kapalıdır: F12, Ctrl+U, Ctrl+Shift+I/J/C, Ctrl+S.
- Arama motorları ve bağlantı önizlemeleri için sayfa başlığı, açıklama ve paylaşım etiketleri açık kalır.

Bilinmesi gerekenler:

- **Bu bir caydırıcıdır, kilit değildir.** Tarayıcı sayfayı gösterebilmek için kodu indirmek zorunda. Bilen biri tarayıcı menüsünden geliştirici araçlarını açıp sayfanın o anki halini görebilir. Amaç, kodun kolayca okunup kopyalanmasını engellemek.
- **Depo herkese açık.** GitHub'da `src/` klasörü okunabilir durumda. Kaynağı tamamen gizlemek için iki yol var:
  - Depoyu **gizli (private)** yapmak. GitHub Pages'i gizli depodan yayınlamak ücretli GitHub planı ister (GitHub Pro).
  - Siteyi gizli depodan ücretsiz yayınlayan bir hizmete taşımak: **Cloudflare Pages** ya da **Netlify**. Derleme komutu `npm run build`, yayın klasörü depo kökü.
- Siteyi görmek için tarayıcıda JavaScript açık olmalı. Kapalıysa kısa bir uyarı görünür.

## Sayfalar

Her sayfa ayrı bir dosya ve tek ekrana sığar. Üst menü ve alt bilgi sabit durur.
İçerik küçük bir ekrana sığmazsa sadece aradaki alan kayar.

| Dosya | Menüde | İçerik |
|---|---|---|
| `index.html` | Logo | **Ana sayfa:** "Yeni çıktı" etiketi, oyunun adı, "Oyunu keşfet", Google Play ve App Store düğmeleri.<br>Sağda oyunun gerçek ekranlarını sırayla gösteren telefon. Etrafında dedektif objeleri, arkada polis ışıkları, altta olay yeri şeridi. |
| `games.html` | OYUNLAR | **Oyunlar:** her oyun için bir kart. Tek oyun varken kart geniş durur, oyun sayısı artınca kartlar yan yana dizilir. |
| `detective-on-duty.html` | OYUNLAR altında | **Detective on Duty:** ikonun mor tonlarıyla. Sekmeler: Oynanış, Vakalar, Gizlilik.<br>Adresin sonuna `#cases` ya da `#privacy` eklenirse o sekme açılır. |
| `privacy-policy.html` | Oyun sayfasının içinde | **Detective on Duty gizlilik politikası** (İngilizce). Google Play Console'a verilen adres bu olduğu için adı değişmedi. |
| `about.html` | BİZ KİMİZ? | QuUp Games tanıtımı ve üç kural. |
| `contact.html` | İLETİŞİM | E-posta adresleri (kopyala / e-posta yaz) ve siteyi paylaşma düğmesi. |
| `404.html` | Yok | Bulunamayan adreslerde açılan sayfa. |

- TR/EN düğmesi dili değiştirir ve seçim hatırlanır. Adresin sonuna `?lang=en` eklenirse sayfa İngilizce açılır.
- Tarayıcı sekmesinde ana sayfa için sadece "QuUp Games" yazar.

## Yayından önce yapılacaklar

1. **Google Play bağlantısı:**
   - `src/js/main.js` dosyasının başındaki `STORE_LINKS.googleplay` alanına yazılır, sonra `npm run build`.
   - Boşken düğme görünür ve tıklanınca "çok yakında" der.
2. **App Store:**
   - Şimdilik soluk görünür, üstüne gelince "Yakında" yazar.
   - iPhone sürümü çıkınca aynı yerdeki `STORE_LINKS.appstore` alanına bağlantı yazılır.
3. **quupgames.com:**
   - `support@quupgames.com` ve `hello@quupgames.com` için posta kutusu ya da yönlendirme kurulmalı.
   - Gizlilik politikasındaki iletişim adresi de `support@quupgames.com`.
4. **Siteyi quupgames.com'a taşımak (isteğe bağlı):**
   - GitHub'da **Settings → Pages → Custom domain** alanına alan adı yazılır.
   - `src/build.py` içindeki `BASE` adresi, `sitemap.xml` ve `robots.txt` güncellenir, sonra `npm run build`.

## İçerik nasıl değiştirilir?

- **Türkçe metinler:** `src/build.py` içinde. 404 sayfası için `src/404.html`.
- **İngilizce metinler:** `src/js/main.js` içindeki `EN` nesnesinde. Her metnin `data-i18n="..."` anahtarı iki tarafta aynı olmalı.
- **Oyun listesi:** `src/build.py` içindeki `GAMES` listesi. Üst menü, telefon menüsü ve Oyunlar sayfası bu listeden üretilir.
- **Vaka adları:**
  - Türkçesi `src/build.py` içindeki `CASES` listesinde, İngilizcesi `main.js` içindeki `case.*` anahtarlarında.
  - İngilizce adlar oyunun vaka dosyalarından alındı. Türkçeler oyundaki çeviri tarzıyla yazıldı.
- **Oyun ekranları:** `assets/img/games/detective-on-duty/shots/` (540×960 WebP). Kariyer ekranındaki sicil numarası yayından önce bulanıklaştırıldı.
- **Oyun ikonu:** `assets/img/games/detective-on-duty/icon-128.webp`, `icon-256.webp`, `icon-512.webp`.
- **Logo:**
  - Q harfinin çizimi `src/q.txt` dosyasında.
  - "uUp Games" yazısı Outfit yazı tipinin 600 kalınlığıyla. Q bu kalınlığa göre çizildi.
- **Renkler:** `src/css/style.css` dosyasının başı.
  - Stüdyonun ana rengi polis mavisi: `--accent`.
  - Detective on Duty sayfaları `[data-theme="dod"]` bloğundaki mor tonları kullanır.
- **Paylaşım görseli:** `assets/img/og.jpg` (1200×630).

## Yeni bir oyun eklemek

1. İkonu ve ekranları `assets/img/games/<oyun-adi>/` klasörüne koy.
2. `src/build.py` içindeki `GAMES` listesine bir kayıt ekle. Menüler ve Oyunlar sayfası kendiliğinden güncellenir. İki kart olunca sayfa iki sütuna geçer.
3. Oyunun kendi sayfasını `game()` fonksiyonunu örnek alarak yaz. İsterse kendi renk teması olur: `[data-theme]`.
4. `sitemap.xml` dosyasına adresini ekle, sonra `npm run build`.

## Bilgisayarında çalıştırma

```bash
npm run build
python3 -m http.server 8080
```

Sonra tarayıcıda `http://localhost:8080` adresini aç.

## Yayınlama (GitHub Pages)

- Site GitHub Pages ile bu dalın kökünden yayınlanıyor. Bu dala gönderilen her değişiklik bir iki dakika içinde yayına çıkar.
- `_config.yml`, `src/`, `README.md` ve derleme dosyalarını yayının dışında tutar.
- Oyun projesinin dosyaları bu depoya konmamalı: Unity projesi, `firestore.rules`, anahtarlar vb. Keystore dosyaları `.gitignore` ile zaten dışarıda tutulur.

## Performans notları

- **Ana sayfa:**
  - UV fener efekti yalnızca cihazda grafik hızlandırma varsa açılır. Yavaş cihazda kalitesini kendi düşürür.
  - Siren ışıkları grafik hızlandırması olan cihazlarda yanıp söner. Diğerlerinde sabit ama belirgin durur.
- **Telefondaki ekranlar:** Yumuşak geçişle değişir. Resimler sırası gelmeden hemen önce yüklenir.
- **Genel:**
  - Efektler ekrandan çıkınca ya da sekme gizlenince durur.
  - "Hareketi azalt" ayarı açık olan ziyaretçilere animasyonsuz sürüm gösterilir.
