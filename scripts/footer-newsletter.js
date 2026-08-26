const DEFAULT_ENDPOINT = 'https://api.spincresta.com/api/subscribe';

const COPY = {
  en: {
    eyebrow: 'STAY IN THE LOOP',
    title: 'Fresh reviews, without the daily noise',
    description: 'Get new casino reviews, country guides and important availability updates in one concise email.',
    placeholder: 'Email address',
    emailLabel: 'Email address',
    submit: 'Subscribe',
    sending: 'Subscribing…',
    success: 'Almost done — check your inbox and confirm your subscription.',
    invalid: 'Enter a valid email address.',
    error: 'We could not start your subscription. Please try again shortly.',
    ageRequired: 'Confirm that you are 18 or older.',
    consentRequired: 'Confirm that you agree to receive SpinCresta updates.',
    rateLimited: 'Too many attempts. Please wait a minute and try again.',
    age: 'I confirm that I am 18 or older.',
    consent: 'I agree to receive SpinCresta email updates about new reviews, country guides and important availability changes. I can unsubscribe at any time.',
    disclosure: 'SpinCresta uses Brevo to deliver emails and manage subscriptions.',
    privacy: 'Privacy Policy',
    confirmedTitle: 'Subscription confirmed',
    confirmedMessage: 'Your email is confirmed. You will now receive occasional SpinCresta updates.',
    close: 'Close',
  },
  de: {
    eyebrow: 'AUF DEM LAUFENDEN BLEIBEN',
    title: 'Neue Tests, ohne tägliche Werbeflut',
    description: 'Erhalten Sie neue Casino-Tests, Länder-Guides und wichtige Hinweise zur Verfügbarkeit in einer kompakten E-Mail.',
    placeholder: 'E-Mail-Adresse',
    emailLabel: 'E-Mail-Adresse',
    submit: 'Abonnieren',
    sending: 'Wird abonniert…',
    success: 'Fast geschafft — öffnen Sie Ihr Postfach und bestätigen Sie das Abonnement.',
    invalid: 'Geben Sie eine gültige E-Mail-Adresse ein.',
    error: 'Das Abonnement konnte nicht gestartet werden. Versuchen Sie es bitte später erneut.',
    ageRequired: 'Bestätigen Sie, dass Sie mindestens 18 Jahre alt sind.',
    consentRequired: 'Bestätigen Sie, dass Sie SpinCresta-Updates erhalten möchten.',
    rateLimited: 'Zu viele Versuche. Warten Sie bitte eine Minute und versuchen Sie es erneut.',
    age: 'Ich bestätige, dass ich mindestens 18 Jahre alt bin.',
    consent: 'Ich möchte E-Mail-Updates von SpinCresta zu neuen Tests, Länder-Guides und wichtigen Änderungen der Verfügbarkeit erhalten. Eine Abmeldung ist jederzeit möglich.',
    disclosure: 'SpinCresta nutzt Brevo für den E-Mail-Versand und die Verwaltung von Abonnements.',
    privacy: 'Datenschutzerklärung',
    confirmedTitle: 'Abonnement bestätigt',
    confirmedMessage: 'Ihre E-Mail-Adresse ist bestätigt. Sie erhalten nun gelegentliche SpinCresta-Updates.',
    close: 'Schließen',
  },
  es: {
    eyebrow: 'MANTENTE AL DÍA',
    title: 'Nuevas reseñas, sin correos innecesarios',
    description: 'Recibe nuevas reseñas de casinos, guías por país y cambios importantes de disponibilidad en un correo breve.',
    placeholder: 'Correo electrónico',
    emailLabel: 'Correo electrónico',
    submit: 'Suscribirme',
    sending: 'Suscribiendo…',
    success: 'Ya casi está: revisa tu correo y confirma la suscripción.',
    invalid: 'Introduce un correo electrónico válido.',
    error: 'No hemos podido iniciar la suscripción. Inténtalo de nuevo en unos minutos.',
    ageRequired: 'Confirma que tienes al menos 18 años.',
    consentRequired: 'Confirma que aceptas recibir novedades de SpinCresta.',
    rateLimited: 'Demasiados intentos. Espera un minuto y vuelve a intentarlo.',
    age: 'Confirmo que tengo al menos 18 años.',
    consent: 'Acepto recibir por correo electrónico novedades de SpinCresta sobre nuevas reseñas, guías por país y cambios importantes de disponibilidad. Puedo darme de baja cuando quiera.',
    disclosure: 'SpinCresta utiliza Brevo para enviar correos y gestionar las suscripciones.',
    privacy: 'Política de privacidad',
    confirmedTitle: 'Suscripción confirmada',
    confirmedMessage: 'Tu correo está confirmado. A partir de ahora recibirás novedades ocasionales de SpinCresta.',
    close: 'Cerrar',
  },
  it: {
    eyebrow: 'RESTA AGGIORNATO',
    title: 'Nuove recensioni, senza email inutili',
    description: 'Ricevi nuove recensioni di casinò, guide per paese e importanti aggiornamenti sulla disponibilità in una sola email concisa.',
    placeholder: 'Indirizzo email',
    emailLabel: 'Indirizzo email',
    submit: 'Iscriviti',
    sending: 'Iscrizione…',
    success: 'Ci siamo quasi: controlla la posta e conferma l’iscrizione.',
    invalid: 'Inserisci un indirizzo email valido.',
    error: 'Non è stato possibile avviare l’iscrizione. Riprova tra poco.',
    ageRequired: 'Conferma di avere almeno 18 anni.',
    consentRequired: 'Conferma di voler ricevere gli aggiornamenti di SpinCresta.',
    rateLimited: 'Troppi tentativi. Attendi un minuto e riprova.',
    age: 'Confermo di avere almeno 18 anni.',
    consent: 'Accetto di ricevere via email gli aggiornamenti di SpinCresta su nuove recensioni, guide per paese e importanti variazioni di disponibilità. Posso annullare l’iscrizione in qualsiasi momento.',
    disclosure: 'SpinCresta utilizza Brevo per inviare le email e gestire le iscrizioni.',
    privacy: 'Informativa sulla privacy',
    confirmedTitle: 'Iscrizione confermata',
    confirmedMessage: 'Il tuo indirizzo email è stato confermato. Ora riceverai occasionali aggiornamenti da SpinCresta.',
    close: 'Chiudi',
  },
  pl: {
    eyebrow: 'BĄDŹ NA BIEŻĄCO',
    title: 'Nowe recenzje bez zbędnych wiadomości',
    description: 'Otrzymuj nowe recenzje kasyn, przewodniki po krajach i ważne zmiany dostępności w jednej krótkiej wiadomości.',
    placeholder: 'Adres e-mail',
    emailLabel: 'Adres e-mail',
    submit: 'Zapisz się',
    sending: 'Zapisywanie…',
    success: 'Prawie gotowe — sprawdź skrzynkę i potwierdź zapis.',
    invalid: 'Podaj prawidłowy adres e-mail.',
    error: 'Nie udało się rozpocząć zapisu. Spróbuj ponownie za chwilę.',
    ageRequired: 'Potwierdź, że masz co najmniej 18 lat.',
    consentRequired: 'Potwierdź zgodę na otrzymywanie aktualności SpinCresta.',
    rateLimited: 'Zbyt wiele prób. Odczekaj minutę i spróbuj ponownie.',
    age: 'Potwierdzam, że mam co najmniej 18 lat.',
    consent: 'Zgadzam się otrzymywać e-maile SpinCresta o nowych recenzjach, przewodnikach po krajach i ważnych zmianach dostępności. Mogę zrezygnować w dowolnym momencie.',
    disclosure: 'SpinCresta korzysta z Brevo do wysyłania wiadomości i zarządzania subskrypcjami.',
    privacy: 'Polityka prywatności',
    confirmedTitle: 'Subskrypcja potwierdzona',
    confirmedMessage: 'Twój adres e-mail został potwierdzony. Od teraz będziesz otrzymywać okazjonalne aktualności SpinCresta.',
    close: 'Zamknij',
  },
  uk: {
    eyebrow: 'БУДЬТЕ В КУРСІ',
    title: 'Нові огляди без зайвих листів',
    description: 'Отримуйте нові огляди казино, гіди за країнами та важливі зміни доступності в одному короткому листі.',
    placeholder: 'Електронна пошта',
    emailLabel: 'Електронна пошта',
    submit: 'Підписатися',
    sending: 'Підписуємо…',
    success: 'Майже готово — перевірте пошту та підтвердьте підписку.',
    invalid: 'Введіть коректну адресу електронної пошти.',
    error: 'Не вдалося розпочати підписку. Спробуйте ще раз трохи пізніше.',
    ageRequired: 'Підтвердьте, що вам виповнилося 18 років.',
    consentRequired: 'Підтвердьте згоду на отримання оновлень SpinCresta.',
    rateLimited: 'Забагато спроб. Зачекайте хвилину та спробуйте ще раз.',
    age: 'Підтверджую, що мені виповнилося 18 років.',
    consent: 'Погоджуюся отримувати електронні листи SpinCresta про нові огляди, гіди за країнами та важливі зміни доступності. Відписатися можна будь-коли.',
    disclosure: 'SpinCresta використовує Brevo для надсилання листів і керування підписками.',
    privacy: 'Політика конфіденційності',
    confirmedTitle: 'Підписку підтверджено',
    confirmedMessage: 'Вашу електронну адресу підтверджено. Тепер ви отримуватимете періодичні оновлення SpinCresta.',
    close: 'Закрити',
  },
  pt: {
    eyebrow: 'RECEBA AS NOVIDADES',
    title: 'Novas análises, sem emails desnecessários',
    description: 'Receba novas análises de casinos, guias por país e alterações importantes de disponibilidade num único email conciso.',
    placeholder: 'Endereço de email',
    emailLabel: 'Endereço de email',
    submit: 'Subscrever',
    sending: 'A subscrever…',
    success: 'Falta pouco — consulte o seu email e confirme a subscrição.',
    invalid: 'Introduza um endereço de email válido.',
    error: 'Não foi possível iniciar a subscrição. Tente novamente dentro de instantes.',
    ageRequired: 'Confirme que tem pelo menos 18 anos.',
    consentRequired: 'Confirme que aceita receber novidades da SpinCresta.',
    rateLimited: 'Demasiadas tentativas. Aguarde um minuto e tente novamente.',
    age: 'Confirmo que tenho pelo menos 18 anos.',
    consent: 'Aceito receber por email novidades da SpinCresta sobre novas análises, guias por país e alterações importantes de disponibilidade. Posso cancelar a subscrição a qualquer momento.',
    disclosure: 'A SpinCresta utiliza a Brevo para enviar emails e gerir subscrições.',
    privacy: 'Política de privacidade',
    confirmedTitle: 'Subscrição confirmada',
    confirmedMessage: 'O seu endereço de email foi confirmado. Passará a receber atualizações ocasionais da SpinCresta.',
    close: 'Fechar',
  },
  fr: {
    eyebrow: 'RESTEZ INFORMÉ',
    title: 'De nouveaux avis, sans courriels superflus',
    description: 'Recevez les nouveaux avis sur les casinos, les guides par pays et les changements importants de disponibilité dans un seul courriel concis.',
    placeholder: 'Adresse e-mail',
    emailLabel: 'Adresse e-mail',
    submit: 'S’abonner',
    sending: 'Inscription…',
    success: 'Vous y êtes presque : consultez votre messagerie et confirmez votre inscription.',
    invalid: 'Saisissez une adresse e-mail valide.',
    error: 'Nous n’avons pas pu lancer votre inscription. Réessayez dans quelques instants.',
    ageRequired: 'Confirmez que vous avez au moins 18 ans.',
    consentRequired: 'Confirmez que vous acceptez de recevoir les actualités de SpinCresta.',
    rateLimited: 'Trop de tentatives. Patientez une minute avant de réessayer.',
    age: 'Je confirme avoir au moins 18 ans.',
    consent: 'J’accepte de recevoir par e-mail les actualités de SpinCresta sur les nouveaux avis, les guides par pays et les changements importants de disponibilité. Je peux me désabonner à tout moment.',
    disclosure: 'SpinCresta utilise Brevo pour envoyer les e-mails et gérer les abonnements.',
    privacy: 'Politique de confidentialité',
    confirmedTitle: 'Inscription confirmée',
    confirmedMessage: 'Votre adresse e-mail est confirmée. Vous recevrez désormais les actualités occasionnelles de SpinCresta.',
    close: 'Fermer',
  },
  hi: {
    eyebrow: 'अपडेट रहें',
    title: 'नई समीक्षाएँ, बिना बेवजह ईमेल के',
    description: 'नई कैसीनो समीक्षाएँ, देश गाइड और उपलब्धता से जुड़े महत्वपूर्ण बदलाव एक संक्षिप्त ईमेल में पाएँ।',
    placeholder: 'ईमेल पता',
    emailLabel: 'ईमेल पता',
    submit: 'सदस्यता लें',
    sending: 'सदस्यता ली जा रही है…',
    success: 'बस एक कदम बाकी है — अपना इनबॉक्स देखें और सदस्यता की पुष्टि करें।',
    invalid: 'मान्य ईमेल पता दर्ज करें।',
    error: 'सदस्यता शुरू नहीं हो सकी। कृपया थोड़ी देर बाद फिर कोशिश करें।',
    ageRequired: 'कृपया पुष्टि करें कि आपकी आयु कम से कम 18 वर्ष है।',
    consentRequired: 'कृपया पुष्टि करें कि आप SpinCresta के अपडेट पाना चाहते हैं।',
    rateLimited: 'बहुत अधिक प्रयास किए गए हैं। एक मिनट रुककर फिर कोशिश करें।',
    age: 'मैं पुष्टि करता/करती हूँ कि मेरी आयु कम से कम 18 वर्ष है।',
    consent: 'मैं नई समीक्षाओं, देश गाइड और उपलब्धता से जुड़े महत्वपूर्ण बदलावों के बारे में SpinCresta के ईमेल पाने के लिए सहमत हूँ। मैं किसी भी समय सदस्यता छोड़ सकता/सकती हूँ।',
    disclosure: 'SpinCresta ईमेल भेजने और सदस्यताएँ प्रबंधित करने के लिए Brevo का उपयोग करता है।',
    privacy: 'गोपनीयता नीति',
    confirmedTitle: 'सदस्यता की पुष्टि हो गई',
    confirmedMessage: 'आपका ईमेल पता सत्यापित हो गया है। अब आपको कभी-कभी SpinCresta के अपडेट मिलेंगे।',
    close: 'बंद करें',
  },
  fi: {
    eyebrow: 'PYSY AJAN TASALLA',
    title: 'Uudet arvostelut ilman turhia viestejä',
    description: 'Saat uudet kasinoarvostelut, maaoppaat ja tärkeät saatavuusmuutokset yhdessä tiiviissä sähköpostissa.',
    placeholder: 'Sähköpostiosoite',
    emailLabel: 'Sähköpostiosoite',
    submit: 'Tilaa uutiset',
    sending: 'Tilataan…',
    success: 'Melkein valmista — tarkista sähköpostisi ja vahvista tilaus.',
    invalid: 'Anna kelvollinen sähköpostiosoite.',
    error: 'Tilausta ei voitu aloittaa. Yritä hetken kuluttua uudelleen.',
    ageRequired: 'Vahvista, että olet vähintään 18-vuotias.',
    consentRequired: 'Vahvista, että haluat vastaanottaa SpinCrestan uutisia.',
    rateLimited: 'Liian monta yritystä. Odota minuutti ja yritä uudelleen.',
    age: 'Vahvistan olevani vähintään 18-vuotias.',
    consent: 'Hyväksyn SpinCrestan sähköpostit uusista arvosteluista, maaoppaista ja tärkeistä saatavuusmuutoksista. Voin perua tilauksen milloin tahansa.',
    disclosure: 'SpinCresta käyttää Brevoa sähköpostien lähettämiseen ja tilausten hallintaan.',
    privacy: 'Tietosuojakäytäntö',
    confirmedTitle: 'Tilaus vahvistettu',
    confirmedMessage: 'Sähköpostiosoitteesi on vahvistettu. Saat nyt ajoittain SpinCrestan päivityksiä.',
    close: 'Sulje',
  },
};

const privacyPath = locale =>
  locale === 'en' ? '/privacy-policy/' : `/${locale}/privacy-policy/`;

const setStatus = (form, message, state = '') => {
  const status = form.querySelector('.footer-newsletter-status');
  if (!status) return;
  status.textContent = message;
  status.dataset.state = state;
};

const showConfirmationNotice = copy => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('subscription') !== 'confirmed') return;

  const notice = document.createElement('aside');
  notice.className = 'newsletter-confirmation-notice';
  notice.setAttribute('role', 'status');
  notice.setAttribute('aria-live', 'polite');
  notice.innerHTML = `
    <span class="newsletter-confirmation-icon" aria-hidden="true">✓</span>
    <span class="newsletter-confirmation-copy">
      <strong>${copy.confirmedTitle}</strong>
      <span>${copy.confirmedMessage}</span>
    </span>
    <button type="button" aria-label="${copy.close}">×</button>
  `;

  const removeNotice = () => {
    notice.classList.remove('is-visible');
    window.setTimeout(() => notice.remove(), 220);
  };

  notice.querySelector('button')?.addEventListener('click', removeNotice);
  document.body.append(notice);
  window.requestAnimationFrame(() => notice.classList.add('is-visible'));
  window.setTimeout(removeNotice, 10_000);

  params.delete('subscription');
  const query = params.toString();
  window.history.replaceState(
    {},
    '',
    `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
  );

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'newsletter_subscription_confirmed', {
      page_language: document.documentElement.lang || 'en',
      transport_type: 'beacon',
    });
  }
};

const bindForm = (form, copy, locale) => {
  const email = form.querySelector('input[type="email"]');
  const age = form.querySelector('input[name="newsletterAge"]');
  const consent = form.querySelector('input[name="newsletterConsent"]');
  const submit = form.querySelector('button[type="submit"]');
  if (!email || !age || !consent || !submit) return;

  form.addEventListener('submit', async event => {
    event.preventDefault();

    if (!email.validity.valid) {
      setStatus(form, copy.invalid, 'error');
      email.focus();
      return;
    }

    if (!age.checked) {
      setStatus(form, copy.ageRequired, 'error');
      age.focus();
      return;
    }

    if (!consent.checked) {
      setStatus(form, copy.consentRequired, 'error');
      consent.focus();
      return;
    }

    const originalLabel = submit.textContent;
    submit.disabled = true;
    submit.textContent = copy.sending;
    form.setAttribute('aria-busy', 'true');
    setStatus(form, '', '');

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(
        document.documentElement.dataset.newsletterEndpoint || DEFAULT_ENDPOINT,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.value.trim(),
            website: form.elements.website?.value || '',
            consent: true,
            locale,
          }),
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          setStatus(form, copy.rateLimited, 'error');
          return;
        }

        let errorCode = '';
        try {
          errorCode = (await response.json()).error || '';
        } catch {
          errorCode = '';
        }

        if (errorCode === 'invalid_email') {
          setStatus(form, copy.invalid, 'error');
          return;
        }

        throw new Error(`Subscription failed with status ${response.status}`);
      }

      email.value = '';
      age.checked = false;
      consent.checked = false;
      setStatus(form, copy.success, 'success');

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'newsletter_subscription_started', {
          page_language: document.documentElement.lang || 'en',
          transport_type: 'beacon',
        });
      }
    } catch (error) {
      if (error?.name !== 'AbortError') {
        console.warn('Newsletter subscription could not be started.');
      }
      setStatus(form, copy.error, 'error');
    } finally {
      window.clearTimeout(timeout);
      submit.disabled = false;
      submit.textContent = originalLabel;
      form.removeAttribute('aria-busy');
    }
  });
};

export const initFooterNewsletter = locale => {
  const copy = COPY[locale] || COPY.en;

  showConfirmationNotice(copy);

  document.querySelectorAll('.footer > .container').forEach((container, index) => {
    if (container.querySelector('.footer-newsletter')) return;

    const section = document.createElement('section');
    const headingId = `footerNewsletterTitle${index || ''}`;
    const statusId = `footerNewsletterStatus${index || ''}`;
    section.className = 'footer-newsletter';
    section.setAttribute('aria-labelledby', headingId);
    section.innerHTML = `
      <div class="footer-newsletter-copy">
        <span class="footer-newsletter-eyebrow">${copy.eyebrow}</span>
        <h2 id="${headingId}">${copy.title}</h2>
        <p>${copy.description}</p>
      </div>
      <form class="footer-newsletter-form" novalidate>
        <div class="footer-newsletter-row">
          <label class="footer-newsletter-email-label" for="footerNewsletterEmail${index || ''}">${copy.emailLabel}</label>
          <input id="footerNewsletterEmail${index || ''}" name="email" type="email" inputmode="email" autocomplete="email" maxlength="254" placeholder="${copy.placeholder}" required aria-describedby="${statusId}" />
          <label class="footer-newsletter-honeypot" aria-hidden="true">
            Website
            <input name="website" type="text" tabindex="-1" autocomplete="off" />
          </label>
          <button class="footer-newsletter-submit" type="submit">${copy.submit}</button>
        </div>
        <label class="footer-newsletter-consent">
          <input name="newsletterAge" type="checkbox" required />
          <span>${copy.age}</span>
        </label>
        <label class="footer-newsletter-consent">
          <input name="newsletterConsent" type="checkbox" required />
          <span>${copy.consent} <a href="${privacyPath(locale)}">${copy.privacy}</a></span>
        </label>
        <p class="footer-newsletter-disclosure">${copy.disclosure}</p>
        <p id="${statusId}" class="footer-newsletter-status" role="status" aria-live="polite"></p>
      </form>
    `;

    container.prepend(section);
    bindForm(section.querySelector('form'), copy, locale);
  });
};
