export const siteConfig = {
  name: 'ДЕНЬ',
  tagline: 'Городское кафе',
  city: '',
  address: '',
  phone: '',
  email: '',
  bookingUrl: '',
  currency: '₽',
  demoNote: 'Демонстрационный проект студии. Меню и цены приведены как пример.',
  hours: [
    { days: 'Пн — Пт', time: '' },
    { days: 'Сб — Вс', time: '' },
  ],
  social: { instagram: '', telegram: '', vk: '' },
} as const;

export type MenuCategory = 'Всё меню' | 'Завтраки' | 'Основное' | 'Выпечка' | 'Напитки';
export type Diet = 'Растительное' | 'Без глютена';
export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Exclude<MenuCategory, 'Всё меню'>;
  mark?: string;
  diets?: Diet[];
  note?: string;
};

export const menu: MenuItem[] = [
  { id: 'eggs', name: 'Яйца на тосте', description: 'Два яйца, хлеб на закваске, авокадо, зелёный соус.', price: 590, category: 'Завтраки', mark: 'любимое', note: 'Яйца, пшеница, молоко' },
  { id: 'porridge', name: 'Тёплая каша', description: 'Овсянка на выбор, печёная груша, орехи и мёд.', price: 420, category: 'Завтраки', diets: ['Растительное'], note: 'Овёс, орехи' },
  { id: 'syrniki', name: 'Сырники с кремом', description: 'Творожные, с вишней и густой сметаной.', price: 510, category: 'Завтраки', note: 'Молоко, яйцо, пшеница' },
  { id: 'bowl', name: 'Зелёная тарелка', description: 'Запечённая тыква, киноа, хумус, травы, семечки.', price: 640, category: 'Основное', diets: ['Растительное', 'Без глютена'], mark: 'растительное' },
  { id: 'chicken', name: 'Курица и полба', description: 'Томлёная курица, полба, соус из печёного перца.', price: 720, category: 'Основное', note: 'Пшеница' },
  { id: 'soup', name: 'Суп дня', description: 'Густой сезонный суп с хлебом на закваске.', price: 460, category: 'Основное', mark: 'сезонное', note: 'Зависит от состава дня' },
  { id: 'croissant', name: 'Круассан', description: 'Слоёное тесто, сливочное масло, выпекаем утром.', price: 240, category: 'Выпечка', note: 'Пшеница, молоко' },
  { id: 'bun', name: 'Булочка с корицей', description: 'Мягкая, тёплая, с коричной глазурью.', price: 290, category: 'Выпечка', mark: 'из печи', note: 'Пшеница, молоко, яйцо' },
  { id: 'filter', name: 'Фильтр-кофе', description: 'Светлая обжарка, сорт дня. Можно со льдом.', price: 250, category: 'Напитки', diets: ['Растительное', 'Без глютена'] },
  { id: 'cocoa', name: 'Какао', description: 'Натуральный какао-порошок, молоко или растительная основа.', price: 320, category: 'Напитки', note: 'Молоко по умолчанию' },
];

export const categories: MenuCategory[] = ['Всё меню', 'Завтраки', 'Основное', 'Выпечка', 'Напитки'];
