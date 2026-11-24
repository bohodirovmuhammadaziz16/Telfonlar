export const USD_TO_UZS = 12800;

export const PHONE_CATALOG = [
  {
    id: 'iphone-16-pro-max',
    brand: 'Apple',
    category: 'Apple',
    name: 'iPhone 16 Pro Max',
    tagline: 'Grade 5 titan korpus, A18 Pro chip va 5x optik zumli pro kamera tizimi.',
    sketchfabUid: '41a071ae12794b668502f58d1e0fd1a3',
    sketchfabUrl: 'https://sketchfab.com/3d-models/iphone-16-pro-max-41a071ae12794b668502f58d1e0fd1a3',
    image: '/src/assets/images/phone_iphone_16_pro_max_1795518246668.jpg',
    basePriceUsd: 1299,
    colors: [
      { id: 'desert', name: "Cho'l Titani", hex: '#C2A886', rgb: '194, 168, 134' },
      { id: 'natural', name: 'Tabiiy Titan', hex: '#A5A29C', rgb: '165, 162, 156' },
      { id: 'black', name: 'Qora Titan', hex: '#26282D', rgb: '110, 122, 142' },
      { id: 'white', name: 'Oq Titan', hex: '#E9EAEC', rgb: '214, 220, 232' }
    ],
    storages: [
      { id: '256', label: '256 GB · 8 GB RAM', short: '256 GB', deltaUsd: 0 },
      { id: '512', label: '512 GB · 8 GB RAM', short: '512 GB', deltaUsd: 200 },
      { id: '1024', label: '1 TB · 8 GB RAM', short: '1 TB', deltaUsd: 400 }
    ],
    sims: [
      { id: 'global-esim', label: 'Global (eSIM + Nano)', sub: 'IMEI ro‘yxatdan o‘tgan', deltaUsd: 0 },
      { id: 'dual-sim', label: 'Dual Physical SIM', sub: '2 ta fizik SIM karta', deltaUsd: 35 }
    ],
    bundles: [
      { id: 'standard', label: 'Standart qadoq', sub: 'Kabel + 1 yil kafolat', deltaUsd: 0 },
      { id: 'pro-pack', label: 'Pro himoya to‘plami', sub: '+ MagSafe g‘ilof va shisha', deltaUsd: 35 }
    ],
    specs: {
      Displey: '6.9" Super Retina XDR LTPO OLED · 120 Hz',
      Protsessor: 'Apple A18 Pro (3 nm, 6-yadro)',
      Kamera: '48 MP Asosiy + 48 MP Keng + 12 MP 5x Periskop',
      OldKamera: '12 MP TrueDepth · 4K 120fps Dolby Vision',
      Batareya: '4685 mAh · 25W MagSafe va tezkor quvvatlash',
      Korpus: 'Grade 5 Titan · Ceramic Shield · IP68',
      Vazn: '227 g · USB-C 3.2 Gen 2'
    }
  },
  {
    id: 'galaxy-s25-ultra',
    brand: 'Samsung',
    category: 'Samsung',
    name: 'Samsung Galaxy S25 Ultra',
    tagline: 'Yangi avlod Galaxy AI, 200 MP kamera va o‘ta yengil titan ramka.',
    sketchfabUid: 'db03971b59004f4489208eef033dfdbe',
    sketchfabUrl: 'https://sketchfab.com/3d-models/samsung-galaxy-s25-ultra-v1-db03971b59004f4489208eef033dfdbe',
    image: '/src/assets/images/phone_galaxy_s25_ultra_1795518248327.jpg',
    basePriceUsd: 1249,
    colors: [
      { id: 'silverblue', name: 'Kumush Ko‘k Titan', hex: '#4B6D9B', rgb: '75, 109, 155' },
      { id: 'titangray', name: 'Kulrang Titan', hex: '#8F9196', rgb: '143, 145, 150' },
      { id: 'titanblack', name: 'Qora Titan', hex: '#1F2329', rgb: '95, 108, 128' },
      { id: 'emerald', name: 'Zumrad Yashil', hex: '#3E6B5C', rgb: '62, 107, 92' }
    ],
    storages: [
      { id: '256', label: '256 GB · 12 GB RAM', short: '256 GB', deltaUsd: 0 },
      { id: '512', label: '512 GB · 12 GB RAM', short: '512 GB', deltaUsd: 140 },
      { id: '1024', label: '1 TB · 16 GB RAM', short: '1 TB', deltaUsd: 340 }
    ],
    sims: [
      { id: 'global-esim', label: '2x Nano SIM + eSIM', sub: 'IMEI ro‘yxatdan o‘tgan', deltaUsd: 0 },
      { id: 'korea-pro', label: 'Global Unlocked', sub: 'Barcha tarmoqlar (5G)', deltaUsd: 0 }
    ],
    bundles: [
      { id: 'standard', label: 'Standart qadoq', sub: 'S-Pen + Kabel + Kafolat', deltaUsd: 0 },
      { id: 'pro-pack', label: 'Ultra himoya to‘plami', sub: '+ 45W Adapter va g‘ilof', deltaUsd: 40 }
    ],
    specs: {
      Displey: '6.9" Dynamic AMOLED 2X · 2600 nit · 120 Hz',
      Protsessor: 'Snapdragon 8 Elite for Galaxy (3 nm)',
      Kamera: '200 MP + 50 MP Keng + 50 MP 5x + 10 MP 3x',
      OldKamera: '12 MP Dual Pixel AF · 4K 60fps',
      Batareya: '5000 mAh · 45W tezkor simli quvvatlash',
      Korpus: 'Titan ramka · Gorilla Armor 2 · S-Pen',
      Vazn: '218 g · IP68 suv va changdan himoya'
    }
  },
  {
    id: 'iphone-15-pro-max',
    brand: 'Apple',
    category: 'Apple',
    name: 'iPhone 15 Pro Max',
    tagline: 'Professional mobil video suratga olish va titan yengilligidagi klassik flagman.',
    sketchfabUid: 'df17520841214c1792fb8a44c6783ee7',
    sketchfabUrl: 'https://sketchfab.com/3d-models/apple-iphone-15-pro-max-black-df17520841214c1792fb8a44c6783ee7',
    image: '/src/assets/images/phone_iphone_15_pro_max_v2_1795519510254.jpg',
    basePriceUsd: 1099,
    colors: [
      { id: 'black-ti', name: 'Qora Titan', hex: '#2B2D32', rgb: '105, 118, 138' },
      { id: 'blue-ti', name: 'Ko‘k Titan', hex: '#2E3D52', rgb: '68, 102, 152' },
      { id: 'natural-ti', name: 'Tabiiy Titan', hex: '#ACA89E', rgb: '172, 168, 158' },
      { id: 'white-ti', name: 'Oq Titan', hex: '#ECECEE', rgb: '215, 220, 228' }
    ],
    storages: [
      { id: '256', label: '256 GB · 8 GB RAM', short: '256 GB', deltaUsd: 0 },
      { id: '512', label: '512 GB · 8 GB RAM', short: '512 GB', deltaUsd: 180 },
      { id: '1024', label: '1 TB · 8 GB RAM', short: '1 TB', deltaUsd: 350 }
    ],
    sims: [
      { id: 'global-esim', label: 'Global (eSIM + Nano)', sub: 'IMEI ro‘yxatdan o‘tgan', deltaUsd: 0 },
      { id: 'dual-sim', label: 'Dual Physical SIM', sub: '2 ta fizik SIM karta', deltaUsd: 25 }
    ],
    bundles: [
      { id: 'standard', label: 'Standart qadoq', sub: 'USB-C kabel + Kafolat', deltaUsd: 0 },
      { id: 'pro-pack', label: 'Pro himoya to‘plami', sub: '+ MagSafe g‘ilof va shisha', deltaUsd: 30 }
    ],
    specs: {
      Displey: '6.7" Super Retina XDR ProMotion · 120 Hz',
      Protsessor: 'Apple A17 Pro (3 nm, Ray Tracing)',
      Kamera: '48 MP + 12 MP Keng + 12 MP 5x Tetraprizma',
      OldKamera: '12 MP TrueDepth · ProRes Log',
      Batareya: '4441 mAh · 29 soatgacha video',
      Korpus: 'Aero-titan ramka · Action tugmasi · IP68',
      Vazn: '221 g · USB-C 10 Gb/s'
    }
  },
  {
    id: 'galaxy-s24-ultra',
    brand: 'Samsung',
    category: 'Samsung',
    name: 'Samsung Galaxy S24 Ultra',
    tagline: 'O‘rnatilgan S-Pen, aks ettirmaydigan ekran va 100x Space Zoom.',
    sketchfabUid: '1e8fecdb2a1849ec8dad382b73bd39d1',
    sketchfabUrl: 'https://sketchfab.com/3d-models/galaxy-s24-ultra-20-1e8fecdb2a1849ec8dad382b73bd39d1',
    image: '/src/assets/images/phone_galaxy_s24_ultra_1795518247743.jpg',
    basePriceUsd: 989,
    colors: [
      { id: 'gray', name: 'Kulrang Titan', hex: '#7D7B76', rgb: '150, 148, 142' },
      { id: 'violet', name: 'Binafsha Titan', hex: '#554E69', rgb: '115, 102, 152' },
      { id: 'yellow', name: 'Sariq Titan', hex: '#D8C998', rgb: '216, 201, 152' },
      { id: 'black', name: 'Qora Titan', hex: '#232428', rgb: '95, 102, 118' }
    ],
    storages: [
      { id: '256', label: '256 GB · 12 GB RAM', short: '256 GB', deltaUsd: 0 },
      { id: '512', label: '512 GB · 12 GB RAM', short: '512 GB', deltaUsd: 120 },
      { id: '1024', label: '1 TB · 12 GB RAM', short: '1 TB', deltaUsd: 260 }
    ],
    sims: [
      { id: 'global-esim', label: '2x Nano SIM + eSIM', sub: 'IMEI ro‘yxatdan o‘tgan', deltaUsd: 0 },
      { id: 'single-esim', label: '1x SIM + eSIM', sub: 'Rasmiy Global', deltaUsd: 0 }
    ],
    bundles: [
      { id: 'standard', label: 'Standart qadoq', sub: 'S-Pen + Kabel + Kafolat', deltaUsd: 0 },
      { id: 'pro-pack', label: 'Ultra himoya to‘plami', sub: '+ 45W Adapter va g‘ilof', deltaUsd: 35 }
    ],
    specs: {
      Displey: '6.8" QHD+ Dynamic AMOLED 2X · Gorilla Armor',
      Protsessor: 'Snapdragon 8 Gen 3 for Galaxy',
      Kamera: '200 MP + 50 MP 5x + 10 MP 3x + 12 MP Keng',
      OldKamera: '12 MP Dual Pixel · Super HDR',
      Batareya: '5000 mAh · 45W Super Fast Charging',
      Korpus: 'Titan korpus · S-Pen · IP68',
      Vazn: '232 g · Tekis ekran'
    }
  },
  {
    id: 'galaxy-z-fold-5',
    brand: 'Samsung',
    category: 'Bukiladigan',
    name: 'Samsung Galaxy Z Fold 5',
    tagline: 'Cho‘ntakdagi 7.6 dyuymli planshet, Flex Hinge va ko‘p oynali unumdorlik.',
    sketchfabUid: '87ea3eff834a49b992591cd086d20310',
    sketchfabUrl: 'https://sketchfab.com/3d-models/samsung-galaxy-z-fold-5-20-87ea3eff834a49b992591cd086d20310',
    image: '/src/assets/images/phone_galaxy_z_fold_5_v2_1795519510324.jpg',
    basePriceUsd: 1180,
    colors: [
      { id: 'phantom', name: 'Fantom Qora', hex: '#1E2024', rgb: '90, 102, 126' },
      { id: 'icyblue', name: 'Muz Ko‘k', hex: '#9FB6CA', rgb: '159, 182, 202' },
      { id: 'cream', name: 'Krem Oltin', hex: '#E6DFD3', rgb: '218, 206, 186' }
    ],
    storages: [
      { id: '256', label: '256 GB · 12 GB RAM', short: '256 GB', deltaUsd: 0 },
      { id: '512', label: '512 GB · 12 GB RAM', short: '512 GB', deltaUsd: 130 },
      { id: '1024', label: '1 TB · 12 GB RAM', short: '1 TB', deltaUsd: 280 }
    ],
    sims: [
      { id: 'global-esim', label: '2x Nano SIM + eSIM', sub: 'IMEI ro‘yxatdan o‘tgan', deltaUsd: 0 }
    ],
    bundles: [
      { id: 'standard', label: 'Standart qadoq', sub: 'Kabel + 1 yil kafolat', deltaUsd: 0 },
      { id: 'pro-pack', label: 'Fold S-Pen to‘plami', sub: '+ Slim S-Pen g‘ilof', deltaUsd: 55 }
    ],
    specs: {
      Displey: '7.6" Ichki Fold AMOLED + 6.2" Tashqi 120 Hz',
      Protsessor: 'Snapdragon 8 Gen 2 for Galaxy',
      Kamera: '50 MP Asosiy + 12 MP Keng + 10 MP 3x Zum',
      OldKamera: '10 MP Tashqi + 4 MP Ekran osti',
      Batareya: '4400 mAh · Dual batareya tizimi',
      Korpus: 'Armor Aluminum · Flex Hinge · IPX8',
      Vazn: '253 g · Bukilganda 13.4 mm'
    }
  },
  {
    id: 'galaxy-z-flip-3',
    brand: 'Samsung',
    category: 'Bukiladigan',
    name: 'Samsung Galaxy Z Flip',
    tagline: 'Ixcham bukiladigan dizayn, Flex Mode kamera va cho‘ntakbop qulaylik.',
    sketchfabUid: '112947cbab7a4f708d0d01adb7d3fa3d',
    sketchfabUrl: 'https://sketchfab.com/3d-models/samsung-galaxy-z-flip-3-112947cbab7a4f708d0d01adb7d3fa3d',
    image: '/src/assets/images/phone_galaxy_z_flip_3_1795518250307.jpg',
    basePriceUsd: 590,
    colors: [
      { id: 'lavender', name: 'Lavanda Binafsha', hex: '#C2B1D1', rgb: '194, 177, 209' },
      { id: 'cream', name: 'Krem Oq', hex: '#ECE5D3', rgb: '236, 229, 211' },
      { id: 'green', name: 'Zaytun Yashil', hex: '#3A4D43', rgb: '78, 122, 98' },
      { id: 'phantom', name: 'Fantom Qora', hex: '#23252A', rgb: '102, 112, 128' }
    ],
    storages: [
      { id: '128', label: '128 GB · 8 GB RAM', short: '128 GB', deltaUsd: 0 },
      { id: '256', label: '256 GB · 8 GB RAM', short: '256 GB', deltaUsd: 60 }
    ],
    sims: [
      { id: 'global-esim', label: 'Nano SIM + eSIM', sub: 'IMEI ro‘yxatdan o‘tgan', deltaUsd: 0 }
    ],
    bundles: [
      { id: 'standard', label: 'Standart qadoq', sub: 'Kabel + 1 yil kafolat', deltaUsd: 0 },
      { id: 'pro-pack', label: 'Ring g‘ilof to‘plami', sub: '+ Silikon halqali g‘ilof', deltaUsd: 25 }
    ],
    specs: {
      Displey: '6.7" Dynamic AMOLED 2X 120 Hz + 1.9" Tashqi',
      Protsessor: 'Snapdragon 888 5G (5 nm)',
      Kamera: '12 MP OIS Asosiy + 12 MP Ultra Keng',
      OldKamera: '10 MP Flex Mode selfi',
      Batareya: '3300 mAh · Simsiz va teskari quvvatlash',
      Korpus: 'Armor Aluminum · Gorilla Glass Victus · IPX8',
      Vazn: '183 g · Bukilganda 86.4 mm'
    }
  }
];
