const DEFAULT_CONFIG_ENDPOINT = 'https://api.spincresta.com/api/auth-config';
const DEFAULT_NEWSLETTER_ENDPOINT = 'https://api.spincresta.com/api/subscribe';
const SUPABASE_MODULE_URL = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
const GOOGLE_SCRIPT_URL = 'https://accounts.google.com/gsi/client';

const COPY = {
  en: {
    signIn: 'Sign in',
    dialogTitle: 'Join SpinCresta',
    dialogIntro: 'Use your Google account to save your profile and take part in future ratings and reviews.',
    completeTitle: 'Complete your registration',
    age: 'I confirm that I am 18 or older.',
    privacy: 'I have read the Privacy Policy.',
    newsletter: 'Send me occasional SpinCresta updates. I can unsubscribe at any time.',
    privacyLink: 'Privacy Policy',
    complete: 'Create account',
    completing: 'Creating account…',
    account: 'Your account',
    accountIntro: 'Your SpinCresta profile and account details.',
    signedInAs: 'Signed in as',
    statusLabel: 'Account status',
    active: 'Active',
    languageLabel: 'Site language',
    memberSince: 'Member since',
    responsibleLink: 'Responsible gambling',
    signOut: 'Sign out',
    required: 'Confirm your age and acknowledge the Privacy Policy to continue.',
    failed: 'Google sign-in is temporarily unavailable. Please try again.',
    profileFailed: 'We could not finish your profile. Please try again.',
    newsletterPending: 'Account created. Check your inbox to confirm the optional email subscription.',
    newsletterFailed: 'Your account is ready, but the optional email subscription could not be started. You can subscribe later in the footer.',
    success: 'Your SpinCresta account is ready.',
    close: 'Close',
  },
  de: {
    signIn: 'Anmelden', dialogTitle: 'Bei SpinCresta registrieren', dialogIntro: 'Nutzen Sie Ihr Google-Konto, um Ihr Profil zu speichern und künftig Bewertungen abzugeben.', completeTitle: 'Registrierung abschließen', age: 'Ich bestätige, dass ich mindestens 18 Jahre alt bin.', privacy: 'Ich habe die Datenschutzerklärung gelesen.', newsletter: 'Ich möchte gelegentliche SpinCresta-Updates erhalten. Eine Abmeldung ist jederzeit möglich.', privacyLink: 'Datenschutzerklärung', complete: 'Konto erstellen', completing: 'Konto wird erstellt…', account: 'Ihr Konto', signedInAs: 'Angemeldet als', signOut: 'Abmelden', required: 'Bestätigen Sie Ihr Alter und die Datenschutzerklärung, um fortzufahren.', failed: 'Die Google-Anmeldung ist derzeit nicht verfügbar. Versuchen Sie es erneut.', profileFailed: 'Ihr Profil konnte nicht fertiggestellt werden. Versuchen Sie es erneut.', newsletterPending: 'Konto erstellt. Bestätigen Sie das optionale E-Mail-Abonnement über Ihr Postfach.', newsletterFailed: 'Ihr Konto ist bereit, aber das optionale E-Mail-Abonnement konnte nicht gestartet werden. Sie können es später im Footer abonnieren.', success: 'Ihr SpinCresta-Konto ist bereit.', close: 'Schließen',
    accountIntro: 'Ihr SpinCresta-Profil und Ihre Kontodaten.', statusLabel: 'Kontostatus', active: 'Aktiv', languageLabel: 'Seitensprache', memberSince: 'Mitglied seit', responsibleLink: 'Verantwortungsvolles Spielen',
  },
  es: {
    signIn: 'Iniciar sesión', dialogTitle: 'Únete a SpinCresta', dialogIntro: 'Usa tu cuenta de Google para guardar tu perfil y participar en futuras valoraciones y reseñas.', completeTitle: 'Completa tu registro', age: 'Confirmo que tengo al menos 18 años.', privacy: 'He leído la Política de privacidad.', newsletter: 'Quiero recibir novedades ocasionales de SpinCresta. Puedo darme de baja cuando quiera.', privacyLink: 'Política de privacidad', complete: 'Crear cuenta', completing: 'Creando la cuenta…', account: 'Tu cuenta', signedInAs: 'Sesión iniciada como', signOut: 'Cerrar sesión', required: 'Confirma tu edad y la Política de privacidad para continuar.', failed: 'El acceso con Google no está disponible temporalmente. Inténtalo de nuevo.', profileFailed: 'No hemos podido completar tu perfil. Inténtalo de nuevo.', newsletterPending: 'Cuenta creada. Revisa tu correo para confirmar la suscripción opcional.', newsletterFailed: 'Tu cuenta está lista, pero no se pudo iniciar la suscripción opcional. Puedes suscribirte más tarde desde el pie de página.', success: 'Tu cuenta de SpinCresta está lista.', close: 'Cerrar',
    accountIntro: 'Tu perfil y los datos de tu cuenta de SpinCresta.', statusLabel: 'Estado de la cuenta', active: 'Activa', languageLabel: 'Idioma del sitio', memberSince: 'Miembro desde', responsibleLink: 'Juego responsable',
  },
  it: {
    signIn: 'Accedi', dialogTitle: 'Unisciti a SpinCresta', dialogIntro: 'Usa il tuo account Google per salvare il profilo e partecipare alle future valutazioni e recensioni.', completeTitle: 'Completa la registrazione', age: 'Confermo di avere almeno 18 anni.', privacy: 'Ho letto l’Informativa sulla privacy.', newsletter: 'Desidero ricevere aggiornamenti occasionali da SpinCresta. Posso annullare l’iscrizione in qualsiasi momento.', privacyLink: 'Informativa sulla privacy', complete: 'Crea account', completing: 'Creazione dell’account…', account: 'Il tuo account', signedInAs: 'Accesso effettuato come', signOut: 'Esci', required: 'Conferma la tua età e l’Informativa sulla privacy per continuare.', failed: 'L’accesso con Google non è temporaneamente disponibile. Riprova.', profileFailed: 'Non è stato possibile completare il profilo. Riprova.', newsletterPending: 'Account creato. Controlla la posta per confermare l’iscrizione facoltativa.', newsletterFailed: 'Il tuo account è pronto, ma non è stato possibile avviare l’iscrizione facoltativa. Puoi iscriverti più tardi dal footer.', success: 'Il tuo account SpinCresta è pronto.', close: 'Chiudi',
    accountIntro: 'Il tuo profilo SpinCresta e i dati dell’account.', statusLabel: 'Stato dell’account', active: 'Attivo', languageLabel: 'Lingua del sito', memberSince: 'Membro dal', responsibleLink: 'Gioco responsabile',
  },
  pl: {
    signIn: 'Zaloguj się', dialogTitle: 'Dołącz do SpinCresta', dialogIntro: 'Użyj konta Google, aby zapisać profil i w przyszłości dodawać oceny oraz recenzje.', completeTitle: 'Dokończ rejestrację', age: 'Potwierdzam, że mam co najmniej 18 lat.', privacy: 'Zapoznałem(-am) się z Polityką prywatności.', newsletter: 'Chcę otrzymywać okazjonalne aktualności SpinCresta. Mogę zrezygnować w dowolnym momencie.', privacyLink: 'Polityka prywatności', complete: 'Utwórz konto', completing: 'Tworzenie konta…', account: 'Twoje konto', signedInAs: 'Zalogowano jako', signOut: 'Wyloguj się', required: 'Potwierdź wiek i zapoznanie się z Polityką prywatności.', failed: 'Logowanie przez Google jest chwilowo niedostępne. Spróbuj ponownie.', profileFailed: 'Nie udało się dokończyć profilu. Spróbuj ponownie.', newsletterPending: 'Konto utworzono. Potwierdź opcjonalną subskrypcję w wiadomości e-mail.', newsletterFailed: 'Konto jest gotowe, ale nie udało się uruchomić opcjonalnej subskrypcji. Możesz zapisać się później w stopce.', success: 'Twoje konto SpinCresta jest gotowe.', close: 'Zamknij',
    accountIntro: 'Twój profil SpinCresta i dane konta.', statusLabel: 'Status konta', active: 'Aktywne', languageLabel: 'Język strony', memberSince: 'Użytkownik od', responsibleLink: 'Odpowiedzialna gra',
  },
  uk: {
    signIn: 'Увійти', dialogTitle: 'Приєднатися до SpinCresta', dialogIntro: 'Скористайтеся Google-акаунтом, щоб зберегти профіль і надалі ставити оцінки та писати відгуки.', completeTitle: 'Завершіть реєстрацію', age: 'Підтверджую, що мені виповнилося 18 років.', privacy: 'Я ознайомився(-лася) з Політикою конфіденційності.', newsletter: 'Хочу отримувати періодичні оновлення SpinCresta. Відписатися можна будь-коли.', privacyLink: 'Політика конфіденційності', complete: 'Створити акаунт', completing: 'Створюємо акаунт…', account: 'Ваш акаунт', signedInAs: 'Ви увійшли як', signOut: 'Вийти', required: 'Підтвердьте свій вік і ознайомлення з Політикою конфіденційності.', failed: 'Вхід через Google тимчасово недоступний. Спробуйте ще раз.', profileFailed: 'Не вдалося завершити налаштування профілю. Спробуйте ще раз.', newsletterPending: 'Акаунт створено. Перевірте пошту, щоб підтвердити необов’язкову підписку.', newsletterFailed: 'Акаунт готовий, але необов’язкову підписку запустити не вдалося. Підписатися можна пізніше у футері.', success: 'Ваш акаунт SpinCresta готовий.', close: 'Закрити',
    accountIntro: 'Ваш профіль SpinCresta та дані акаунта.', statusLabel: 'Статус акаунта', active: 'Активний', languageLabel: 'Мова сайту', memberSince: 'Дата реєстрації', responsibleLink: 'Відповідальна гра',
  },
  pt: {
    signIn: 'Entrar', dialogTitle: 'Junte-se à SpinCresta', dialogIntro: 'Use a sua conta Google para guardar o perfil e participar em futuras avaliações e análises.', completeTitle: 'Conclua o registo', age: 'Confirmo que tenho pelo menos 18 anos.', privacy: 'Li a Política de privacidade.', newsletter: 'Quero receber atualizações ocasionais da SpinCresta. Posso cancelar a subscrição a qualquer momento.', privacyLink: 'Política de privacidade', complete: 'Criar conta', completing: 'A criar a conta…', account: 'A sua conta', signedInAs: 'Sessão iniciada como', signOut: 'Terminar sessão', required: 'Confirme a sua idade e a Política de privacidade para continuar.', failed: 'O início de sessão com o Google está temporariamente indisponível. Tente novamente.', profileFailed: 'Não foi possível concluir o seu perfil. Tente novamente.', newsletterPending: 'Conta criada. Consulte o email para confirmar a subscrição opcional.', newsletterFailed: 'A conta está pronta, mas não foi possível iniciar a subscrição opcional. Pode subscrever mais tarde no rodapé.', success: 'A sua conta SpinCresta está pronta.', close: 'Fechar',
    accountIntro: 'O seu perfil SpinCresta e os dados da conta.', statusLabel: 'Estado da conta', active: 'Ativa', languageLabel: 'Idioma do site', memberSince: 'Membro desde', responsibleLink: 'Jogo responsável',
  },
  fr: {
    signIn: 'Se connecter', dialogTitle: 'Rejoindre SpinCresta', dialogIntro: 'Utilisez votre compte Google pour enregistrer votre profil et participer aux futures notes et évaluations.', completeTitle: 'Terminez votre inscription', age: 'Je confirme avoir au moins 18 ans.', privacy: 'J’ai lu la Politique de confidentialité.', newsletter: 'Je souhaite recevoir des actualités occasionnelles de SpinCresta. Je peux me désabonner à tout moment.', privacyLink: 'Politique de confidentialité', complete: 'Créer un compte', completing: 'Création du compte…', account: 'Votre compte', signedInAs: 'Connecté en tant que', signOut: 'Se déconnecter', required: 'Confirmez votre âge et la Politique de confidentialité pour continuer.', failed: 'La connexion Google est temporairement indisponible. Réessayez.', profileFailed: 'Nous n’avons pas pu terminer votre profil. Réessayez.', newsletterPending: 'Compte créé. Consultez votre messagerie pour confirmer l’abonnement facultatif.', newsletterFailed: 'Votre compte est prêt, mais l’abonnement facultatif n’a pas pu être lancé. Vous pourrez vous inscrire plus tard dans le pied de page.', success: 'Votre compte SpinCresta est prêt.', close: 'Fermer',
    accountIntro: 'Votre profil SpinCresta et les informations du compte.', statusLabel: 'Statut du compte', active: 'Actif', languageLabel: 'Langue du site', memberSince: 'Membre depuis', responsibleLink: 'Jeu responsable',
  },
  hi: {
    signIn: 'साइन इन करें', dialogTitle: 'SpinCresta से जुड़ें', dialogIntro: 'अपनी प्रोफ़ाइल सहेजने और आगे रेटिंग व समीक्षाएँ देने के लिए Google खाते का उपयोग करें।', completeTitle: 'पंजीकरण पूरा करें', age: 'मैं पुष्टि करता/करती हूँ कि मेरी आयु कम से कम 18 वर्ष है।', privacy: 'मैंने गोपनीयता नीति पढ़ ली है।', newsletter: 'मैं कभी-कभार SpinCresta अपडेट पाना चाहता/चाहती हूँ। मैं किसी भी समय सदस्यता छोड़ सकता/सकती हूँ।', privacyLink: 'गोपनीयता नीति', complete: 'खाता बनाएँ', completing: 'खाता बनाया जा रहा है…', account: 'आपका खाता', signedInAs: 'इस रूप में साइन इन हैं', signOut: 'साइन आउट करें', required: 'जारी रखने के लिए अपनी आयु और गोपनीयता नीति की पुष्टि करें।', failed: 'Google साइन-इन अभी उपलब्ध नहीं है। फिर कोशिश करें।', profileFailed: 'आपकी प्रोफ़ाइल पूरी नहीं हो सकी। फिर कोशिश करें।', newsletterPending: 'खाता बन गया है। वैकल्पिक ईमेल सदस्यता की पुष्टि के लिए अपना इनबॉक्स देखें।', newsletterFailed: 'आपका खाता तैयार है, लेकिन वैकल्पिक ईमेल सदस्यता शुरू नहीं हो सकी। आप बाद में फ़ुटर से सदस्यता ले सकते हैं।', success: 'आपका SpinCresta खाता तैयार है।', close: 'बंद करें',
    accountIntro: 'आपकी SpinCresta प्रोफ़ाइल और खाते की जानकारी।', statusLabel: 'खाते की स्थिति', active: 'सक्रिय', languageLabel: 'साइट की भाषा', memberSince: 'सदस्यता की तारीख', responsibleLink: 'जिम्मेदार जुआ',
  },
  fi: {
    signIn: 'Kirjaudu', dialogTitle: 'Liity SpinCrestaan', dialogIntro: 'Tallenna profiilisi Google-tilillä ja osallistu myöhemmin arvioihin ja arvosteluihin.', completeTitle: 'Viimeistele rekisteröityminen', age: 'Vahvistan olevani vähintään 18-vuotias.', privacy: 'Olen lukenut tietosuojakäytännön.', newsletter: 'Haluan saada ajoittain SpinCrestan päivityksiä. Voin perua tilauksen milloin tahansa.', privacyLink: 'Tietosuojakäytäntö', complete: 'Luo tili', completing: 'Tiliä luodaan…', account: 'Tilisi', signedInAs: 'Kirjautuneena käyttäjänä', signOut: 'Kirjaudu ulos', required: 'Vahvista ikäsi ja tietosuojakäytäntö jatkaaksesi.', failed: 'Google-kirjautuminen ei ole juuri nyt käytettävissä. Yritä uudelleen.', profileFailed: 'Profiilia ei voitu viimeistellä. Yritä uudelleen.', newsletterPending: 'Tili luotiin. Vahvista valinnainen sähköpostitilaus postilaatikostasi.', newsletterFailed: 'Tilisi on valmis, mutta valinnaista sähköpostitilausta ei voitu aloittaa. Voit tilata myöhemmin alatunnisteesta.', success: 'SpinCresta-tilisi on valmis.', close: 'Sulje',
    accountIntro: 'SpinCresta-profiilisi ja tilisi tiedot.', statusLabel: 'Tilin tila', active: 'Aktiivinen', languageLabel: 'Sivuston kieli', memberSince: 'Jäsen alkaen', responsibleLink: 'Vastuullinen pelaaminen',
  },
};

const privacyPath = locale => locale === 'en' ? '/privacy-policy/' : `/${locale}/privacy-policy/`;
const responsiblePath = locale => locale === 'en'
  ? '/responsible-gambling/'
  : `/${locale}/responsible-gambling/`;
const accountPath = locale => locale === 'en' ? '/account/' : `/${locale}/account/`;
const ACCOUNT_NOTICE_KEY = 'spincresta-account-notice';

const loadGoogleIdentity = () => new Promise((resolve, reject) => {
  if (window.google?.accounts?.id) {
    resolve(window.google);
    return;
  }

  const existing = document.querySelector(`script[src="${GOOGLE_SCRIPT_URL}"]`);
  if (existing) {
    existing.addEventListener('load', () => resolve(window.google), { once: true });
    existing.addEventListener('error', reject, { once: true });
    return;
  }

  const script = document.createElement('script');
  script.src = GOOGLE_SCRIPT_URL;
  script.async = true;
  script.defer = true;
  script.addEventListener('load', () => resolve(window.google), { once: true });
  script.addEventListener('error', reject, { once: true });
  document.head.append(script);
});

const createNonce = async () => {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  const raw = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
  const hashed = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
  return { raw, hashed };
};

const setStatus = (modal, message, state = '') => {
  const status = modal.querySelector('.account-auth-status');
  if (!status) return;
  status.textContent = message;
  status.dataset.state = state;
};

const createInterface = (copy, locale) => {
  const headerInner = document.querySelector('.header-inner');
  if (!headerInner || headerInner.querySelector('.account-auth-control')) return null;

  const control = document.createElement('button');
  control.type = 'button';
  control.disabled = true;
  control.className = 'account-auth-control';
  control.setAttribute('aria-haspopup', 'dialog');
  control.setAttribute('aria-label', copy.signIn);
  control.innerHTML = `
    <span class="account-auth-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" role="img"><path d="M12 12a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Zm-7.25 8.5c.7-4 3.2-6.25 7.25-6.25s6.55 2.25 7.25 6.25" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
    </span>
    <span class="account-auth-label">${copy.signIn}</span>
  `;

  const modal = document.createElement('div');
  modal.className = 'account-auth-modal';
  modal.hidden = true;
  modal.innerHTML = `
    <div class="account-auth-backdrop" data-account-close></div>
    <section class="account-auth-dialog" role="dialog" aria-modal="true" aria-labelledby="accountAuthTitle">
      <button class="account-auth-close" type="button" data-account-close aria-label="${copy.close}">&times;</button>
      <div class="account-auth-signin" data-account-view="signin">
        <span class="account-auth-kicker">SPINCRESTA ACCOUNT</span>
        <h2 id="accountAuthTitle">${copy.dialogTitle}</h2>
        <p>${copy.dialogIntro}</p>
        <div class="account-google-button" data-google-button></div>
      </div>
      <form class="account-auth-completion" data-account-view="completion" hidden>
        <span class="account-auth-kicker">SPINCRESTA ACCOUNT</span>
        <h2>${copy.completeTitle}</h2>
        <div class="account-auth-user-preview">
          <img alt="" data-account-avatar hidden />
          <div><strong data-account-name></strong><span data-account-email></span></div>
        </div>
        <label class="account-auth-choice"><input name="ageConfirmed" type="checkbox" required /><span>${copy.age}</span></label>
        <label class="account-auth-choice"><input name="privacyAcknowledged" type="checkbox" required /><span>${copy.privacy} <a href="${privacyPath(locale)}">${copy.privacyLink}</a></span></label>
        <label class="account-auth-choice"><input name="newsletterConsent" type="checkbox" /><span>${copy.newsletter}</span></label>
        <button class="account-auth-primary" type="submit">${copy.complete}</button>
      </form>
      <div class="account-auth-profile" data-account-view="profile" hidden>
        <span class="account-auth-kicker">SPINCRESTA ACCOUNT</span>
        <h2>${copy.account}</h2>
        <p class="account-auth-profile-intro">${copy.accountIntro}</p>
        <div class="account-auth-user-preview">
          <img alt="" data-profile-avatar hidden />
          <div><small>${copy.signedInAs}</small><strong data-profile-name></strong><span data-profile-email></span></div>
        </div>
        <div class="account-auth-summary">
          <div><span>${copy.statusLabel}</span><strong>${copy.active}</strong></div>
          <div><span>${copy.languageLabel}</span><strong data-profile-locale></strong></div>
          <div><span>${copy.memberSince}</span><strong data-profile-created></strong></div>
        </div>
        <nav class="account-auth-links" aria-label="${copy.account}">
          <a href="${privacyPath(locale)}">${copy.privacyLink}</a>
          <a href="${responsiblePath(locale)}">${copy.responsibleLink}</a>
        </nav>
        <button class="account-auth-secondary" type="button" data-account-signout>${copy.signOut}</button>
      </div>
      <p class="account-auth-status" role="status" aria-live="polite"></p>
    </section>
  `;

  headerInner.append(control);
  document.body.append(modal);
  return { control, modal };
};

export const initAccountAuth = async locale => {
  const copy = COPY[locale] || COPY.en;
  const ui = createInterface(copy, locale);
  if (!ui) return;

  const { control, modal } = ui;
  const views = Array.from(modal.querySelectorAll('[data-account-view]'));
  const completionForm = modal.querySelector('.account-auth-completion');
  const googleButton = modal.querySelector('[data-google-button]');
  const accountPage = document.querySelector('[data-account-page]');
  const originalCompleteLabel = completionForm.querySelector('.account-auth-primary').textContent;
  let supabase;
  let googleReady = false;
  let nonce;
  let currentUser = null;
  let currentProfile = null;
  let autoCloseTimer = 0;

  const showView = name => {
    views.forEach(view => { view.hidden = view.dataset.accountView !== name; });
  };

  const openModal = view => {
    window.clearTimeout(autoCloseTimer);
    showView(view);
    modal.hidden = false;
    document.body.classList.add('account-auth-open');
    setStatus(modal, '');
  };

  const closeModal = () => {
    window.clearTimeout(autoCloseTimer);
    modal.hidden = true;
    document.body.classList.remove('account-auth-open');
  };

  const updateControl = () => {
    const label = control.querySelector('.account-auth-label');
    const avatarUrl = currentProfile?.avatar_url || currentUser?.user_metadata?.avatar_url;
    label.textContent = currentUser
      ? (currentProfile?.display_name || currentUser.user_metadata?.full_name || copy.account)
      : copy.signIn;
    control.setAttribute('aria-label', currentUser ? copy.account : copy.signIn);
    control.classList.toggle('is-signed-in', Boolean(currentUser));
    const existingAvatar = control.querySelector('.account-auth-avatar');
    existingAvatar?.remove();
    if (currentUser && avatarUrl) {
      const avatar = document.createElement('img');
      avatar.className = 'account-auth-avatar';
      avatar.src = avatarUrl;
      avatar.alt = '';
      control.prepend(avatar);
    }
  };

  const loadProfile = async user => {
    const [profileResult, settingsResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', user.id)
        .single(),
      supabase
        .from('user_account_settings')
        .select('locale, age_confirmed_at, privacy_acknowledged_at, registration_completed_at, created_at')
        .eq('user_id', user.id)
        .single(),
    ]);
    if (profileResult.error) throw profileResult.error;
    if (settingsResult.error) throw settingsResult.error;
    return { ...profileResult.data, ...settingsResult.data };
  };

  const populateUser = (prefix, user, profile, root = modal) => {
    const name = profile?.display_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email || '';
    const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture;
    const nameElement = root.querySelector(`[data-${prefix}-name]`);
    const emailElement = root.querySelector(`[data-${prefix}-email]`);
    const avatar = root.querySelector(`[data-${prefix}-avatar]`);
    if (nameElement) nameElement.textContent = name;
    if (emailElement) emailElement.textContent = user.email || '';
    if (avatar && avatarUrl) {
      avatar.src = avatarUrl;
      avatar.alt = '';
      avatar.hidden = false;
    }
  };

  const populateProfileSummary = (profile, root = modal, prefix = 'profile') => {
    const localeElement = root.querySelector(`[data-${prefix}-locale]`);
    const createdElement = root.querySelector(`[data-${prefix}-created]`);
    const profileLocale = profile?.locale || locale;

    if (localeElement) {
      try {
        localeElement.textContent = new Intl.DisplayNames([locale], { type: 'language' })
          .of(profileLocale) || profileLocale.toUpperCase();
      } catch {
        localeElement.textContent = profileLocale.toUpperCase();
      }
    }

    if (createdElement) {
      const createdAt = profile?.created_at || currentUser?.created_at;
      createdElement.textContent = createdAt
        ? new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(createdAt))
        : '—';
    }
  };

  const renderAccountPage = () => {
    if (!accountPage) return;
    const loading = accountPage.querySelector('[data-account-page-loading]');
    const signedOut = accountPage.querySelector('[data-account-page-signed-out]');
    const signedIn = accountPage.querySelector('[data-account-page-signed-in]');
    const notice = accountPage.querySelector('[data-account-page-notice]');
    if (loading) loading.hidden = true;
    if (signedOut) signedOut.hidden = Boolean(currentUser);
    if (signedIn) signedIn.hidden = !currentUser;

    if (currentUser) {
      populateUser('account-page', currentUser, currentProfile, accountPage);
      populateProfileSummary(currentProfile, accountPage, 'account-page');
    }

    if (notice && !notice.dataset.initialized) {
      notice.dataset.initialized = 'true';
      notice.hidden = true;
      try {
        const savedNotice = JSON.parse(sessionStorage.getItem(ACCOUNT_NOTICE_KEY) || 'null');
        sessionStorage.removeItem(ACCOUNT_NOTICE_KEY);
        if (savedNotice?.message) {
          notice.textContent = savedNotice.message;
          notice.dataset.state = savedNotice.state || 'success';
          notice.hidden = false;
        }
      } catch {
        sessionStorage.removeItem(ACCOUNT_NOTICE_KEY);
      }
    }
  };

  const syncSession = async ({ openIncomplete = false } = {}) => {
    const { data } = await supabase.auth.getSession();
    currentUser = data.session?.user || null;
    currentProfile = currentUser ? await loadProfile(currentUser) : null;
    updateControl();
    renderAccountPage();

    if (currentUser && googleReady) {
      window.google?.accounts?.id?.cancel();
    }

    if (currentUser && !currentProfile?.registration_completed_at && openIncomplete) {
      populateUser('account', currentUser, currentProfile);
      openModal('completion');
    }
  };

  const handleGoogleCredential = async response => {
    if (!response?.credential || !nonce?.raw) return;
    setStatus(modal, '');
    try {
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
        nonce: nonce.raw,
      });
      if (error) throw error;
      await syncSession({ openIncomplete: true });
      if (currentProfile?.registration_completed_at) closeModal();
    } catch {
      openModal('signin');
      setStatus(modal, copy.failed, 'error');
    }
  };

  const prepareGoogle = async config => {
    if (googleReady) return;
    const google = await loadGoogleIdentity();
    nonce = await createNonce();
    google.accounts.id.initialize({
      client_id: config.googleClientId,
      callback: handleGoogleCredential,
      nonce: nonce.hashed,
      context: 'signin',
      ux_mode: 'popup',
      use_fedcm_for_prompt: true,
    });
    google.accounts.id.renderButton(googleButton, {
      type: 'standard',
      theme: 'filled_black',
      size: 'large',
      shape: 'rectangular',
      text: 'continue_with',
      width: Math.min(340, Math.max(240, googleButton.clientWidth || 320)),
    });
    googleReady = true;

    window.setTimeout(() => {
      if (!currentUser) google.accounts.id.prompt();
    }, 1200);

  };

  control.addEventListener('click', () => {
    if (currentUser) {
      if (accountPage) {
        accountPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.location.assign(accountPath(locale));
      }
      return;
    }
    openModal('signin');
  });

  modal.querySelectorAll('[data-account-close]').forEach(button => {
    button.addEventListener('click', closeModal);
  });

  modal.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeModal();
  });

  completionForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (!currentUser) return;

    const age = completionForm.elements.ageConfirmed;
    const privacy = completionForm.elements.privacyAcknowledged;
    const newsletter = completionForm.elements.newsletterConsent;
    if (!age.checked || !privacy.checked) {
      setStatus(modal, copy.required, 'error');
      (!age.checked ? age : privacy).focus();
      return;
    }

    const button = completionForm.querySelector('.account-auth-primary');
    button.disabled = true;
    button.textContent = copy.completing;
    const completedAt = new Date().toISOString();

    try {
      const rawDisplayName = String(
        currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || ''
      ).trim();
      const displayName = rawDisplayName.length >= 2 ? rawDisplayName.slice(0, 60) : null;
      const avatarUrl = currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture || null;
      const { error: profileError } = await supabase.from('profiles').update({
        display_name: displayName,
        avatar_url: avatarUrl,
      }).eq('id', currentUser.id);
      if (profileError) throw profileError;

      const { error } = await supabase.from('user_account_settings').update({
        locale,
        age_confirmed_at: completedAt,
        privacy_acknowledged_at: completedAt,
        registration_completed_at: completedAt,
      }).eq('user_id', currentUser.id);
      if (error) throw error;

      let newsletterState = 'not_requested';
      if (newsletter.checked && currentUser.email) {
        try {
          const response = await fetch(
            document.documentElement.dataset.newsletterEndpoint || DEFAULT_NEWSLETTER_ENDPOINT,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: currentUser.email,
                website: '',
                consent: true,
                locale,
              }),
            }
          );
          newsletterState = response.ok ? 'pending' : 'failed';
        } catch {
          newsletterState = 'failed';
        }
      }

      currentProfile = await loadProfile(currentUser);
      updateControl();
      populateUser('profile', currentUser, currentProfile);
      populateProfileSummary(currentProfile);
      openModal('profile');
      const message = newsletterState === 'pending'
        ? copy.newsletterPending
        : newsletterState === 'failed'
          ? copy.newsletterFailed
          : copy.success;
      setStatus(modal, message, newsletterState === 'failed' ? 'error' : 'success');
      sessionStorage.setItem(ACCOUNT_NOTICE_KEY, JSON.stringify({
        message,
        state: newsletterState === 'failed' ? 'error' : 'success',
      }));
      autoCloseTimer = window.setTimeout(() => {
        window.location.assign(accountPath(locale));
      }, 1200);
    } catch {
      setStatus(modal, copy.profileFailed, 'error');
    } finally {
      button.disabled = false;
      button.textContent = originalCompleteLabel;
    }
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    currentUser = null;
    currentProfile = null;
    updateControl();
    renderAccountPage();
    closeModal();
  };

  modal.querySelector('[data-account-signout]').addEventListener('click', signOut);
  accountPage?.querySelector('[data-account-page-signin]')?.addEventListener('click', event => {
    event.preventDefault();
    openModal('signin');
  });
  accountPage?.querySelector('[data-account-page-signout]')?.addEventListener('click', event => {
    event.preventDefault();
    signOut();
  });

  try {
    const configResponse = await fetch(
      document.documentElement.dataset.authConfigEndpoint || DEFAULT_CONFIG_ENDPOINT,
      { headers: { Accept: 'application/json' } }
    );
    if (!configResponse.ok) throw new Error('auth_config_unavailable');
    const config = await configResponse.json();
    const { createClient } = await import(SUPABASE_MODULE_URL);
    supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });

    await syncSession({ openIncomplete: true });
    await prepareGoogle(config);
    control.disabled = false;
    supabase.auth.onAuthStateChange(() => {
      window.setTimeout(() => syncSession({ openIncomplete: true }).catch(() => {}), 0);
    });
  } catch {
    control.remove();
    modal.remove();
  }
};
