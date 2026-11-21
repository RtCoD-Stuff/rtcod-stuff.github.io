// Единая конфигурация сайта Return to Castle of Dark.
// Меняйте IP, ссылки, цены и URL кассы (EasyDonate / TradeMC) прямо здесь.

window.RTCOD_CONFIG = {
  server: {
    name: "Return to Castle of Dark",
    shortName: "RtCoD",
    tagline: "Тёмное средневековое фэнтези • 20 рас • Кланы с тавернами • Боссы и магия",
    ip: "В разработке • скоро открытие", // Когда запустите на SolidHost, впишите IP (например: 123.45.67.89:25565)
    version: "Forge 1.20.1",
    enableLiveStatus: false, // Поставьте true, когда укажете реальный IP
  },

  links: {
    discord: "https://discord.com/invite/9mPS3sXq", // Официальная ссылка-виджет Discord (без автора)
    telegram: "https://t.me/RtCoD_server", // Вставьте реальную ссылку на Telegram-канал
    launcherWin: "https://github.com/RtCoD-Stuff/rtcod-launcher/releases/latest/download/RtCoD-Launcher-Windows.exe",
    launcherLinux: "https://github.com/RtCoD-Stuff/rtcod-launcher/releases/latest/download/RtCoD-Launcher-Linux",
    modpackZip: "https://github.com/RtCoD-Stuff/rtcod-launcher/releases/latest",
  },

  currency: {
    usdRate: 95, // Курс для отображения в USD ($), если игрок не из РФ
  },

  // Ссылка-шаблон вашей кассы (EasyDonate / TradeMC).
  // При оплате {productId}, {nick} и {qty} автоматически подставятся,
  // либо можно указать прямую checkoutUrl у каждого товара ниже.
  payment: {
    providerName: "EasyDonate / TradeMC",
    shopBaseUrl: "", // Например: "https://shop.easydonate.ru/your-shop"
  },

  ranks: [
    {
      id: "vip",
      name: "VIP",
      badge: "Стартовый",
      priceRub: 299,
      accent: "#60a5fa",
      command: "/donate setrank {nick} vip",
      perks: [
        "Префикс [VIP] в чате и табе",
        "Доступ к набору /kit vip (ресурсы и снаряжение из сборки)",
        "+2 дополнительных чанка привата для клана",
        "Сниженный КД на команды и приоритетный вход",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      badge: "Популярный",
      featured: true,
      priceRub: 599,
      accent: "#f59e0b",
      command: "/donate setrank {nick} premium",
      perks: [
        "Всё из привилегии VIP",
        "Набор /kit premium (магия, реликвии и улучшенная броня)",
        "+1 Mythic-ключ в подарок при покупке",
        "Расширенный лимит приватов и клановых возможностей",
      ],
    },
    {
      id: "lord",
      name: "Lord",
      badge: "Максимум",
      priceRub: 999,
      accent: "#ef4444",
      command: "/donate setrank {nick} lord",
      perks: [
        "Всё из привилегий VIP и Premium",
        "Элитный набор /kit lord (высокоуровневый лут и артефакты)",
        "+2 Void-ключа в подарок при покупке",
        "Уникальный багрово-золотой титул [LORD] и все бонусы сервера",
      ],
    },
  ],

  cases: [
    {
      id: "common",
      name: "Common Case",
      rarity: "Обычный",
      priceRub: 25,
      accent: "#94a3b8",
      command: "/donate givekey {nick} common {qty}",
      description: "Стартовые ресурсы, еда, базовые свитки и полезные материалы для быстрого разгона.",
    },
    {
      id: "mythic",
      name: "Mythic Case",
      rarity: "Мифический",
      priceRub: 50,
      accent: "#a855f7",
      command: "/donate givekey {nick} mythic {qty}",
      description: "Редкое оружие, книги заклинаний Iron's Spells, артефакты и материалы боссов.",
    },
    {
      id: "void",
      name: "Void Case",
      rarity: "Бездна",
      priceRub: 100,
      accent: "#f43f5e",
      command: "/donate givekey {nick} void {qty}",
      description: "Топовое снаряжение Cataclysm, Ice & Fire и Dying Realms с максимальным шансом редкости.",
    },
    {
      id: "crown",
      name: "Донат-кейс (Привилегия)",
      rarity: "Королевский",
      featured: true,
      priceRub: 179,
      accent: "#fbbf24",
      command: "/donate givekey {nick} crown {qty}",
      description: "Испытай удачу: шанс выбить VIP (55%), Premium (30%), Lord (10%) или 3× Void-ключа (5%)!",
    },
  ],
};
