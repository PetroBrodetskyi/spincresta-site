#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CONTACT_EMAIL = 'affiliates@armadaapp.com';

const policyUpdates = {
  en: {
    updated: 'Last updated: August 21, 2026',
    browserTitle: 'Browser Storage and Google Analytics',
    browserBody: `<p>We store your selected language and display preferences in your browser's local storage so they remain available on your next visit. These values stay on your device until you clear them.</p><p>Google Analytics may set first-party cookies such as <code>_ga</code> and <code>_ga_...</code> and process session statistics, approximate location, browser and device details, and page interactions. Do not send us sensitive information through URLs or email.</p>`,
    retentionTitle: 'Data Retention',
    retentionBody: `<p>We keep contact correspondence only as long as needed to answer the request, maintain appropriate records, or meet legal obligations. Analytics and technical data are retained according to our configured settings and applicable provider controls, then deleted or aggregated. Retention periods may vary by data type and legal requirement.</p>`,
    affiliateTitle: 'External Links, Affiliate Tracking, and Infrastructure',
    affiliateBody: `<p>SpinCresta contains links to casino and betting operators. A link may include a campaign or partner identifier so the operator can attribute the referral. Once you leave SpinCresta, the operator's privacy policy applies. Ordinary referral links do not give us your casino password, deposits, payment-card details, or gaming history.</p><p>Images and site files may be delivered by infrastructure providers such as Cloudinary and Vercel, which may receive standard request data needed to deliver and secure their services.</p>`,
    faqFirstAnswer: 'We process technical and usage data such as browser and device details, pages visited, session information, and approximate location. Google Analytics may use first-party cookies. We do not collect casino passwords, deposits, or payment-card data.',
    rightsNote: `To exercise these rights, email us at <strong>${CONTACT_EMAIL}</strong>. We respond within the period required by applicable law. GDPR requests are normally answered within one month; other jurisdictions may allow a different period. We may ask for information needed to verify your identity.`,
  },
  de: {
    updated: 'Zuletzt aktualisiert: 21. August 2026',
    browserTitle: 'Browser-Speicher und Google Analytics',
    browserBody: `<p>Wir speichern Ihre ausgewählte Sprache und Darstellungsoptionen im lokalen Speicher Ihres Browsers, damit sie beim nächsten Besuch verfügbar sind. Diese Werte bleiben auf Ihrem Gerät, bis Sie sie löschen.</p><p>Google Analytics kann Erstanbieter-Cookies wie <code>_ga</code> und <code>_ga_...</code> setzen und Sitzungsstatistiken, den ungefähren Standort, Browser- und Gerätedaten sowie Seiteninteraktionen verarbeiten. Senden Sie uns keine sensiblen Informationen über URLs oder per E-Mail.</p>`,
    retentionTitle: 'Speicherdauer',
    retentionBody: `<p>Wir speichern Korrespondenz nur so lange, wie es zur Beantwortung Ihrer Anfrage, für angemessene Nachweise oder zur Erfüllung rechtlicher Pflichten erforderlich ist. Analyse- und technische Daten werden gemäß unseren Einstellungen und den Kontrollen des jeweiligen Anbieters gespeichert und anschließend gelöscht oder zusammengefasst. Die Dauer kann je nach Datenart und rechtlicher Vorgabe variieren.</p>`,
    affiliateTitle: 'Externe Links, Affiliate-Tracking und Infrastruktur',
    affiliateBody: `<p>SpinCresta enthält Links zu Casino- und Wettanbietern. Ein Link kann eine Kampagnen- oder Partnerkennung enthalten, damit der Anbieter die Weiterleitung zuordnen kann. Sobald Sie SpinCresta verlassen, gilt die Datenschutzerklärung des jeweiligen Anbieters. Über gewöhnliche Affiliate-Links erhalten wir weder Ihr Casino-Passwort noch Einzahlungen, Kartendaten oder Ihren Spielverlauf.</p><p>Bilder und Website-Dateien können über Infrastruktur-Anbieter wie Cloudinary und Vercel ausgeliefert werden. Dabei können übliche technische Anfragedaten verarbeitet werden, die für Bereitstellung und Sicherheit erforderlich sind.</p>`,
    faqFirstAnswer: 'Wir verarbeiten technische Nutzungsdaten wie Browser- und Gerätedaten, besuchte Seiten, Sitzungsinformationen und den ungefähren Standort. Google Analytics kann Erstanbieter-Cookies verwenden. Casino-Passwörter, Einzahlungen oder Kartendaten erfassen wir nicht.',
    rightsNote: `Um diese Rechte auszuüben, schreiben Sie an <strong>${CONTACT_EMAIL}</strong>. Wir antworten innerhalb der gesetzlich vorgeschriebenen Frist. Anfragen nach der DSGVO werden in der Regel innerhalb eines Monats beantwortet; in anderen Rechtsordnungen können andere Fristen gelten. Zur Identitätsprüfung können wir zusätzliche Angaben anfordern.`,
  },
  es: {
    updated: 'Última actualización: 21 de agosto de 2026',
    browserTitle: 'Almacenamiento del navegador y Google Analytics',
    browserBody: `<p>Guardamos el idioma y las preferencias de visualización que eliges en el almacenamiento local del navegador para conservarlos en tu próxima visita. Estos valores permanecen en tu dispositivo hasta que los eliminas.</p><p>Google Analytics puede instalar cookies propias como <code>_ga</code> y <code>_ga_...</code> y tratar estadísticas de sesión, ubicación aproximada, datos del navegador y del dispositivo e interacciones con las páginas. No nos envíes información sensible mediante URL o correo electrónico.</p>`,
    retentionTitle: 'Conservación de los datos',
    retentionBody: `<p>Conservamos la correspondencia solo durante el tiempo necesario para responder, mantener registros adecuados o cumplir obligaciones legales. Los datos analíticos y técnicos se conservan según nuestra configuración y los controles aplicables del proveedor; después se eliminan o se agregan. El plazo puede variar según el tipo de dato y los requisitos legales.</p>`,
    affiliateTitle: 'Enlaces externos, seguimiento de afiliación e infraestructura',
    affiliateBody: `<p>SpinCresta contiene enlaces a operadores de casino y apuestas. Un enlace puede incluir un identificador de campaña o de socio para que el operador atribuya la visita. Al salir de SpinCresta, se aplica la política de privacidad del operador. Los enlaces de afiliación habituales no nos facilitan tu contraseña del casino, depósitos, datos de tarjeta ni historial de juego.</p><p>Las imágenes y los archivos del sitio pueden servirse mediante proveedores de infraestructura como Cloudinary y Vercel, que pueden recibir los datos técnicos de solicitud necesarios para prestar y proteger sus servicios.</p>`,
    faqFirstAnswer: 'Tratamos datos técnicos y de uso, como información del navegador y del dispositivo, páginas visitadas, datos de sesión y ubicación aproximada. Google Analytics puede utilizar cookies propias. No recopilamos contraseñas de casino, depósitos ni datos de tarjetas.',
    rightsNote: `Para ejercer estos derechos, escribe a <strong>${CONTACT_EMAIL}</strong>. Respondemos dentro del plazo exigido por la legislación aplicable. Las solicitudes sujetas al RGPD suelen responderse en un mes; otras jurisdicciones pueden establecer un plazo distinto. Podemos pedir información para verificar tu identidad.`,
  },
  it: {
    updated: 'Ultimo aggiornamento: 21 agosto 2026',
    browserTitle: 'Memoria del browser e Google Analytics',
    browserBody: `<p>Salviamo la lingua e le preferenze di visualizzazione selezionate nella memoria locale del browser, così restano disponibili alla visita successiva. Questi valori rimangono sul dispositivo finché non vengono cancellati.</p><p>Google Analytics può impostare cookie proprietari come <code>_ga</code> e <code>_ga_...</code> e trattare statistiche di sessione, posizione approssimativa, dati del browser e del dispositivo e interazioni con le pagine. Non inviarci informazioni sensibili tramite URL o e-mail.</p>`,
    retentionTitle: 'Conservazione dei dati',
    retentionBody: `<p>Conserviamo la corrispondenza solo per il tempo necessario a rispondere, mantenere registri adeguati o adempiere agli obblighi di legge. I dati analitici e tecnici sono conservati in base alle nostre impostazioni e ai controlli applicabili del fornitore, quindi eliminati o aggregati. I tempi possono variare in base al tipo di dato e agli obblighi legali.</p>`,
    affiliateTitle: 'Link esterni, tracciamento affiliati e infrastruttura',
    affiliateBody: `<p>SpinCresta contiene link a operatori di casinò e scommesse. Un link può includere un identificativo della campagna o del partner per consentire all'operatore di attribuire la visita. Dopo aver lasciato SpinCresta si applica l'informativa privacy dell'operatore. I normali link di affiliazione non ci trasmettono password del casinò, depositi, dati delle carte o cronologia di gioco.</p><p>Immagini e file del sito possono essere distribuiti da fornitori di infrastruttura come Cloudinary e Vercel, che possono ricevere i normali dati tecnici della richiesta necessari a fornire e proteggere i servizi.</p>`,
    faqFirstAnswer: 'Trattiamo dati tecnici e di utilizzo, come informazioni su browser e dispositivo, pagine visitate, dati di sessione e posizione approssimativa. Google Analytics può usare cookie proprietari. Non raccogliamo password del casinò, depositi o dati delle carte.',
    rightsNote: `Per esercitare questi diritti, scrivi a <strong>${CONTACT_EMAIL}</strong>. Rispondiamo entro il termine previsto dalla legge applicabile. Le richieste soggette al GDPR ricevono normalmente risposta entro un mese; altre giurisdizioni possono prevedere termini diversi. Potremmo chiedere informazioni per verificare la tua identità.`,
  },
  pl: {
    updated: 'Ostatnia aktualizacja: 21 sierpnia 2026',
    browserTitle: 'Pamięć przeglądarki i Google Analytics',
    browserBody: `<p>Wybrany język i ustawienia wyglądu zapisujemy w lokalnej pamięci przeglądarki, aby były dostępne podczas kolejnej wizyty. Dane te pozostają na urządzeniu do czasu ich usunięcia.</p><p>Google Analytics może ustawiać własne pliki cookie, takie jak <code>_ga</code> i <code>_ga_...</code>, oraz przetwarzać statystyki sesji, przybliżoną lokalizację, dane przeglądarki i urządzenia oraz interakcje ze stronami. Nie przesyłaj nam danych wrażliwych w adresach URL ani wiadomościach e-mail.</p>`,
    retentionTitle: 'Okres przechowywania danych',
    retentionBody: `<p>Korespondencję przechowujemy tylko tak długo, jak jest to potrzebne do udzielenia odpowiedzi, prowadzenia odpowiedniej dokumentacji lub wykonania obowiązków prawnych. Dane analityczne i techniczne są przechowywane zgodnie z naszymi ustawieniami i mechanizmami danego dostawcy, a następnie usuwane lub agregowane. Okres może zależeć od rodzaju danych i wymogów prawa.</p>`,
    affiliateTitle: 'Linki zewnętrzne, śledzenie afiliacyjne i infrastruktura',
    affiliateBody: `<p>SpinCresta zawiera linki do operatorów kasyn i zakładów. Link może zawierać identyfikator kampanii lub partnera, dzięki któremu operator przypisze polecenie. Po opuszczeniu SpinCresta obowiązuje polityka prywatności operatora. Zwykłe linki afiliacyjne nie przekazują nam hasła do kasyna, wpłat, danych karty ani historii gry.</p><p>Obrazy i pliki strony mogą być dostarczane przez dostawców infrastruktury, takich jak Cloudinary i Vercel. Mogą oni otrzymywać standardowe techniczne dane żądania potrzebne do świadczenia i zabezpieczenia usług.</p>`,
    faqFirstAnswer: 'Przetwarzamy dane techniczne i informacje o korzystaniu ze strony, takie jak dane przeglądarki i urządzenia, odwiedzone strony, informacje o sesji oraz przybliżona lokalizacja. Google Analytics może używać własnych plików cookie. Nie zbieramy haseł do kasyn, danych o wpłatach ani danych kart.',
    rightsNote: `Aby skorzystać z tych praw, napisz na adres <strong>${CONTACT_EMAIL}</strong>. Odpowiadamy w terminie wymaganym przez właściwe przepisy. Na wnioski objęte RODO odpowiadamy zwykle w ciągu miesiąca; w innych jurysdykcjach termin może być inny. Możemy poprosić o informacje potrzebne do potwierdzenia tożsamości.`,
  },
  uk: {
    updated: 'Останнє оновлення: 21 серпня 2026 року',
    browserTitle: 'Локальне сховище браузера та Google Analytics',
    browserBody: `<p>Ми зберігаємо вибрану мову й налаштування відображення в локальному сховищі браузера, щоб вони залишалися доступними під час наступного відвідування. Ці значення зберігаються на вашому пристрої, доки ви їх не видалите.</p><p>Google Analytics може встановлювати власні файли cookie, зокрема <code>_ga</code> і <code>_ga_...</code>, та обробляти статистику сеансів, приблизне місцезнаходження, відомості про браузер і пристрій, а також взаємодію зі сторінками. Не надсилайте нам конфіденційні дані через URL-адреси або електронну пошту.</p>`,
    retentionTitle: 'Строки зберігання даних',
    retentionBody: `<p>Ми зберігаємо листування лише стільки, скільки потрібно для відповіді на запит, ведення належної документації або виконання юридичних обов’язків. Аналітичні й технічні дані зберігаються відповідно до наших налаштувань і доступних засобів контролю постачальника, після чого видаляються або агрегуються. Строк залежить від типу даних і вимог законодавства.</p>`,
    affiliateTitle: 'Зовнішні посилання, партнерське відстеження та інфраструктура',
    affiliateBody: `<p>На SpinCresta є посилання на операторів казино та ставок. Посилання може містити ідентифікатор кампанії або партнера, за яким оператор визначає джерело переходу. Після виходу зі SpinCresta застосовується політика конфіденційності оператора. Звичайні партнерські посилання не передають нам пароль від казино, дані про депозити, платіжні картки чи історію гри.</p><p>Зображення та файли сайту можуть доставлятися через постачальників інфраструктури, зокрема Cloudinary і Vercel. Вони можуть отримувати стандартні технічні дані запиту, необхідні для роботи й захисту своїх сервісів.</p>`,
    faqFirstAnswer: 'Ми обробляємо технічні дані та відомості про використання сайту: інформацію про браузер і пристрій, відвідані сторінки, сеанс і приблизне місцезнаходження. Google Analytics може використовувати власні файли cookie. Ми не збираємо паролі від казино, дані про депозити чи платіжні картки.',
    rightsNote: `Щоб скористатися цими правами, напишіть на <strong>${CONTACT_EMAIL}</strong>. Ми відповідаємо у строк, передбачений застосовним законодавством. На запити за GDPR зазвичай відповідають протягом одного місяця; в інших юрисдикціях строк може відрізнятися. Ми можемо попросити дані, необхідні для підтвердження вашої особи.`,
  },
  pt: {
    updated: 'Última atualização: 21 de agosto de 2026',
    browserTitle: 'Armazenamento do navegador e Google Analytics',
    browserBody: `<p>Guardamos o idioma e as preferências de apresentação escolhidas no armazenamento local do navegador, para que continuem disponíveis na visita seguinte. Estes valores permanecem no dispositivo até serem eliminados.</p><p>O Google Analytics pode definir cookies próprios, como <code>_ga</code> e <code>_ga_...</code>, e tratar estatísticas de sessão, localização aproximada, dados do navegador e do dispositivo e interações com as páginas. Não nos envie informações sensíveis através de URL ou e-mail.</p>`,
    retentionTitle: 'Conservação dos dados',
    retentionBody: `<p>Conservamos a correspondência apenas durante o tempo necessário para responder, manter registos adequados ou cumprir obrigações legais. Os dados analíticos e técnicos são conservados de acordo com as nossas definições e os controlos aplicáveis do prestador, sendo depois eliminados ou agregados. O prazo pode variar consoante o tipo de dado e os requisitos legais.</p>`,
    affiliateTitle: 'Ligações externas, rastreio de afiliados e infraestrutura',
    affiliateBody: `<p>A SpinCresta contém ligações para operadores de casino e apostas. Uma ligação pode incluir um identificador de campanha ou de parceiro para que o operador atribua a referência. Ao sair da SpinCresta, aplica-se a política de privacidade do operador. As ligações de afiliado habituais não nos fornecem a sua palavra-passe do casino, depósitos, dados do cartão ou histórico de jogo.</p><p>As imagens e os ficheiros do site podem ser fornecidos por prestadores de infraestrutura, como a Cloudinary e a Vercel, que podem receber os dados técnicos normais do pedido necessários para prestar e proteger os seus serviços.</p>`,
    faqFirstAnswer: 'Tratamos dados técnicos e de utilização, como informações do navegador e do dispositivo, páginas visitadas, dados da sessão e localização aproximada. O Google Analytics pode utilizar cookies próprios. Não recolhemos palavras-passe de casino, depósitos nem dados de cartões.',
    rightsNote: `Para exercer estes direitos, escreva para <strong>${CONTACT_EMAIL}</strong>. Respondemos dentro do prazo exigido pela legislação aplicável. Os pedidos abrangidos pelo RGPD são normalmente respondidos no prazo de um mês; outras jurisdições podem prever prazos diferentes. Podemos solicitar informações para confirmar a sua identidade.`,
  },
  fr: {
    updated: 'Dernière mise à jour : 21 août 2026',
    browserTitle: 'Stockage du navigateur et Google Analytics',
    browserBody: `<p>Nous enregistrons la langue et les préférences d'affichage sélectionnées dans le stockage local du navigateur afin de les conserver pour votre prochaine visite. Ces valeurs restent sur votre appareil jusqu'à ce que vous les supprimiez.</p><p>Google Analytics peut déposer des cookies internes tels que <code>_ga</code> et <code>_ga_...</code> et traiter des statistiques de session, une localisation approximative, des informations sur le navigateur et l'appareil ainsi que les interactions avec les pages. Ne nous transmettez pas d'informations sensibles dans une URL ou par e-mail.</p>`,
    retentionTitle: 'Durée de conservation',
    retentionBody: `<p>Nous conservons les échanges uniquement le temps nécessaire pour répondre à la demande, tenir des registres appropriés ou respecter nos obligations légales. Les données analytiques et techniques sont conservées selon nos réglages et les contrôles disponibles chez le prestataire, puis supprimées ou agrégées. La durée peut varier selon le type de données et les exigences légales.</p>`,
    affiliateTitle: 'Liens externes, suivi d’affiliation et infrastructure',
    affiliateBody: `<p>SpinCresta contient des liens vers des opérateurs de casino et de paris. Un lien peut inclure un identifiant de campagne ou de partenaire afin que l'opérateur attribue la recommandation. Lorsque vous quittez SpinCresta, la politique de confidentialité de l'opérateur s'applique. Les liens d'affiliation ordinaires ne nous communiquent pas votre mot de passe de casino, vos dépôts, les données de votre carte ou votre historique de jeu.</p><p>Les images et fichiers du site peuvent être distribués par des prestataires d'infrastructure tels que Cloudinary et Vercel. Ils peuvent recevoir les données techniques de requête nécessaires à la fourniture et à la sécurisation de leurs services.</p>`,
    faqFirstAnswer: 'Nous traitons des données techniques et d’utilisation, notamment les informations sur le navigateur et l’appareil, les pages consultées, les données de session et la localisation approximative. Google Analytics peut utiliser des cookies internes. Nous ne recueillons ni mots de passe de casino, ni dépôts, ni données de carte bancaire.',
    rightsNote: `Pour exercer ces droits, écrivez à <strong>${CONTACT_EMAIL}</strong>. Nous répondons dans le délai prévu par la législation applicable. Les demandes relevant du RGPD reçoivent normalement une réponse dans un délai d’un mois ; d’autres juridictions peuvent prévoir un délai différent. Nous pouvons demander les informations nécessaires pour vérifier votre identité.`,
  },
  hi: {
    updated: 'अंतिम अपडेट: 21 अगस्त 2026',
    browserTitle: 'ब्राउज़र स्टोरेज और Google Analytics',
    browserBody: `<p>हम आपकी चुनी हुई भाषा और डिस्प्ले सेटिंग को ब्राउज़र के लोकल स्टोरेज में रखते हैं, ताकि अगली बार साइट खोलने पर वे उपलब्ध रहें। ये मान आपके डिवाइस पर तब तक रहते हैं, जब तक आप उन्हें हटाते नहीं हैं।</p><p>Google Analytics <code>_ga</code> और <code>_ga_...</code> जैसी फ़र्स्ट-पार्टी कुकी सेट कर सकता है और सेशन के आँकड़े, अनुमानित स्थान, ब्राउज़र व डिवाइस की जानकारी तथा पेज पर की गई गतिविधि को संसाधित कर सकता है। URL या ईमेल के माध्यम से हमें संवेदनशील जानकारी न भेजें।</p>`,
    retentionTitle: 'डेटा रखने की अवधि',
    retentionBody: `<p>हम संपर्क से जुड़ा पत्राचार केवल उतने समय तक रखते हैं, जितना अनुरोध का उत्तर देने, उचित रिकॉर्ड रखने या कानूनी दायित्व पूरा करने के लिए आवश्यक हो। एनालिटिक्स और तकनीकी डेटा हमारी सेटिंग तथा संबंधित प्रदाता के नियंत्रणों के अनुसार रखा जाता है, फिर उसे हटा दिया जाता है या समेकित कर दिया जाता है। अवधि डेटा के प्रकार और कानूनी आवश्यकता के अनुसार बदल सकती है।</p>`,
    affiliateTitle: 'बाहरी लिंक, अफ़िलिएट ट्रैकिंग और इन्फ्रास्ट्रक्चर',
    affiliateBody: `<p>SpinCresta पर कैसीनो और बेटिंग ऑपरेटरों के लिंक होते हैं। किसी लिंक में अभियान या पार्टनर पहचानकर्ता हो सकता है, जिससे ऑपरेटर रेफ़रल का स्रोत पहचान सके। SpinCresta से बाहर जाने के बाद उस ऑपरेटर की गोपनीयता नीति लागू होती है। सामान्य अफ़िलिएट लिंक से हमें आपका कैसीनो पासवर्ड, जमा राशि, भुगतान कार्ड की जानकारी या खेलने का इतिहास नहीं मिलता।</p><p>चित्र और साइट फ़ाइलें Cloudinary तथा Vercel जैसे इन्फ्रास्ट्रक्चर प्रदाताओं द्वारा उपलब्ध कराई जा सकती हैं। सेवा देने और सुरक्षित रखने के लिए उन्हें सामान्य तकनीकी अनुरोध डेटा मिल सकता है।</p>`,
    faqFirstAnswer: 'हम ब्राउज़र और डिवाइस की जानकारी, देखे गए पेज, सेशन डेटा और अनुमानित स्थान जैसे तकनीकी तथा उपयोग संबंधी डेटा को संसाधित करते हैं। Google Analytics फ़र्स्ट-पार्टी कुकी का उपयोग कर सकता है। हम कैसीनो पासवर्ड, जमा राशि या भुगतान कार्ड की जानकारी एकत्र नहीं करते।',
    rightsNote: `इन अधिकारों का उपयोग करने के लिए <strong>${CONTACT_EMAIL}</strong> पर ईमेल करें। हम लागू कानून में तय समय के भीतर जवाब देते हैं। GDPR के अंतर्गत अनुरोधों का उत्तर सामान्यतः एक महीने में दिया जाता है; अन्य क्षेत्रों में समय अलग हो सकता है। पहचान की पुष्टि के लिए हम आवश्यक जानकारी माँग सकते हैं।`,
  },
  fi: {
    updated: 'Päivitetty viimeksi: 21. elokuuta 2026',
    browserTitle: 'Selaimen tallennustila ja Google Analytics',
    browserBody: `<p>Tallennamme valitsemasi kielen ja näyttöasetukset selaimen paikalliseen tallennustilaan, jotta ne ovat käytettävissä seuraavalla käynnillä. Tiedot säilyvät laitteellasi, kunnes poistat ne.</p><p>Google Analytics voi asettaa ensimmäisen osapuolen evästeitä, kuten <code>_ga</code> ja <code>_ga_...</code>, sekä käsitellä istuntotilastoja, likimääräistä sijaintia, selain- ja laitetietoja ja sivujen käyttöä. Älä lähetä meille arkaluonteisia tietoja URL-osoitteessa tai sähköpostitse.</p>`,
    retentionTitle: 'Tietojen säilytysaika',
    retentionBody: `<p>Säilytämme yhteydenottoihin liittyvää viestintää vain niin kauan kuin vastauksen antaminen, asianmukainen kirjanpito tai lakisääteiset velvoitteet edellyttävät. Analytiikka- ja teknisiä tietoja säilytetään asetustemme ja palveluntarjoajan käytettävissä olevien hallintojen mukaisesti, minkä jälkeen ne poistetaan tai yhdistetään. Säilytysaika voi vaihdella tietotyypin ja lakisääteisten vaatimusten mukaan.</p>`,
    affiliateTitle: 'Ulkoiset linkit, kumppaniseuranta ja infrastruktuuri',
    affiliateBody: `<p>SpinCrestassa on linkkejä kasino- ja vedonlyöntioperaattoreiden sivustoille. Linkki voi sisältää kampanja- tai kumppanitunnisteen, jonka avulla operaattori tunnistaa suosittelun lähteen. Kun poistut SpinCrestasta, sovelletaan operaattorin tietosuojakäytäntöä. Tavalliset kumppanilinkit eivät välitä meille kasinosalasanaasi, talletuksiasi, maksukorttitietojasi tai pelihistoriaasi.</p><p>Kuvat ja sivuston tiedostot voidaan toimittaa Cloudinaryn ja Vercelin kaltaisten infrastruktuuripalvelujen kautta. Ne voivat saada palvelun toimittamiseen ja suojaamiseen tarvittavia tavanomaisia teknisiä pyyntötietoja.</p>`,
    faqFirstAnswer: 'Käsittelemme teknisiä ja käyttöön liittyviä tietoja, kuten selain- ja laitetietoja, vierailtuja sivuja, istuntotietoja ja likimääräistä sijaintia. Google Analytics voi käyttää ensimmäisen osapuolen evästeitä. Emme kerää kasinosalasanoja, talletustietoja tai maksukorttitietoja.',
    rightsNote: `Voit käyttää näitä oikeuksia lähettämällä sähköpostia osoitteeseen <strong>${CONTACT_EMAIL}</strong>. Vastaamme sovellettavan lain edellyttämässä ajassa. GDPR:n mukaisiin pyyntöihin vastataan tavallisesti yhden kuukauden kuluessa; muilla lainkäyttöalueilla määräaika voi olla erilainen. Voimme pyytää henkilöllisyyden varmistamiseen tarvittavia tietoja.`,
  },
};

const copy = {
  en: {
    eyebrow: 'Your privacy at SpinCresta',
    lead: 'A clear overview of the limited information we collect, why we use it, who may process it, and the choices available to you.',
    primary: 'Read the policy',
    secondary: 'Privacy contact',
    detailsEyebrow: 'Full policy',
    detailsTitle: 'How we handle information',
    detailsLead: 'The sections below explain our data practices in practical terms, including analytics, service providers, security, transfers, and your rights.',
    contactTitle: 'Have a privacy question or request?',
    contactLead: 'Contact us to ask about your data or exercise a privacy right available in your jurisdiction.',
    contactButton: 'Email privacy team',
    faqEyebrow: 'Quick answers',
  },
  de: {
    eyebrow: 'Ihre Privatsphäre bei SpinCresta',
    lead: 'Ein klarer Überblick darüber, welche begrenzten Daten wir erfassen, warum wir sie verwenden, wer sie verarbeiten kann und welche Wahlmöglichkeiten Sie haben.',
    primary: 'Richtlinie lesen',
    secondary: 'Datenschutzkontakt',
    detailsEyebrow: 'Vollständige Richtlinie',
    detailsTitle: 'So gehen wir mit Informationen um',
    detailsLead: 'Die folgenden Abschnitte erläutern verständlich unsere Datenpraxis, Analysen, Dienstleister, Sicherheit, Übertragungen und Ihre Rechte.',
    contactTitle: 'Eine Datenschutzfrage oder Anfrage?',
    contactLead: 'Kontaktieren Sie uns, wenn Sie Fragen zu Ihren Daten haben oder ein Datenschutzrecht ausüben möchten.',
    contactButton: 'Datenschutzteam mailen',
    faqEyebrow: 'Kurze Antworten',
  },
  es: {
    eyebrow: 'Tu privacidad en SpinCresta',
    lead: 'Una explicación clara de los datos limitados que recopilamos, por qué los usamos, quién puede tratarlos y qué opciones tienes.',
    primary: 'Leer la política',
    secondary: 'Contacto de privacidad',
    detailsEyebrow: 'Política completa',
    detailsTitle: 'Cómo tratamos la información',
    detailsLead: 'Las siguientes secciones explican nuestras prácticas de datos, analítica, proveedores, seguridad, transferencias y tus derechos.',
    contactTitle: '¿Tienes una consulta o solicitud de privacidad?',
    contactLead: 'Escríbenos para preguntar por tus datos o ejercer un derecho de privacidad disponible en tu jurisdicción.',
    contactButton: 'Escribir al equipo',
    faqEyebrow: 'Respuestas rápidas',
  },
  it: {
    eyebrow: 'La tua privacy su SpinCresta',
    lead: 'Una spiegazione chiara dei pochi dati che raccogliamo, del loro utilizzo, di chi può trattarli e delle scelte a tua disposizione.',
    primary: 'Leggi l’informativa',
    secondary: 'Contatto privacy',
    detailsEyebrow: 'Informativa completa',
    detailsTitle: 'Come gestiamo le informazioni',
    detailsLead: 'Le sezioni seguenti spiegano le nostre pratiche sui dati, l’analisi, i fornitori, la sicurezza, i trasferimenti e i tuoi diritti.',
    contactTitle: 'Hai una domanda o una richiesta sulla privacy?',
    contactLead: 'Contattaci per chiedere informazioni sui tuoi dati o esercitare un diritto previsto nella tua giurisdizione.',
    contactButton: 'Scrivi al team privacy',
    faqEyebrow: 'Risposte rapide',
  },
  pl: {
    eyebrow: 'Twoja prywatność w SpinCresta',
    lead: 'Jasne wyjaśnienie, jakie ograniczone dane zbieramy, dlaczego ich używamy, kto może je przetwarzać i jakie masz możliwości wyboru.',
    primary: 'Przeczytaj politykę',
    secondary: 'Kontakt w sprawie prywatności',
    detailsEyebrow: 'Pełna polityka',
    detailsTitle: 'Jak postępujemy z informacjami',
    detailsLead: 'Poniższe sekcje wyjaśniają nasze praktyki dotyczące danych, analityki, usługodawców, bezpieczeństwa, transferów i Twoich praw.',
    contactTitle: 'Masz pytanie lub wniosek dotyczący prywatności?',
    contactLead: 'Napisz do nas, aby zapytać o swoje dane lub skorzystać z prawa dostępnego w Twojej jurysdykcji.',
    contactButton: 'Napisz do zespołu',
    faqEyebrow: 'Krótkie odpowiedzi',
  },
  uk: {
    eyebrow: 'Ваша конфіденційність у SpinCresta',
    lead: 'Зрозуміле пояснення того, які обмежені дані ми збираємо, навіщо їх використовуємо, хто може їх обробляти та які права ви маєте.',
    primary: 'Прочитати політику',
    secondary: 'Зв’язатися щодо даних',
    detailsEyebrow: 'Повна політика',
    detailsTitle: 'Як ми працюємо з інформацією',
    detailsLead: 'Нижче пояснюємо правила роботи з даними, аналітикою, постачальниками послуг, безпекою, передаванням інформації та вашими правами.',
    contactTitle: 'Маєте запитання або запит щодо конфіденційності?',
    contactLead: 'Напишіть нам, щоб уточнити інформацію про свої дані або скористатися правом, передбаченим у вашій юрисдикції.',
    contactButton: 'Написати команді',
    faqEyebrow: 'Короткі відповіді',
  },
  pt: {
    eyebrow: 'A sua privacidade na SpinCresta',
    lead: 'Uma explicação clara dos dados limitados que recolhemos, por que os utilizamos, quem os pode tratar e quais são as suas opções.',
    primary: 'Ler a política',
    secondary: 'Contacto de privacidade',
    detailsEyebrow: 'Política completa',
    detailsTitle: 'Como tratamos as informações',
    detailsLead: 'As secções seguintes explicam as nossas práticas de dados, análise, prestadores, segurança, transferências e os seus direitos.',
    contactTitle: 'Tem uma pergunta ou pedido sobre privacidade?',
    contactLead: 'Contacte-nos para esclarecer dúvidas sobre os seus dados ou exercer um direito disponível na sua jurisdição.',
    contactButton: 'Enviar e-mail à equipa',
    faqEyebrow: 'Respostas rápidas',
  },
  fr: {
    eyebrow: 'Votre vie privée chez SpinCresta',
    lead: 'Une explication claire des données limitées que nous recueillons, de leur utilisation, des personnes qui peuvent les traiter et de vos choix.',
    primary: 'Lire la politique',
    secondary: 'Contact confidentialité',
    detailsEyebrow: 'Politique complète',
    detailsTitle: 'Comment nous traitons les informations',
    detailsLead: 'Les sections suivantes expliquent nos pratiques relatives aux données, aux analyses, aux prestataires, à la sécurité, aux transferts et à vos droits.',
    contactTitle: 'Une question ou une demande relative à la confidentialité ?',
    contactLead: 'Contactez-nous pour obtenir des informations sur vos données ou exercer un droit applicable dans votre juridiction.',
    contactButton: 'Écrire à l’équipe',
    faqEyebrow: 'Réponses rapides',
  },
  hi: {
    eyebrow: 'SpinCresta पर आपकी गोपनीयता',
    lead: 'हम कौन-सी सीमित जानकारी एकत्र करते हैं, उसका उपयोग क्यों करते हैं, उसे कौन संसाधित कर सकता है और आपके पास क्या विकल्प हैं—इसका स्पष्ट विवरण।',
    primary: 'नीति पढ़ें',
    secondary: 'गोपनीयता संपर्क',
    detailsEyebrow: 'पूरी नीति',
    detailsTitle: 'हम जानकारी का उपयोग कैसे करते हैं',
    detailsLead: 'नीचे दिए गए भाग डेटा, एनालिटिक्स, सेवा प्रदाताओं, सुरक्षा, स्थानांतरण और आपके अधिकारों से जुड़ी हमारी प्रक्रिया बताते हैं।',
    contactTitle: 'गोपनीयता से जुड़ा कोई सवाल या अनुरोध है?',
    contactLead: 'अपने डेटा के बारे में पूछने या अपने क्षेत्र में उपलब्ध गोपनीयता अधिकार का उपयोग करने के लिए हमसे संपर्क करें।',
    contactButton: 'गोपनीयता टीम को ईमेल करें',
    faqEyebrow: 'संक्षिप्त उत्तर',
  },
  fi: {
    eyebrow: 'Yksityisyytesi SpinCrestassa',
    lead: 'Selkeä kuvaus siitä, mitä rajattuja tietoja keräämme, miksi käytämme niitä, kuka voi käsitellä niitä ja millaisia valintoja sinulla on.',
    primary: 'Lue käytäntö',
    secondary: 'Tietosuojayhteys',
    detailsEyebrow: 'Koko käytäntö',
    detailsTitle: 'Näin käsittelemme tietoja',
    detailsLead: 'Seuraavissa osioissa kuvataan tietokäytäntömme, analytiikka, palveluntarjoajat, turvallisuus, siirrot ja oikeutesi.',
    contactTitle: 'Onko sinulla tietosuojakysymys tai -pyyntö?',
    contactLead: 'Ota yhteyttä, jos haluat kysyä tiedoistasi tai käyttää lainkäyttöalueellasi voimassa olevaa tietosuojaoikeutta.',
    contactButton: 'Lähetä sähköpostia',
    faqEyebrow: 'Lyhyet vastaukset',
  },
};

const escapeHtml = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const textOnly = value => {
  let text = String(value)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  for (let pass = 0; pass < 2; pass += 1) {
    text = text
      .replaceAll('&amp;', '&')
      .replaceAll('&quot;', '"')
      .replaceAll('&#39;', "'")
      .replaceAll('&nbsp;', ' ');
  }
  return text;
};

const extractCards = (source, tag = 'div') => [...source.matchAll(new RegExp(
  `<${tag} class="faq-card">\\s*<h3>([\\s\\S]*?)<\\/h3>\\s*([\\s\\S]*?)<\\/${tag}>`,
  'gi',
))].map(match => ({ title: textOnly(match[1]), body: match[2].trim() }));

const extractSource = html => {
  const hero = html.match(/<section class="hero container">([\s\S]*?)<\/section>/i)?.[1];
  const title = textOnly(hero?.match(/<h1>([\s\S]*?)<\/h1>/i)?.[1] ?? '');
  const redesignedKicker = textOnly(hero?.match(/<span class="home-hero-kicker">([\s\S]*?)<\/span>/i)?.[1] ?? '');
  const updated = redesignedKicker.includes(' · ')
    ? redesignedKicker.split(' · ').at(-1).trim()
    : textOnly(hero?.match(/<p>([\s\S]*?)<\/p>/i)?.[1] ?? '');

  const legacyDetails = html.match(/<div class="container content-article">\s*<h2 class="title">[\s\S]*?<div class="timeline">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/i)?.[1];
  let details = [];
  if (legacyDetails) {
    details = [...legacyDetails.matchAll(/<div>\s*<h3>([\s\S]*?)<\/h3>\s*([\s\S]*?)<\/div>/gi)]
      .map(match => ({ title: textOnly(match[1]), body: match[2].trim() }));
  } else {
    const redesignedDetails = html.match(/<section class="home-showcase-section" id="privacy-details"[\s\S]*?<div class="faq-grid">([\s\S]*?)<\/div>\s*<\/section>/i)?.[1] ?? '';
    details = extractCards(redesignedDetails, 'article');
  }

  const legacyFaqSections = [...html.matchAll(/<section class="content">\s*<div class="container content-article">([\s\S]*?)<\/div>\s*<\/section>/gi)];
  let faqTitle = '';
  let faq = [];
  for (const section of legacyFaqSections) {
    if (!section[1].includes('faq-grid')) continue;
    faqTitle = textOnly(section[1].match(/<h2 class="title">([\s\S]*?)<\/h2>/i)?.[1] ?? '');
    faq = extractCards(section[1], 'div');
  }
  if (!faq.length) {
    const redesignedFaq = html.match(/<section class="home-showcase-section" id="privacy-faq"[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>[\s\S]*?<div class="faq-grid">([\s\S]*?)<\/div>\s*<\/section>/i);
    faqTitle = textOnly(redesignedFaq?.[1] ?? '');
    faq = extractCards(redesignedFaq?.[2] ?? '', 'article');
  }

  const countries = html.match(/<section class="all-countries">[\s\S]*?<\/section>/i)?.[0] ?? '';
  if (!title || !updated || details.length < 10 || faq.length < 6 || !faqTitle || !countries) {
    throw new Error(`Unexpected privacy page structure: title=${Boolean(title)}, updated=${Boolean(updated)}, details=${details.length}, faq=${faq.length}.`);
  }
  return { title, updated, details, faqTitle, faq, countries };
};

const renderPolicyCards = entries => entries.map(entry => `
            <article class="faq-card">
              <h3>${escapeHtml(entry.title)}</h3>
              ${entry.body}
            </article>`).join('');

const renderFaqCards = entries => entries.map(entry => `
            <article class="faq-card">
              <h3>${escapeHtml(entry.title)}</h3>
              ${entry.body}
            </article>`).join('');

const withoutNumber = title => title.replace(/^\s*\d+\.\s*/, '').trim();

const applyPolicyUpdate = (locale, source) => {
  const update = policyUpdates[locale];
  const alreadyUpdated = source.details.some(entry => withoutNumber(entry.title) === update.browserTitle);
  if (!alreadyUpdated) {
    const base = source.details.slice(0, -1);
    source.details = [
      ...base.slice(0, 4),
      { title: update.browserTitle, body: update.browserBody },
      { title: update.retentionTitle, body: update.retentionBody },
      ...base.slice(4, -1),
      { title: update.affiliateTitle, body: update.affiliateBody },
      base.at(-1),
    ];
  }

  source.details = source.details.map((entry, index) => ({
    ...entry,
    title: `${index + 1}. ${withoutNumber(entry.title)}`,
  }));
  const rights = source.details[6];
  const finalParagraph = rights?.body.lastIndexOf('<p') ?? -1;
  if (finalParagraph >= 0 && rights.body.slice(finalParagraph).includes(CONTACT_EMAIL)) {
    rights.body = `${rights.body.slice(0, finalParagraph)}<p>${update.rightsNote}</p>`;
  }
  source.updated = update.updated;
  source.faq[0].body = `<p>${escapeHtml(update.faqFirstAnswer)}</p>`;
  return source;
};

const updateStructuredFaq = (html, answer) => html.replace(
  /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi,
  (full, source) => {
    try {
      const data = JSON.parse(source);
      const graph = Array.isArray(data?.['@graph']) ? data['@graph'] : [];
      const faq = graph.find(item => item?.['@type'] === 'FAQPage');
      if (faq?.mainEntity?.[0]?.acceptedAnswer) faq.mainEntity[0].acceptedAnswer.text = answer;
      return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
    } catch {
      return full;
    }
  },
);

const renderMain = (locale, source) => {
  const t = copy[locale];
  return `<main>
      <section class="hero container">
        <div class="hero-content">
          <span class="home-hero-kicker">${escapeHtml(t.eyebrow)} · ${escapeHtml(source.updated)}</span>
          <h1>${escapeHtml(source.title)}</h1>
          <p>${escapeHtml(t.lead)}</p>
          <div class="home-hero-actions">
            <a class="home-primary-action" href="#privacy-details">${escapeHtml(t.primary)}</a>
            <a class="home-secondary-action" href="mailto:${CONTACT_EMAIL}">${escapeHtml(t.secondary)}</a>
          </div>
        </div>
      </section>

      <div class="content-area container">
        <section class="home-showcase-section" id="privacy-details" aria-labelledby="privacy-details-title">
          <div class="home-showcase-heading">
            <div>
              <span class="home-section-kicker">${escapeHtml(t.detailsEyebrow)}</span>
              <h2 id="privacy-details-title">${escapeHtml(t.detailsTitle)}</h2>
            </div>
            <p>${escapeHtml(t.detailsLead)}</p>
          </div>
          <div class="faq-grid">${renderPolicyCards(source.details)}
          </div>
        </section>

        <section class="home-showcase-section" aria-label="${escapeHtml(t.contactTitle)}">
          <div class="home-section-cta">
            <div>
              <strong>${escapeHtml(t.contactTitle)}</strong>
              <span>${escapeHtml(t.contactLead)}</span>
            </div>
            <a href="mailto:${CONTACT_EMAIL}">${escapeHtml(t.contactButton)}</a>
          </div>
        </section>

        <section class="home-showcase-section" id="privacy-faq" aria-labelledby="privacy-faq-title">
          <div class="home-showcase-heading">
            <div>
              <span class="home-section-kicker">${escapeHtml(t.faqEyebrow)}</span>
              <h2 id="privacy-faq-title">${escapeHtml(source.faqTitle)}</h2>
            </div>
          </div>
          <div class="faq-grid">${renderFaqCards(source.faq)}
          </div>
        </section>

        ${source.countries}
      </div>
    </main>`;
};

let changed = 0;
for (const locale of Object.keys(copy)) {
  const file = locale === 'en'
    ? path.join(ROOT, 'privacy-policy', 'index.html')
    : path.join(ROOT, locale, 'privacy-policy', 'index.html');
  let html = fs.readFileSync(file, 'utf8')
    .replaceAll('privacy@spincresta.com', CONTACT_EMAIL);
  const source = applyPolicyUpdate(locale, extractSource(html));

  html = html
    .replace(/<body([^>]*)>/i, (_, attrs) => {
      const cleaned = attrs
        .replace(/\sclass="[^"]*"/gi, '')
        .replace(/\sdata-page="[^"]*"/gi, '');
      return `<body class="home-page" data-page="privacy"${cleaned}>`;
    })
    .replace(
      /(<script type="application\/ld\+json">[\s\S]*?<\/script>)/i,
      block => updateStructuredFaq(block, policyUpdates[locale].faqFirstAnswer),
    )
    .replace(/<main\b[^>]*>[\s\S]*?<\/main>/i, renderMain(locale, source));

  fs.writeFileSync(file, html);
  changed += 1;
}

console.log(`Redesigned ${changed} Privacy Policy pages with existing site components.`);
