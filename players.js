/* =========================================================
   فهرست بازیکنان
   برای اضافه‌کردن نفر جدید:
   ۱) عکس را در پوشه images بگذارید (مثلاً images/p25.jpg)
   ۲) یک آیتم مثل بقیه در پایین اضافه کنید و id بعدی را بدهید.

   تگ‌ها (برای یارکشی هوشمند):
   - keeper: 'complete'  → دروازه‌بان کامل
             'potential' → دروازه‌بان بالقوه
             null        → بدون نقش دروازه‌بان
   - level:  'A' تا 'E' → رتبهٔ بازیکن (A قوی‌ترین، E ضعیف‌ترین)

   این تگ‌ها پیش‌فرض هستند؛ داخل خود برنامه (مرحلهٔ ۱) هم می‌شود
   آن‌ها را برای هر بازیکن تغییر داد و برنامه تغییرات را ذخیره می‌کند.
   ========================================================= */

const PLAYERS = [
  { id: 1,  name: 'شایگان شاهدحقیقی',   img: 'images/p01.jpg', anime: 'images/anime/p01.webp', keeper: 'potential', level: 'A' },
  { id: 2,  name: 'حسین کیادلیری',       img: 'images/p02.jpg', anime: 'images/anime/p02.webp', keeper: null,        level: 'C' },
  { id: 3,  name: 'جواد تجری',            img: 'images/p03.jpg', anime: 'images/anime/p03.webp', keeper: null,        level: 'B' },
  { id: 4,  name: 'شریف خاکشورنیا',      img: 'images/p04.jpg', anime: 'images/anime/p04.webp', keeper: null,        level: 'A' },
  { id: 5,  name: 'امین حسن پور',        img: 'images/p05.jpg', anime: 'images/anime/p05.webp', keeper: null,        level: 'B' },
  { id: 6,  name: 'علی پور اسد',         img: 'images/p06.jpg', anime: 'images/anime/p06.webp', keeper: null,        level: 'D' },
  { id: 7,  name: 'مسعود محمدی',         img: 'images/p07.jpg', anime: 'images/anime/p07.webp', keeper: null,        level: 'E' },
  { id: 8,  name: 'مجتبی ابویی',         img: 'images/p08.jpg', anime: 'images/anime/p08.webp', keeper: 'potential', level: 'D' },
  { id: 9,  name: 'مجید اسماعیل نژاد',   img: 'images/p09.jpg', anime: 'images/anime/p09.webp', keeper: 'complete',  level: 'C' },
  { id: 10, name: 'احمد توکلی',          img: 'images/p10.jpg', anime: 'images/anime/p10.webp', keeper: null,        level: 'D' },
  { id: 11, name: 'نیما فتاحی',          img: 'images/p11.jpg', anime: 'images/anime/p11.webp', keeper: null,        level: 'C' },
  { id: 12, name: 'محسن علیاری',         img: 'images/p12.jpg', anime: 'images/anime/p12.webp', keeper: null,        level: 'B' },
  { id: 13, name: 'هادی فعال',           img: 'images/p13.jpg', anime: 'images/anime/p13.webp', keeper: null,        level: 'C' },
  { id: 14, name: 'محمد رضا زنجانیان',   img: 'images/p14.jpg', anime: 'images/anime/p14.webp', keeper: 'potential', level: 'E' },
  { id: 15, name: 'آرین معصومی',         img: 'images/p15.jpg', anime: 'images/anime/p15.webp', keeper: null,        level: 'C' },
  { id: 16, name: 'محمدجواد دهقانیان',   img: 'images/p16.jpg', anime: 'images/anime/p16.webp', keeper: 'complete',  level: 'B' },
  { id: 17, name: 'امید شهمیرزادی',       img: 'images/p17.jpg', anime: 'images/anime/p17.webp', keeper: null,        level: 'B' },
  { id: 18, name: 'امین زرنانی',          img: 'images/p18.jpg', anime: 'images/anime/p18.webp', keeper: null,        level: 'C' },
  { id: 19, name: 'جواد همتی',            img: 'images/p19.jpg', anime: 'images/anime/p19.webp', keeper: null,        level: 'B' },
  { id: 20, name: 'امیرحسن منظور',        img: 'images/p20.jpg', anime: 'images/anime/p20.webp', keeper: null,        level: 'C' },
  { id: 21, name: 'حمید توکلی',           img: 'images/p21.jpg', anime: 'images/anime/p21.webp', keeper: 'complete',  level: 'C' },
  { id: 22, name: 'حسین اکبری',           img: 'images/p22.jpg', anime: 'images/anime/p22.webp', keeper: null,        level: 'C' },
  { id: 23, name: 'مهدی جولایی',          img: 'images/p23.jpg', anime: 'images/anime/p23.webp', keeper: null,        level: 'A' },
  { id: 24, name: 'علی رئیسی',            img: 'images/p24.jpg', anime: 'images/anime/p24.webp', keeper: 'complete',  level: 'A' },
];
