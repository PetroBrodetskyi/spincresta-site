#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const copy = {
  en: {
    eyebrow: 'Partner with SpinCresta',
    title: 'Useful partnerships. Clear visibility.',
    lead: 'We work with operators, affiliate teams, payment services, and iGaming projects that can offer something genuinely useful to our readers.',
    primary: 'Message us on Telegram', secondary: 'About SpinCresta',
    reach: 'SpinCresta at a glance', languages: 'Languages', markets: 'Country guides', reviews: 'Brand reviews',
    typesEyebrow: 'Ways to work together', typesTitle: 'Partnerships with a clear purpose',
    typesLead: 'Every placement starts with relevance. We choose the format that gives readers useful context and gives partners an accurate public presence.',
    cards: [
      ['Casino & sportsbook operators', 'Accurate brand profiles, market availability, product updates, and review pages built around verifiable player information.', 'Operators'],
      ['Affiliate programs', 'A direct route for factual offer updates, tracking changes, new market launches, and corrections across existing listings.', 'Programs'],
      ['Payments & iGaming services', 'Useful tools and services can be featured when they help readers understand payments, safety, or the wider player experience.', 'Services'],
      ['Media & content partners', 'Editorial collaborations, interviews, research, and relevant cross-promotion where both audiences receive real value.', 'Media'],
    ],
    processEyebrow: 'How it works', processTitle: 'From first message to a live placement',
    steps: [
      ['Share the details', 'Send the official domain, legal operator, target markets, current offer terms, and the right contact person.'],
      ['We verify the facts', 'We check public product pages, terms, payments, restrictions, and the information players need before registration.'],
      ['We choose the format', 'Depending on relevance, this may be a new review, a factual update, a partner listing, or an editorial collaboration.'],
      ['We keep it accurate', 'Partners can send material updates. Outdated or unavailable information is corrected or removed.'],
    ],
    standardsEyebrow: 'Before we publish', standardsTitle: 'What makes a strong proposal',
    needTitle: 'Please include', need: ['Official domain and legal operator name', 'Supported countries and restricted markets', 'Current bonus terms and payment options', 'Licence, KYC, and responsible-gambling information'],
    expectTitle: 'What you can expect', expect: ['An editorial check before publication', 'Sponsored and affiliate links marked correctly', 'No guaranteed positive review or paid ranking', 'A clear route for corrections and product updates'],
    contactEyebrow: 'Start a conversation', contactTitle: 'Have a partnership idea?',
    contactLead: 'Tell us what you are building, which markets matter, and what would be useful for SpinCresta readers. We will suggest the most suitable format.',
    contactPrimary: 'Contact on Telegram', contactSecondary: 'Follow on X', faqTitle: 'Partnership questions',
  },
  uk: {
    eyebrow: 'Співпраця зі SpinCresta', title: 'Корисні партнерства. Чітка видимість.',
    lead: 'Ми співпрацюємо з операторами, партнерськими командами, платіжними сервісами та iGaming-проєктами, які можуть запропонувати нашим читачам реальну користь.',
    primary: 'Написати в Telegram', secondary: 'Про SpinCresta', reach: 'SpinCresta у цифрах', languages: 'Мовні версії', markets: 'Гіди за країнами', reviews: 'Огляди брендів',
    typesEyebrow: 'Формати співпраці', typesTitle: 'Партнерство з чіткою метою',
    typesLead: 'Кожне розміщення починається з користі для читача. Ми обираємо формат, який дає аудиторії потрібний контекст, а партнеру — точне й зрозуміле представлення.',
    cards: [
      ['Оператори казино та ставок', 'Точні профілі брендів, географія роботи, оновлення продукту та огляди на основі інформації, яку гравець може перевірити.', 'Оператори'],
      ['Партнерські програми', 'Прямий канал для оновлення пропозицій, трекінгу, запусків у нових країнах і виправлення інформації в чинних оглядах.', 'Програми'],
      ['Платежі та iGaming-сервіси', 'Корисні інструменти й сервіси можуть бути представлені, якщо допомагають читачам краще зрозуміти платежі, безпеку або досвід гри.', 'Сервіси'],
      ['Медіа та контент-партнери', 'Редакційні матеріали, інтерв’ю, дослідження та доречне взаємне просування, корисне для обох аудиторій.', 'Медіа'],
    ],
    processEyebrow: 'Як це працює', processTitle: 'Від першого повідомлення до публікації',
    steps: [
      ['Надішліть інформацію', 'Вкажіть офіційний домен, юридичну особу, цільові країни, актуальні умови пропозиції та контактну особу.'],
      ['Ми перевіримо факти', 'Переглянемо сторінки продукту, правила, платежі, обмеження та інформацію, потрібну гравцям до реєстрації.'],
      ['Оберемо формат', 'Залежно від доречності це може бути новий огляд, фактичне оновлення, сторінка партнера або редакційний матеріал.'],
      ['Підтримуватимемо актуальність', 'Партнери можуть надсилати важливі оновлення. Застарілу або недоступну інформацію ми виправляємо чи видаляємо.'],
    ],
    standardsEyebrow: 'До публікації', standardsTitle: 'Що потрібно для хорошої пропозиції',
    needTitle: 'Будь ласка, додайте', need: ['Офіційний домен і назву юридичної особи', 'Доступні країни та обмежені ринки', 'Актуальні умови бонусів і способи оплати', 'Інформацію про ліцензію, KYC та відповідальну гру'],
    expectTitle: 'Що ми гарантуємо', expect: ['Редакційну перевірку перед публікацією', 'Коректне маркування рекламних і партнерських посилань', 'Відсутність продажу позитивних оцінок і місць у рейтингу', 'Зрозумілий процес виправлень та оновлень'],
    contactEyebrow: 'Почнімо розмову', contactTitle: 'Маєте ідею для співпраці?',
    contactLead: 'Розкажіть, над чим ви працюєте, які країни для вас важливі та що буде корисним читачам SpinCresta. Ми запропонуємо найдоречніший формат.',
    contactPrimary: 'Написати в Telegram', contactSecondary: 'Підписатися в X', faqTitle: 'Запитання про партнерство',
  },
  de: {
    eyebrow: 'Partner von SpinCresta werden', title: 'Sinnvolle Partnerschaften. Klare Sichtbarkeit.',
    lead: 'Wir arbeiten mit Betreibern, Affiliate-Teams, Zahlungsdiensten und iGaming-Projekten zusammen, die unseren Lesern einen echten Mehrwert bieten.',
    primary: 'Auf Telegram schreiben', secondary: 'Über SpinCresta', reach: 'SpinCresta auf einen Blick', languages: 'Sprachen', markets: 'Länderguides', reviews: 'Markentests',
    typesEyebrow: 'Möglichkeiten der Zusammenarbeit', typesTitle: 'Partnerschaften mit einem klaren Zweck', typesLead: 'Jede Platzierung beginnt mit Relevanz. Wir wählen das Format, das Lesern nützlichen Kontext und Partnern eine präzise öffentliche Präsenz bietet.',
    cards: [['Casino- und Wettanbieter', 'Präzise Markenprofile, Marktverfügbarkeit, Produktupdates und Testberichte auf Basis überprüfbarer Spielerinformationen.', 'Betreiber'], ['Affiliate-Programme', 'Ein direkter Weg für Angebotsupdates, Tracking-Änderungen, neue Märkte und Korrekturen bestehender Einträge.', 'Programme'], ['Zahlungs- und iGaming-Dienste', 'Nützliche Tools und Dienste können vorgestellt werden, wenn sie Zahlungen, Sicherheit oder das Spielerlebnis verständlicher machen.', 'Dienste'], ['Medien- und Content-Partner', 'Redaktionelle Kooperationen, Interviews, Forschung und passende Cross-Promotion mit echtem Mehrwert für beide Zielgruppen.', 'Medien']],
    processEyebrow: 'So funktioniert es', processTitle: 'Von der ersten Nachricht bis zur Veröffentlichung',
    steps: [['Details senden', 'Offizielle Domain, Betreiber, Zielmärkte, aktuelle Angebotsbedingungen und den richtigen Kontakt angeben.'], ['Wir prüfen die Fakten', 'Wir prüfen Produktseiten, Bedingungen, Zahlungen, Einschränkungen und wichtige Informationen vor der Registrierung.'], ['Wir wählen das Format', 'Je nach Relevanz entsteht ein neuer Test, ein Update, ein Partnereintrag oder eine redaktionelle Kooperation.'], ['Wir halten alles aktuell', 'Partner können wichtige Änderungen melden. Veraltete oder nicht mehr verfügbare Angaben werden korrigiert oder entfernt.']],
    standardsEyebrow: 'Vor der Veröffentlichung', standardsTitle: 'Was ein gutes Angebot ausmacht', needTitle: 'Bitte mitsenden', need: ['Offizielle Domain und rechtlicher Betreiber', 'Unterstützte Länder und ausgeschlossene Märkte', 'Aktuelle Bonusbedingungen und Zahlungsarten', 'Lizenz-, KYC- und Spielerschutzinformationen'], expectTitle: 'Was Sie erwarten können', expect: ['Redaktionelle Prüfung vor der Veröffentlichung', 'Korrekte Kennzeichnung gesponserter und Affiliate-Links', 'Keine garantierte positive Bewertung oder gekaufte Platzierung', 'Klare Abläufe für Korrekturen und Produktupdates'],
    contactEyebrow: 'Gespräch beginnen', contactTitle: 'Eine Idee für eine Partnerschaft?', contactLead: 'Erzählen Sie uns von Ihrem Projekt, den wichtigsten Märkten und dem Nutzen für SpinCresta-Leser. Wir schlagen das passende Format vor.', contactPrimary: 'Auf Telegram kontaktieren', contactSecondary: 'Auf X folgen', faqTitle: 'Fragen zu Partnerschaften',
  },
  es: {
    eyebrow: 'Colabora con SpinCresta', title: 'Colaboraciones útiles. Visibilidad clara.', lead: 'Trabajamos con operadores, equipos de afiliación, servicios de pago y proyectos de iGaming que aporten un valor real a nuestros lectores.', primary: 'Escribir por Telegram', secondary: 'Sobre SpinCresta', reach: 'SpinCresta en cifras', languages: 'Idiomas', markets: 'Guías de países', reviews: 'Reseñas de marcas',
    typesEyebrow: 'Formas de colaborar', typesTitle: 'Colaboraciones con un objetivo claro', typesLead: 'Cada publicación comienza por la relevancia. Elegimos el formato que aporta contexto útil al lector y una presencia pública precisa al colaborador.', cards: [['Operadores de casino y apuestas', 'Perfiles precisos, mercados disponibles, novedades del producto y reseñas basadas en información que el jugador puede verificar.', 'Operadores'], ['Programas de afiliación', 'Un canal directo para actualizar ofertas, enlaces de seguimiento, nuevos mercados y datos de publicaciones existentes.', 'Programas'], ['Pagos y servicios de iGaming', 'Herramientas y servicios útiles cuando ayudan a entender mejor los pagos, la seguridad o la experiencia del jugador.', 'Servicios'], ['Medios y socios de contenido', 'Colaboraciones editoriales, entrevistas, estudios y promoción cruzada relevante con valor para ambas audiencias.', 'Medios']],
    processEyebrow: 'Cómo funciona', processTitle: 'Del primer mensaje a la publicación', steps: [['Comparte los datos', 'Envía el dominio oficial, el operador legal, los mercados, las condiciones actuales y la persona de contacto.'], ['Verificamos la información', 'Revisamos las páginas del producto, condiciones, pagos, restricciones y datos necesarios antes del registro.'], ['Elegimos el formato', 'Según la relevancia, puede ser una reseña, una actualización, una ficha de socio o una colaboración editorial.'], ['Mantenemos la información al día', 'Los socios pueden enviar cambios importantes. Corregimos o retiramos los datos obsoletos.']],
    standardsEyebrow: 'Antes de publicar', standardsTitle: 'Qué debe incluir una buena propuesta', needTitle: 'Incluye, por favor', need: ['Dominio oficial y nombre legal del operador', 'Países disponibles y mercados restringidos', 'Bonos actuales y métodos de pago', 'Información sobre licencia, KYC y juego responsable'], expectTitle: 'Qué puedes esperar', expect: ['Revisión editorial antes de publicar', 'Etiquetado correcto de enlaces patrocinados y de afiliación', 'Sin reseñas positivas ni posiciones garantizadas', 'Un proceso claro para correcciones y actualizaciones'],
    contactEyebrow: 'Hablemos', contactTitle: '¿Tienes una idea de colaboración?', contactLead: 'Cuéntanos qué estás creando, qué mercados te interesan y qué puede ser útil para los lectores de SpinCresta. Propondremos el formato más adecuado.', contactPrimary: 'Contactar por Telegram', contactSecondary: 'Seguir en X', faqTitle: 'Preguntas sobre colaboraciones',
  },
  it: {
    eyebrow: 'Collabora con SpinCresta', title: 'Partnership utili. Visibilità chiara.', lead: 'Collaboriamo con operatori, team di affiliazione, servizi di pagamento e progetti iGaming capaci di offrire un valore reale ai nostri lettori.', primary: 'Scrivici su Telegram', secondary: 'Chi è SpinCresta', reach: 'SpinCresta in breve', languages: 'Lingue', markets: 'Guide nazionali', reviews: 'Recensioni dei brand',
    typesEyebrow: 'Come collaborare', typesTitle: 'Partnership con uno scopo chiaro', typesLead: 'Ogni pubblicazione parte dalla rilevanza. Scegliamo il formato che offre un contesto utile ai lettori e una presenza pubblica accurata al partner.', cards: [['Operatori di casinò e scommesse', 'Profili accurati, disponibilità per mercato, aggiornamenti di prodotto e recensioni basate su informazioni verificabili.', 'Operatori'], ['Programmi di affiliazione', 'Un canale diretto per aggiornare offerte, tracking, nuovi mercati e informazioni presenti nelle schede pubblicate.', 'Programmi'], ['Pagamenti e servizi iGaming', 'Strumenti e servizi utili quando aiutano a comprendere pagamenti, sicurezza o esperienza di gioco.', 'Servizi'], ['Media e content partner', 'Collaborazioni editoriali, interviste, ricerche e promozione incrociata rilevante per entrambe le community.', 'Media']],
    processEyebrow: 'Come funziona', processTitle: 'Dal primo messaggio alla pubblicazione', steps: [['Invia i dettagli', 'Condividi dominio ufficiale, operatore legale, mercati, condizioni attuali e referente corretto.'], ['Verifichiamo i fatti', 'Controlliamo pagine del prodotto, termini, pagamenti, restrizioni e informazioni utili prima della registrazione.'], ['Scegliamo il formato', 'In base alla rilevanza: nuova recensione, aggiornamento, scheda partner o collaborazione editoriale.'], ['Manteniamo tutto aggiornato', 'I partner possono segnalare cambiamenti importanti. Correggiamo o rimuoviamo le informazioni obsolete.']],
    standardsEyebrow: 'Prima della pubblicazione', standardsTitle: 'Cosa rende valida una proposta', needTitle: 'Includi', need: ['Dominio ufficiale e nome legale dell’operatore', 'Paesi supportati e mercati esclusi', 'Termini dei bonus e metodi di pagamento attuali', 'Informazioni su licenza, KYC e gioco responsabile'], expectTitle: 'Cosa puoi aspettarti', expect: ['Verifica editoriale prima della pubblicazione', 'Link sponsorizzati e di affiliazione contrassegnati correttamente', 'Nessuna recensione positiva o posizione garantita', 'Un processo chiaro per correzioni e aggiornamenti'],
    contactEyebrow: 'Parliamone', contactTitle: 'Hai un’idea per una partnership?', contactLead: 'Raccontaci il progetto, i mercati più importanti e il valore per i lettori di SpinCresta. Ti proporremo il formato più adatto.', contactPrimary: 'Contattaci su Telegram', contactSecondary: 'Seguici su X', faqTitle: 'Domande sulle partnership',
  },
  pl: {
    eyebrow: 'Współpracuj ze SpinCresta', title: 'Wartościowe partnerstwa. Jasna widoczność.', lead: 'Współpracujemy z operatorami, zespołami afiliacyjnymi, dostawcami płatności i projektami iGaming, które oferują czytelnikom realną wartość.', primary: 'Napisz na Telegramie', secondary: 'O SpinCresta', reach: 'SpinCresta w liczbach', languages: 'Wersje językowe', markets: 'Przewodniki krajowe', reviews: 'Recenzje marek',
    typesEyebrow: 'Formy współpracy', typesTitle: 'Partnerstwo z jasnym celem', typesLead: 'Każda publikacja zaczyna się od użyteczności. Dobieramy format, który daje czytelnikom potrzebny kontekst, a partnerowi rzetelną obecność.', cards: [['Operatorzy kasyn i zakładów', 'Rzetelne profile marek, dostępność na rynkach, aktualizacje produktów i recenzje oparte na sprawdzalnych informacjach.', 'Operatorzy'], ['Programy afiliacyjne', 'Bezpośredni kanał do aktualizacji ofert, linków śledzących, nowych rynków i danych w istniejących publikacjach.', 'Programy'], ['Płatności i usługi iGaming', 'Przydatne narzędzia i usługi, które pomagają lepiej zrozumieć płatności, bezpieczeństwo lub doświadczenie gracza.', 'Usługi'], ['Media i partnerzy treści', 'Wspólne materiały, wywiady, badania i trafna promocja krzyżowa z wartością dla obu grup odbiorców.', 'Media']],
    processEyebrow: 'Jak to działa', processTitle: 'Od pierwszej wiadomości do publikacji', steps: [['Prześlij informacje', 'Podaj oficjalną domenę, operatora prawnego, rynki, aktualne warunki i właściwą osobę kontaktową.'], ['Weryfikujemy fakty', 'Sprawdzamy strony produktu, warunki, płatności, ograniczenia i informacje potrzebne przed rejestracją.'], ['Dobieramy format', 'Może to być nowa recenzja, aktualizacja, profil partnera lub współpraca redakcyjna.'], ['Dbamy o aktualność', 'Partnerzy mogą zgłaszać ważne zmiany. Nieaktualne informacje poprawiamy lub usuwamy.']],
    standardsEyebrow: 'Przed publikacją', standardsTitle: 'Co powinna zawierać dobra propozycja', needTitle: 'Prosimy dołączyć', need: ['Oficjalną domenę i nazwę operatora prawnego', 'Obsługiwane kraje i rynki wykluczone', 'Aktualne warunki bonusów i metody płatności', 'Informacje o licencji, KYC i odpowiedzialnej grze'], expectTitle: 'Czego możesz oczekiwać', expect: ['Weryfikacji redakcyjnej przed publikacją', 'Prawidłowego oznaczenia linków sponsorowanych i afiliacyjnych', 'Braku gwarantowanej pozytywnej oceny lub płatnej pozycji', 'Jasnej ścieżki korekt i aktualizacji'],
    contactEyebrow: 'Porozmawiajmy', contactTitle: 'Masz pomysł na współpracę?', contactLead: 'Opowiedz o projekcie, ważnych rynkach i korzyści dla czytelników SpinCresta. Zaproponujemy odpowiedni format.', contactPrimary: 'Napisz na Telegramie', contactSecondary: 'Obserwuj na X', faqTitle: 'Pytania o współpracę',
  },
  pt: {
    eyebrow: 'Colabore com a SpinCresta', title: 'Parcerias úteis. Visibilidade clara.', lead: 'Trabalhamos com operadores, equipas de afiliados, serviços de pagamento e projetos de iGaming que oferecem valor real aos nossos leitores.', primary: 'Falar pelo Telegram', secondary: 'Sobre a SpinCresta', reach: 'SpinCresta em números', languages: 'Idiomas', markets: 'Guias de países', reviews: 'Análises de marcas',
    typesEyebrow: 'Formas de colaborar', typesTitle: 'Parcerias com um objetivo claro', typesLead: 'Cada publicação começa pela relevância. Escolhemos o formato que oferece contexto útil aos leitores e uma presença pública rigorosa ao parceiro.', cards: [['Operadores de casino e apostas', 'Perfis rigorosos, disponibilidade por mercado, novidades de produto e análises baseadas em informação verificável.', 'Operadores'], ['Programas de afiliados', 'Um canal direto para atualizar ofertas, tracking, novos mercados e informação em publicações existentes.', 'Programas'], ['Pagamentos e serviços iGaming', 'Ferramentas e serviços úteis quando ajudam a compreender pagamentos, segurança ou a experiência do jogador.', 'Serviços'], ['Media e parceiros de conteúdo', 'Colaborações editoriais, entrevistas, investigação e promoção cruzada relevante para ambas as audiências.', 'Media']],
    processEyebrow: 'Como funciona', processTitle: 'Da primeira mensagem à publicação', steps: [['Partilhe os detalhes', 'Envie o domínio oficial, operador legal, mercados, condições atuais e contacto responsável.'], ['Verificamos os factos', 'Analisamos páginas do produto, termos, pagamentos, restrições e informação necessária antes do registo.'], ['Escolhemos o formato', 'Consoante a relevância, pode ser uma análise, atualização, perfil de parceiro ou colaboração editorial.'], ['Mantemos tudo atualizado', 'Os parceiros podem enviar alterações importantes. Corrigimos ou removemos informação desatualizada.']],
    standardsEyebrow: 'Antes de publicar', standardsTitle: 'O que torna uma proposta sólida', needTitle: 'Inclua, por favor', need: ['Domínio oficial e nome legal do operador', 'Países suportados e mercados restritos', 'Termos de bónus e métodos de pagamento atuais', 'Informação sobre licença, KYC e jogo responsável'], expectTitle: 'O que pode esperar', expect: ['Verificação editorial antes da publicação', 'Identificação correta de links patrocinados e de afiliados', 'Sem análise positiva ou posição garantida', 'Um processo claro para correções e atualizações'],
    contactEyebrow: 'Vamos conversar', contactTitle: 'Tem uma ideia de parceria?', contactLead: 'Conte-nos o que está a criar, quais os mercados importantes e o valor para os leitores da SpinCresta. Sugerimos o formato mais adequado.', contactPrimary: 'Contactar no Telegram', contactSecondary: 'Seguir no X', faqTitle: 'Perguntas sobre parcerias',
  },
  fr: {
    eyebrow: 'Devenir partenaire de SpinCresta', title: 'Des partenariats utiles. Une visibilité claire.', lead: 'Nous travaillons avec des opérateurs, équipes d’affiliation, services de paiement et projets iGaming qui apportent une réelle valeur à nos lecteurs.', primary: 'Écrire sur Telegram', secondary: 'À propos de SpinCresta', reach: 'SpinCresta en chiffres', languages: 'Langues', markets: 'Guides par pays', reviews: 'Avis de marques',
    typesEyebrow: 'Façons de collaborer', typesTitle: 'Des partenariats avec un objectif clair', typesLead: 'Chaque publication commence par sa pertinence. Nous choisissons le format qui apporte un contexte utile au lecteur et une présence publique précise au partenaire.', cards: [['Opérateurs de casino et de paris', 'Profils précis, disponibilité par marché, actualités produit et avis fondés sur des informations vérifiables.', 'Opérateurs'], ['Programmes d’affiliation', 'Un canal direct pour les offres, le suivi, les nouveaux marchés et les corrections dans les publications existantes.', 'Programmes'], ['Paiements et services iGaming', 'Des outils et services utiles lorsqu’ils facilitent la compréhension des paiements, de la sécurité ou de l’expérience joueur.', 'Services'], ['Médias et partenaires éditoriaux', 'Collaborations éditoriales, entretiens, recherches et promotion croisée pertinente pour les deux audiences.', 'Médias']],
    processEyebrow: 'Comment ça marche', processTitle: 'Du premier message à la publication', steps: [['Partagez les informations', 'Envoyez le domaine officiel, l’opérateur légal, les marchés, les conditions actuelles et le bon contact.'], ['Nous vérifions les faits', 'Nous contrôlons les pages produit, conditions, paiements, restrictions et informations utiles avant l’inscription.'], ['Nous choisissons le format', 'Selon la pertinence : nouvel avis, mise à jour, fiche partenaire ou collaboration éditoriale.'], ['Nous maintenons l’exactitude', 'Les partenaires peuvent signaler les changements importants. Les informations obsolètes sont corrigées ou retirées.']],
    standardsEyebrow: 'Avant la publication', standardsTitle: 'Les éléments d’une bonne proposition', needTitle: 'Merci d’inclure', need: ['Domaine officiel et nom légal de l’opérateur', 'Pays pris en charge et marchés exclus', 'Conditions de bonus et moyens de paiement actuels', 'Informations sur la licence, le KYC et le jeu responsable'], expectTitle: 'Ce que vous pouvez attendre', expect: ['Vérification éditoriale avant publication', 'Liens sponsorisés et affiliés correctement identifiés', 'Aucun avis positif ni classement garanti', 'Une procédure claire pour les corrections et mises à jour'],
    contactEyebrow: 'Parlons-en', contactTitle: 'Une idée de partenariat ?', contactLead: 'Présentez-nous votre projet, vos marchés prioritaires et son intérêt pour les lecteurs de SpinCresta. Nous proposerons le format le plus adapté.', contactPrimary: 'Nous contacter sur Telegram', contactSecondary: 'Nous suivre sur X', faqTitle: 'Questions sur les partenariats',
  },
  fi: {
    eyebrow: 'Tee yhteistyötä SpinCrestan kanssa', title: 'Hyödyllisiä kumppanuuksia. Selkeää näkyvyyttä.', lead: 'Teemme yhteistyötä operaattoreiden, affiliate-tiimien, maksupalvelujen ja iGaming-hankkeiden kanssa, kun ne tarjoavat lukijoillemme todellista hyötyä.', primary: 'Lähetä viesti Telegramissa', secondary: 'Tietoa SpinCrestasta', reach: 'SpinCresta lukuina', languages: 'Kielet', markets: 'Maaoppaat', reviews: 'Brändiarvostelut',
    typesEyebrow: 'Yhteistyömuodot', typesTitle: 'Kumppanuuksia selkeällä tavoitteella', typesLead: 'Jokainen julkaisu perustuu olennaisuuteen. Valitsemme muodon, joka antaa lukijalle hyödyllistä tietoa ja kumppanille täsmällisen julkisen näkyvyyden.', cards: [['Kasino- ja vedonlyöntioperaattorit', 'Täsmälliset brändiprofiilit, markkinasaatavuus, tuoteuutiset ja todennettaviin tietoihin perustuvat arvostelut.', 'Operaattorit'], ['Affiliate-ohjelmat', 'Suora kanava tarjousten, seurannan, uusien markkinoiden ja nykyisten julkaisujen tietojen päivittämiseen.', 'Ohjelmat'], ['Maksu- ja iGaming-palvelut', 'Hyödylliset työkalut ja palvelut, jotka selventävät maksuja, turvallisuutta tai pelaajakokemusta.', 'Palvelut'], ['Media- ja sisältökumppanit', 'Toimituksellinen yhteistyö, haastattelut, tutkimus ja molemmille yleisöille hyödyllinen ristiinmarkkinointi.', 'Media']],
    processEyebrow: 'Näin se toimii', processTitle: 'Ensimmäisestä viestistä julkaisuun', steps: [['Lähetä tiedot', 'Kerro virallinen verkkotunnus, oikeudellinen operaattori, kohdemarkkinat, nykyiset ehdot ja yhteyshenkilö.'], ['Tarkistamme faktat', 'Tarkistamme tuotesivut, ehdot, maksut, rajoitukset ja ennen rekisteröitymistä tarvittavat tiedot.'], ['Valitsemme muodon', 'Kyse voi olla uudesta arvostelusta, päivityksestä, kumppaniesittelystä tai toimituksellisesta yhteistyöstä.'], ['Pidämme tiedot ajan tasalla', 'Kumppanit voivat ilmoittaa tärkeistä muutoksista. Vanhentuneet tiedot korjataan tai poistetaan.']],
    standardsEyebrow: 'Ennen julkaisua', standardsTitle: 'Mitä hyvä ehdotus sisältää', needTitle: 'Liitä mukaan', need: ['Virallinen verkkotunnus ja oikeudellisen operaattorin nimi', 'Tuetut maat ja rajoitetut markkinat', 'Ajantasaiset bonusehdot ja maksutavat', 'Lisenssi-, KYC- ja vastuullisen pelaamisen tiedot'], expectTitle: 'Mitä voit odottaa', expect: ['Toimituksellinen tarkistus ennen julkaisua', 'Sponsoroitujen ja affiliate-linkkien oikea merkintä', 'Ei taattua myönteistä arviota tai ostettua sijoitusta', 'Selkeä tapa toimittaa korjauksia ja päivityksiä'],
    contactEyebrow: 'Aloitetaan keskustelu', contactTitle: 'Onko sinulla yhteistyöidea?', contactLead: 'Kerro hankkeestasi, tärkeistä markkinoista ja hyödystä SpinCrestan lukijoille. Ehdotamme sopivinta muotoa.', contactPrimary: 'Ota yhteyttä Telegramissa', contactSecondary: 'Seuraa X:ssä', faqTitle: 'Kysymyksiä kumppanuuksista',
  },
  hi: {
    eyebrow: 'SpinCresta के साथ साझेदारी', title: 'उपयोगी साझेदारियाँ। स्पष्ट पहचान।', lead: 'हम ऑपरेटरों, एफिलिएट टीमों, भुगतान सेवाओं और ऐसे iGaming प्रोजेक्ट्स के साथ काम करते हैं जो हमारे पाठकों को वास्तविक उपयोगिता देते हैं।', primary: 'Telegram पर संदेश भेजें', secondary: 'SpinCresta के बारे में', reach: 'SpinCresta एक नज़र में', languages: 'भाषाएँ', markets: 'देश गाइड', reviews: 'ब्रांड समीक्षाएँ',
    typesEyebrow: 'साथ काम करने के तरीके', typesTitle: 'स्पष्ट उद्देश्य वाली साझेदारियाँ', typesLead: 'हर प्रकाशन की शुरुआत उपयोगिता से होती है। हम ऐसा प्रारूप चुनते हैं जो पाठकों को उपयोगी संदर्भ और साझेदार को सटीक सार्वजनिक पहचान दे।', cards: [['कैसीनो और स्पोर्ट्सबुक ऑपरेटर', 'सटीक ब्रांड प्रोफ़ाइल, बाज़ार उपलब्धता, उत्पाद अपडेट और सत्यापित की जा सकने वाली जानकारी पर आधारित समीक्षाएँ।', 'ऑपरेटर'], ['एफिलिएट प्रोग्राम', 'ऑफ़र, ट्रैकिंग, नए बाज़ार और मौजूदा प्रकाशनों की जानकारी अपडेट करने का सीधा माध्यम।', 'प्रोग्राम'], ['भुगतान और iGaming सेवाएँ', 'ऐसे उपयोगी टूल और सेवाएँ जो भुगतान, सुरक्षा या खिलाड़ी अनुभव को बेहतर ढंग से समझने में मदद करें।', 'सेवाएँ'], ['मीडिया और कंटेंट पार्टनर', 'दोनों दर्शक समूहों के लिए उपयोगी संपादकीय सहयोग, इंटरव्यू, रिसर्च और प्रासंगिक क्रॉस-प्रमोशन।', 'मीडिया']],
    processEyebrow: 'प्रक्रिया', processTitle: 'पहले संदेश से प्रकाशन तक', steps: [['जानकारी भेजें', 'आधिकारिक डोमेन, कानूनी ऑपरेटर, लक्षित बाज़ार, मौजूदा शर्तें और सही संपर्क व्यक्ति भेजें।'], ['हम तथ्य जाँचते हैं', 'हम उत्पाद पेज, शर्तें, भुगतान, प्रतिबंध और रजिस्ट्रेशन से पहले ज़रूरी जानकारी जाँचते हैं।'], ['हम प्रारूप चुनते हैं', 'प्रासंगिकता के आधार पर यह नई समीक्षा, अपडेट, पार्टनर प्रोफ़ाइल या संपादकीय सहयोग हो सकता है।'], ['हम जानकारी सही रखते हैं', 'साझेदार महत्वपूर्ण बदलाव भेज सकते हैं। पुरानी या अनुपलब्ध जानकारी को सुधारा या हटाया जाता है।']],
    standardsEyebrow: 'प्रकाशन से पहले', standardsTitle: 'एक अच्छे प्रस्ताव में क्या होना चाहिए', needTitle: 'कृपया शामिल करें', need: ['आधिकारिक डोमेन और कानूनी ऑपरेटर का नाम', 'समर्थित देश और प्रतिबंधित बाज़ार', 'मौजूदा बोनस शर्तें और भुगतान विधियाँ', 'लाइसेंस, KYC और जिम्मेदार खेल की जानकारी'], expectTitle: 'आप क्या उम्मीद कर सकते हैं', expect: ['प्रकाशन से पहले संपादकीय जाँच', 'प्रायोजित और एफिलिएट लिंक की सही पहचान', 'सकारात्मक समीक्षा या रैंकिंग की कोई गारंटी नहीं', 'सुधार और उत्पाद अपडेट के लिए स्पष्ट प्रक्रिया'],
    contactEyebrow: 'बात शुरू करें', contactTitle: 'क्या आपके पास साझेदारी का विचार है?', contactLead: 'हमें अपने प्रोजेक्ट, प्रमुख बाज़ारों और SpinCresta के पाठकों के लिए इसकी उपयोगिता के बारे में बताएँ। हम सबसे उपयुक्त प्रारूप सुझाएँगे।', contactPrimary: 'Telegram पर संपर्क करें', contactSecondary: 'X पर फ़ॉलो करें', faqTitle: 'साझेदारी से जुड़े सवाल',
  },
};

const escapeHtml = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const getFaq = html => {
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(match[1]);
      const nodes = Array.isArray(data?.['@graph']) ? data['@graph'] : [data];
      const faq = nodes.find(node => node?.['@type'] === 'FAQPage');
      if (faq?.mainEntity?.length) return faq.mainEntity.map(item => [item.name, item.acceptedAnswer?.text ?? '']);
    } catch {}
  }
  return [];
};

const getHomeStatsGrid = locale => {
  const homeFile = locale === 'en' ? path.join(ROOT, 'index.html') : path.join(ROOT, locale, 'index.html');
  const homeHtml = fs.readFileSync(homeFile, 'utf8');
  const match = homeHtml.match(/<div class="home-stats-grid">[\s\S]*?<\/div>/i);
  if (!match) throw new Error(`No homepage statistics grid found in ${path.relative(ROOT, homeFile)}`);
  return match[0];
};

const updateStructuredData = (html, pageTitle, pageDescription) => html.replace(
  /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi,
  (full, source) => {
    try {
      const data = JSON.parse(source);
      const nodes = Array.isArray(data?.['@graph']) ? data['@graph'] : [data];
      const webpage = nodes.find(node => node?.['@type'] === 'WebPage' && String(node.url ?? '').includes('/partners/'));
      if (!webpage) return full;
      webpage.name = pageTitle;
      webpage.description = pageDescription;
      return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`;
    } catch {
      return full;
    }
  },
);

const renderCards = cards => cards.map(([title, text], index) => `
              <article>
                <span>0${index + 1}</span>
                <h3>${escapeHtml(title)}</h3>
                <p>${escapeHtml(text)}</p>
              </article>`).join('');

const renderSteps = steps => steps.map(([title, text], index) => `
              <article>
                <span>0${index + 1}</span>
                <h3>${escapeHtml(title)}</h3>
                <p>${escapeHtml(text)}</p>
              </article>`).join('');

const renderList = items => items.map(item => `• ${escapeHtml(item)}`).join('<br />');
const renderFaq = items => items.map(([question, answer]) => `<article class="faq-card"><h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p></article>`).join('');

const renderMain = (locale, faq, homeStatsGrid) => {
  const t = copy[locale];
  const prefix = locale === 'en' ? '' : `/${locale}`;
  return `<main>
      <section class="hero container">
        <div class="hero-content">
          <span class="home-hero-kicker">${escapeHtml(t.eyebrow)}</span>
          <h1>${escapeHtml(t.title)}</h1>
          <p>${escapeHtml(t.lead)}</p>
          <div class="home-hero-actions">
            <a class="home-primary-action" href="https://t.me/spincresta" target="_blank" rel="noopener noreferrer nofollow">${escapeHtml(t.primary)}</a>
            <a class="home-secondary-action" href="${prefix}/about/">${escapeHtml(t.secondary)}</a>
          </div>
        </div>

        <div class="home-insight-card">
          ${homeStatsGrid}
        </div>
      </section>

      <div class="content-area container">
          <section class="home-showcase-section">
            <div class="home-showcase-heading">
              <div>
                <span class="home-section-kicker">${escapeHtml(t.typesEyebrow)}</span>
                <h2>${escapeHtml(t.typesTitle)}</h2>
              </div>
              <p>${escapeHtml(t.typesLead)}</p>
            </div>
            <div class="home-method-grid">${renderCards(t.cards)}
            </div>
          </section>

          <section class="home-showcase-section">
            <div class="home-showcase-heading">
              <div>
                <span class="home-section-kicker">${escapeHtml(t.processEyebrow)}</span>
                <h2>${escapeHtml(t.processTitle)}</h2>
              </div>
            </div>
            <div class="home-method-grid">${renderSteps(t.steps)}
            </div>
          </section>

          <section class="home-showcase-section">
            <div class="home-showcase-heading">
              <div>
                <span class="home-section-kicker">${escapeHtml(t.standardsEyebrow)}</span>
                <h2>${escapeHtml(t.standardsTitle)}</h2>
              </div>
            </div>
            <div class="faq-grid">
              <article class="faq-card">
                <h3>${escapeHtml(t.needTitle)}</h3>
                <p>${renderList(t.need)}</p>
              </article>
              <article class="faq-card">
                <h3>${escapeHtml(t.expectTitle)}</h3>
                <p>${renderList(t.expect)}</p>
              </article>
            </div>
          </section>

          <section class="home-showcase-section">
            <div class="home-section-cta">
              <div>
                <strong>${escapeHtml(t.contactTitle)}</strong>
                <span>${escapeHtml(t.contactLead)}</span>
              </div>
              <a href="https://t.me/spincresta" target="_blank" rel="noopener noreferrer nofollow">${escapeHtml(t.contactPrimary)}</a>
            </div>
          </section>

          <section class="home-showcase-section">
            <div class="home-showcase-heading">
              <div>
                <span class="home-section-kicker">FAQ</span>
                <h2>${escapeHtml(t.faqTitle)}</h2>
              </div>
            </div>
            <div class="faq-grid">${renderFaq(faq)}
            </div>
          </section>
      </div>
    </main>`;
};

const removeLegacyPartnersCss = () => {
  const cssPath = path.join(ROOT, 'styles', 'pages.css');
  const css = fs.readFileSync(cssPath, 'utf8');
  const marker = '/* =============================================================\n   PARTNERS PAGE\n   ============================================================= */';
  const markerIndex = css.indexOf(marker);
  if (markerIndex !== -1) fs.writeFileSync(cssPath, `${css.slice(0, markerIndex).trimEnd()}\n`);
};

let changed = 0;
for (const locale of Object.keys(copy)) {
  const file = locale === 'en' ? path.join(ROOT, 'partners', 'index.html') : path.join(ROOT, locale, 'partners', 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  const faq = getFaq(html);
  const homeStatsGrid = getHomeStatsGrid(locale);
  if (!faq.length) throw new Error(`No FAQ schema found in ${path.relative(ROOT, file)}`);
  const pageTitle = `SpinCresta | ${copy[locale].title}`;
  const pageDescription = copy[locale].lead;

  html = html
    .replace(/<body([^>]*)>/i, (_, attrs) => {
      const cleaned = attrs
        .replace(/\sclass="[^"]*"/gi, '')
        .replace(/\sdata-page="[^"]*"/gi, '');
      return `<body class="home-page" data-page="partners"${cleaned}>`;
    })
    .replace(/<main\b[^>]*>[\s\S]*?<\/main>/i, renderMain(locale, faq, homeStatsGrid))
    .replace(/\s*<style>\s*\.partners-listing-title\s*\{[\s\S]*?<\/style>/i, '')
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(pageTitle)}</title>`)
    .replace(/<meta\s+name="description"\s+content="[\s\S]*?"\s*\/>/i, `<meta name="description" content="${escapeHtml(pageDescription)}" />`)
    .replace(/<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/>/i, `<meta property="og:title" content="${escapeHtml(pageTitle)}" />`)
    .replace(/<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/>/i, `<meta property="og:description" content="${escapeHtml(pageDescription)}" />`)
    .replace(/<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/>/i, `<meta name="twitter:title" content="${escapeHtml(pageTitle)}" />`)
    .replace(/<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/>/i, `<meta name="twitter:description" content="${escapeHtml(pageDescription)}" />`)
    .replace(/\/styles\.css\?v=[^"]+/i, '/styles.css?v=20260820-partners-existing-1');

  html = updateStructuredData(html, pageTitle, pageDescription);

  fs.writeFileSync(file, html);
  changed += 1;
}

removeLegacyPartnersCss();

console.log(`Redesigned ${changed} Partners pages.`);
