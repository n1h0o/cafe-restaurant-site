import { useMemo, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Clock3, Coffee, Copy, Leaf, Menu as MenuIcon, Minus, Plus, X } from 'lucide-react';
import { categories, menu, siteConfig, type Diet, type MenuCategory } from './config';

const money = (value: number) => `${new Intl.NumberFormat('ru-RU').format(value)} ${siteConfig.currency}`;
const currentDate = new Date();
const today = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

function App() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('Всё меню');
  const [diet, setDiet] = useState<Diet | 'Все'>('Все');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'copied' | 'sent' | 'manual'>('idle');
  const [manualRequest, setManualRequest] = useState('');
  const [booking, setBooking] = useState({ name: '', phone: '', date: '', time: '10:00', guests: '2', note: '' });
  const [expanded, setExpanded] = useState<string | null>(null);

  const filteredMenu = useMemo(() => menu.filter((item) =>
    (activeCategory === 'Всё меню' || item.category === activeCategory) &&
    (diet === 'Все' || item.diets?.includes(diet)),
  ), [activeCategory, diet]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 3600);
  };

  const handleBooking = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '').trim();
    const phone = String(formData.get('phone') ?? '').trim();
    const dateValue = String(formData.get('date') ?? '');
    const time = String(formData.get('time') ?? '');
    const guests = String(formData.get('guests') ?? '2');
    const note = String(formData.get('note') ?? '').trim();
    const date = new Date(`${dateValue}T00:00:00`);
    if (!dateValue || Number.isNaN(date.getTime())) {
      showToast('Выбери корректную дату.');
      return;
    }
    const request = [
      `Запрос на столик — ${siteConfig.name}`,
      `Имя: ${name}`,
      `Телефон: ${phone}`,
      `Дата и время: ${new Intl.DateTimeFormat('ru-RU', { dateStyle: 'long' }).format(date)}, ${time}`,
      `Гостей: ${guests}`,
      note ? `Пожелание: ${note}` : '',
    ].filter(Boolean).join('\n');

    if (siteConfig.bookingUrl) {
      window.open(`${siteConfig.bookingUrl}${encodeURIComponent(request)}`, '_blank', 'noopener,noreferrer');
      setBookingStatus('sent');
      showToast('Запрос подготовлен — отправьте его в открывшемся мессенджере.');
      return;
    }
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
      await Promise.race([
        navigator.clipboard.writeText(request),
        new Promise<never>((_, reject) => window.setTimeout(() => reject(new Error('Clipboard timed out')), 1500)),
      ]);
      setManualRequest('');
      setBookingStatus('copied');
      showToast('Текст запроса скопирован. Его можно отправить выбранному заведению.');
    } catch {
      setManualRequest(request);
      setBookingStatus('manual');
      showToast('Запрос готов. Скопируй его из поля под формой.');
    }
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <a className="skip-link" href="#main">К содержимому</a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="ДЕНЬ — на главную"><span className="wordmark-mark">Д</span><span>ДЕНЬ<small>ГОРОДСКОЕ КАФЕ</small></span></a>
        <nav className="desktop-nav" aria-label="Основная навигация">
          <a href="#idea">О месте</a><a href="#menu">Меню</a><a href="#visit">Как найти</a>
        </nav>
        <a className="header-booking" href="#booking">Столик <ArrowUpRight size={16} aria-hidden="true" /></a>
        <button className="mobile-menu-button" type="button" aria-label={mobileOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => setMobileOpen((open) => !open)}>{mobileOpen ? <X /> : <MenuIcon />}</button>
      </header>
      {mobileOpen && <nav className="mobile-nav" id="mobile-navigation" aria-label="Мобильная навигация"><a href="#idea" onClick={closeMobile}>О месте</a><a href="#menu" onClick={closeMobile}>Меню</a><a href="#visit" onClick={closeMobile}>Как найти</a><a href="#booking" onClick={closeMobile}>Столик</a></nav>}
      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow"><span className="sun-dot" /> МЕСТО ДЛЯ СВОЕГО УТРА</div>
            <h1 id="hero-title">Не спеши.<br /><em>Ты уже</em><br />пришёл.</h1>
            <div className="hero-bottom"><p>Завтраки, выпечка и чашка, ради которой можно свернуть с привычного маршрута.</p><a className="round-link" href="#menu" aria-label="Перейти к меню"><ArrowDown size={19} /></a></div>
            <span className="hero-index">01 / 04</span>
          </div>
          <figure className="hero-visual"><img src="/images/brunch.webp" alt="Завтрак с яйцами, зеленью и свежим хлебом на солнечном столе" fetchPriority="high" /><figcaption><span>СЕЙЧАС НА СТОЛЕ</span><span>Яйца · тост · зелёный соус</span></figcaption><span className="hero-stamp">КАЖДЫЙ<br />ДЕНЬ</span></figure>
          <div className="hero-strip"><span>ЗАВТРАКИ ДО 14:00</span><span>МЕДЛЕННЫЕ УТРА · СВЕЖАЯ ВЫПЕЧКА</span><span>КОФЕ ВЕСЬ ДЕНЬ</span></div>
        </section>

        <section className="intro-section" id="idea">
          <div className="section-kicker"><span>01 — О МЕСТЕ</span><span>ХОРОШО ЗДЕСЬ</span></div>
          <div className="intro-grid"><h2>День становится<br /><em>чуть добрее.</em></h2><div className="intro-text"><p>«ДЕНЬ» — образ городского кафе, куда заходят без повода и остаются на ещё одну чашку. Утреннее меню, знакомая выпечка, сезонные блюда — простые вещи, сделанные с вниманием.</p><a className="text-link" href="#menu">Что сегодня в меню <ArrowRight size={16} /></a></div></div>
          <figure className="interior-photo"><img src="/images/interior.webp" alt="Тёплое солнечное кафе с деревянными столами и спокойным зелёным интерьером" loading="lazy" /><figcaption>ПРОСТРАНСТВО, ГДЕ МОЖНО ОСТАТЬСЯ</figcaption></figure>
          <div className="values-row"><span>01 <b>Готовим с утра</b></span><span>02 <b>Меняем меню по сезону</b></span><span>03 <b>Рады тихим планам</b></span></div>
        </section>

        <section className="menu-section" id="menu">
          <div className="section-kicker"><span>02 — МЕНЮ</span><span>ПРИМЕР МЕНЮ · ЦЕНЫ ДЕМО</span></div>
          <div className="menu-heading"><h2>Выбирай<br /><em>по настроению.</em></h2><p>Несколько знакомых любимых вещей и что-нибудь новое. Состав и цены в готовом сайте настраиваются под заведение.</p></div>
          <div className="menu-controls"><div className="category-tabs" role="group" aria-label="Категории меню">{categories.map((category) => <button type="button" key={category} className={activeCategory === category ? 'active' : ''} aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>{category}</button>)}</div><label className="diet-select"><Leaf size={15} aria-hidden="true" /><span className="sr-only">Фильтр питания</span><select value={diet} onChange={(event) => setDiet(event.target.value as Diet | 'Все')}><option value="Все">Все блюда</option><option value="Растительное">Растительные</option><option value="Без глютена">Без глютена</option></select></label></div>
          <div className="menu-layout"><div className="menu-photo-card"><img src="/images/pastry.webp" alt="Свежая выпечка к утреннему кофе" loading="lazy" /><span className="photo-card-label"><Coffee size={16} /> ИЗ ПЕЧИ КОФЕЙНЯ</span><p>Маленькая пауза<br /><em>посреди дня.</em></p></div><div className="menu-list" aria-live="polite">{filteredMenu.length ? filteredMenu.map((item, index) => <article className={`menu-item ${expanded === item.id ? 'expanded' : ''}`} key={item.id}><button className="menu-item-main" type="button" aria-expanded={expanded === item.id} onClick={() => setExpanded(expanded === item.id ? null : item.id)}><span className="menu-item-number">{String(index + 1).padStart(2, '0')}</span><span className="menu-item-copy"><span className="menu-item-name">{item.name}{item.mark && <small>{item.mark}</small>}</span><span className="menu-item-description">{item.description}</span></span><span className="menu-item-price">{money(item.price)}</span><span className="expand-icon" aria-hidden="true">{expanded === item.id ? <Minus size={16} /> : <Plus size={16} />}</span></button>{expanded === item.id && <div className="menu-item-detail">{item.note && <span>Состав и возможные аллергены: {item.note}. Уточняйте актуальную информацию у заведения.</span>}{item.diets?.includes('Растительное') && <span className="diet-badge"><Leaf size={13} /> Растительное</span>}{item.diets?.includes('Без глютена') && <span className="diet-badge"><Check size={13} /> Без глютена по составу</span>}</div>}</article>) : <p className="empty-menu">В этой категории пока нет позиций с выбранным фильтром. <button type="button" onClick={() => setDiet('Все')}>Показать всё меню</button></p>}</div></div>
          <p className="menu-disclaimer">Демонстрационное меню и цены показаны для примера. Аллергены и состав в реальном заведении следует проверить.</p>
        </section>

        <section className="feature-section" aria-labelledby="feature-title"><div className="feature-number">03 <span>— МАЛЕНЬКОЕ НАПОМИНАНИЕ</span></div><div className="feature-content"><span className="feature-label">БЕЗ ПОВОДА ТОЖЕ ПОВОД</span><h2 id="feature-title">Оставь<br />этот час<br /><em>себе.</em></h2><a className="feature-cta" href="#booking">Запланировать утро <ArrowUpRight size={18} /></a></div><div className="feature-aside"><p>Хороший кофе не торопится. Ты тоже можешь.</p><span className="feature-doodle" aria-hidden="true">✳</span></div></section>

        <section className="booking-section" id="booking">
          <div className="section-kicker"><span>04 — БРОНИРОВАНИЕ</span><span>НЕСКОЛЬКО ПРОСТЫХ ШАГОВ</span></div>
          <div className="booking-layout"><div className="booking-copy"><h2>Будем<br /><em>ждать.</em></h2><p>Оставь пожелание — подготовим сообщение для выбранного заведения. Запрос подтверждается самим кафе.</p><div className="booking-hours"><Clock3 size={18} /><div><b>Часы и адрес</b><span>{siteConfig.address || 'Добавляются владельцем заведения'}</span><span>{siteConfig.hours.map((row) => `${row.days}${row.time ? ` · ${row.time}` : ''}`).join(' / ')}</span></div></div></div><form className="booking-form" onSubmit={handleBooking}><label>Как к тебе обращаться<input autoComplete="name" name="name" required maxLength={80} value={booking.name} onChange={(event) => setBooking({ ...booking, name: event.target.value })} placeholder="Имя" /></label><label>Номер для связи<input autoComplete="tel" name="phone" required type="tel" pattern="(?=.*[0-9])[0-9+() .-]{7,32}" title="Укажи номер телефона с кодом страны" maxLength={32} value={booking.phone} onChange={(event) => setBooking({ ...booking, phone: event.target.value })} placeholder="+7 900 000-00-00" /></label><div className="form-pair"><label>Дата<input type="date" name="date" min={today} required value={booking.date} onChange={(event) => setBooking({ ...booking, date: event.target.value })} /></label><label>Время<select name="time" value={booking.time} onChange={(event) => setBooking({ ...booking, time: event.target.value })}>{Array.from({ length: 14 }, (_, index) => `${String(index + 9).padStart(2, '0')}:00`).map((time) => <option key={time}>{time}</option>)}</select></label></div><div className="guest-row"><span>Гостей</span><input type="hidden" name="guests" value={booking.guests} /><div className="guest-stepper"><button type="button" aria-label="Уменьшить количество гостей" disabled={booking.guests === '1'} onClick={() => setBooking({ ...booking, guests: String(Math.max(1, Number(booking.guests) - 1)) })}><Minus size={15} /></button><output aria-live="polite">{booking.guests}</output><button type="button" aria-label="Увеличить количество гостей" disabled={booking.guests === '12'} onClick={() => setBooking({ ...booking, guests: String(Math.min(12, Number(booking.guests) + 1)) })}><Plus size={15} /></button></div></div><label>Пожелание <span className="optional">необязательно</span><textarea name="note" rows={2} maxLength={250} value={booking.note} onChange={(event) => setBooking({ ...booking, note: event.target.value })} placeholder="Например, столик у окна" /></label><button className="submit-booking" type="submit">{bookingStatus === 'copied' ? <><Check size={17} /> Запрос скопирован</> : bookingStatus === 'sent' ? <>Открыть мессенджер <ArrowUpRight size={17} /></> : bookingStatus === 'manual' ? <>Запрос сформирован <Check size={17} /></> : <>Подготовить запрос <Copy size={16} /></>}</button>{manualRequest && <label className="request-output-label">Скопируй запрос и отправь заведению<textarea className="request-output" readOnly rows={7} value={manualRequest} onFocus={(event) => event.currentTarget.select()} /></label>}<p className="form-privacy">Данные не сохраняются на сайте. Запрос отправляется только после твоего действия.</p></form></div>
        </section>

        <section className="visit-section" id="visit"><div className="visit-card"><span className="section-kicker">КАК НАЙТИ</span><h2>До скорой<br /><em>встречи.</em></h2><div className="visit-info"><div><span>АДРЕС</span><p>{siteConfig.address || 'Укажет владелец кафе'}</p></div><div><span>ЧАСЫ</span><p>{siteConfig.hours.map((row) => <span key={row.days}>{row.days}{row.time ? ` · ${row.time}` : ' · уточняются'}</span>)}</p></div>{siteConfig.phone && <div><span>ТЕЛЕФОН</span><a href={`tel:${siteConfig.phone}`}>{siteConfig.phone}</a></div>}</div></div><div className="visit-illustration" aria-hidden="true"><div className="sun-shape" /><div className="coffee-cup"><span /><i /></div><span className="visit-note">здесь хорошо</span><div className="visit-table" /></div></section>
      </main>
      <footer className="footer"><a className="wordmark footer-brand" href="#top"><span className="wordmark-mark">Д</span><span>ДЕНЬ<small>ГОРОДСКОЕ КАФЕ</small></span></a><p>Будни становятся теплее<br />с первой чашки.</p><nav aria-label="Навигация в подвале"><a href="#menu">Меню</a><a href="#booking">Столик</a><a href="#visit">Контакты</a></nav><span className="footer-copy">© ДЕНЬ · ДЕМО-ПРОЕКТ СТУДИИ</span></footer>
      {toast && <div className="toast" role="status"><Check size={17} /> {toast}</div>}
    </>
  );
}

export default App;
