import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { siteIconMarkup } from '../scripts/site-icons.js';
import { syncDefaultTheme } from './sync-default-theme.mjs';
import { dashboardLoading } from './dashboard-loading-markup.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const locales = {
  en: {
    base: '', title: 'Your SpinCresta Account', description: 'View your SpinCresta profile, account status, language and important account links.',
    kicker: 'SPINCRESTA ACCOUNT', heading: 'Your account, in one place', intro: 'View your profile details and use the account tools available to you.',
    overviewKicker: 'Account overview', overviewTitle: 'Profile and account details', overviewIntro: 'Your Google profile is used to identify your SpinCresta account securely.',
    loading: 'Loading your account…', signedOutTitle: 'Sign in to open your account', signedOutIntro: 'Use the Google account connected to SpinCresta.', signIn: 'Sign in with Google',
    signedInAs: 'Signed in as', status: 'Account status', active: 'Active', language: 'Site language', memberSince: 'Member since',
    privacy: 'Privacy Policy', responsible: 'Responsible gambling', signOut: 'Sign out', moderator: 'Moderator dashboard',
    quickTitle: 'Account essentials', quickText: 'Review how your account data is handled and find safer-play information at any time.',
  },
  de: {
    base: 'de', title: 'Ihr SpinCresta-Konto', description: 'Sehen Sie Ihr SpinCresta-Profil, Ihren Kontostatus, Ihre Sprache und wichtige Kontolinks.',
    kicker: 'SPINCRESTA-KONTO', heading: 'Ihr Konto an einem Ort', intro: 'Sehen Sie Ihre Profildaten und nutzen Sie die verfügbaren Kontofunktionen.',
    overviewKicker: 'Kontoübersicht', overviewTitle: 'Profil- und Kontodaten', overviewIntro: 'Ihr Google-Profil dient zur sicheren Identifizierung Ihres SpinCresta-Kontos.',
    loading: 'Ihr Konto wird geladen…', signedOutTitle: 'Melden Sie sich an, um Ihr Konto zu öffnen', signedOutIntro: 'Verwenden Sie das mit SpinCresta verknüpfte Google-Konto.', signIn: 'Mit Google anmelden',
    signedInAs: 'Angemeldet als', status: 'Kontostatus', active: 'Aktiv', language: 'Seitensprache', memberSince: 'Mitglied seit',
    privacy: 'Datenschutzerklärung', responsible: 'Verantwortungsvolles Spielen', signOut: 'Abmelden', moderator: 'Moderationsbereich',
    quickTitle: 'Wichtige Kontoinformationen', quickText: 'Lesen Sie jederzeit, wie Ihre Kontodaten verarbeitet werden, und finden Sie Informationen zum Spielerschutz.',
  },
  es: {
    base: 'es', title: 'Tu cuenta de SpinCresta', description: 'Consulta tu perfil de SpinCresta, el estado de la cuenta, el idioma y los enlaces importantes.',
    kicker: 'CUENTA SPINCRESTA', heading: 'Tu cuenta, en un solo lugar', intro: 'Consulta los datos de tu perfil y utiliza las opciones disponibles para tu cuenta.',
    overviewKicker: 'Resumen de la cuenta', overviewTitle: 'Perfil y datos de la cuenta', overviewIntro: 'Tu perfil de Google se utiliza para identificar tu cuenta de SpinCresta de forma segura.',
    loading: 'Cargando tu cuenta…', signedOutTitle: 'Inicia sesión para abrir tu cuenta', signedOutIntro: 'Utiliza la cuenta de Google vinculada a SpinCresta.', signIn: 'Iniciar sesión con Google',
    signedInAs: 'Sesión iniciada como', status: 'Estado de la cuenta', active: 'Activa', language: 'Idioma del sitio', memberSince: 'Miembro desde',
    privacy: 'Política de privacidad', responsible: 'Juego responsable', signOut: 'Cerrar sesión', moderator: 'Panel de moderación',
    quickTitle: 'Información esencial', quickText: 'Consulta cómo tratamos los datos de tu cuenta y accede cuando quieras a la información sobre juego responsable.',
  },
  it: {
    base: 'it', title: 'Il tuo account SpinCresta', description: 'Consulta il profilo SpinCresta, lo stato dell’account, la lingua e i link importanti.',
    kicker: 'ACCOUNT SPINCRESTA', heading: 'Il tuo account, tutto in un unico posto', intro: 'Consulta i dati del profilo e utilizza gli strumenti disponibili per il tuo account.',
    overviewKicker: 'Riepilogo account', overviewTitle: 'Profilo e dati dell’account', overviewIntro: 'Il tuo profilo Google viene utilizzato per identificare in modo sicuro l’account SpinCresta.',
    loading: 'Caricamento dell’account…', signedOutTitle: 'Accedi per aprire il tuo account', signedOutIntro: 'Utilizza l’account Google collegato a SpinCresta.', signIn: 'Accedi con Google',
    signedInAs: 'Accesso effettuato come', status: 'Stato dell’account', active: 'Attivo', language: 'Lingua del sito', memberSince: 'Membro dal',
    privacy: 'Informativa sulla privacy', responsible: 'Gioco responsabile', signOut: 'Esci', moderator: 'Pannello di moderazione',
    quickTitle: 'Informazioni essenziali', quickText: 'Consulta come vengono gestiti i dati del tuo account e accedi alle informazioni sul gioco responsabile.',
  },
  pl: {
    base: 'pl', title: 'Twoje konto SpinCresta', description: 'Sprawdź profil SpinCresta, status konta, język i ważne łącza dotyczące konta.',
    kicker: 'KONTO SPINCRESTA', heading: 'Twoje konto w jednym miejscu', intro: 'Sprawdź dane profilu i skorzystaj z dostępnych funkcji konta.',
    overviewKicker: 'Przegląd konta', overviewTitle: 'Profil i dane konta', overviewIntro: 'Twój profil Google służy do bezpiecznej identyfikacji konta SpinCresta.',
    loading: 'Wczytywanie konta…', signedOutTitle: 'Zaloguj się, aby otworzyć konto', signedOutIntro: 'Użyj konta Google połączonego ze SpinCresta.', signIn: 'Zaloguj się przez Google',
    signedInAs: 'Zalogowano jako', status: 'Status konta', active: 'Aktywne', language: 'Język strony', memberSince: 'Użytkownik od',
    privacy: 'Polityka prywatności', responsible: 'Odpowiedzialna gra', signOut: 'Wyloguj się', moderator: 'Panel moderatora',
    quickTitle: 'Najważniejsze informacje', quickText: 'Sprawdź, jak przetwarzamy dane konta, i w każdej chwili przejdź do informacji o odpowiedzialnej grze.',
  },
  uk: {
    base: 'uk', title: 'Ваш акаунт SpinCresta', description: 'Переглядайте профіль SpinCresta, статус акаунта, вибрану мову та важливі посилання.',
    kicker: 'АКАУНТ SPINCRESTA', heading: 'Ваш акаунт в одному місці', intro: 'Переглядайте дані профілю та користуйтеся доступними функціями акаунта.',
    overviewKicker: 'Огляд акаунта', overviewTitle: 'Профіль і дані акаунта', overviewIntro: 'Ваш Google-профіль використовується для безпечної ідентифікації акаунта SpinCresta.',
    loading: 'Завантажуємо акаунт…', signedOutTitle: 'Увійдіть, щоб відкрити свій акаунт', signedOutIntro: 'Скористайтеся Google-акаунтом, підключеним до SpinCresta.', signIn: 'Увійти через Google',
    signedInAs: 'Ви увійшли як', status: 'Статус акаунта', active: 'Активний', language: 'Мова сайту', memberSince: 'Дата реєстрації',
    privacy: 'Політика конфіденційності', responsible: 'Відповідальна гра', signOut: 'Вийти', moderator: 'Кабінет модератора',
    quickTitle: 'Важливе про акаунт', quickText: 'Перевіряйте, як ми обробляємо дані акаунта, і будь-коли відкривайте інформацію про відповідальну гру.',
  },
  pt: {
    base: 'pt', title: 'A sua conta SpinCresta', description: 'Consulte o perfil SpinCresta, o estado da conta, o idioma e as ligações importantes.',
    kicker: 'CONTA SPINCRESTA', heading: 'A sua conta num só lugar', intro: 'Consulte os dados do perfil e utilize as funcionalidades disponíveis para a sua conta.',
    overviewKicker: 'Resumo da conta', overviewTitle: 'Perfil e dados da conta', overviewIntro: 'O seu perfil Google é utilizado para identificar a conta SpinCresta de forma segura.',
    loading: 'A carregar a sua conta…', signedOutTitle: 'Inicie sessão para abrir a sua conta', signedOutIntro: 'Utilize a conta Google associada à SpinCresta.', signIn: 'Entrar com o Google',
    signedInAs: 'Sessão iniciada como', status: 'Estado da conta', active: 'Ativa', language: 'Idioma do site', memberSince: 'Membro desde',
    privacy: 'Política de privacidade', responsible: 'Jogo responsável', signOut: 'Terminar sessão', moderator: 'Painel de moderação',
    quickTitle: 'Informações essenciais', quickText: 'Consulte como tratamos os dados da conta e aceda às informações sobre jogo responsável quando quiser.',
  },
  fr: {
    base: 'fr', title: 'Votre compte SpinCresta', description: 'Consultez votre profil SpinCresta, l’état du compte, la langue et les liens importants.',
    kicker: 'COMPTE SPINCRESTA', heading: 'Votre compte, au même endroit', intro: 'Consultez les informations de votre profil et utilisez les fonctions disponibles.',
    overviewKicker: 'Vue d’ensemble', overviewTitle: 'Profil et informations du compte', overviewIntro: 'Votre profil Google permet d’identifier votre compte SpinCresta de manière sécurisée.',
    loading: 'Chargement de votre compte…', signedOutTitle: 'Connectez-vous pour ouvrir votre compte', signedOutIntro: 'Utilisez le compte Google associé à SpinCresta.', signIn: 'Se connecter avec Google',
    signedInAs: 'Connecté en tant que', status: 'Statut du compte', active: 'Actif', language: 'Langue du site', memberSince: 'Membre depuis',
    privacy: 'Politique de confidentialité', responsible: 'Jeu responsable', signOut: 'Se déconnecter', moderator: 'Espace de modération',
    quickTitle: 'Informations essentielles', quickText: 'Consultez la gestion des données de votre compte et accédez à tout moment aux informations sur le jeu responsable.',
  },
  hi: {
    base: 'hi', title: 'आपका SpinCresta खाता', description: 'अपनी SpinCresta प्रोफ़ाइल, खाते की स्थिति, भाषा और जरूरी लिंक देखें।',
    kicker: 'SPINCRESTA खाता', heading: 'आपका खाता, एक ही जगह', intro: 'अपनी प्रोफ़ाइल की जानकारी देखें और उपलब्ध खाता सुविधाओं का उपयोग करें।',
    overviewKicker: 'खाते का सारांश', overviewTitle: 'प्रोफ़ाइल और खाते की जानकारी', overviewIntro: 'आपके SpinCresta खाते की सुरक्षित पहचान के लिए आपकी Google प्रोफ़ाइल का उपयोग किया जाता है।',
    loading: 'आपका खाता लोड हो रहा है…', signedOutTitle: 'अपना खाता खोलने के लिए साइन इन करें', signedOutIntro: 'SpinCresta से जुड़े Google खाते का उपयोग करें।', signIn: 'Google से साइन इन करें',
    signedInAs: 'इस रूप में साइन इन हैं', status: 'खाते की स्थिति', active: 'सक्रिय', language: 'साइट की भाषा', memberSince: 'सदस्यता की तारीख',
    privacy: 'गोपनीयता नीति', responsible: 'जिम्मेदार जुआ', signOut: 'साइन आउट करें', moderator: 'मॉडरेटर पैनल',
    quickTitle: 'खाते की जरूरी जानकारी', quickText: 'देखें कि आपके खाते के डेटा का उपयोग कैसे होता है और जिम्मेदार जुए की जानकारी कभी भी खोलें।',
  },
  fi: {
    base: 'fi', title: 'SpinCresta-tilisi', description: 'Näytä SpinCresta-profiilisi, tilin tila, kieli ja tärkeät tililinkit.',
    kicker: 'SPINCRESTA-TILI', heading: 'Tilisi yhdessä paikassa', intro: 'Näytä profiilisi tiedot ja käytä tilillesi saatavilla olevia toimintoja.',
    overviewKicker: 'Tilin yhteenveto', overviewTitle: 'Profiili ja tilin tiedot', overviewIntro: 'Google-profiiliasi käytetään SpinCresta-tilisi turvalliseen tunnistamiseen.',
    loading: 'Tiliäsi ladataan…', signedOutTitle: 'Avaa tilisi kirjautumalla sisään', signedOutIntro: 'Käytä SpinCrestaan yhdistettyä Google-tiliä.', signIn: 'Kirjaudu Googlella',
    signedInAs: 'Kirjautuneena käyttäjänä', status: 'Tilin tila', active: 'Aktiivinen', language: 'Sivuston kieli', memberSince: 'Jäsen alkaen',
    privacy: 'Tietosuojakäytäntö', responsible: 'Vastuullinen pelaaminen', signOut: 'Kirjaudu ulos', moderator: 'Moderaattorin hallintapaneeli',
    quickTitle: 'Tilin tärkeät tiedot', quickText: 'Tarkista, miten tilisi tietoja käsitellään, ja avaa vastuullisen pelaamisen tiedot milloin tahansa.',
  },
};

const contactCopy = {
  en: { kicker: 'PROFILE DETAILS', title: 'Your contact details', intro: 'Your selected country may appear as a flag beside published reviews. Your phone and Telegram remain private.', country: 'Country of residence', chooseCountry: 'Choose a country', phone: 'Phone number', phonePlaceholder: '+49 123 456789', telegram: 'Telegram username', telegramPlaceholder: '@username', save: 'Save details' },
  de: { kicker: 'PROFILDATEN', title: 'Ihre Kontaktdaten', intro: 'Ihr ausgewähltes Land kann als Flagge neben veröffentlichten Beiträgen erscheinen. Telefon und Telegram bleiben privat.', country: 'Wohnsitzland', chooseCountry: 'Land auswählen', phone: 'Telefonnummer', phonePlaceholder: '+49 123 456789', telegram: 'Telegram-Benutzername', telegramPlaceholder: '@benutzername', save: 'Angaben speichern' },
  es: { kicker: 'DATOS DEL PERFIL', title: 'Tus datos de contacto', intro: 'El país elegido puede aparecer como bandera junto a las reseñas publicadas. El teléfono y Telegram siguen siendo privados.', country: 'País de residencia', chooseCountry: 'Elige un país', phone: 'Número de teléfono', phonePlaceholder: '+34 612 345 678', telegram: 'Usuario de Telegram', telegramPlaceholder: '@usuario', save: 'Guardar datos' },
  it: { kicker: 'DATI DEL PROFILO', title: 'I tuoi contatti', intro: 'Il Paese selezionato può apparire come bandiera accanto alle recensioni pubblicate. Telefono e Telegram restano privati.', country: 'Paese di residenza', chooseCountry: 'Seleziona un Paese', phone: 'Numero di telefono', phonePlaceholder: '+39 312 345 6789', telegram: 'Nome utente Telegram', telegramPlaceholder: '@nomeutente', save: 'Salva i dati' },
  pl: { kicker: 'DANE PROFILU', title: 'Twoje dane kontaktowe', intro: 'Wybrany kraj może pojawić się jako flaga przy opublikowanych recenzjach. Telefon i Telegram pozostają prywatne.', country: 'Kraj zamieszkania', chooseCountry: 'Wybierz kraj', phone: 'Numer telefonu', phonePlaceholder: '+48 123 456 789', telegram: 'Nazwa użytkownika Telegram', telegramPlaceholder: '@nazwauzytkownika', save: 'Zapisz dane' },
  uk: { kicker: 'ДАНІ ПРОФІЛЮ', title: 'Ваші контактні дані', intro: 'Вибрана країна може відображатися прапорцем біля опублікованих відгуків. Телефон і Telegram залишаються приватними.', country: 'Країна проживання', chooseCountry: 'Виберіть країну', phone: 'Номер телефону', phonePlaceholder: '+380 67 123 45 67', telegram: 'Ім’я користувача в Telegram', telegramPlaceholder: '@username', save: 'Зберегти дані' },
  pt: { kicker: 'DADOS DO PERFIL', title: 'Os seus contactos', intro: 'O país selecionado pode aparecer como bandeira junto das opiniões publicadas. O telefone e o Telegram permanecem privados.', country: 'País de residência', chooseCountry: 'Escolha um país', phone: 'Número de telefone', phonePlaceholder: '+351 912 345 678', telegram: 'Nome de utilizador do Telegram', telegramPlaceholder: '@utilizador', save: 'Guardar dados' },
  fr: { kicker: 'DONNÉES DU PROFIL', title: 'Vos coordonnées', intro: 'Le pays choisi peut apparaître sous forme de drapeau à côté des avis publiés. Le téléphone et Telegram restent privés.', country: 'Pays de résidence', chooseCountry: 'Choisissez un pays', phone: 'Numéro de téléphone', phonePlaceholder: '+33 6 12 34 56 78', telegram: 'Nom d’utilisateur Telegram', telegramPlaceholder: '@utilisateur', save: 'Enregistrer' },
  hi: { kicker: 'प्रोफ़ाइल विवरण', title: 'आपके संपर्क विवरण', intro: 'चुना गया देश प्रकाशित समीक्षाओं के पास झंडे के रूप में दिख सकता है। फ़ोन और Telegram निजी रहेंगे।', country: 'निवास का देश', chooseCountry: 'देश चुनें', phone: 'फ़ोन नंबर', phonePlaceholder: '+91 98765 43210', telegram: 'Telegram यूज़रनेम', telegramPlaceholder: '@username', save: 'जानकारी सेव करें' },
  fi: { kicker: 'PROFIILITIEDOT', title: 'Yhteystietosi', intro: 'Valittu maa voidaan näyttää lippuna julkaistun kokemuksen vieressä. Puhelin ja Telegram pysyvät yksityisinä.', country: 'Asuinmaa', chooseCountry: 'Valitse maa', phone: 'Puhelinnumero', phonePlaceholder: '+358 40 123 4567', telegram: 'Telegram-käyttäjänimi', telegramPlaceholder: '@kayttajanimi', save: 'Tallenna tiedot' },
};

const reviewCopy = {
  en: { kicker: 'YOUR ACTIVITY', title: 'Your reviews', intro: 'Open a review to see it on the casino page.', loading: 'Loading your reviews…', empty: 'You have not written any reviews yet.' },
  de: { kicker: 'IHRE AKTIVITÄT', title: 'Ihre Erfahrungsberichte', intro: 'Öffnen Sie einen Beitrag, um ihn auf der Casino-Seite anzusehen.', loading: 'Ihre Erfahrungsberichte werden geladen…', empty: 'Sie haben noch keine Erfahrungsberichte geschrieben.' },
  es: { kicker: 'TU ACTIVIDAD', title: 'Tus reseñas', intro: 'Abre una reseña para verla en la página del casino.', loading: 'Cargando tus reseñas…', empty: 'Todavía no has escrito ninguna reseña.' },
  it: { kicker: 'LA TUA ATTIVITÀ', title: 'Le tue recensioni', intro: 'Apri una recensione per visualizzarla nella pagina del casinò.', loading: 'Caricamento delle recensioni…', empty: 'Non hai ancora scritto recensioni.' },
  pl: { kicker: 'TWOJA AKTYWNOŚĆ', title: 'Twoje recenzje', intro: 'Otwórz recenzję, aby zobaczyć ją na stronie kasyna.', loading: 'Wczytywanie recenzji…', empty: 'Nie masz jeszcze żadnych recenzji.' },
  uk: { kicker: 'ВАША АКТИВНІСТЬ', title: 'Ваші відгуки', intro: 'Відкрийте відгук, щоб переглянути його на сторінці казино.', loading: 'Завантажуємо ваші відгуки…', empty: 'Ви ще не залишали текстових відгуків.' },
  pt: { kicker: 'A SUA ATIVIDADE', title: 'As suas opiniões', intro: 'Abra uma opinião para a ver na página do casino.', loading: 'A carregar as suas opiniões…', empty: 'Ainda não escreveu nenhuma opinião.' },
  fr: { kicker: 'VOTRE ACTIVITÉ', title: 'Vos avis', intro: 'Ouvrez un avis pour le consulter sur la page du casino.', loading: 'Chargement de vos avis…', empty: 'Vous n’avez encore publié aucun avis.' },
  hi: { kicker: 'आपकी गतिविधि', title: 'आपकी समीक्षाएँ', intro: 'कैसीनो पेज पर समीक्षा देखने के लिए उसे खोलें।', loading: 'आपकी समीक्षाएँ लोड हो रही हैं…', empty: 'आपने अभी तक कोई समीक्षा नहीं लिखी है।' },
  fi: { kicker: 'TOIMINTASI', title: 'Kokemuksesi', intro: 'Avaa kokemus nähdäksesi sen kasinon sivulla.', loading: 'Kokemuksiasi ladataan…', empty: 'Et ole vielä kirjoittanut kokemuksia.' },
};

const dashboardCopy = {
  en: ['My account', 'Profile', 'Favorites', 'Reviews', 'Help & privacy', 'Sign in with Google to view your profile, favorites, and reviews.', 'Save a casino using the heart on its review page.', 'Browse casino reviews'],
  de: ['Mein Konto', 'Profil', 'Favoriten', 'Erfahrungsberichte', 'Hilfe und Datenschutz', 'Melden Sie sich mit Google an, um Ihr Profil, Ihre Favoriten und Ihre Erfahrungsberichte zu sehen.', 'Speichern Sie ein Casino über das Herzsymbol auf der jeweiligen Testseite.', 'Casinotests ansehen'],
  es: ['Mi cuenta', 'Perfil', 'Favoritos', 'Reseñas', 'Ayuda y privacidad', 'Inicia sesión con Google para ver tu perfil, tus favoritos y tus reseñas.', 'Pulsa el corazón en la reseña de un casino para guardarlo.', 'Ver reseñas de casinos'],
  it: ['Il mio account', 'Profilo', 'Preferiti', 'Recensioni', 'Aiuto e privacy', 'Accedi con Google per vedere il profilo, i preferiti e le recensioni.', 'Usa il cuore nella pagina di recensione per salvare un casinò.', 'Sfoglia le recensioni'],
  pl: ['Moje konto', 'Profil', 'Ulubione', 'Recenzje', 'Pomoc i prywatność', 'Zaloguj się przez Google, aby zobaczyć profil, ulubione i recenzje.', 'Kliknij serce na stronie recenzji, aby zapisać kasyno.', 'Przeglądaj recenzje kasyn'],
  uk: ['Мій акаунт', 'Профіль', 'Обране', 'Відгуки', 'Допомога й приватність', 'Увійдіть через Google, щоб переглянути свій профіль, обране та відгуки.', 'Натисніть сердечко на сторінці огляду, щоб зберегти казино.', 'Переглянути огляди казино'],
  pt: ['A minha conta', 'Perfil', 'Favoritos', 'Opiniões', 'Ajuda e privacidade', 'Entre com o Google para ver o seu perfil, os favoritos e as opiniões.', 'Selecione o coração na página de análise para guardar um casino.', 'Ver análises de casinos'],
  fr: ['Mon compte', 'Profil', 'Favoris', 'Avis', 'Aide et confidentialité', 'Connectez-vous avec Google pour voir votre profil, vos favoris et vos avis.', 'Cliquez sur le cœur dans un avis pour enregistrer le casino.', 'Consulter les avis sur les casinos'],
  hi: ['मेरा खाता', 'प्रोफ़ाइल', 'पसंदीदा', 'समीक्षाएँ', 'सहायता और गोपनीयता', 'अपनी प्रोफ़ाइल, पसंदीदा और समीक्षाएँ देखने के लिए Google से साइन इन करें।', 'कैसीनो को सहेजने के लिए उसके समीक्षा पेज पर दिल का आइकन दबाएँ।', 'कैसीनो समीक्षाएँ देखें'],
  fi: ['Oma tilini', 'Profiili', 'Suosikit', 'Arvostelut', 'Ohjeet ja tietosuoja', 'Kirjaudu Googlella, niin näet profiilisi, suosikkisi ja arvostelusi.', 'Tallenna kasino painamalla arvostelusivun sydäntä.', 'Selaa kasinoarvosteluja'],
};

const escapeHtml = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const pagePath = (locale, slug) => locale.base ? `/${locale.base}/${slug}/` : `/${slug}/`;

const renderMain = (locale, language) => {
  const contact = contactCopy[language] || contactCopy.en;
  const reviews = reviewCopy[language] || reviewCopy.en;
  const [account, profile, favorites, reviewLabel, help, signInIntro, favoritesIntro, browse] = dashboardCopy[language];
  const menu = [['profile', profile, 'user'], ['favorites', favorites, 'heart'], ['reviews', reviewLabel, 'chat'], ['support', help, 'help']];
  return `
    <main class="account-dashboard container" data-account-page data-account-active="profile">
      <header class="account-dashboard-heading">
        <h1 id="account-title">${escapeHtml(account)}</h1>
      </header>
      <div class="account-layout">
        <aside class="account-sidebar">
          <nav class="account-menu" aria-labelledby="account-title">
            ${menu.map(([id, title, icon]) =>
              `<a href="#${id}" data-account-nav="${id}"${id === 'profile' ? ' aria-current="location"' : ''}>${siteIconMarkup(icon, 'site-icon', 20)}<span>${escapeHtml(title)}</span></a>`
            ).join('\n            ')}
          </nav>
          <div class="account-menu-actions">
            <a href="/moderator/" data-moderator-link hidden>${escapeHtml(locale.moderator)}</a>
            <button type="button" data-account-page-signout hidden>${escapeHtml(locale.signOut)}</button>
          </div>
        </aside>
        <div class="account-workspace">
          <p class="account-auth-status" data-account-page-notice role="status" aria-live="polite" hidden></p>
          ${dashboardLoading('data-account-page-loading', locale.loading, { account: true })}
          <div class="account-panel account-signin-panel" data-account-page-signed-out hidden>
            ${siteIconMarkup('lock', 'site-icon account-signin-icon', 24)}
            <h2 tabindex="-1">${escapeHtml(locale.signedOutTitle)}</h2>
            <p>${escapeHtml(signInIntro)}</p>
            <button class="account-dashboard-signin" type="button" data-account-page-signin>${escapeHtml(locale.signIn)}</button>
          </div>

          <div data-account-page-signed-in hidden>
            <section id="profile" data-account-panel="profile" aria-labelledby="account-overview-title">
              <div class="account-panel">
                <h2 id="account-overview-title" tabindex="-1">${escapeHtml(profile)}</h2>
                <div class="account-auth-user-preview">
                  <span class="account-profile-avatar">
                    ${siteIconMarkup('user', 'site-icon', 24)}
                    <img alt="" data-account-page-avatar hidden />
                  </span>
                  <div><strong data-account-page-name></strong><span data-account-page-email></span></div>
                </div>
                <dl class="account-profile-facts">
                  <div><dt>${escapeHtml(locale.status)}</dt><dd data-account-page-status>${escapeHtml(locale.active)}</dd></div>
                  <div><dt>${escapeHtml(locale.language)}</dt><dd data-account-page-locale></dd></div>
                  <div><dt>${escapeHtml(locale.memberSince)}</dt><dd data-account-page-created></dd></div>
                </dl>
              </div>
              <form class="account-contact-form account-panel" data-account-contact-form>
                <div class="account-contact-heading">
                  <h3>${escapeHtml(contact.title)}</h3>
                  <p>${escapeHtml(contact.intro)}</p>
                </div>
                <div class="account-contact-fields">
                  <label><span>${escapeHtml(contact.country)}</span><select name="countryCode" data-account-country><option value="">${escapeHtml(contact.chooseCountry)}</option></select></label>
                  <label><span>${escapeHtml(contact.phone)}</span><input name="phoneNumber" type="tel" maxlength="32" autocomplete="tel" placeholder="${escapeHtml(contact.phonePlaceholder)}" /></label>
                  <label><span>${escapeHtml(contact.telegram)}</span><input name="telegramUsername" type="text" maxlength="33" autocomplete="off" placeholder="${escapeHtml(contact.telegramPlaceholder)}" /></label>
                </div>
                <div class="account-contact-actions">
                  <button type="submit" data-account-contact-submit>${escapeHtml(contact.save)}</button>
                  <p class="account-auth-status" data-account-contact-status role="status" aria-live="polite" hidden></p>
                </div>
              </form>
            </section>
            <section id="favorites" class="account-panel account-favorites" data-account-panel="favorites" aria-labelledby="account-favorites-title" hidden>
              <h2 id="account-favorites-title" tabindex="-1">${escapeHtml(favorites)}</h2>
              <p>${escapeHtml(favoritesIntro)}</p>
              <div data-account-favorites-mount></div>
              <a class="account-browse-link" href="${pagePath(locale, 'top-casinos')}">${escapeHtml(browse)}</a>
            </section>
            <section id="reviews" class="account-panel account-review-history" data-account-panel="reviews" data-account-review-history aria-labelledby="account-review-history-title" hidden>
              <h2 id="account-review-history-title" tabindex="-1">${escapeHtml(reviews.title)}</h2>
              <p>${escapeHtml(reviews.intro)}</p>
              ${dashboardLoading('data-account-reviews-loading', reviews.loading)}
              <p class="account-review-history-state" data-account-reviews-empty role="status" hidden>${escapeHtml(reviews.empty)}</p>
              <div class="account-review-history-list" data-account-reviews-list hidden></div>
            </section>
          </div>
          <section id="support" class="account-panel" data-account-panel="support" aria-labelledby="account-support-title" hidden>
            <h2 id="account-support-title" tabindex="-1">${escapeHtml(help)}</h2>
            <div class="account-support-links">
              <a href="${pagePath(locale, 'privacy-policy')}">${siteIconMarkup('lock', 'site-icon', 20)}<span>${escapeHtml(locale.privacy)}</span></a>
              <a href="${pagePath(locale, 'responsible-gambling')}">${siteIconMarkup('safety', 'site-icon', 20)}<span>${escapeHtml(locale.responsible)}</span></a>
            </div>
          </section>
        </div>
      </div>
    </main>`;
};

for (const [language, locale] of Object.entries(locales)) {
  const source = path.join(root, locale.base, 'about', 'index.html');
  const targetDir = path.join(root, locale.base, 'account');
  const target = path.join(targetDir, 'index.html');
  let html = await readFile(target, 'utf8').catch(error => {
    if (error.code !== 'ENOENT') throw error;
    return readFile(source, 'utf8');
  });

  if (!html.includes('data-page="account"')) html = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(locale.title)} | SpinCresta</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeHtml(locale.description)}" />`)
    .replace(/<meta name="robots" content="[^"]*"\s*\/>/, '<meta name="robots" content="noindex, nofollow" />')
    .replace(/\s*<link rel="canonical"[^>]*\/>/g, '')
    .replace(/\s*<link rel="alternate"[^>]*\/>/g, '')
    .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')
    .replace(/<meta name="twitter:(?:title|description)"[^>]*\/>/g, '')
    .replace(/<meta property="og:(?:title|description|url)"[^>]*\/>/g, '')
    .replace('data-page="about"', 'data-page="account"');
  html = syncDefaultTheme(html.replace(/\s*<main\b[^>]*>[\s\S]*?<\/main>/, `\n${renderMain(locale, language)}`));

  html = `${html.split('\n').map(line => line.trimEnd()).join('\n').trimEnd()}\n`;

  await mkdir(targetDir, { recursive: true });
  await writeFile(target, html);
  console.log(`Generated ${language}: ${path.relative(root, targetDir)}/index.html`);
}
