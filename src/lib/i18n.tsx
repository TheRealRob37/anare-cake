"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Locale, I18nLabel } from "@/types/cake";

// ─── UI Strings ───────────────────────────────────────────────────────────────
type UIStrings = {
  nav: { home: string; cakes: string; design: string; story: string; contact: string };

  hero: {
    badge: string; title1: string; title2: string; subtitle: string;
    cta: string; explore: string;
    stat_cakes: string; stat_natural: string; stat_rating: string;
  };

  featured: {
    badge: string; title1: string; title2: string; subtitle: string;
    tag_bestseller: string; tag_premium: string; tag_signature: string; tag_seasonal: string;
    customise: string; viewAll: string;
  };

  about: {
    badge: string; title1: string; title2: string; title3: string;
    p1: string; p2: string;
    val1_title: string; val1_desc: string;
    val2_title: string; val2_desc: string;
    val3_title: string; val3_desc: string;
    process_title: string;
    step1_label: string; step1_desc: string;
    step2_label: string; step2_desc: string;
    step3_label: string; step3_desc: string;
    step4_label: string; step4_desc: string;
    cta: string;
    badge_stars: string;
  };

  configurator: {
    title: string; subtitle: string;
    layers: string;
    size: string; shape: string; tiers: string;
    sponge: string; fillings: string; fillingsHint: string;
    frosting: string; toppings: string;
    message: string; messagePlaceholder: string;
    date: string; cutView: string; view3d: string;
    pause: string; rotate: string; included: string;
    order: string; summary: string; total: string;
    serves: string; people: string;
    tier: string; tiers_word: string;
    font: string;
    instagram_note: string;
  };

  price: {
    base: string; sponge: string; fillings: string;
    frosting: string; toppings: string; extra_tiers: string; total: string;
  };

  checkout: {
    title: string; subtitle: string;
    back: string;
    contact_title: string;
    name: string; namePlaceholder: string;
    phone: string; phonePlaceholder: string;
    email: string; emailPlaceholder: string;
    delivery_title: string;
    address: string; addressPlaceholder: string;
    map_hint: string; map_click_hint: string;
    payment_title: string;
    pay_card: string; pay_gpay: string; pay_applepay: string;
    card_number: string; card_expiry: string; card_cvv: string;
    card_name: string; card_namePlaceholder: string;
    place_order: string; processing: string;
    order_summary: string;
    serves_label: string;
    success_title: string; success_desc: string; success_ref: string;
    error_required: string;
    note: string;
  };

  toppings_section: {
    badge: string; title: string; subtitle: string;
    pos_top: string; pos_side: string; pos_drip: string;
  };

  menu: {
    badge: string; title: string; subtitle: string;
    all: string; bestseller: string; premium: string; signature: string; seasonal: string;
    from: string; order: string; customise: string;
    count: string;
  };

  seasonal: {
    badge: string; title: string; subtitle: string;
    dates: string; cta: string;
    item1_name: string; item1_desc: string;
    item2_name: string; item2_desc: string;
    item3_name: string; item3_desc: string;
  };

  footer: {
    tagline: string; description: string;
    explore: string; order: string;
    link_home: string; link_cakes: string; link_design: string;
    link_story: string; link_contact: string;
    link_faq: string; link_delivery: string; link_weddings: string;
    rights: string; madeWith: string;
  };
};

// ─────────────────────────────────────────────────────────────────────────────
const STRINGS: Record<Locale, UIStrings> = {

  // ─── ARMENIAN ──────────────────────────────────────────────────────────────
  hy: {
    nav: {
      home: "Գլխավոր",
      cakes: "Մեր Տորթերը",
      design: "Ձևավորեք Ձերը",
      story: "Մեր Պատմությունը",
      contact: "Կապ",
    },
    hero: {
      badge: "Անհատական Հրուշակ",
      title1: "Ամեն Տորթ",
      title2: "Պատմություն Ունի",
      subtitle: "Ձեռագործ շքեղ տորթեր ձեր ամենաթանկ պահերի համար",
      cta: "Ձևավորեք Ձեր Տորթը",
      explore: "Դիտել Հավաքածուն",
      stat_cakes: "Տորթ Պատրաստված",
      stat_natural: "Բնական Բաղադրիչներ",
      stat_rating: "Հաճախորդների Գնահատական",
    },
    featured: {
      badge: "Մեր Հավաքածուն",
      title1: "Ընտրված",
      title2: "Ստեղծագործություններ",
      subtitle: "Ամեն տորթ եզակի է — պատրաստված փոքր խմբաքանակով, սեզոնային բաղադրիչներով",
      tag_bestseller: "Ամենավաճառ",
      tag_premium: "Պրեմիում",
      tag_signature: "Հեղինակային",
      tag_seasonal: "Սեզոնային",
      customise: "Հարմարեցնել →",
      viewAll: "Տեսնել Ամբողջ Հավաքածուն",
    },
    about: {
      badge: "Մեր Պատմությունը",
      title1: "Ծնված",
      title2: "Կրքից",
      title3: "Գեղեցիկ Բաների Հանդեպ",
      p1: "Anare Cake-ը ստեղծվել է մի պարզ համոզմունքով. իսկապես հատուկ տորթ պետք է համի այնքան արտասովոր, որքան տեսնում ես։",
      p2: "Մենք բացառապես անհատական պատվերներ ենք կատարում, քանի որ լավագույն տորթերն ստեղծվում են հատուկ ձեզ համար։",
      val1_title: "Բնական Բաղադրիչներ",
      val1_desc: "Ամեն բիսկվիտ, կրեմ ու լցոնում սկսվում է պրեմիում, տեղական բաղադրիչներից։",
      val2_title: "Վարպետ Արհեստ",
      val2_desc: "Ամեն տորթ ձեռքով է զարդարված — ոչ ձևեր, ոչ կրճատումներ, միայն հմտություն ու համբերություն։",
      val3_title: "Անձնական Մոտեցում",
      val3_desc: "Առաջին խորհրդատվությունից մինչ առաքում, ձեր տեսլականը ուղղորդում է ամեն որոշում։",
      process_title: "Ինչպես է Աշխատում",
      step1_label: "Ձևավոր",
      step1_desc: "Օգտագործեք կոնֆիգուրատորը՝ ընտրելու համ, լցոնումներ ու զարդարանք։",
      step2_label: "Հաստատեք",
      step2_desc: "Ուղարկեք ձեր դիզայնը Instagram-ի կամ էլ. փոստի միջոցով, մենք կհաստատենք մանրամասները։",
      step3_label: "Ստեղծում",
      step3_desc: "Մեր վարպետները ձեր տորթը կպատրաստեն եւ կառաքեն ձեր ընտրած ամսաթվին։",
      step4_label: "Առաքում",
      step4_desc: "Նույն օրը առաքում եզակի նվերի տուփով։",
      cta: "Սկսեք Ձեր Տորթի Ձևավորումը",
      badge_stars: "Աստղ",
    },
    configurator: {
      title: "Ձևավորեք Ձեր Տորթը",
      subtitle: "Ընտրեք շերտ առ շերտ",
      layers: "Շերտեր",
      size: "Չափ",
      shape: "Ձև",
      tiers: "Հարկ",
      sponge: "Բիսկվիտի Համ",
      fillings: "Լցոնումներ",
      fillingsHint: "Ընտրեք մինչև 3",
      frosting: "Ծածկույթ",
      toppings: "Զարդարանք",
      message: "Ձեր Մաղթանքը",
      messagePlaceholder: "Օր.՝ Շնորհավոր Ծնունդդ...",
      date: "Ամսաթիվ",
      cutView: "Կտրվածք",
      view3d: "3D Տեսք",
      pause: "Դադար",
      rotate: "Պտտել",
      included: "Ներառված",
      order: "Պատվիրել",
      summary: "Ամփոփ",
      total: "Ընդամենը",
      serves: "Չափաբաժին",
      people: "հոգ.",
      tier: "Հարկ",
      tiers_word: "Հարկ",
      font: "Տառատեսակ",
      instagram_note: "Ձեր պատվերը կհաստատվի Instagram DM @anare_cake-ի միջոցով",
    },
    price: {
      base: "Հիմք", sponge: "Բիսկվիտ", fillings: "Լցոնումներ",
      frosting: "Ծածկույթ", toppings: "Զարդարանք", extra_tiers: "Լրաց. Հարկ", total: "Ընդամենը",
    },
    checkout: {
      title: "Ձևակերպեք Պատվերը",
      subtitle: "Վճարեք անվտանգ, ստացեք ձեր ցանկությամբ",
      back: "← Վերադառնալ",
      contact_title: "Կապի Տվյալներ",
      name: "Անուն Ազգանուն",
      namePlaceholder: "Օր.՝ Անի Սարգսյան",
      phone: "Հեռախոս",
      phonePlaceholder: "+374 XX XXX XXX",
      email: "Էլ. Փոստ",
      emailPlaceholder: "your@email.com",
      delivery_title: "Առաքման Հասցե",
      address: "Հասցե",
      addressPlaceholder: "Մուտքագրեք ձեր հասցեն",
      map_hint: "Ընտրեք հասցեն քարտեզի վրա",
      map_click_hint: "Սեղմեք քարտեզի վրա՝ հասցեն ընտրելու համար",
      payment_title: "Վճարման Եղանակ",
      pay_card: "Բանկային Քարտ",
      pay_gpay: "Google Pay",
      pay_applepay: "Apple Pay",
      card_number: "Քարտի Համար",
      card_expiry: "Վավ. Ժամկ.",
      card_cvv: "CVV",
      card_name: "Քարտատիրոջ Անուն",
      card_namePlaceholder: "Ինչպես քարտի վրա",
      place_order: "Վճարել և Պատվիրել",
      processing: "Մշակվում է...",
      order_summary: "Պատվերի Ամփոփ",
      serves_label: "Չափաբաժին",
      success_title: "Պատվերը Ընդունված է",
      success_desc: "Շնորհակալություն։ Մենք կհաղորդակցվենք ձեզ հետ Instagram DM-ի կամ էլ. փոստի միջոցով՝ հաստատելու համար։",
      success_ref: "Պատվերի համար",
      error_required: "Լրացրեք բոլոր դաշտերը",
      note: "Ձեր պատվերը կհաստատվի Instagram DM @anare_cake-ի կամ էլ. փոստի միջոցով",
    },
    toppings_section: {
      badge: "Զարդարանք",
      title: "Ընտրեք Ձեր Զարդերը",
      subtitle: "Պրեմիում հավելյալ զարդարանք ձեր տորթի համար",
      pos_top: "Վերևում",
      pos_side: "Կողքին",
      pos_drip: "Կաթիլ",
    },
    menu: {
      badge: "Մեր Հավաքածուն",
      title: "Բոլոր Տորթերը",
      subtitle: "Ընտրեք ձեր կատարյալ տորթը — կամ ձևավորեք ձեր սեփականը",
      all: "Բոլորը",
      bestseller: "Ամենավաճառ",
      premium: "Պրեմիում",
      signature: "Հեղինակային",
      seasonal: "Սեզոնային",
      from: "Սկսած",
      order: "Պատվիրել",
      customise: "Հարմարեցնել →",
      count: "տորթ",
    },
    seasonal: {
      badge: "Գարնանային Հավաքածու 2026",
      title: "Ծաղկող Համերի",
      subtitle: "Բացառիկ սեզոնային տորթեր թարմ գարնանային բաղադրիչներով",
      dates: "Մարտ – Մայիս 2026",
      cta: "Տեսնել Հավաքածուն",
      item1_name: "Բալի Ծաղիկ Մաչա",
      item1_desc: "Մաչայի բիսկվիտ, բալի ծաղկի կրեմ, յուզու",
      item2_name: "Ելակ Լավանդա",
      item2_desc: "Ելակի բիսկվիտ, լավանդայի մուս, մեղրի կրեմ",
      item3_name: "Կիտրոն Բզեզ",
      item3_desc: "Կիտրոնի բիսկվիտ, բզեզ-ծաղիկ կրեմ, ռոզ.",
    },
    footer: {
      tagline: "Սիրով ամեն շերտում",
      description: "Ձեռագործ շքեղ տորթեր ձեր ամենաթանկ պահերի համար — ձևավորված ձեր կողմից, կատարելագործված մեր կողմից։",
      explore: "Ուսումնասիրել",
      order: "Պատվիրել",
      link_home: "Գլխավոր",
      link_cakes: "Տորթեր",
      link_design: "Ձևավորեք",
      link_story: "Մեր Պատմությունը",
      link_contact: "Կապ",
      link_faq: "ՀՏՀ",
      link_delivery: "Առաքում",
      link_weddings: "Հարսանիք",
      rights: "Բոլոր իրավունքները պաշտպանված են։",
      madeWith: "Պատրաստված սիրով ու կարագով",
    },
  },

  // ─── ENGLISH ───────────────────────────────────────────────────────────────
  en: {
    nav: {
      home: "Home", cakes: "Our Cakes", design: "Design Yours",
      story: "Our Story", contact: "Contact",
    },
    hero: {
      badge: "Bespoke Pastry Art",
      title1: "Every Cake",
      title2: "Tells a Story",
      subtitle: "Handcrafted luxury cakes for your most cherished moments",
      cta: "Design Your Cake",
      explore: "Explore Collection",
      stat_cakes: "Cakes Crafted",
      stat_natural: "Natural Ingredients",
      stat_rating: "Customer Rating",
    },
    featured: {
      badge: "Our Collection",
      title1: "Featured",
      title2: "Creations",
      subtitle: "Each cake is an original — crafted in small batches with seasonal ingredients",
      tag_bestseller: "Bestseller",
      tag_premium: "Premium",
      tag_signature: "Signature",
      tag_seasonal: "Seasonal",
      customise: "Customise →",
      viewAll: "View Full Collection",
    },
    about: {
      badge: "Our Story",
      title1: "Born from a",
      title2: "Passion",
      title3: "for Beautiful Things",
      p1: "Anare Cake was founded with a simple belief: a truly special cake should taste as extraordinary as it looks.",
      p2: "We work exclusively with bespoke orders — because the best cakes are the ones designed around you.",
      val1_title: "Natural Ingredients",
      val1_desc: "Every sponge, cream and filling starts with premium, locally-sourced ingredients.",
      val2_title: "Artisan Craft",
      val2_desc: "Each cake is hand-decorated — no moulds, no shortcuts, just skill and patience.",
      val3_title: "Personal Touch",
      val3_desc: "From the first consultation to final delivery, your vision guides every decision.",
      process_title: "How It Works",
      step1_label: "Design",
      step1_desc: "Use our configurator to choose flavours, fillings & decorations.",
      step2_label: "Consult",
      step2_desc: "We review your design and confirm details via Instagram or email.",
      step3_label: "Create",
      step3_desc: "Our pastry artists handcraft your cake fresh on your chosen date.",
      step4_label: "Deliver",
      step4_desc: "Same-day delivery in a bespoke keepsake box.",
      cta: "Start Designing Your Cake",
      badge_stars: "Stars",
    },
    configurator: {
      title: "Design Your Cake",
      subtitle: "Choose layer by layer",
      layers: "Layers",
      size: "Size",
      shape: "Shape",
      tiers: "Tiers",
      sponge: "Sponge Flavour",
      fillings: "Fillings",
      fillingsHint: "Choose up to 3",
      frosting: "Frosting",
      toppings: "Decorations",
      message: "Dedication Message",
      messagePlaceholder: "e.g. Happy Birthday...",
      date: "Serving Date",
      cutView: "Cut View",
      view3d: "3D View",
      pause: "Pause",
      rotate: "Rotate",
      included: "Included",
      order: "Place Order",
      summary: "Summary",
      total: "Total",
      serves: "Serves",
      people: "ppl",
      tier: "Tier",
      tiers_word: "Tiers",
      font: "Message Font",
      instagram_note: "Your order will be confirmed via Instagram DM @anare_cake",
    },
    price: {
      base: "Base", sponge: "Sponge", fillings: "Fillings",
      frosting: "Frosting", toppings: "Toppings", extra_tiers: "Extra Tiers", total: "Total",
    },
    checkout: {
      title: "Place Your Order",
      subtitle: "Pay securely, receive your dream cake",
      back: "← Back",
      contact_title: "Contact Details",
      name: "Full Name",
      namePlaceholder: "e.g. Ani Sargsyan",
      phone: "Phone",
      phonePlaceholder: "+374 XX XXX XXX",
      email: "Email",
      emailPlaceholder: "your@email.com",
      delivery_title: "Delivery Address",
      address: "Address",
      addressPlaceholder: "Enter your address",
      map_hint: "Select address on map",
      map_click_hint: "Click on the map to select your delivery address",
      payment_title: "Payment Method",
      pay_card: "Bank Card",
      pay_gpay: "Google Pay",
      pay_applepay: "Apple Pay",
      card_number: "Card Number",
      card_expiry: "Expiry",
      card_cvv: "CVV",
      card_name: "Cardholder Name",
      card_namePlaceholder: "As on card",
      place_order: "Pay & Place Order",
      processing: "Processing...",
      order_summary: "Order Summary",
      serves_label: "Serves",
      success_title: "Order Received",
      success_desc: "Thank you! We will contact you via Instagram DM or email to confirm your order.",
      success_ref: "Order reference",
      error_required: "Please fill in all required fields",
      note: "Your order will be confirmed via Instagram DM @anare_cake or email",
    },
    toppings_section: {
      badge: "Decorations",
      title: "Crown Your Cake",
      subtitle: "Premium finishing touches that make every cake unforgettable",
      pos_top: "Top",
      pos_side: "Side",
      pos_drip: "Drip",
    },
    menu: {
      badge: "Our Collection",
      title: "All Cakes",
      subtitle: "Choose your perfect cake — or design your own from scratch",
      all: "All",
      bestseller: "Bestseller",
      premium: "Premium",
      signature: "Signature",
      seasonal: "Seasonal",
      from: "From",
      order: "Order Now",
      customise: "Customise →",
      count: "cakes",
    },
    seasonal: {
      badge: "Spring Collection 2026",
      title: "Flavours in Bloom",
      subtitle: "Limited edition cakes made with the freshest spring ingredients",
      dates: "March – May 2026",
      cta: "Shop Spring Collection",
      item1_name: "Cherry Blossom Matcha",
      item1_desc: "Matcha sponge, cherry blossom cream, yuzu curd",
      item2_name: "Strawberry Lavender",
      item2_desc: "Strawberry sponge, lavender mousse, honey cream",
      item3_name: "Lemon Elderflower",
      item3_desc: "Lemon sponge, elderflower cream, rose water glaze",
    },
    footer: {
      tagline: "Made with love in every layer",
      description: "Handcrafted luxury cakes made to celebrate your most cherished moments — designed by you, perfected by us.",
      explore: "Explore",
      order: "Order",
      link_home: "Home",
      link_cakes: "Our Cakes",
      link_design: "Design Yours",
      link_story: "Our Story",
      link_contact: "Contact",
      link_faq: "FAQ",
      link_delivery: "Delivery Info",
      link_weddings: "Weddings",
      rights: "All rights reserved.",
      madeWith: "Made with love & butter",
    },
  },

  // ─── RUSSIAN ───────────────────────────────────────────────────────────────
  ru: {
    nav: {
      home: "Главная", cakes: "Торты", design: "Создать",
      story: "О нас", contact: "Контакт",
    },
    hero: {
      badge: "Авторские Торты на Заказ",
      title1: "Каждый Торт",
      title2: "Рассказывает Историю",
      subtitle: "Торты ручной работы для самых особенных моментов",
      cta: "Создать Торт",
      explore: "Смотреть Коллекцию",
      stat_cakes: "Тортов Создано",
      stat_natural: "Натуральные Ингред.",
      stat_rating: "Рейтинг Клиентов",
    },
    featured: {
      badge: "Наша Коллекция",
      title1: "Избранные",
      title2: "Работы",
      subtitle: "Каждый торт — авторский, из сезонных ингредиентов небольшими партиями",
      tag_bestseller: "Хит продаж",
      tag_premium: "Премиум",
      tag_signature: "Фирменный",
      tag_seasonal: "Сезонный",
      customise: "Настроить →",
      viewAll: "Смотреть всю коллекцию",
    },
    about: {
      badge: "Наша История",
      title1: "Рождено из",
      title2: "Страсти",
      title3: "к Прекрасному",
      p1: "Anare Cake основана с простой идеей: по-настоящему особенный торт должен быть таким же удивительным на вкус, каким выглядит.",
      p2: "Мы работаем исключительно на заказ — потому что лучшие торты создаются специально для вас.",
      val1_title: "Натур. Ингред.",
      val1_desc: "Каждый бисквит, крем и начинка — из отборных местных продуктов.",
      val2_title: "Авторский Декор",
      val2_desc: "Каждый торт украшается вручную — никаких форм, только мастерство.",
      val3_title: "Личный Подход",
      val3_desc: "От первой консультации до доставки — ваше видение в центре всего.",
      process_title: "Как это работает",
      step1_label: "Дизайн",
      step1_desc: "Используйте конфигуратор для выбора вкуса, начинок и украшений.",
      step2_label: "Конс.",
      step2_desc: "Мы согласуем детали через Instagram или email.",
      step3_label: "Созд.",
      step3_desc: "Наши кондитеры изготовят торт свежим к выбранной дате.",
      step4_label: "Дост.",
      step4_desc: "Доставка в день заказа в фирменной подарочной коробке.",
      cta: "Начать Создание Торта",
      badge_stars: "Звёзд",
    },
    configurator: {
      title: "Создайте Свой Торт",
      subtitle: "Выбирайте слой за слоем",
      layers: "Слои",
      size: "Размер",
      shape: "Форма",
      tiers: "Ярусы",
      sponge: "Вкус Бисквита",
      fillings: "Начинки",
      fillingsHint: "Выберите до 3",
      frosting: "Покрытие",
      toppings: "Украшения",
      message: "Надпись на Торте",
      messagePlaceholder: "Напр.: С Днём Рождения...",
      date: "Дата Подачи",
      cutView: "Разрез",
      view3d: "3D Вид",
      pause: "Пауза",
      rotate: "Вращать",
      included: "Включено",
      order: "Оформить Заказ",
      summary: "Итого",
      total: "Итого",
      serves: "Порций",
      people: "чел.",
      tier: "Ярус",
      tiers_word: "Яруса",
      font: "Шрифт Надписи",
      instagram_note: "Заказ подтверждается через Instagram DM @anare_cake",
    },
    price: {
      base: "База", sponge: "Бисквит", fillings: "Начинки",
      frosting: "Покрытие", toppings: "Украшения", extra_tiers: "Доп. ярусы", total: "Итого",
    },
    checkout: {
      title: "Оформление Заказа",
      subtitle: "Безопасная оплата, доставка по вашему адресу",
      back: "← Назад",
      contact_title: "Контактные Данные",
      name: "Имя Фамилия",
      namePlaceholder: "Напр.: Ани Саргсян",
      phone: "Телефон",
      phonePlaceholder: "+374 XX XXX XXX",
      email: "Эл. Почта",
      emailPlaceholder: "your@email.com",
      delivery_title: "Адрес Доставки",
      address: "Адрес",
      addressPlaceholder: "Введите ваш адрес",
      map_hint: "Выберите адрес на карте",
      map_click_hint: "Нажмите на карту для выбора адреса доставки",
      payment_title: "Способ Оплаты",
      pay_card: "Банковская Карта",
      pay_gpay: "Google Pay",
      pay_applepay: "Apple Pay",
      card_number: "Номер Карты",
      card_expiry: "Срок",
      card_cvv: "CVV",
      card_name: "Имя на Карте",
      card_namePlaceholder: "Как на карте",
      place_order: "Оплатить и Заказать",
      processing: "Обработка...",
      order_summary: "Итог Заказа",
      serves_label: "Порций",
      success_title: "Заказ Принят",
      success_desc: "Спасибо! Мы свяжемся с вами через Instagram DM или email для подтверждения.",
      success_ref: "Номер заказа",
      error_required: "Заполните все обязательные поля",
      note: "Заказ подтверждается через Instagram DM @anare_cake или email",
    },
    toppings_section: {
      badge: "Украшения",
      title: "Украсьте Ваш Торт",
      subtitle: "Премиальные украшения, которые делают каждый торт незабываемым",
      pos_top: "Сверху",
      pos_side: "Сбоку",
      pos_drip: "Потёк",
    },
    menu: {
      badge: "Наша Коллекция",
      title: "Все Торты",
      subtitle: "Выберите идеальный торт — или создайте свой с нуля",
      all: "Все",
      bestseller: "Хиты продаж",
      premium: "Премиум",
      signature: "Фирменные",
      seasonal: "Сезонные",
      from: "От",
      order: "Заказать",
      customise: "Настроить →",
      count: "торта",
    },
    seasonal: {
      badge: "Весенняя Коллекция 2026",
      title: "Вкусы в Цвету",
      subtitle: "Лимитированные торты из самых свежих весенних ингредиентов",
      dates: "Март – Май 2026",
      cta: "Весенняя Коллекция",
      item1_name: "Сакура Матча",
      item1_desc: "Бисквит матча, крем из цветов вишни, юдзу курд",
      item2_name: "Клубника и Лаванда",
      item2_desc: "Клубничный бисквит, мусс из лаванды, медовый крем",
      item3_name: "Лимон Бузина",
      item3_desc: "Лимонный бисквит, крем из бузины, глазурь с розовой водой",
    },
    footer: {
      tagline: "С любовью в каждом слое",
      description: "Торты ручной работы для самых особенных моментов — созданные вами, доведённые до совершенства нами.",
      explore: "Каталог",
      order: "Заказать",
      link_home: "Главная",
      link_cakes: "Торты",
      link_design: "Создать",
      link_story: "О нас",
      link_contact: "Контакт",
      link_faq: "Вопросы",
      link_delivery: "Доставка",
      link_weddings: "Свадьбы",
      rights: "Все права защищены.",
      madeWith: "Сделано с любовью и маслом",
    },
  },
};

// ─── Context ──────────────────────────────────────────────────────────────────
interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: UIStrings;
  tl: (label: I18nLabel) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("hy");
  const value: I18nContextValue = {
    locale,
    setLocale,
    t: STRINGS[locale],
    tl: (label) => label[locale],
  };
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
