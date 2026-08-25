import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const pages = {
  en: {
    file: 'privacy-policy/index.html',
    oldDate: 'Your privacy at SpinCresta · Last updated: August 21, 2026',
    newDate: 'Your privacy at SpinCresta · Last updated: August 25, 2026',
    heading: '5A. Email Updates and Subscriptions',
    paragraphs: [
      'If you choose to subscribe, we collect your email address only to send occasional SpinCresta updates about new casino reviews, country guides and important availability changes. Subscribing is voluntary and based on your consent.',
      'We use Brevo as our email delivery and contact-management provider. Your email address is sent to Brevo for this purpose. We use double opt-in: after submitting the form, you must confirm your subscription through the link in the confirmation email before it becomes active.',
      'Every update includes an unsubscribe link, and you can withdraw your consent at any time. We retain your address while you are subscribed and may keep a limited suppression record after you unsubscribe so that we do not contact you again.',
    ],
  },
  de: {
    file: 'de/privacy-policy/index.html',
    oldDate: 'Ihre Privatsphäre bei SpinCresta · Zuletzt aktualisiert: 21. August 2026',
    newDate: 'Ihre Privatsphäre bei SpinCresta · Zuletzt aktualisiert: 25. August 2026',
    heading: '5A. E-Mail-Updates und Abonnements',
    paragraphs: [
      'Wenn Sie sich freiwillig anmelden, erfassen wir Ihre E-Mail-Adresse ausschließlich, um Ihnen gelegentliche SpinCresta-Updates zu neuen Casino-Tests, Länder-Guides und wichtigen Änderungen der Verfügbarkeit zu senden. Die Verarbeitung beruht auf Ihrer Einwilligung.',
      'Für den E-Mail-Versand und die Kontaktverwaltung nutzen wir Brevo. Ihre E-Mail-Adresse wird zu diesem Zweck an Brevo übermittelt. Wir verwenden das Double-Opt-in-Verfahren: Das Abonnement wird erst aktiv, nachdem Sie es über den Link in der Bestätigungs-E-Mail bestätigt haben.',
      'Jedes Update enthält einen Abmeldelink. Sie können Ihre Einwilligung jederzeit widerrufen. Wir speichern Ihre Adresse, solange das Abonnement besteht, und können nach der Abmeldung einen begrenzten Sperrvermerk aufbewahren, damit wir Sie nicht erneut anschreiben.',
    ],
  },
  es: {
    file: 'es/privacy-policy/index.html',
    oldDate: 'Tu privacidad en SpinCresta · Última actualización: 21 de agosto de 2026',
    newDate: 'Tu privacidad en SpinCresta · Última actualización: 25 de agosto de 2026',
    heading: '5A. Novedades por correo y suscripciones',
    paragraphs: [
      'Si decides suscribirte, recopilamos tu dirección de correo únicamente para enviarte ocasionalmente novedades de SpinCresta sobre nuevas reseñas de casinos, guías por país y cambios importantes de disponibilidad. La suscripción es voluntaria y se basa en tu consentimiento.',
      'Utilizamos Brevo como proveedor de envío de correo y gestión de contactos. Tu dirección se transmite a Brevo para este fin. Aplicamos un proceso de doble confirmación: la suscripción solo se activa cuando confirmas el alta mediante el enlace del correo de verificación.',
      'Todas las comunicaciones incluyen un enlace para darte de baja y puedes retirar tu consentimiento en cualquier momento. Conservamos tu dirección mientras sigas suscrito y, después de la baja, podemos mantener un registro mínimo de exclusión para no volver a contactarte.',
    ],
  },
  it: {
    file: 'it/privacy-policy/index.html',
    oldDate: 'La tua privacy su SpinCresta · Ultimo aggiornamento: 21 agosto 2026',
    newDate: 'La tua privacy su SpinCresta · Ultimo aggiornamento: 25 agosto 2026',
    heading: '5A. Aggiornamenti via email e iscrizioni',
    paragraphs: [
      'Se scegli di iscriverti, raccogliamo il tuo indirizzo email esclusivamente per inviarti occasionalmente aggiornamenti di SpinCresta su nuove recensioni di casinò, guide per paese e importanti variazioni di disponibilità. L’iscrizione è volontaria e si basa sul tuo consenso.',
      'Utilizziamo Brevo come fornitore per l’invio delle email e la gestione dei contatti. Il tuo indirizzo viene trasmesso a Brevo per questo scopo. Adottiamo il double opt-in: l’iscrizione diventa attiva solo dopo la conferma tramite il link contenuto nell’email di verifica.',
      'Ogni aggiornamento contiene un link per annullare l’iscrizione e puoi revocare il consenso in qualsiasi momento. Conserviamo l’indirizzo finché l’iscrizione è attiva e, dopo la disiscrizione, possiamo mantenere un registro minimo di esclusione per evitare ulteriori contatti.',
    ],
  },
  pl: {
    file: 'pl/privacy-policy/index.html',
    oldDate: 'Twoja prywatność w SpinCresta · Ostatnia aktualizacja: 21 sierpnia 2026',
    newDate: 'Twoja prywatność w SpinCresta · Ostatnia aktualizacja: 25 sierpnia 2026',
    heading: '5A. Aktualności e-mail i subskrypcje',
    paragraphs: [
      'Jeśli zdecydujesz się zapisać, zbieramy Twój adres e-mail wyłącznie po to, aby od czasu do czasu przesyłać aktualności SpinCresta dotyczące nowych recenzji kasyn, przewodników po krajach i ważnych zmian dostępności. Zapis jest dobrowolny i opiera się na Twojej zgodzie.',
      'Do wysyłki wiadomości i zarządzania kontaktami korzystamy z Brevo. W tym celu Twój adres e-mail jest przekazywany do Brevo. Stosujemy podwójne potwierdzenie zapisu: subskrypcja staje się aktywna dopiero po kliknięciu linku w wiadomości weryfikacyjnej.',
      'Każda wiadomość zawiera link rezygnacji, a zgodę możesz wycofać w dowolnym momencie. Przechowujemy adres przez czas trwania subskrypcji, a po rezygnacji możemy zachować ograniczony wpis na liście wykluczeń, aby nie kontaktować się z Tobą ponownie.',
    ],
  },
  uk: {
    file: 'uk/privacy-policy/index.html',
    oldDate: 'Ваша конфіденційність у SpinCresta · Останнє оновлення: 21 серпня 2026 року',
    newDate: 'Ваша конфіденційність у SpinCresta · Останнє оновлення: 25 серпня 2026 року',
    heading: '5A. Оновлення електронною поштою та підписка',
    paragraphs: [
      'Якщо ви вирішите підписатися, ми збиратимемо вашу електронну адресу лише для періодичних листів SpinCresta про нові огляди казино, гіди за країнами та важливі зміни доступності. Підписка є добровільною та ґрунтується на вашій згоді.',
      'Для надсилання листів і керування списком підписників ми використовуємо Brevo. З цією метою ваша електронна адреса передається Brevo. Ми застосовуємо подвійне підтвердження: підписка активується лише після переходу за посиланням у листі-підтвердженні.',
      'У кожному листі є посилання для відписки, а відкликати згоду можна будь-коли. Ми зберігаємо адресу, доки ви підписані, а після відписки можемо залишити мінімальний запис у списку виключень, щоб більше не надсилати вам листи.',
    ],
  },
  pt: {
    file: 'pt/privacy-policy/index.html',
    oldDate: 'A sua privacidade na SpinCresta · Última atualização: 21 de agosto de 2026',
    newDate: 'A sua privacidade na SpinCresta · Última atualização: 25 de agosto de 2026',
    heading: '5A. Novidades por email e subscrições',
    paragraphs: [
      'Se optar por subscrever, recolhemos o seu endereço de email apenas para enviar ocasionalmente novidades da SpinCresta sobre novas análises de casinos, guias por país e alterações importantes de disponibilidade. A subscrição é voluntária e baseia-se no seu consentimento.',
      'Utilizamos a Brevo como prestador de envio de email e gestão de contactos. O seu endereço é transmitido à Brevo para esta finalidade. Aplicamos dupla confirmação: a subscrição só fica ativa depois de confirmar através da ligação enviada no email de verificação.',
      'Todas as mensagens incluem uma ligação para cancelar a subscrição, podendo retirar o consentimento a qualquer momento. Conservamos o endereço enquanto a subscrição estiver ativa e, após o cancelamento, poderemos manter um registo mínimo de exclusão para não voltar a contactá-lo.',
    ],
  },
  fr: {
    file: 'fr/privacy-policy/index.html',
    oldDate: 'Votre vie privée chez SpinCresta · Dernière mise à jour : 21 août 2026',
    newDate: 'Votre vie privée chez SpinCresta · Dernière mise à jour : 25 août 2026',
    heading: '5A. Actualités par e-mail et abonnements',
    paragraphs: [
      'Si vous choisissez de vous abonner, nous recueillons votre adresse e-mail uniquement pour vous envoyer occasionnellement des actualités SpinCresta sur les nouveaux avis de casinos, les guides par pays et les changements importants de disponibilité. L’abonnement est volontaire et repose sur votre consentement.',
      'Nous utilisons Brevo comme prestataire d’envoi d’e-mails et de gestion des contacts. Votre adresse est transmise à Brevo à cette fin. Nous appliquons une double confirmation : l’abonnement n’est activé qu’après validation via le lien reçu dans l’e-mail de confirmation.',
      'Chaque message contient un lien de désabonnement et vous pouvez retirer votre consentement à tout moment. Nous conservons votre adresse tant que l’abonnement est actif et pouvons garder une inscription minimale sur une liste d’exclusion après votre désabonnement afin de ne plus vous contacter.',
    ],
  },
  hi: {
    file: 'hi/privacy-policy/index.html',
    oldDate: 'SpinCresta पर आपकी गोपनीयता · अंतिम अपडेट: 21 अगस्त 2026',
    newDate: 'SpinCresta पर आपकी गोपनीयता · अंतिम अपडेट: 25 अगस्त 2026',
    heading: '5A. ईमेल अपडेट और सदस्यता',
    paragraphs: [
      'यदि आप सदस्यता लेना चुनते हैं, तो हम आपका ईमेल पता केवल नई कैसीनो समीक्षाओं, देश गाइड और उपलब्धता में महत्वपूर्ण बदलावों से जुड़े कभी-कभार आने वाले SpinCresta अपडेट भेजने के लिए एकत्र करते हैं। सदस्यता स्वैच्छिक है और आपकी सहमति पर आधारित है।',
      'ईमेल भेजने और संपर्क सूची के प्रबंधन के लिए हम Brevo का उपयोग करते हैं। इस उद्देश्य से आपका ईमेल पता Brevo को भेजा जाता है। हम दोहरे पुष्टिकरण की प्रक्रिया अपनाते हैं: पुष्टि वाले ईमेल में दिए गए लिंक पर क्लिक करने के बाद ही सदस्यता सक्रिय होती है।',
      'हर अपडेट में सदस्यता छोड़ने का लिंक होता है और आप किसी भी समय अपनी सहमति वापस ले सकते हैं। सदस्यता जारी रहने तक हम आपका पता रखते हैं। सदस्यता छोड़ने के बाद हम एक सीमित निषेध रिकॉर्ड रख सकते हैं, ताकि आपको दोबारा ईमेल न भेजा जाए।',
    ],
  },
  fi: {
    file: 'fi/privacy-policy/index.html',
    oldDate: 'Yksityisyytesi SpinCrestassa · Päivitetty viimeksi: 21. elokuuta 2026',
    newDate: 'Yksityisyytesi SpinCrestassa · Päivitetty viimeksi: 25. elokuuta 2026',
    heading: '5A. Sähköpostiuutiset ja tilaukset',
    paragraphs: [
      'Jos päätät tilata uutiset, keräämme sähköpostiosoitteesi vain lähettääksemme ajoittain SpinCrestan päivityksiä uusista kasinoarvosteluista, maaoppaista ja tärkeistä saatavuusmuutoksista. Tilaaminen on vapaaehtoista ja perustuu suostumukseesi.',
      'Käytämme Brevoa sähköpostien lähettämiseen ja yhteystietojen hallintaan. Sähköpostiosoitteesi siirretään Brevolle tätä tarkoitusta varten. Käytämme kaksinkertaista vahvistusta: tilaus aktivoituu vasta, kun vahvistat sen vahvistusviestissä olevasta linkistä.',
      'Jokaisessa viestissä on peruutuslinkki, ja voit peruuttaa suostumuksesi milloin tahansa. Säilytämme osoitteesi tilauksen ajan ja voimme peruutuksen jälkeen säilyttää rajatun estomerkinnän, jotta emme lähetä sinulle uusia viestejä.',
    ],
  },
};

const root = resolve(import.meta.dirname, '..');

for (const [locale, page] of Object.entries(pages)) {
  const path = resolve(root, page.file);
  let html = await readFile(path, 'utf8');

  if (!html.includes(page.newDate)) {
    if (!html.includes(page.oldDate)) {
      throw new Error(`${locale}: privacy-policy date marker was not found`);
    }
    html = html.replace(page.oldDate, page.newDate);
  }

  if (!html.includes('data-newsletter-privacy')) {
    const sectionFive = /(\s*<article class="faq-card">\s*<h3>5\.[\s\S]*?<\/article>)/;
    const match = html.match(sectionFive);
    if (!match) throw new Error(`${locale}: section 5 was not found`);

    const card = `\n            <article class="faq-card" data-newsletter-privacy>\n              <h3>${page.heading}</h3>\n${page.paragraphs.map(paragraph => `              <p>${paragraph}</p>`).join('\n')}\n            </article>`;
    html = html.replace(sectionFive, `$1${card}`);
  }

  await writeFile(path, html);
  console.log(`Updated ${page.file}`);
}
