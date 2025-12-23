
import { Product, Category } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'MacBook Pro 14" M3',
    description: 'Apple-ning eng kuchli ixcham noutbuki. Professional ishlar uchun maxsus.',
    price: 1999,
    category: Category.LAPTOPS,
    image: 'https://picsum.photos/seed/mac/600/400',
    specs: ['Apple M3 Pro', '16GB RAM', '512GB SSD', 'Liquid Retina XDR']
  },
  {
    id: '2',
    name: 'ROG Strix G16',
    description: 'O\'yin olamidagi haqiqiy hayvon. Har qanday o\'yinni ultra nastroykada tortadi.',
    price: 1450,
    category: Category.GAMING,
    image: 'https://picsum.photos/seed/rog/600/400',
    specs: ['RTX 4060', 'Intel i7-13650HX', '16GB DDR5', '165Hz Display']
  },
  {
    id: '3',
    name: 'Custom Desktop PC - Ultra',
    description: 'Ofis va render uchun mukammal yechim. Sifat va tezlik uyg\'unligi.',
    price: 890,
    category: Category.DESKTOPS,
    image: 'https://picsum.photos/seed/pc/600/400',
    specs: ['Ryzen 7 5700G', '32GB RAM', '1TB NVMe', 'RGB Case']
  },
  {
    id: '4',
    name: 'Keychron K2 V2',
    description: 'Mexanik klaviatura ishqibozlari uchun eng yaxshi tanlov.',
    price: 95,
    category: Category.ACCESSORIES,
    image: 'https://picsum.photos/seed/key/600/400',
    specs: ['Mechanical Brown', 'Wireless/Wired', 'RGB Backlight']
  },
  {
    id: '5',
    name: 'Logitech G Pro X Superlight',
    description: 'Dunyodagi eng yengil va aniq geymer sichqonchasi.',
    price: 130,
    category: Category.ACCESSORIES,
    image: 'https://picsum.photos/seed/mouse/600/400',
    specs: ['HERO 25K Sensor', '63g Weight', 'Wireless']
  },
  {
    id: '6',
    name: 'Dell XPS 13 Plus',
    description: 'Elegantlik va quvvat bir joyda. Windows olamidagi MacBook raqobatchisi.',
    price: 1299,
    category: Category.LAPTOPS,
    image: 'https://picsum.photos/seed/dell/600/400',
    specs: ['Intel i7-1360P', '16GB RAM', '512GB SSD', 'OLED Touch']
  }
];
