const DEFAULT_FEEDBACK_ENDPOINT = 'https://api.spincresta.com/api/brand-feedback';

const COPY = {
  en: {
    kicker: 'PLAYER FEEDBACK', title: 'Player ratings and reviews', intro: 'Ratings come from registered SpinCresta players. Written reviews are checked before publication.',
    average: 'Average rating', ratings: 'ratings', reviews: 'published reviews', noReviews: 'No published player reviews yet. Be the first to share a useful experience.',
    rateTitle: 'Rate this casino', rateHint: 'Choose from 1 to 5 stars. You can also add a written review.', titleLabel: 'Review title (optional)', titlePlaceholder: 'A short summary', bodyLabel: 'Your experience (optional)', bodyPlaceholder: 'What worked well? What should other players know?', bodyHint: 'At least 20 characters when you add a written review.', submit: 'Submit rating', submitting: 'Submitting…', signIn: 'Sign in to rate this casino', pending: 'Thank you. Your rating was saved and your review is awaiting moderation.', ratingSaved: 'Thank you. Your rating was saved.', selectRating: 'Choose a star rating before submitting.', invalidReview: 'Write at least 20 characters or leave the written review empty.', failed: 'We could not submit your feedback. Please try again.', unavailable: 'Player feedback is temporarily unavailable.', anonymous: 'SpinCresta player', star: 'star', stars: 'stars',
  },
  de: {
    kicker: 'SPIELERFEEDBACK', title: 'Bewertungen und Erfahrungen von Spielern', intro: 'Die Bewertungen stammen von registrierten SpinCresta-Nutzern. Schriftliche Beiträge werden vor der Veröffentlichung geprüft.',
    average: 'Durchschnitt', ratings: 'Bewertungen', reviews: 'veröffentlichte Erfahrungsberichte', noReviews: 'Noch keine veröffentlichten Spielerberichte. Teilen Sie als Erste oder Erster eine hilfreiche Erfahrung.',
    rateTitle: 'Casino bewerten', rateHint: 'Wählen Sie 1 bis 5 Sterne. Optional können Sie einen Erfahrungsbericht ergänzen.', titleLabel: 'Titel (optional)', titlePlaceholder: 'Kurze Zusammenfassung', bodyLabel: 'Ihre Erfahrung (optional)', bodyPlaceholder: 'Was war gut? Was sollten andere Spieler wissen?', bodyHint: 'Mindestens 20 Zeichen, wenn Sie einen Text hinzufügen.', submit: 'Bewertung senden', submitting: 'Wird gesendet…', signIn: 'Anmelden und Casino bewerten', pending: 'Vielen Dank. Ihre Bewertung wurde gespeichert; der Erfahrungsbericht wartet auf die Prüfung.', ratingSaved: 'Vielen Dank. Ihre Bewertung wurde gespeichert.', selectRating: 'Wählen Sie vor dem Absenden eine Sternebewertung.', invalidReview: 'Schreiben Sie mindestens 20 Zeichen oder lassen Sie den Text leer.', failed: 'Ihr Feedback konnte nicht gesendet werden. Versuchen Sie es erneut.', unavailable: 'Spielerfeedback ist vorübergehend nicht verfügbar.', anonymous: 'SpinCresta-Spieler', star: 'Stern', stars: 'Sterne',
  },
  es: {
    kicker: 'OPINIONES DE JUGADORES', title: 'Valoraciones y reseñas de jugadores', intro: 'Las valoraciones proceden de usuarios registrados de SpinCresta. Las reseñas escritas se revisan antes de publicarse.',
    average: 'Valoración media', ratings: 'valoraciones', reviews: 'reseñas publicadas', noReviews: 'Todavía no hay reseñas publicadas. Sé la primera persona en compartir una experiencia útil.',
    rateTitle: 'Valora este casino', rateHint: 'Elige de 1 a 5 estrellas. También puedes añadir una reseña.', titleLabel: 'Título (opcional)', titlePlaceholder: 'Resumen breve', bodyLabel: 'Tu experiencia (opcional)', bodyPlaceholder: '¿Qué funcionó bien? ¿Qué deberían saber otros jugadores?', bodyHint: 'Mínimo 20 caracteres si añades una reseña escrita.', submit: 'Enviar valoración', submitting: 'Enviando…', signIn: 'Inicia sesión para valorar', pending: 'Gracias. Guardamos tu valoración y la reseña está pendiente de moderación.', ratingSaved: 'Gracias. Tu valoración se ha guardado.', selectRating: 'Elige una valoración antes de enviar.', invalidReview: 'Escribe al menos 20 caracteres o deja vacía la reseña.', failed: 'No pudimos enviar tu opinión. Inténtalo de nuevo.', unavailable: 'Las opiniones de jugadores no están disponibles temporalmente.', anonymous: 'Jugador de SpinCresta', star: 'estrella', stars: 'estrellas',
  },
  it: {
    kicker: 'OPINIONI DEI GIOCATORI', title: 'Valutazioni e recensioni dei giocatori', intro: 'Le valutazioni provengono da utenti SpinCresta registrati. Le recensioni scritte vengono controllate prima della pubblicazione.',
    average: 'Valutazione media', ratings: 'valutazioni', reviews: 'recensioni pubblicate', noReviews: 'Non ci sono ancora recensioni pubblicate. Condividi per primo un’esperienza utile.',
    rateTitle: 'Valuta questo casinò', rateHint: 'Scegli da 1 a 5 stelle. Puoi anche aggiungere una recensione.', titleLabel: 'Titolo (facoltativo)', titlePlaceholder: 'Breve riepilogo', bodyLabel: 'La tua esperienza (facoltativa)', bodyPlaceholder: 'Cosa ha funzionato bene? Cosa dovrebbero sapere gli altri giocatori?', bodyHint: 'Almeno 20 caratteri se aggiungi una recensione.', submit: 'Invia valutazione', submitting: 'Invio…', signIn: 'Accedi per valutare', pending: 'Grazie. La valutazione è stata salvata e la recensione attende la moderazione.', ratingSaved: 'Grazie. La valutazione è stata salvata.', selectRating: 'Scegli una valutazione prima di inviare.', invalidReview: 'Scrivi almeno 20 caratteri oppure lascia vuota la recensione.', failed: 'Non è stato possibile inviare il feedback. Riprova.', unavailable: 'Le opinioni dei giocatori non sono temporaneamente disponibili.', anonymous: 'Giocatore SpinCresta', star: 'stella', stars: 'stelle',
  },
  pl: {
    kicker: 'OPINIE GRACZY', title: 'Oceny i recenzje graczy', intro: 'Oceny pochodzą od zarejestrowanych użytkowników SpinCresta. Recenzje tekstowe sprawdzamy przed publikacją.',
    average: 'Średnia ocena', ratings: 'ocen', reviews: 'opublikowanych recenzji', noReviews: 'Nie ma jeszcze opublikowanych recenzji graczy. Podziel się pierwszą pomocną opinią.',
    rateTitle: 'Oceń to kasyno', rateHint: 'Wybierz od 1 do 5 gwiazdek. Możesz również dodać recenzję.', titleLabel: 'Tytuł recenzji (opcjonalnie)', titlePlaceholder: 'Krótkie podsumowanie', bodyLabel: 'Twoje doświadczenie (opcjonalnie)', bodyPlaceholder: 'Co działało dobrze? Co powinni wiedzieć inni gracze?', bodyHint: 'Co najmniej 20 znaków, jeśli dodajesz recenzję.', submit: 'Wyślij ocenę', submitting: 'Wysyłanie…', signIn: 'Zaloguj się, aby ocenić', pending: 'Dziękujemy. Ocena została zapisana, a recenzja oczekuje na moderację.', ratingSaved: 'Dziękujemy. Ocena została zapisana.', selectRating: 'Przed wysłaniem wybierz ocenę.', invalidReview: 'Napisz co najmniej 20 znaków albo pozostaw recenzję pustą.', failed: 'Nie udało się wysłać opinii. Spróbuj ponownie.', unavailable: 'Opinie graczy są chwilowo niedostępne.', anonymous: 'Gracz SpinCresta', star: 'gwiazdka', stars: 'gwiazdki',
  },
  uk: {
    kicker: 'ВІДГУКИ ГРАВЦІВ', title: 'Оцінки та відгуки гравців', intro: 'Оцінки залишають зареєстровані користувачі SpinCresta. Текстові відгуки проходять перевірку перед публікацією.',
    average: 'Середня оцінка', ratings: 'оцінок', reviews: 'опублікованих відгуків', noReviews: 'Опублікованих відгуків поки немає. Залиште перший корисний відгук про свій досвід.',
    rateTitle: 'Оцініть це казино', rateHint: 'Оберіть від 1 до 5 зірок. За бажанням додайте текстовий відгук.', titleLabel: 'Заголовок відгуку (необов’язково)', titlePlaceholder: 'Короткий підсумок', bodyLabel: 'Ваш досвід (необов’язково)', bodyPlaceholder: 'Що працювало добре? Що варто знати іншим гравцям?', bodyHint: 'Якщо додаєте текст, напишіть щонайменше 20 символів.', submit: 'Надіслати оцінку', submitting: 'Надсилаємо…', signIn: 'Увійдіть, щоб оцінити казино', pending: 'Дякуємо. Оцінку збережено, а відгук очікує на модерацію.', ratingSaved: 'Дякуємо. Вашу оцінку збережено.', selectRating: 'Перед надсиланням оберіть оцінку.', invalidReview: 'Напишіть щонайменше 20 символів або залиште текст відгуку порожнім.', failed: 'Не вдалося надіслати відгук. Спробуйте ще раз.', unavailable: 'Відгуки гравців тимчасово недоступні.', anonymous: 'Гравець SpinCresta', star: 'зірка', stars: 'зірки',
  },
  pt: {
    kicker: 'OPINIÕES DOS JOGADORES', title: 'Avaliações e opiniões dos jogadores', intro: 'As avaliações são de utilizadores registados na SpinCresta. As opiniões escritas são verificadas antes da publicação.',
    average: 'Avaliação média', ratings: 'avaliações', reviews: 'opiniões publicadas', noReviews: 'Ainda não existem opiniões publicadas. Seja a primeira pessoa a partilhar uma experiência útil.',
    rateTitle: 'Avalie este casino', rateHint: 'Escolha entre 1 e 5 estrelas. Também pode acrescentar uma opinião.', titleLabel: 'Título (opcional)', titlePlaceholder: 'Resumo breve', bodyLabel: 'A sua experiência (opcional)', bodyPlaceholder: 'O que funcionou bem? O que devem saber os outros jogadores?', bodyHint: 'Pelo menos 20 caracteres se adicionar uma opinião.', submit: 'Enviar avaliação', submitting: 'A enviar…', signIn: 'Inicie sessão para avaliar', pending: 'Obrigado. A avaliação foi guardada e a opinião aguarda moderação.', ratingSaved: 'Obrigado. A avaliação foi guardada.', selectRating: 'Escolha uma avaliação antes de enviar.', invalidReview: 'Escreva pelo menos 20 caracteres ou deixe a opinião vazia.', failed: 'Não foi possível enviar a sua opinião. Tente novamente.', unavailable: 'As opiniões dos jogadores estão temporariamente indisponíveis.', anonymous: 'Jogador SpinCresta', star: 'estrela', stars: 'estrelas',
  },
  fr: {
    kicker: 'AVIS DES JOUEURS', title: 'Notes et avis des joueurs', intro: 'Les notes proviennent de membres SpinCresta inscrits. Les avis écrits sont vérifiés avant leur publication.',
    average: 'Note moyenne', ratings: 'notes', reviews: 'avis publiés', noReviews: 'Aucun avis de joueur n’est encore publié. Soyez la première personne à partager une expérience utile.',
    rateTitle: 'Noter ce casino', rateHint: 'Choisissez de 1 à 5 étoiles. Vous pouvez également ajouter un avis.', titleLabel: 'Titre (facultatif)', titlePlaceholder: 'Résumé court', bodyLabel: 'Votre expérience (facultatif)', bodyPlaceholder: 'Qu’est-ce qui a bien fonctionné ? Que doivent savoir les autres joueurs ?', bodyHint: 'Au moins 20 caractères si vous ajoutez un avis.', submit: 'Envoyer la note', submitting: 'Envoi…', signIn: 'Connectez-vous pour noter', pending: 'Merci. Votre note a été enregistrée et l’avis attend sa modération.', ratingSaved: 'Merci. Votre note a été enregistrée.', selectRating: 'Choisissez une note avant l’envoi.', invalidReview: 'Écrivez au moins 20 caractères ou laissez l’avis vide.', failed: 'Votre avis n’a pas pu être envoyé. Réessayez.', unavailable: 'Les avis des joueurs sont temporairement indisponibles.', anonymous: 'Joueur SpinCresta', star: 'étoile', stars: 'étoiles',
  },
  hi: {
    kicker: 'खिलाड़ियों की राय', title: 'खिलाड़ियों की रेटिंग और समीक्षाएँ', intro: 'रेटिंग पंजीकृत SpinCresta उपयोगकर्ताओं से आती हैं। लिखित समीक्षा प्रकाशित होने से पहले जाँची जाती है।',
    average: 'औसत रेटिंग', ratings: 'रेटिंग', reviews: 'प्रकाशित समीक्षाएँ', noReviews: 'अभी कोई खिलाड़ी समीक्षा प्रकाशित नहीं हुई है। उपयोगी अनुभव साझा करने वाले पहले व्यक्ति बनें।',
    rateTitle: 'इस कैसीनो को रेट करें', rateHint: '1 से 5 सितारे चुनें। चाहें तो लिखित समीक्षा भी जोड़ें।', titleLabel: 'समीक्षा का शीर्षक (वैकल्पिक)', titlePlaceholder: 'छोटा सार', bodyLabel: 'आपका अनुभव (वैकल्पिक)', bodyPlaceholder: 'क्या अच्छा रहा? दूसरे खिलाड़ियों को क्या जानना चाहिए?', bodyHint: 'लिखित समीक्षा जोड़ने पर कम से कम 20 अक्षर लिखें।', submit: 'रेटिंग भेजें', submitting: 'भेजा जा रहा है…', signIn: 'रेटिंग देने के लिए साइन इन करें', pending: 'धन्यवाद। आपकी रेटिंग सहेज ली गई है और समीक्षा मॉडरेशन की प्रतीक्षा में है।', ratingSaved: 'धन्यवाद। आपकी रेटिंग सहेज ली गई है।', selectRating: 'भेजने से पहले स्टार रेटिंग चुनें।', invalidReview: 'कम से कम 20 अक्षर लिखें या समीक्षा खाली छोड़ दें।', failed: 'आपकी प्रतिक्रिया भेजी नहीं जा सकी। फिर कोशिश करें।', unavailable: 'खिलाड़ियों की प्रतिक्रिया अभी उपलब्ध नहीं है।', anonymous: 'SpinCresta खिलाड़ी', star: 'सितारा', stars: 'सितारे',
  },
  fi: {
    kicker: 'PELAAJIEN PALAUTE', title: 'Pelaajien arviot ja kokemukset', intro: 'Arviot ovat rekisteröityneiltä SpinCresta-käyttäjiltä. Kirjalliset kokemukset tarkistetaan ennen julkaisua.',
    average: 'Keskiarvo', ratings: 'arviota', reviews: 'julkaistua kokemusta', noReviews: 'Julkaistuja pelaajakokemuksia ei vielä ole. Jaa ensimmäinen hyödyllinen kokemus.',
    rateTitle: 'Arvioi tämä kasino', rateHint: 'Valitse 1–5 tähteä. Voit halutessasi lisätä kirjallisen kokemuksen.', titleLabel: 'Otsikko (valinnainen)', titlePlaceholder: 'Lyhyt yhteenveto', bodyLabel: 'Kokemuksesi (valinnainen)', bodyPlaceholder: 'Mikä toimi hyvin? Mitä muiden pelaajien tulisi tietää?', bodyHint: 'Vähintään 20 merkkiä, jos lisäät tekstin.', submit: 'Lähetä arvio', submitting: 'Lähetetään…', signIn: 'Kirjaudu sisään ja arvioi', pending: 'Kiitos. Arviosi tallennettiin ja kirjoitus odottaa tarkistusta.', ratingSaved: 'Kiitos. Arviosi tallennettiin.', selectRating: 'Valitse tähtiarvio ennen lähettämistä.', invalidReview: 'Kirjoita vähintään 20 merkkiä tai jätä teksti tyhjäksi.', failed: 'Palautetta ei voitu lähettää. Yritä uudelleen.', unavailable: 'Pelaajien palaute ei ole juuri nyt käytettävissä.', anonymous: 'SpinCresta-pelaaja', star: 'tähti', stars: 'tähteä',
  },
};

const TEASER_COPY = {
  en: { read: 'Read player reviews', first: 'Be the first to review', ratings: 'Ratings', reviews: 'Reviews' },
  de: { read: 'Spielerbewertungen lesen', first: 'Erste Bewertung abgeben', ratings: 'Bewertungen', reviews: 'Erfahrungsberichte' },
  es: { read: 'Leer reseñas de jugadores', first: 'Escribe la primera reseña', ratings: 'Valoraciones', reviews: 'Reseñas' },
  it: { read: 'Leggi le recensioni dei giocatori', first: 'Scrivi la prima recensione', ratings: 'Valutazioni', reviews: 'Recensioni' },
  pl: { read: 'Przeczytaj opinie graczy', first: 'Dodaj pierwszą opinię', ratings: 'Oceny', reviews: 'Recenzje' },
  uk: { read: 'Читати відгуки гравців', first: 'Залишити перший відгук', ratings: 'Оцінки', reviews: 'Відгуки' },
  pt: { read: 'Ler opiniões dos jogadores', first: 'Escrever a primeira opinião', ratings: 'Avaliações', reviews: 'Opiniões' },
  fr: { read: 'Lire les avis des joueurs', first: 'Publier le premier avis', ratings: 'Notes', reviews: 'Avis' },
  hi: { read: 'खिलाड़ियों की समीक्षाएँ पढ़ें', first: 'पहली समीक्षा लिखें', ratings: 'रेटिंग', reviews: 'समीक्षाएँ' },
  fi: { read: 'Lue pelaajien kokemuksia', first: 'Kirjoita ensimmäinen kokemus', ratings: 'Arviot', reviews: 'Kokemukset' },
};

const escapeHtml = value => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const starLabel = (copy, value) => `${value} ${value === 1 ? copy.star : copy.stars}`;

const renderStars = rating => {
  const rounded = Math.round(Number(rating) || 0);
  return Array.from({ length: 5 }, (_, index) =>
    `<span class="${index < rounded ? 'is-filled' : ''}" aria-hidden="true">★</span>`
  ).join('');
};

const formatFeedbackCounts = (ratingCount, reviewCount, teaserCopy) =>
  `${teaserCopy.ratings}: ${ratingCount} · ${teaserCopy.reviews}: ${reviewCount}`;

const createWhyRatingLink = (copy, teaserCopy) => {
  const whySection = document.querySelector(
    'body[data-brand] #brand-why-section, body[data-brand] .brand-hero-why'
  );
  if (!whySection || whySection.querySelector('.brand-rating-teaser')) return null;

  const heading = whySection.querySelector('.brand-why-heading') || whySection;
  const title = heading.querySelector(':scope > .title, :scope > h2');
  if (!title) return null;

  const link = document.createElement('a');
  link.className = 'brand-rating-teaser';
  link.href = '#player-reviews';
  link.setAttribute('aria-label', teaserCopy.first);
  link.innerHTML = `
    <strong data-rating-teaser-average>—</strong>
    <span class="brand-rating-teaser-summary">
      <span class="brand-rating-teaser-stars" data-rating-teaser-stars aria-hidden="true">${renderStars(0)}</span>
      <span data-rating-teaser-counts>${escapeHtml(copy.average)}</span>
    </span>
    <span class="brand-rating-teaser-action" data-rating-teaser-action>${escapeHtml(teaserCopy.first)}</span>
  `;

  title.insertAdjacentElement('afterend', link);
  return link;
};

const updateWhyRatingLink = (link, payload, copy, teaserCopy) => {
  if (!link) return;
  const average = Number(payload.summary?.averageRating || 0);
  const ratingCount = Number(payload.summary?.ratingCount || 0);
  const reviewCount = Number(payload.summary?.reviewCount || 0);
  const action = reviewCount > 0 ? teaserCopy.read : teaserCopy.first;

  link.querySelector('[data-rating-teaser-average]').textContent = ratingCount
    ? average.toFixed(1)
    : '—';
  link.querySelector('[data-rating-teaser-stars]').innerHTML = renderStars(average);
  link.querySelector('[data-rating-teaser-counts]').textContent =
    formatFeedbackCounts(ratingCount, reviewCount, teaserCopy);
  link.querySelector('[data-rating-teaser-action]').textContent = action;
  link.setAttribute('aria-label', action);
};

const feedbackEndpoint = () =>
  document.documentElement.dataset.feedbackEndpoint || DEFAULT_FEEDBACK_ENDPOINT;

const accountBridge = () => window.SpinCrestaAccount || null;

const waitForAccountBridge = () => new Promise(resolve => {
  if (accountBridge()) {
    resolve(accountBridge());
    return;
  }
  const onReady = () => resolve(accountBridge());
  window.addEventListener('spincresta:account-ready', onReady, { once: true });
  window.setTimeout(() => resolve(accountBridge()), 5000);
});

const createSection = (brand, copy) => {
  const section = document.createElement('section');
  section.className = 'brand-player-feedback';
  section.id = 'player-reviews';
  section.innerHTML = `
    <div class="brand-feedback-heading">
      <div>
        <span class="section-kicker">${escapeHtml(copy.kicker)}</span>
        <h2>${escapeHtml(copy.title)}</h2>
        <p>${escapeHtml(copy.intro)}</p>
      </div>
      <div class="brand-feedback-score" aria-live="polite">
        <strong data-feedback-average>—</strong>
        <div class="brand-feedback-stars" data-feedback-stars aria-hidden="true">${renderStars(0)}</div>
        <span data-feedback-counts>${escapeHtml(copy.average)}</span>
      </div>
    </div>
    <div class="brand-feedback-list" data-feedback-list>
      <p class="brand-feedback-empty">${escapeHtml(copy.noReviews)}</p>
    </div>
    <div class="brand-feedback-compose">
      <div>
        <span class="section-kicker">${escapeHtml(copy.rateTitle)}</span>
        <p>${escapeHtml(copy.rateHint)}</p>
      </div>
      <button class="brand-feedback-signin" type="button" data-feedback-signin>${escapeHtml(copy.signIn)}</button>
      <form data-feedback-form hidden>
        <fieldset class="brand-feedback-rating">
          <legend>${escapeHtml(copy.rateTitle)}</legend>
          <div class="brand-feedback-rating-options">
            ${[5, 4, 3, 2, 1].map(value => `
              <input id="brand-rating-${value}" name="rating" type="radio" value="${value}" />
              <label for="brand-rating-${value}" aria-label="${escapeHtml(starLabel(copy, value))}" title="${escapeHtml(starLabel(copy, value))}">★</label>
            `).join('')}
          </div>
        </fieldset>
        <label>
          <span>${escapeHtml(copy.titleLabel)}</span>
          <input name="title" type="text" minlength="3" maxlength="120" placeholder="${escapeHtml(copy.titlePlaceholder)}" />
        </label>
        <label>
          <span>${escapeHtml(copy.bodyLabel)}</span>
          <textarea name="body" rows="5" maxlength="5000" placeholder="${escapeHtml(copy.bodyPlaceholder)}"></textarea>
          <small>${escapeHtml(copy.bodyHint)}</small>
        </label>
        <button class="brand-feedback-submit" type="submit">${escapeHtml(copy.submit)}</button>
      </form>
      <p class="brand-feedback-status" data-feedback-status role="status" aria-live="polite"></p>
    </div>
  `;
  section.dataset.brand = brand;
  return section;
};

const renderReviews = (section, payload, copy, teaserCopy, locale, teaserLink) => {
  const average = Number(payload.summary?.averageRating || 0);
  const ratingCount = Number(payload.summary?.ratingCount || 0);
  const reviewCount = Number(payload.summary?.reviewCount || 0);
  section.querySelector('[data-feedback-average]').textContent = ratingCount
    ? average.toFixed(1)
    : '—';
  section.querySelector('[data-feedback-stars]').innerHTML = renderStars(average);
  section.querySelector('[data-feedback-counts]').textContent =
    formatFeedbackCounts(ratingCount, reviewCount, teaserCopy);
  updateWhyRatingLink(teaserLink, payload, copy, teaserCopy);

  const list = section.querySelector('[data-feedback-list]');
  const reviews = Array.isArray(payload.reviews) ? payload.reviews : [];
  if (!reviews.length) {
    list.innerHTML = `<p class="brand-feedback-empty">${escapeHtml(copy.noReviews)}</p>`;
    return;
  }

  list.innerHTML = reviews.map(review => {
    const author = review.author?.displayName || copy.anonymous;
    const avatar = review.author?.avatarUrl
      ? `<img src="${escapeHtml(review.author.avatarUrl)}" alt="" loading="lazy" referrerpolicy="no-referrer" />`
      : `<span aria-hidden="true">${escapeHtml(author.slice(0, 1).toUpperCase())}</span>`;
    const createdAt = review.createdAt
      ? new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(review.createdAt))
      : '';
    return `
      <article class="brand-feedback-review">
        <header>
          <div class="brand-feedback-author">${avatar}<div><strong>${escapeHtml(author)}</strong><time>${escapeHtml(createdAt)}</time></div></div>
        </header>
        ${review.title ? `<h3>${escapeHtml(review.title)}</h3>` : ''}
        <p>${escapeHtml(review.body)}</p>
      </article>
    `;
  }).join('');
};

export const initBrandFeedback = async ({ brand, locale = 'en' }) => {
  const main = document.querySelector('body[data-brand] .content-review');
  if (!main || !brand || document.getElementById('player-reviews')) return;

  const copy = COPY[locale] || COPY.en;
  const teaserCopy = TEASER_COPY[locale] || TEASER_COPY.en;
  const section = createSection(brand, copy);
  main.append(section);
  const teaserLink = createWhyRatingLink(copy, teaserCopy);
  const form = section.querySelector('[data-feedback-form]');
  const signIn = section.querySelector('[data-feedback-signin]');
  const status = section.querySelector('[data-feedback-status]');

  const syncAuth = () => {
    const state = accountBridge()?.getState?.() || {};
    const canReview = Boolean(state.signedIn && state.registrationComplete);
    form.hidden = !canReview;
    signIn.hidden = canReview;
  };

  signIn.addEventListener('click', async () => {
    const bridge = await waitForAccountBridge();
    bridge?.openSignIn?.();
  });

  window.addEventListener('spincresta:account-state', syncAuth);
  window.addEventListener('spincresta:account-ready', syncAuth);
  syncAuth();

  const loadFeedback = async ({ fresh = false } = {}) => {
    const requestUrl = new URL(feedbackEndpoint());
    requestUrl.searchParams.set('brand', brand);
    requestUrl.searchParams.set('limit', '10');
    if (fresh) requestUrl.searchParams.set('_', String(Date.now()));
    const response = await fetch(requestUrl, {
      cache: fresh ? 'no-store' : 'default',
      headers: { Accept: 'application/json' },
    });
    if (response.status === 404) return false;
    if (!response.ok) throw new Error('feedback_unavailable');
    const payload = await response.json();
    renderReviews(section, payload, copy, teaserCopy, locale, teaserLink);
    return true;
  };

  try {
    const brandAvailable = await loadFeedback();
    if (!brandAvailable) {
      teaserLink?.remove();
      section.remove();
      return;
    }
  } catch {
    status.textContent = copy.unavailable;
    status.dataset.state = 'error';
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    status.textContent = '';
    status.dataset.state = '';

    const data = new FormData(form);
    const rating = Number(data.get('rating'));
    const title = String(data.get('title') || '').trim();
    const body = String(data.get('body') || '').trim();
    if (!rating) {
      status.textContent = copy.selectRating;
      status.dataset.state = 'error';
      return;
    }
    if ((title && !body) || (body && body.length < 20)) {
      status.textContent = copy.invalidReview;
      status.dataset.state = 'error';
      return;
    }

    const bridge = await waitForAccountBridge();
    const token = await bridge?.getAccessToken?.();
    if (!token) {
      bridge?.openSignIn?.();
      return;
    }

    const button = form.querySelector('.brand-feedback-submit');
    button.disabled = true;
    button.textContent = copy.submitting;
    try {
      const response = await fetch(feedbackEndpoint(), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ brand, rating, title, body, language: locale }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'submission_failed');
      status.textContent = payload.reviewStatus === 'pending' ? copy.pending : copy.ratingSaved;
      status.dataset.state = 'success';
      form.reset();
      await loadFeedback({ fresh: true });
    } catch {
      status.textContent = copy.failed;
      status.dataset.state = 'error';
    } finally {
      button.disabled = false;
      button.textContent = copy.submit;
    }
  });
};
