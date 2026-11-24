/**
 * «Розумне планування» — єдине джерело правди: флаги, категорії, шаблони завдань.
 * Тексти взято зі специфікації (smart-planning-spec.md, розділ 8) — не змінювати без неї.
 */

export const FLAGS = [
  // група: Церемонія
  { id: 'drats',            label: 'Розпис у ДРАЦС',                                         group: 1 },
  { id: 'church',           label: 'Шлюб у церкві',                                          group: 1 },
  { id: 'offsite_ceremony', label: 'Виїзна церемонія',                                       group: 1 },
  { id: 'offsite_banquet',  label: 'Банкет не в ресторані (потрібен кейтеринг)',             group: 1 },
  { id: 'traditions',       label: 'Українські традиції (викуп, благословення, коровай тощо)', group: 1 },
  // група: Команда
  { id: 'coordinator',      label: 'Весільний координатор (організатори)',                   group: 2 },
  { id: 'host',             label: 'Ведучий',                                                group: 2 },
  { id: 'videographer',     label: 'Відеограф',                                              group: 2 },
  { id: 'decorator',        label: 'Декоратор',                                              group: 2 },
  { id: 'first_dance',      label: 'Постановка першого танцю',                               group: 2 },
  // група: Гості
  { id: 'kids',             label: 'Діти на весіллі',                                        group: 3 },
  { id: 'transfer',         label: 'Трансфер для гостей',                                    group: 3 },
  { id: 'accommodation',    label: 'Поселення гостей',                                       group: 3 },
  { id: 'welcome_zone',     label: 'Welcome-зона/фотозона',                                  group: 3 },
  // група: Частування
  { id: 'cake',             label: 'Весільний торт',                                         group: 4 },
  { id: 'candy_bar',        label: 'Кенді-бар',                                              group: 4 },
  { id: 'cossack_table',    label: 'Козацький стіл',                                         group: 4 },
  // група: Після весілля
  { id: 'honeymoon',        label: 'Весільна подорож',                                       group: 5 },
] as const;

export type FlagId = (typeof FLAGS)[number]['id'];

/** Порядок = порядок блоків на кроках 2 і 3. */
export const CATEGORIES = [
  { id: 'basics',      title: 'Основне' },
  { id: 'ceremony',    title: 'Церемонія' },
  { id: 'traditions',  title: 'Традиції' },
  { id: 'team',        title: 'Команда' },
  { id: 'decor',       title: 'Декор' },
  { id: 'looks',       title: 'Образи наречених' },
  { id: 'guests',      title: 'Гості та запрошення' },
  { id: 'banquet',     title: 'Банкет' },
  { id: 'offsite',     title: 'Локація без ресторану' },
  { id: 'wedding_day', title: 'День весілля' },
  { id: 'honeymoon',   title: 'Весільна подорож' },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];

export type Due = { months: number } | { weeks: number };

export type TaskTemplate = {
  id: string;
  category: CategoryId;
  /** минулий час — крок 2 */
  step2Label: string;
  /** наказовий — крок 3 і вкладка «Завдання» */
  step3Label: string;
  /** за скільки до весілля */
  due: Due;
  /** OR; немає = базове */
  showIf?: FlagId[];
  /** OR */
  hideIf?: FlagId[];
  override?: { if: FlagId[]; step2Label: string; step3Label: string }[];
};

// prettier-ignore
export const TASK_TEMPLATES: TaskTemplate[] = [
  // ───────── Основне (базові)
  { id: 'pick_date',   category: 'basics', step2Label: 'Обрали дату весілля',               step3Label: 'Обрати дату весілля',               due: { months: 12 } },
  { id: 'set_budget',  category: 'basics', step2Label: 'Визначили бюджет',                  step3Label: 'Визначити бюджет',                  due: { months: 12 } },
  { id: 'book_venue',  category: 'basics', step2Label: 'Забронювали ресторан / локацію для банкету', step3Label: 'Забронювати ресторан / локацію для банкету', due: { months: 11 },
    override: [{ if: ['offsite_banquet'], step2Label: 'Забронювали локацію для банкету', step3Label: 'Забронювати локацію для банкету' }] },
  { id: 'concept',     category: 'basics', step2Label: 'Визначилися з концепцією та стилем', step3Label: 'Визначитися з концепцією та стилем', due: { months: 10 } },

  // ───────── Церемонія
  { id: 'drats_date',        category: 'ceremony', showIf: ['drats'], step2Label: 'Обрали дату й час реєстрації', step3Label: 'Обрати дату й час реєстрації', due: { months: 3 } },
  { id: 'drats_application', category: 'ceremony', showIf: ['drats'], step2Label: 'Подали заяву до ДРАЦС',        step3Label: 'Подати заяву до ДРАЦС',        due: { months: 2 } },
  { id: 'drats_documents',   category: 'ceremony', showIf: ['drats'], step2Label: 'Підготували документи',        step3Label: 'Підготувати документи',        due: { months: 2 } },
  { id: 'church_agree',      category: 'ceremony', showIf: ['church'], step2Label: 'Домовилися з церквою та священником', step3Label: 'Домовитися з церквою та священником', due: { months: 6 } },
  { id: 'church_witnesses',  category: 'ceremony', showIf: ['church'], step2Label: 'Обрали свідків',               step3Label: 'Обрати свідків',               due: { months: 4 } },
  { id: 'church_classes',    category: 'ceremony', showIf: ['church'], step2Label: 'Пройшли передшлюбні науки',    step3Label: 'Пройти передшлюбні науки',     due: { months: 3 } },
  { id: 'rushnyk',           category: 'ceremony', showIf: ['church', 'traditions'], step2Label: 'Підготували рушник, свічки та ікони', step3Label: 'Підготувати рушник, свічки та ікони', due: { months: 1 } },
  { id: 'ceremony_venue',    category: 'ceremony', showIf: ['offsite_ceremony'], step2Label: 'Забронювали майданчик для церемонії', step3Label: 'Забронювати майданчик для церемонії', due: { months: 10 } },
  { id: 'ceremony_officiant',category: 'ceremony', showIf: ['offsite_ceremony'], step2Label: 'Знайшли, хто проводить церемонію', step3Label: 'Знайти, хто проводить церемонію', due: { months: 6 } },
  { id: 'ceremony_plan_b',   category: 'ceremony', showIf: ['offsite_ceremony'], step2Label: 'Продумали план Б на випадок поганої погоди', step3Label: 'Продумати план Б на випадок поганої погоди', due: { months: 2 } },
  { id: 'ceremony_arch',     category: 'ceremony', showIf: ['offsite_ceremony'], step2Label: 'Оформили арку / декор церемонії', step3Label: 'Оформити арку / декор церемонії', due: { months: 2 } },

  // ───────── Традиції
  { id: 'blessing',         category: 'traditions', showIf: ['traditions'], step2Label: 'Обговорили з батьками благословення', step3Label: 'Обговорити з батьками благословення', due: { months: 2 } },
  { id: 'korovai',          category: 'traditions', showIf: ['traditions'], step2Label: 'Замовили коровай',                   step3Label: 'Замовити коровай',                   due: { months: 1 } },
  { id: 'vykup',            category: 'traditions', showIf: ['traditions'], step2Label: 'Підготували сценарій викупу',        step3Label: 'Підготувати сценарій викупу',        due: { months: 1 } },
  { id: 'korovai_greeters', category: 'traditions', showIf: ['traditions'], step2Label: 'Обрали, хто зустрічає молодят із короваєм', step3Label: 'Обрати, хто зустрічає молодят із короваєм', due: { months: 1 } },

  // ───────── Команда
  { id: 'coordinator_pick',    category: 'team', showIf: ['coordinator'],  step2Label: 'Обрали весільного координатора', step3Label: 'Обрати весільного координатора', due: { months: 12 } },
  { id: 'photographer',        category: 'team',                           step2Label: 'Забронювали фотографа',          step3Label: 'Забронювати фотографа',          due: { months: 9 } },
  { id: 'host_book',           category: 'team', showIf: ['host'],         step2Label: 'Забронювали ведучого',           step3Label: 'Забронювати ведучого',           due: { months: 9 } },
  { id: 'videographer',        category: 'team', showIf: ['videographer'], step2Label: 'Забронювали відеографа',         step3Label: 'Забронювати відеографа',         due: { months: 9 } },
  { id: 'dj',                  category: 'team',                           step2Label: 'Забронювали DJ',                 step3Label: 'Забронювати DJ',                 due: { months: 8 } },
  { id: 'band',                category: 'team',                           step2Label: 'Забронювали музикантів / кавер-гурт', step3Label: 'Забронювати музикантів / кавер-гурт', due: { months: 8 } },
  { id: 'decorator_find',      category: 'team', showIf: ['decorator'],    step2Label: 'Знайшли декоратора',             step3Label: 'Знайти декоратора',              due: { months: 8 } },
  { id: 'makeup',              category: 'team',                           step2Label: 'Забронювали візажиста',          step3Label: 'Забронювати візажиста',          due: { months: 6 } },
  { id: 'hair',                category: 'team',                           step2Label: 'Забронювали стиліста (зачіска)', step3Label: 'Забронювати стиліста (зачіска)', due: { months: 6 } },
  { id: 'florist',             category: 'team', showIf: ['decorator'],    step2Label: 'Знайшли флориста',               step3Label: 'Знайти флориста',                due: { months: 6 } },
  { id: 'choreographer',       category: 'team', showIf: ['first_dance'],  step2Label: 'Знайшли хореографа для першого танцю', step3Label: 'Знайти хореографа для першого танцю', due: { months: 3 } },
  { id: 'first_dance_song',    category: 'team', showIf: ['first_dance'],  step2Label: 'Обрали пісню для першого танцю', step3Label: 'Обрати пісню для першого танцю', due: { months: 3 } },
  { id: 'host_program',        category: 'team', showIf: ['host'],         step2Label: 'Узгодили з ведучим програму вечора', step3Label: 'Узгодити з ведучим програму вечора', due: { months: 1 } },
  { id: 'coordinator_handoff', category: 'team', showIf: ['coordinator'],  step2Label: 'Передали координатору контакти всіх підрядників', step3Label: 'Передати координатору контакти всіх підрядників', due: { months: 1 } },

  // ───────── Декор
  { id: 'decor_concept', category: 'decor', showIf: ['decorator'], step2Label: 'Затвердили концепцію декору',          step3Label: 'Затвердити концепцію декору',          due: { months: 4 } },
  { id: 'decor_tables',  category: 'decor', showIf: ['decorator'], step2Label: 'Узгодили декор президіуму та столів',  step3Label: 'Узгодити декор президіуму та столів',  due: { months: 2 } },

  // ───────── Образи наречених (базові)
  { id: 'dress',       category: 'looks', step2Label: 'Купили / пошили весільну сукню',          step3Label: 'Купити / пошити весільну сукню',          due: { months: 8 } },
  { id: 'suit',        category: 'looks', step2Label: 'Обрали костюм нареченого',                step3Label: 'Обрати костюм нареченого',                due: { months: 4 } },
  { id: 'rings',       category: 'looks', step2Label: 'Купили обручки',                          step3Label: 'Купити обручки',                          due: { months: 3 } },
  { id: 'accessories', category: 'looks', step2Label: 'Обрали взуття та аксесуари',              step3Label: 'Обрати взуття та аксесуари',              due: { months: 3 } },
  { id: 'bouquet',     category: 'looks', step2Label: 'Замовили букет нареченої та бутоньєрку',  step3Label: 'Замовити букет нареченої та бутоньєрку',  due: { months: 1 } },

  // ───────── Гості та запрошення
  { id: 'guest_list',          category: 'guests',                            step2Label: 'Склали список гостей',                     step3Label: 'Скласти список гостей',                     due: { months: 10 } },
  { id: 'accommodation_book',  category: 'guests', showIf: ['accommodation'], step2Label: 'Забронювали житло для гостей',             step3Label: 'Забронювати житло для гостей',             due: { months: 4 } },
  { id: 'invitations_create',  category: 'guests',                            step2Label: 'Створили сайт-запрошення / замовили поліграфію', step3Label: 'Створити сайт-запрошення / замовити поліграфію', due: { months: 4 } },
  { id: 'invitations_send',    category: 'guests',                            step2Label: 'Розіслали запрошення',                     step3Label: 'Розіслати запрошення',                     due: { months: 3 } },
  { id: 'welcome_plan',        category: 'guests', showIf: ['welcome_zone'],  step2Label: 'Продумали welcome-зону / фотозону',        step3Label: 'Продумати welcome-зону / фотозону',        due: { months: 3 } },
  { id: 'kids_count',          category: 'guests', showIf: ['kids'],          step2Label: 'Порахували, скільки буде дітей і якого віку', step3Label: 'Порахувати, скільки буде дітей і якого віку', due: { months: 2 } },
  { id: 'kids_corner',         category: 'guests', showIf: ['kids'],          step2Label: 'Організували дитячий куточок / аніматора', step3Label: 'Організувати дитячий куточок / аніматора', due: { months: 2 } },
  { id: 'transfer_count',      category: 'guests', showIf: ['transfer'],      step2Label: 'Порахували, кому потрібен трансфер',       step3Label: 'Порахувати, кому потрібен трансфер',       due: { months: 2 } },
  { id: 'transfer_book',       category: 'guests', showIf: ['transfer'],      step2Label: 'Замовили транспорт для гостей',            step3Label: 'Замовити транспорт для гостей',            due: { months: 2 } },
  { id: 'welcome_decor',       category: 'guests', showIf: ['welcome_zone'],  step2Label: 'Замовили оформлення welcome-зони / фотозони', step3Label: 'Замовити оформлення welcome-зони / фотозони', due: { months: 2 } },
  { id: 'guests_confirm',      category: 'guests',                            step2Label: 'Дізналися, хто з гостей точно прийде',     step3Label: 'Дізнатися, хто з гостей точно прийде',     due: { months: 1 } },
  { id: 'kids_menu',           category: 'guests', showIf: ['kids'],          step2Label: 'Узгодили дитяче меню',                     step3Label: 'Узгодити дитяче меню',                     due: { months: 1 } },
  { id: 'accommodation_info',  category: 'guests', showIf: ['accommodation'], step2Label: 'Надіслали гостям інформацію про проживання', step3Label: 'Надіслати гостям інформацію про проживання', due: { months: 1 } },
  { id: 'welcome_buffet',      category: 'guests', showIf: ['welcome_zone'],  step2Label: 'Замовили фуршет для welcome-зони',         step3Label: 'Замовити фуршет для welcome-зони',         due: { months: 1 } },
  { id: 'seating',             category: 'guests',                            step2Label: 'Склали схему розсадки гостей',             step3Label: 'Скласти схему розсадки гостей',             due: { weeks: 2 } },

  // ───────── Банкет
  { id: 'cake_baker',    category: 'banquet', showIf: ['cake'],          step2Label: 'Обрали кондитера',            step3Label: 'Обрати кондитера',            due: { months: 4 } },
  { id: 'cake_tasting',  category: 'banquet', showIf: ['cake'],          step2Label: 'Провели дегустацію торту',    step3Label: 'Провести дегустацію торту',   due: { months: 3 } },
  { id: 'cake_order',    category: 'banquet', showIf: ['cake'],          step2Label: 'Замовили весільний торт',     step3Label: 'Замовити весільний торт',     due: { months: 2 } },
  { id: 'menu',          category: 'banquet', hideIf: ['offsite_banquet'], step2Label: 'Узгодили меню',             step3Label: 'Узгодити меню',               due: { months: 2 } },
  { id: 'tasting',       category: 'banquet', hideIf: ['offsite_banquet'], step2Label: 'Провели дегустацію',        step3Label: 'Провести дегустацію',         due: { months: 2 } },
  { id: 'candy_bar',     category: 'banquet', showIf: ['candy_bar'],     step2Label: 'Замовили кенді-бар',          step3Label: 'Замовити кенді-бар',          due: { months: 2 } },
  { id: 'cossack_table', category: 'banquet', showIf: ['cossack_table'], step2Label: 'Замовили козацький стіл',     step3Label: 'Замовити козацький стіл',     due: { months: 2 } },
  { id: 'drinks',        category: 'banquet',                            step2Label: 'Закупили напої',              step3Label: 'Закупити напої',              due: { months: 1 } },

  // ───────── Локація без ресторану
  { id: 'catering',         category: 'offsite', showIf: ['offsite_banquet'], step2Label: 'Знайшли кейтеринг', step3Label: 'Знайти кейтеринг', due: { months: 8 } },
  { id: 'venue_rules',      category: 'offsite', showIf: ['offsite_banquet'], step2Label: 'Перевірили правила локації (до котрої можна шуміти, чи можна феєрверк)', step3Label: 'Перевірити правила локації (до котрої можна шуміти, чи можна феєрверк)', due: { months: 6 } },
  { id: 'tent',             category: 'offsite', showIf: ['offsite_banquet'], step2Label: 'Замовили шатро / накриття від дощу', step3Label: 'Замовити шатро / накриття від дощу', due: { months: 6 } },
  { id: 'catering_tasting', category: 'offsite', showIf: ['offsite_banquet'], step2Label: 'Провели дегустацію в кейтерингу', step3Label: 'Провести дегустацію в кейтерингу', due: { months: 3 } },
  { id: 'staff',            category: 'offsite', showIf: ['offsite_banquet'], step2Label: 'Забронювали офіціантів і бармена', step3Label: 'Забронювати офіціантів і бармена', due: { months: 3 } },
  { id: 'furniture',        category: 'offsite', showIf: ['offsite_banquet'], step2Label: 'Орендували столи, стільці та текстиль', step3Label: 'Орендувати столи, стільці та текстиль', due: { months: 3 } },
  { id: 'power_check',      category: 'offsite', showIf: ['offsite_banquet'], step2Label: 'Перевірили, чи вистачить електрики на кухню, звук і світло', step3Label: 'Перевірити, чи вистачить електрики на кухню, звук і світло', due: { months: 3 } },
  { id: 'catering_menu',    category: 'offsite', showIf: ['offsite_banquet'], step2Label: 'Узгодили меню з кейтерингом', step3Label: 'Узгодити меню з кейтерингом', due: { months: 2 } },
  { id: 'tableware',        category: 'offsite', showIf: ['offsite_banquet'], step2Label: 'Домовилися, хто привозить посуд, келихи та прибори', step3Label: 'Домовитися, хто привозить посуд, келихи та прибори', due: { months: 2 } },
  { id: 'toilets',          category: 'offsite', showIf: ['offsite_banquet'], step2Label: 'Замовили мобільні туалети', step3Label: 'Замовити мобільні туалети', due: { months: 2 } },
  { id: 'lighting',         category: 'offsite', showIf: ['offsite_banquet'], step2Label: 'Продумали освітлення на вечір (гірлянди, прожектори)', step3Label: 'Продумати освітлення на вечір (гірлянди, прожектори)', due: { months: 2 } },
  { id: 'generator',        category: 'offsite', showIf: ['offsite_banquet'], step2Label: 'Замовили генератор на випадок відключень', step3Label: 'Замовити генератор на випадок відключень', due: { months: 2 } },
  { id: 'stage_sound',      category: 'offsite', showIf: ['offsite_banquet'], step2Label: 'Домовилися про сцену й звук для музикантів / DJ', step3Label: 'Домовитися про сцену й звук для музикантів / DJ', due: { months: 2 } },
  { id: 'parking',          category: 'offsite', showIf: ['offsite_banquet'], step2Label: 'Організували паркування для гостей', step3Label: 'Організувати паркування для гостей', due: { months: 2 } },
  { id: 'cleanup',          category: 'offsite', showIf: ['offsite_banquet'], step2Label: 'Домовилися про прибирання і вивіз сміття після свята', step3Label: 'Домовитися про прибирання і вивіз сміття після свята', due: { months: 2 } },
  { id: 'getting_ready',    category: 'offsite', showIf: ['offsite_banquet'], step2Label: 'Підготували місце, де наречені можуть зібратися та переодягнутися', step3Label: 'Підготувати місце, де наречені можуть зібратися та переодягнутися', due: { months: 2 } },
  { id: 'heating',          category: 'offsite', showIf: ['offsite_banquet'], step2Label: 'Подбали про обігрів або пледи, якщо вечір прохолодний', step3Label: 'Подбати про обігрів або пледи, якщо вечір прохолодний', due: { months: 1 } },

  // ───────── День весілля
  { id: 'shelter',              category: 'wedding_day',                             step2Label: 'Перевірили, чи є укриття поруч із локацією', step3Label: 'Перевірити, чи є укриття поруч із локацією', due: { months: 10 } },
  { id: 'restaurant_generator', category: 'wedding_day', hideIf: ['offsite_banquet'], step2Label: 'Уточнили, чи є в ресторані генератор',     step3Label: 'Уточнити, чи є в ресторані генератор',     due: { months: 10 } },
  { id: 'couple_transport',     category: 'wedding_day',                             step2Label: 'Замовили транспорт для молодят',           step3Label: 'Замовити транспорт для молодят',           due: { months: 2 } },
  { id: 'timeline',             category: 'wedding_day',                             step2Label: 'Склали тайм-лайн дня весілля',             step3Label: 'Скласти тайм-лайн дня весілля',             due: { months: 1 } },
  { id: 'air_raid_plan',        category: 'wedding_day',                             step2Label: 'Узгодили з локацією та підрядниками план на час тривоги', step3Label: 'Узгодити з локацією та підрядниками план на час тривоги', due: { months: 1 } },
  { id: 'curfew',               category: 'wedding_day',                             step2Label: 'Врахували комендантську годину в таймінгу і трансфері', step3Label: 'Врахувати комендантську годину в таймінгу і трансфері', due: { months: 1 } },

  // ───────── Весільна подорож
  { id: 'trip_destination', category: 'honeymoon', showIf: ['honeymoon'], step2Label: 'Обрали напрямок',                 step3Label: 'Обрати напрямок',                 due: { months: 6 } },
  { id: 'trip_booking',     category: 'honeymoon', showIf: ['honeymoon'], step2Label: 'Забронювали квитки та житло',     step3Label: 'Забронювати квитки та житло',     due: { months: 4 } },
  { id: 'trip_documents',   category: 'honeymoon', showIf: ['honeymoon'], step2Label: 'Перевірили документи для поїздки', step3Label: 'Перевірити документи для поїздки', due: { months: 3 } },
];
