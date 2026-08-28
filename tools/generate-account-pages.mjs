import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ACCOUNT_ASSET_VERSION = '20260828-review-editing-3';
const MAIN_ASSET_VERSION = '20260828-review-editing-3';

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
  en: { kicker: 'PRIVATE CONTACT DETAILS', title: 'Your contact details', intro: 'Optional details visible only to you and approved SpinCresta moderators.', country: 'Country of residence', chooseCountry: 'Choose a country', phone: 'Phone number', phonePlaceholder: '+49 123 456789', telegram: 'Telegram username', telegramPlaceholder: '@username', save: 'Save details' },
  de: { kicker: 'PRIVATE KONTAKTDATEN', title: 'Ihre Kontaktdaten', intro: 'Optionale Angaben, die nur für Sie und freigeschaltete SpinCresta-Moderatoren sichtbar sind.', country: 'Wohnsitzland', chooseCountry: 'Land auswählen', phone: 'Telefonnummer', phonePlaceholder: '+49 123 456789', telegram: 'Telegram-Benutzername', telegramPlaceholder: '@benutzername', save: 'Angaben speichern' },
  es: { kicker: 'DATOS DE CONTACTO PRIVADOS', title: 'Tus datos de contacto', intro: 'Datos opcionales visibles solo para ti y para los moderadores autorizados de SpinCresta.', country: 'País de residencia', chooseCountry: 'Elige un país', phone: 'Número de teléfono', phonePlaceholder: '+34 612 345 678', telegram: 'Usuario de Telegram', telegramPlaceholder: '@usuario', save: 'Guardar datos' },
  it: { kicker: 'CONTATTI PRIVATI', title: 'I tuoi contatti', intro: 'Dati facoltativi visibili solo a te e ai moderatori SpinCresta autorizzati.', country: 'Paese di residenza', chooseCountry: 'Seleziona un Paese', phone: 'Numero di telefono', phonePlaceholder: '+39 312 345 6789', telegram: 'Nome utente Telegram', telegramPlaceholder: '@nomeutente', save: 'Salva i dati' },
  pl: { kicker: 'PRYWATNE DANE KONTAKTOWE', title: 'Twoje dane kontaktowe', intro: 'Opcjonalne dane widoczne tylko dla Ciebie i upoważnionych moderatorów SpinCresta.', country: 'Kraj zamieszkania', chooseCountry: 'Wybierz kraj', phone: 'Numer telefonu', phonePlaceholder: '+48 123 456 789', telegram: 'Nazwa użytkownika Telegram', telegramPlaceholder: '@nazwauzytkownika', save: 'Zapisz dane' },
  uk: { kicker: 'ПРИВАТНІ КОНТАКТНІ ДАНІ', title: 'Ваші контактні дані', intro: 'Необов’язкові дані, які бачите лише ви та уповноважені модератори SpinCresta.', country: 'Країна проживання', chooseCountry: 'Виберіть країну', phone: 'Номер телефону', phonePlaceholder: '+380 67 123 45 67', telegram: 'Ім’я користувача в Telegram', telegramPlaceholder: '@username', save: 'Зберегти дані' },
  pt: { kicker: 'CONTACTOS PRIVADOS', title: 'Os seus contactos', intro: 'Dados opcionais visíveis apenas para si e para os moderadores autorizados da SpinCresta.', country: 'País de residência', chooseCountry: 'Escolha um país', phone: 'Número de telefone', phonePlaceholder: '+351 912 345 678', telegram: 'Nome de utilizador do Telegram', telegramPlaceholder: '@utilizador', save: 'Guardar dados' },
  fr: { kicker: 'COORDONNÉES PRIVÉES', title: 'Vos coordonnées', intro: 'Informations facultatives visibles uniquement par vous et les modérateurs SpinCresta autorisés.', country: 'Pays de résidence', chooseCountry: 'Choisissez un pays', phone: 'Numéro de téléphone', phonePlaceholder: '+33 6 12 34 56 78', telegram: 'Nom d’utilisateur Telegram', telegramPlaceholder: '@utilisateur', save: 'Enregistrer' },
  hi: { kicker: 'निजी संपर्क विवरण', title: 'आपके संपर्क विवरण', intro: 'वैकल्पिक जानकारी, जिसे केवल आप और अधिकृत SpinCresta मॉडरेटर देख सकते हैं।', country: 'निवास का देश', chooseCountry: 'देश चुनें', phone: 'फ़ोन नंबर', phonePlaceholder: '+91 98765 43210', telegram: 'Telegram यूज़रनेम', telegramPlaceholder: '@username', save: 'जानकारी सेव करें' },
  fi: { kicker: 'YKSITYISET YHTEYSTIEDOT', title: 'Yhteystietosi', intro: 'Vapaaehtoiset tiedot näkyvät vain sinulle ja hyväksytyille SpinCresta-moderaattoreille.', country: 'Asuinmaa', chooseCountry: 'Valitse maa', phone: 'Puhelinnumero', phonePlaceholder: '+358 40 123 4567', telegram: 'Telegram-käyttäjänimi', telegramPlaceholder: '@kayttajanimi', save: 'Tallenna tiedot' },
};

const escapeHtml = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const pagePath = (locale, slug) => locale.base ? `/${locale.base}/${slug}/` : `/${slug}/`;

const renderMain = (locale, language) => {
  const contact = contactCopy[language] || contactCopy.en;
  return `
    <main>
      <section class="hero container">
        <div class="hero-content">
          <span class="home-hero-kicker">${escapeHtml(locale.kicker)}</span>
          <h1>${escapeHtml(locale.heading)}</h1>
          <p>${escapeHtml(locale.intro)}</p>
        </div>
        <div class="home-insight-card">
          <div class="home-stats-grid">
            <div class="home-stat-tile">
              <span class="home-stat-number">18+</span>
              <strong>${escapeHtml(locale.status)}</strong>
              <span>${escapeHtml(locale.quickText)}</span>
            </div>
            <div class="home-stat-tile">
              <span class="home-stat-number">01</span>
              <strong>${escapeHtml(locale.privacy)}</strong>
              <span>${escapeHtml(locale.overviewIntro)}</span>
            </div>
          </div>
        </div>
      </section>

      <div class="content-area container">
        <section class="home-showcase-section" data-account-page aria-labelledby="account-overview-title">
          <div class="home-showcase-heading">
            <div>
              <span class="home-section-kicker">${escapeHtml(locale.overviewKicker)}</span>
              <h2 id="account-overview-title">${escapeHtml(locale.overviewTitle)}</h2>
            </div>
            <p>${escapeHtml(locale.overviewIntro)}</p>
          </div>

          <p class="account-auth-status" data-account-page-notice role="status" aria-live="polite" hidden></p>
          <p data-account-page-loading>${escapeHtml(locale.loading)}</p>

          <div class="home-section-cta" data-account-page-signed-out hidden>
            <div>
              <strong>${escapeHtml(locale.signedOutTitle)}</strong>
              <span>${escapeHtml(locale.signedOutIntro)}</span>
            </div>
            <a href="${pagePath(locale, 'account')}" data-account-page-signin>${escapeHtml(locale.signIn)}</a>
          </div>

          <div data-account-page-signed-in hidden>
            <div class="account-auth-user-preview">
              <img alt="" data-account-page-avatar hidden />
              <div><small>${escapeHtml(locale.signedInAs)}</small><strong data-account-page-name></strong><span data-account-page-email></span></div>
            </div>

            <div class="home-method-grid">
              <article><span>01</span><h3>${escapeHtml(locale.status)}</h3><p data-account-page-status>${escapeHtml(locale.active)}</p></article>
              <article><span>02</span><h3>${escapeHtml(locale.language)}</h3><p data-account-page-locale></p></article>
              <article><span>03</span><h3>${escapeHtml(locale.memberSince)}</h3><p data-account-page-created></p></article>
              <article><span>04</span><h3>${escapeHtml(locale.signIn)}</h3><p>Google</p></article>
            </div>

            <form class="account-contact-form" data-account-contact-form>
              <div class="account-contact-heading">
                <span class="home-section-kicker">${escapeHtml(contact.kicker)}</span>
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

            <div class="home-section-cta">
              <div><strong>${escapeHtml(locale.quickTitle)}</strong><span>${escapeHtml(locale.quickText)}</span></div>
              <a href="${pagePath(locale, 'privacy-policy')}">${escapeHtml(locale.privacy)}</a>
              <a href="${pagePath(locale, 'responsible-gambling')}">${escapeHtml(locale.responsible)}</a>
              <a href="/moderator/" data-moderator-link hidden>${escapeHtml(locale.moderator)}</a>
              <a href="${pagePath(locale, 'account')}" data-account-page-signout>${escapeHtml(locale.signOut)}</a>
            </div>
          </div>
        </section>
      </div>
    </main>`;
};

for (const [language, locale] of Object.entries(locales)) {
  const source = path.join(root, locale.base, 'about', 'index.html');
  const targetDir = path.join(root, locale.base, 'account');
  let html = await readFile(source, 'utf8');

  html = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(locale.title)} | SpinCresta</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeHtml(locale.description)}" />`)
    .replace(/<meta name="robots" content="[^"]*"\s*\/>/, '<meta name="robots" content="noindex, nofollow" />')
    .replace(/\s*<link rel="canonical"[^>]*\/>/g, '')
    .replace(/\s*<link rel="alternate"[^>]*\/>/g, '')
    .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')
    .replace(/<meta name="twitter:(?:title|description)"[^>]*\/>/g, '')
    .replace(/<meta property="og:(?:title|description|url)"[^>]*\/>/g, '')
    .replace('data-page="about"', 'data-page="account"')
    .replace(/\/styles\.css\?v=[^"']+/g, `/styles.css?v=${ACCOUNT_ASSET_VERSION}`)
    .replace(/\/scripts\/main\.js\?v=[^"']+/g, `/scripts/main.js?v=${MAIN_ASSET_VERSION}`)
    .replace(/\s*<main>[\s\S]*?<\/main>/, `\n${renderMain(locale, language)}`);

  html = `${html.split('\n').map(line => line.trimEnd()).join('\n').trimEnd()}\n`;

  await mkdir(targetDir, { recursive: true });
  await writeFile(path.join(targetDir, 'index.html'), html);
  console.log(`Generated ${language}: ${path.relative(root, targetDir)}/index.html`);
}
