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
    consentRequired: 'Confirm that you agree to receive SpinCresta updates.',
    consent: 'I am 18+ and agree to receive SpinCresta updates. I can unsubscribe at any time.',
    privacy: 'Privacy Policy',
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
    consentRequired: 'Bestätigen Sie, dass Sie SpinCresta-Updates erhalten möchten.',
    consent: 'Ich bin volljährig und möchte SpinCresta-Updates erhalten. Eine Abmeldung ist jederzeit möglich.',
    privacy: 'Datenschutzerklärung',
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
    consentRequired: 'Confirma que aceptas recibir novedades de SpinCresta.',
    consent: 'Soy mayor de 18 años y acepto recibir novedades de SpinCresta. Puedo darme de baja cuando quiera.',
    privacy: 'Política de privacidad',
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
    consentRequired: 'Conferma di voler ricevere gli aggiornamenti di SpinCresta.',
    consent: 'Sono maggiorenne e accetto di ricevere aggiornamenti da SpinCresta. Posso annullare l’iscrizione in qualsiasi momento.',
    privacy: 'Informativa sulla privacy',
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
    consentRequired: 'Potwierdź zgodę na otrzymywanie aktualności SpinCresta.',
    consent: 'Jestem osobą pełnoletnią i zgadzam się na aktualności SpinCresta. Mogę zrezygnować w dowolnym momencie.',
    privacy: 'Polityka prywatności',
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
    consentRequired: 'Підтвердьте згоду на отримання оновлень SpinCresta.',
    consent: 'Мені виповнилося 18 років, і я погоджуюся отримувати оновлення SpinCresta. Відписатися можна будь-коли.',
    privacy: 'Політика конфіденційності',
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
    consentRequired: 'Confirme que aceita receber novidades da SpinCresta.',
    consent: 'Sou maior de 18 anos e aceito receber novidades da SpinCresta. Posso cancelar a subscrição a qualquer momento.',
    privacy: 'Política de privacidade',
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
    consentRequired: 'Confirmez que vous acceptez de recevoir les actualités de SpinCresta.',
    consent: 'Je confirme avoir l’âge légal et accepter les actualités de SpinCresta. Je peux me désabonner à tout moment.',
    privacy: 'Politique de confidentialité',
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
    consentRequired: 'कृपया पुष्टि करें कि आप SpinCresta के अपडेट पाना चाहते हैं।',
    consent: 'मैं वयस्क हूँ और SpinCresta के अपडेट पाने के लिए सहमत हूँ। मैं किसी भी समय सदस्यता छोड़ सकता हूँ।',
    privacy: 'गोपनीयता नीति',
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
    consentRequired: 'Vahvista, että haluat vastaanottaa SpinCrestan uutisia.',
    consent: 'Olen täysi-ikäinen ja hyväksyn SpinCrestan uutiset. Voin perua tilauksen milloin tahansa.',
    privacy: 'Tietosuojakäytäntö',
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

const bindForm = (form, copy) => {
  const email = form.querySelector('input[type="email"]');
  const consent = form.querySelector('input[name="newsletterConsent"]');
  const submit = form.querySelector('button[type="submit"]');
  if (!email || !consent || !submit) return;

  form.addEventListener('submit', async event => {
    event.preventDefault();

    if (!email.validity.valid) {
      setStatus(form, copy.invalid, 'error');
      email.focus();
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
          }),
          signal: controller.signal,
        }
      );

      if (!response.ok) {
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
          <input name="newsletterConsent" type="checkbox" required />
          <span>${copy.consent} <a href="${privacyPath(locale)}">${copy.privacy}</a></span>
        </label>
        <p id="${statusId}" class="footer-newsletter-status" role="status" aria-live="polite"></p>
      </form>
    `;

    container.prepend(section);
    bindForm(section.querySelector('form'), copy);
  });
};
