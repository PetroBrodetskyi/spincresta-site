#!/usr/bin/env node
import fs from 'node:fs';

const replacements = {
  de: [
    ['SilverPlay Casino- und Sportwetten-Rezension', 'SilverPlay Casino- und Sportwetten-Test'],
    ['Öffentliche Rezension durch SpinCresta; kein Einzahlungs- oder Auszahlungstest.', 'Prüfung der öffentlich zugänglichen Website durch SpinCresta; Ein- und Auszahlungen wurden nicht getestet.'],
    ['Vierer-Einzahlungspaket', 'Willkommenspaket für vier Einzahlungen'],
    ['<p>Die jetzige <span>willkommene Beförderung</span> Listen bis zu <strong>2.500 € + 250 Freispiele</strong> über die ersten vier Einzahlungen. Die Homepage enthält auch einen anderen 1.000-Euro-Hinweis; In dieser Rezension wird die detaillierte Werbung verwendet, nicht das allgemeine Banner. Bei den nachstehenden Zahlen handelt es sich um das überprüfte EUR-Angebot, nicht um Währungsumrechnungen oder ein Versprechen für jedes Land.</p>', '<p>Die aktuelle Willkommensaktion bietet über die ersten vier Einzahlungen insgesamt bis zu <strong>2.500 € + 250 Freispiele</strong>. Auf der Startseite erscheint außerdem ein allgemeiner Hinweis auf 1.000 €; für diesen Test wurden die ausführlichen Aktionsbedingungen verwendet. Die folgenden Beträge beziehen sich auf das geprüfte EUR-Angebot und gelten nicht automatisch für jedes Land.</p>'],
    ['<th scope="col">Kaution</th>', '<th scope="col">Einzahlung</th>'],
    ['<th scope="col">Schlüsselbegriffe</th>', '<th scope="col">Wichtige Bedingung</th>'],
    ['€20.000 <g id="1">Mindesteinzahlung </g>', '20 € Mindesteinzahlung'],
    ['Reklamation nach der ersten Stufe', 'Nach Abschluss der ersten Stufe beanspruchen'],
    ['Reklamation nach der zweiten Stufe', 'Nach Abschluss der zweiten Stufe beanspruchen'],
    ['3. 100 % bis 1.000 € + 100 FS', '100 % bis zu 1.000 € + 100 FS'],
    ['Casino-Bonusregeln & Wetten', 'Casino-Bonusregeln und Umsatzbedingungen'],
    ['Aktueller Bedarf', 'Aktuelle Bedingung'],
    ['Spieler zum Mitnehmen', 'Bedeutung für Spieler'],
    ['<td>Umsetzen</td>', '<td>Umsatzbedingung</td>'],
    ['Je niedriger € 12 oder 5% des gewährten Bonus', 'Der niedrigere Wert aus 12 € oder 5 % des gewährten Bonus'],
    ['<p>Das Getrennte <span>Sport-Willkommensförderung</span> verwendet Code <code translate="no">100PLAY</code>. Casino- und Sportwetten sind getrennt und wir haben keine Wetten platziert, um die Abrechnung oder Auszahlung zu testen.</p>', '<p>Für die separate Sport-Willkommensaktion gilt der Code <code translate="no">100PLAY</code>. Casino- und Sportwetten werden getrennt abgerechnet; wir haben keine Wetten platziert und weder Abrechnung noch Cash-out getestet.</p>'],
    ['Veröffentlichter Begriff', 'Veröffentlichte Bedingung'],
    ['12-facher Bonus innerhalb von 21 Tagen', '12-facher Bonusumsatz innerhalb von 21 Tagen'],
    ['Nur Einsätze bis zu 50 % der Bonuszahl', 'Nur Einsätze bis zu 50 % des Bonusbetrags zählen'],
    ['<td>Qualifizierende Quoten</td><td>mindestens 80. </td>', '<td>Mindestquote</td><td>Mindestens 1,80</td>'],
    ['Sachlicher Geltungsbereich', 'Abgedeckte Produkte'],
    ['Es handelt sich nicht um eine Live-Inventur oder eine gewinnbasierte Empfehlung.', 'Es handelt sich weder um einen Live-Bestand noch um eine Empfehlung auf Grundlage möglicher Gewinne.'],
    ['<strong>GEO</strong><span>Benutzen Sie die <span>Casino-Lobby</span> Und <span>Live-Lobby</span> um die aktuelle Verfügbarkeit zu prüfen. Ein Demo-Link oder eine sichtbare Spielkachel ist kein Beweis dafür, dass in Ihrem Land Echtgeldspiele möglich sind.</span>', '<strong>Verfügbarkeit</strong><span>Prüfen Sie in der Casino- und Live-Lobby, welche Inhalte aktuell verfügbar sind. Ein Demo-Link oder eine sichtbare Spielkachel belegt nicht, dass Echtgeldspiele in Ihrem Land angeboten werden.</span>'],
    ['<p>Diese Punkte stammen aus der <span>Allgemeine Geschäftsbedingungen</span>. Es können auch Bankgebühren, Währungsumrechnungs- und Anbietergebühren anfallen. Mindestabhebungen und Bearbeitungszeiten wurden nicht unabhängig bestätigt.</p>', '<p>Diese Angaben stammen aus den allgemeinen Geschäftsbedingungen. Zusätzlich können Bank-, Währungsumrechnungs- und Anbietergebühren anfallen. Mindestbeträge und Bearbeitungszeiten für Auszahlungen wurden nicht unabhängig bestätigt.</p>'],
    ['<p>Der <span>KYC-Richtlinie</span> erklärt, wann eine Überprüfung erforderlich ist und welche Dokumente angefordert werden können. Die Registrierung und der Zahlungszugang können je nach Standort und Spielerprofil variieren.</p>', '<p>Die KYC-Richtlinie erklärt, wann eine Verifizierung erforderlich ist und welche Dokumente angefordert werden können. Registrierung und Zahlungszugang können je nach Standort und Spielerprofil variieren.</p>'],
    ['Bevor du dich registrieren', 'Vor der Registrierung'],
    ['Schecks können auch früher angefordert werden', 'Prüfungen können auch früher verlangt werden'],
    ['<strong>Die Lizenzüberprüfung bleibt offen</strong><span>Die überprüfte Fußzeile enthält Links zu Ardevar Logo Ltd als Technologieanbieter und die Richtlinien beziehen sich auf Anjouan-Beschränkungen. Weder stellt eine aktuelle Lizenz für genau diese Domain dar. Wir haben eine Lizenznummer nicht unabhängig überprüft und stellen die Marke nicht als lokal lizenziert oder von der Aufsichtsbehörde genehmigt dar.</span>', '<strong>Lizenzstatus nicht abschließend bestätigt</strong><span>Die geprüfte Fußzeile nennt Ardevar Logo Ltd als Technologieanbieter; außerdem verweisen die Richtlinien auf Einschränkungen in Anjouan. Daraus ergibt sich keine aktuelle Lizenz für die geprüfte Domain. Wir haben keine Lizenznummer unabhängig bestätigt und stellen die Marke daher nicht als lokal lizenziert oder behördlich zugelassen dar.</span>'],
    ['<strong>Support-Kanäle</strong><span>Der <span>Kontaktseite</span> wirbt rund um die Uhr per E-Mail und Live-Chat. Allgemeine Fragen gehen zu <span>support@silverplay.com</span>. Wir haben die veröffentlichten Kanäle überprüft, nicht die Reaktionszeiten oder Streitergebnisse.</span>', '<strong>Support-Kanäle</strong><span>Die Kontaktseite nennt einen rund um die Uhr erreichbaren E-Mail- und Live-Chat-Support. Allgemeine Anfragen gehen an support@silverplay.com. Wir haben die veröffentlichten Kontaktwege geprüft, nicht jedoch Reaktionszeiten oder Ergebnisse von Streitfällen.</span>'],
    ['<strong>Browserzugriff und Datenschutz</strong><span>Die Website fördert den Zugriff auf PCs, Macs und Mobilgeräte. Es wurde kein offizieller App-Store-Eintrag überprüft. Der <span>Datenschutzrichtlinie</span> beschreibt den Umgang mit Identitäts-, Kontakt- und Bankinformationen; Verwenden Sie für Dokumente ausschließlich die sichere Profilschnittstelle.</span>', '<strong>Browserzugriff und Datenschutz</strong><span>Die Website ist für PC, Mac und Mobilgeräte ausgelegt. Ein offizieller App-Store-Eintrag wurde nicht bestätigt. Die Datenschutzrichtlinie beschreibt den Umgang mit Identitäts-, Kontakt- und Bankdaten; Dokumente sollten ausschließlich über den geschützten Profilbereich übermittelt werden.</span>'],
    ['<strong>Der Selbstausschluss wird nicht als augenblicklich beschrieben</strong><span>Der <span>Selbstausschlussrichtlinie</span> leitet Anfragen an <span>customercare@silverplay.com</span> und ermöglicht eine Bearbeitungszeit von bis zu 10 Werktagen. Bei dieser Verzögerung handelt es sich um eine wesentliche Einschränkung und nicht um eine unmittelbare Sicherheitsgarantie.</span>', '<strong>Selbstausschluss ist nicht sofort wirksam</strong><span>Laut Selbstausschlussrichtlinie sind Anfragen an customercare@silverplay.com zu richten; die Bearbeitung kann bis zu 10 Werktage dauern. Diese Verzögerung ist eine wichtige Einschränkung und keine sofortige Sicherheitsgarantie.</span>'],
    ['<strong>18+</strong><span>Lesen Sie unsere <a href="/de/responsible-gambling/">Leitfaden für verantwortungsvolles Glücksspiel</a> und des Betreibers <span>Safer-Play-Richtlinie</span>. Glücksspiel ist keine Möglichkeit, Einkommen zu erzielen oder Verluste auszugleichen.</span>', '<strong>18+</strong><span>Lesen Sie unseren <a href="/de/responsible-gambling/">Leitfaden für verantwortungsvolles Glücksspiel</a> sowie die Safer-Play-Richtlinie des Betreibers. Glücksspiel ist keine Möglichkeit, Einkommen zu erzielen oder Verluste auszugleichen.</span>'],
    ['Wer SilverPlay am besten passt', 'Für wen SilverPlay geeignet ist'],
    ['Mobile Browser-Player', 'Spieler im mobilen Browser'],
    ['Denken Sie nochmal nach.', 'Besser vergleichen, wenn …'],
    ['Öffentliche KYC-, Rücknahme-, Support- und Selbstausschlussinformationen.', 'Öffentliche Informationen zu KYC, Auszahlungen, Support und Selbstausschluss.'],
    ['Nützliche Spiel-, Live-Tabelle- und Anbieter-Navigation.', 'Übersichtliche Navigation für Spiele, Live-Tische und Anbieter.'],
    ['Regionale Förderfähigkeit und Währungsbedingungen müssen überprüft werden.', 'Regionale Teilnahmeberechtigung und Währungsbedingungen müssen geprüft werden.'],
    ['Welche Wetteinsätze gelten für das SilverPlay Casino-Paket?', 'Welche Umsatzbedingungen gelten für das SilverPlay-Casinopaket?'],
    ['den Währungsäquivalent', 'den entsprechenden Gegenwert in der jeweiligen Währung'],
    ['Schecks können auch früher beantragt werden.', 'Prüfungen können auch früher verlangt werden.'],
    ['Das Casino-Menü unterteilt in', 'Das Casino-Menü gliedert sich in'],
    ['bereitgestellt; Es handelt', 'bereitgestellt; es handelt'],
    ['5x Einzahlungsüberschlag', '5-facher Umsatz der Einzahlung'],
    ['Bereite die Verifizierung vor, bevor du eine Auszahlung erwartest', 'Bereiten Sie die Verifizierung vor einer Auszahlung vor'],
    ['Lebenslange Einzahlungen über', 'Einzahlungen von insgesamt über'],
    ['Auszahlungen, stornierte und zurückerstattete Wetten qualifizieren sich nicht', 'Cash-out-, stornierte und zurückerstattete Wetten sind nicht qualifiziert'],
  ],
  es: [
    ['SilverPlay Revisión de casinos y apuestas deportivas', 'Reseña del casino y casa de apuestas SilverPlay'],
    ['<strong>casino y casa de apuestas deportivas</strong>', '<strong>Casino y apuestas deportivas</strong>'],
    ['<strong>lobby en vivo dedicado</strong>', '<strong>Lobby de casino en vivo</strong>'],
    ['<p>La corriente <span>promoción de bienvenida</span> enumera hasta <strong>2.500€ + 250 giros gratis</strong> en los primeros cuatro depósitos. La página de inicio también contiene un aviso diferente de 1.000 €; Esta revisión utiliza la promoción detallada, no ese banner genérico. Las cifras a continuación son la oferta en EUR revisada, no conversiones de moneda ni una promesa para cada país.</p>', '<p>La promoción de bienvenida vigente ofrece hasta <strong>2.500 € + 250 giros gratis</strong> repartidos entre los cuatro primeros depósitos. La portada también muestra un reclamo genérico de 1.000 €; esta reseña utiliza las condiciones detalladas de la promoción. Las cifras corresponden a la oferta revisada en EUR y no se aplican automáticamente a todos los países.</p>'],
    ['Bonificación Y tiradas gratuitas', 'Bono y giros gratis'],
    ['<td>Depósito mínimo</td>', '<td>Depósito mínimo de 20 €</td>'],
    ['Reclamación después de la primera etapa', 'Solicitar después de la primera etapa'],
    ['Reclamación después de la segunda etapa', 'Solicitar después de la segunda etapa'],
    ['Requerimiento de Corriente', 'Requisito vigente'],
    ['Reproductor para llevar', 'Qué debe tener en cuenta el jugador'],
    ['<td>Apuesta</td>', '<td>Requisito de apuesta</td>'],
    ['35x depósito más bonificación en 21 días', '35 veces el depósito más el bono en un plazo de 21 días'],
    ['€ 1,400 de facturación', '1.400 € de volumen de juego'],
    ['<p>el separado <span>promoción de bienvenida deportiva</span> utiliza código <code translate="no">100PLAY</code>. Las apuestas deportivas y de casino están separadas, y no realizamos apuestas para probar la liquidación o el cobro.</p>', '<p>La promoción de bienvenida deportiva utiliza el código <code translate="no">100PLAY</code>. Las promociones de casino y apuestas deportivas se calculan por separado; no realizamos apuestas ni probamos la liquidación o el cobro.</p>'],
    ['<th scope="col">Controlar</th>', '<th scope="col">Aspecto</th>'],
    ['12 veces la bonificación en 21 días', '12 veces el bono en un plazo de 21 días'],
    ['<td>Probabilidades de clasificación</td><td>Mínimo 80%</td>', '<td>Cuota mínima</td><td>Al menos 1,80</td>'],
    ['<strong>GEO</strong><span>Utilice el <span>lobby del casino</span> y <span>lobby en vivo</span> para comprobar la disponibilidad actual. Un enlace de demostración o un mosaico de juego visible no es prueba de que el juego con dinero real esté disponible en su país.</span>', '<strong>Disponibilidad</strong><span>Consulta los lobbies de casino y casino en vivo para comprobar la oferta actual. Un enlace de demostración o un juego visible no demuestra que las apuestas con dinero real estén disponibles en tu país.</span>'],
    ['<p>Estos puntos provienen de la <span>términos generales</span>. También pueden aplicarse cargos bancarios, conversión de moneda y tarifas de proveedor. Los retiros mínimos y los tiempos de procesamiento no se confirmaron de forma independiente.</p>', '<p>Estos datos proceden de los términos generales. También pueden aplicarse cargos bancarios, de conversión de divisas o del proveedor. No confirmamos de forma independiente los importes mínimos ni los plazos de procesamiento de los retiros.</p>'],
    ['<p>El <span>Política KYC</span> explica cuándo se requiere verificación y qué documentos se pueden solicitar. El registro y el acceso al pago pueden variar según la ubicación y el perfil del jugador.</p>', '<p>La política KYC explica cuándo se exige la verificación y qué documentos pueden solicitarse. El registro y el acceso a los pagos pueden variar según la ubicación y el perfil del jugador.</p>'],
    ['<strong>Canales de soporte</strong><span>El <span>pagina de contacto</span> anuncia correo electrónico y chat en vivo las 24 horas, los 7 días de la semana. Las preguntas generales van a <span>support@silverplay.com</span>. Verificamos los canales publicados, no los tiempos de respuesta ni los resultados de las disputas.</span>', '<strong>Canales de soporte</strong><span>La página de contacto anuncia asistencia por correo electrónico y chat en vivo las 24 horas. Las consultas generales se envían a support@silverplay.com. Comprobamos los canales publicados, pero no los tiempos de respuesta ni la resolución de disputas.</span>'],
    ['<strong>Acceso al navegador y privacidad</strong><span>El sitio promueve el acceso a PC, Mac y dispositivos móviles. No se verificó ninguna lista oficial de la tienda de aplicaciones. El <span>Política de privacidad</span> describe el manejo de información de identidad, de contacto y bancaria; utilice únicamente la interfaz de perfil seguro para documentos.</span>', '<strong>Acceso desde el navegador y privacidad</strong><span>El sitio funciona en PC, Mac y dispositivos móviles. No se confirmó una aplicación oficial en ninguna tienda. La política de privacidad describe el tratamiento de los datos de identidad, contacto y banca; los documentos deben enviarse únicamente mediante el área segura del perfil.</span>'],
    ['<strong>La autoexclusión no se describe como instantánea</strong><span>El <span>política de autoexclusión</span> dirige las solicitudes a <span>atención al customercare@silverplay.com</span> y permite hasta 10 días hábiles para actuar. Este retraso es una limitación material, no una garantía de seguridad inmediata.</span>', '<strong>La autoexclusión no es inmediata</strong><span>La política de autoexclusión indica que las solicitudes deben enviarse a customercare@silverplay.com y que su tramitación puede tardar hasta 10 días hábiles. Este plazo es una limitación importante, no una garantía de bloqueo inmediato.</span>'],
    ['Reproductores de navegador móvil', 'Jugadores desde el navegador móvil'],
    ['Un ajuste práctico para los jugadores', 'Una opción práctica para los jugadores'],
    ['Juego útil, mesa en vivo y navegación del proveedor.', 'Navegación clara por juegos, mesas en vivo y proveedores.'],
    ['<strong>18+</strong><span>Lea nuestro <a href="/es/responsible-gambling/">guía de juego responsable</a> y el operador <span>política de juego responsable</span>. El juego no es una forma de obtener ingresos o recuperar pérdidas.</span>', '<strong>18+</strong><span>Consulta nuestra <a href="/es/responsible-gambling/">guía de juego responsable</a> y la política de juego responsable del operador. El juego no es una forma de obtener ingresos ni de recuperar pérdidas.</span>'],
    ['Depósito de 35x más bonificación en 21 días', '35 veces el depósito más el bono en un plazo de 21 días'],
    ['Las apuestas retiradas, canceladas y reembolsadas no califican', 'Las apuestas con cash-out, canceladas o reembolsadas no cuentan'],
    ['La obra de arte del nuevo juego que se muestra aquí se proporcionó para la revisión de septiembre de 2026; No es un inventario en vivo ni una recomendación basada en ganancias.', 'La imagen del nuevo juego mostrada aquí se facilitó para la reseña de septiembre de 2026; no representa el catálogo en tiempo real ni constituye una recomendación basada en posibles ganancias.'],
    ['requisitos de apuesta de los depósitos', 'Requisito de apuesta del depósito'],
    ['Transferencia de depósito 5x;', 'El depósito debe apostarse 5 veces;'],
    ['Pregunte cómo se cuenta la facturación del casino.', 'Consulta cómo se calcula el volumen de juego del casino.'],
    ['Prepara la verificación antes de recibir un cobro', 'Prepara la documentación antes de solicitar un retiro'],
    ['Depósitos de por vida superiores a', 'Depósitos acumulados superiores a'],
  ],
  it: [
    ['<p>Il corrente <span>promozione di benvenuto</span> elenchi fino a <strong>2.500€ + 250 giri gratuiti</strong> nei primi quattro depositi. La homepage contiene anche un diverso callout da € 1.000; questa recensione utilizza la promozione dettagliata, non quel banner generico. Le cifre seguenti rappresentano l\'offerta EUR esaminata, non le conversioni di valuta o una promessa per ogni paese.</p>', '<p>La promozione di benvenuto attuale offre fino a <strong>2.500 € + 250 giri gratuiti</strong> distribuiti sui primi quattro depositi. La homepage mostra anche un richiamo generico da 1.000 €; questa recensione utilizza le condizioni dettagliate della promozione. Gli importi si riferiscono all\'offerta verificata in EUR e non valgono automaticamente in ogni Paese.</p>'],
    ['<th scope="col">Depositare</th>', '<th scope="col">Deposito</th>'],
    ['Bonus e Giri Gratuiti', 'Bonus e giri gratuiti'],
    ['<td>Deposito Minimo</td>', '<td>Deposito minimo di 20 €</td>'],
    ['Reclamo dopo la prima fase', 'Da richiedere dopo la prima fase'],
    ['Reclamo dopo la seconda fase', 'Da richiedere dopo la seconda fase'],
    ['Giocatore da asporto', 'Cosa deve sapere il giocatore'],
    ["<td>Gioco d'azzardo</td>", '<td>Requisito di puntata</td>'],
    ['<p>Il separato <span>promozione di benvenuto sportivo</span> utilizza il codice <code translate="no">100PLAY</code>. Le scommesse sul casinò e le scommesse sportive sono separate e non abbiamo piazzato scommesse per testare il regolamento o l\'incasso.</p>', '<p>La promozione di benvenuto sportiva utilizza il codice <code translate="no">100PLAY</code>. Le promozioni del casinò e quelle sportive vengono calcolate separatamente; non abbiamo piazzato scommesse né testato il regolamento o il cash-out.</p>'],
    ['<td>Quote valide</td><td>1</td>', '<td>Quota minima</td><td>Almeno 1,80</td>'],
    ['<strong>GEO</strong><span>Usa il <span>lobby del casinò</span> E <span>lobby dal vivo</span> per verificare la disponibilità attuale. Un collegamento demo o un riquadro di gioco visibile non è una prova che il gioco con soldi veri sia disponibile nel tuo Paese.</span>', '<strong>Disponibilità</strong><span>Controlla le lobby del casinò e del casinò live per verificare l\'offerta attuale. Un collegamento demo o un gioco visibile non dimostra che il gioco con denaro reale sia disponibile nel tuo Paese.</span>'],
    ['<p>Questi punti provengono da <span>condizioni generali</span>. Potrebbero essere applicate anche commissioni bancarie, conversione di valuta e commissioni del fornitore. I prelievi minimi e i tempi di elaborazione non sono stati confermati in modo indipendente.</p>', '<p>Questi dati provengono dai termini e condizioni generali. Possono inoltre essere applicate commissioni bancarie, di conversione valutaria o del fornitore. Non abbiamo confermato in modo indipendente gli importi minimi e i tempi di elaborazione dei prelievi.</p>'],
    ['<p>IL <span>Politica KYC</span> spiega quando è richiesta la verifica e quali documenti possono essere richiesti. La registrazione e l\'accesso al pagamento possono comunque variare in base alla posizione e al profilo del giocatore.</p>', '<p>La politica KYC spiega quando è richiesta la verifica e quali documenti possono essere richiesti. La registrazione e l\'accesso ai pagamenti possono variare in base alla posizione e al profilo del giocatore.</p>'],
    ['Prima di registrare', 'Prima della registrazione'],
    ['<strong>Canali di supporto</strong><span>IL <span>pagina dei contatti</span> pubblicizza e-mail e chat dal vivo 24 ore su 24, 7 giorni su 7. Le domande generali vanno a <span>support@silverplay.com</span>. Abbiamo controllato i canali pubblicati, non i tempi di risposta o gli esiti delle controversie.</span>', '<strong>Canali di supporto</strong><span>La pagina dei contatti indica assistenza via e-mail e chat live 24 ore su 24. Le richieste generali vanno inviate a support@silverplay.com. Abbiamo verificato i canali pubblicati, ma non i tempi di risposta né gli esiti delle controversie.</span>'],
    ['<strong>Accesso al browser e privacy</strong><span>Il sito promuove l\'accesso da PC, Mac e dispositivi mobili. Non è stata verificata alcuna scheda ufficiale dell\'app store. IL <span>Informativa sulla privacy</span> descrive la gestione dell\'identità, dei contatti e delle informazioni bancarie; utilizzare solo l\'interfaccia del profilo sicuro per i documenti.</span>', '<strong>Accesso dal browser e privacy</strong><span>Il sito è accessibile da PC, Mac e dispositivi mobili. Non è stata verificata un\'app ufficiale negli store. L\'informativa sulla privacy descrive il trattamento dei dati identificativi, di contatto e bancari; i documenti vanno inviati soltanto tramite l\'area protetta del profilo.</span>'],
    ["<strong>L'autoesclusione non è descritta come immediata</strong><span>IL <span>politica di autoesclusione</span> indirizza le richieste a <span>customercare@silverplay.com</span> e consente fino a 10 giorni lavorativi per l'azione. Questo ritardo rappresenta una limitazione materiale, non una garanzia di sicurezza immediata.</span>", "<strong>L'autoesclusione non è immediata</strong><span>La politica di autoesclusione indica di inviare le richieste a customercare@silverplay.com e prevede fino a 10 giorni lavorativi per l'elaborazione. Questo termine è una limitazione importante, non una garanzia di blocco immediato.</span>"],
    ['Lettori browser mobile', 'Giocatori da browser mobile'],
    ['Gli assegni possono essere richiesti anche prima.', 'Le verifiche possono essere richieste anche prima.'],
    ['<strong>18+</strong><span>Leggi il nostro <a href="/it/responsible-gambling/">guida al gioco d\'azzardo responsabile</a> e quello dell\'operatore <span>politica di gioco responsabile</span>. Il gioco d\'azzardo non è un modo per guadagnare o recuperare le perdite.</span>', '<strong>18+</strong><span>Consulta la nostra <a href="/it/responsible-gambling/">guida al gioco responsabile</a> e la politica di gioco responsabile dell\'operatore. Il gioco non è un modo per guadagnare né per recuperare le perdite.</span>'],
    ['Solo puntate fino al 50% del conteggio bonus', 'Contano solo le puntate fino al 50% dell’importo del bonus'],
    ['I limiti delle singole tabelle variano.', 'I limiti dei singoli tavoli variano.'],
    ['Prepara la verifica prima di ricevere un compenso', 'Prepara i documenti di verifica prima di richiedere un prelievo'],
    ['Trigger aggiuntivi', 'Condizioni aggiuntive'],
    ['Depositi a vita superiori a', 'Depositi complessivi superiori a'],
    ['Le scommesse più alte possono violare', 'Le puntate superiori possono violare'],
  ],
  pl: [
    ['<p>Prąd <span>mile widziana promocja</span> listy do <strong>2500 € + 250 darmowych spinów</strong> w pierwszych czterech złożach. Strona główna zawiera również inne objaśnienie o wartości 1000 EUR; w tej recenzji wykorzystano szczegółową promocję, a nie ogólny baner. Poniższe liczby przedstawiają sprawdzoną ofertę w EUR, a nie przeliczenia walut lub obietnicę dla każdego kraju.</p>', '<p>Aktualna promocja powitalna obejmuje łącznie do <strong>2 500 € + 250 darmowych spinów</strong> w ramach pierwszych czterech wpłat. Na stronie głównej widnieje również ogólna informacja o kwocie 1 000 €; w tej recenzji opieramy się na szczegółowych warunkach promocji. Podane kwoty dotyczą sprawdzonej oferty w EUR i nie obowiązują automatycznie w każdym kraju.</p>'],
    ['<p>The <span>Polityka KYC</span> wyjaśnia, kiedy wymagana jest weryfikacja i jakie dokumenty mogą być wymagane. Rejestracja i dostęp do płatności mogą nadal różnić się w zależności od lokalizacji i profilu gracza.</p>', '<p>Polityka KYC wyjaśnia, kiedy wymagana jest weryfikacja i jakie dokumenty mogą zostać zażądane. Rejestracja i dostęp do płatności mogą zależeć od lokalizacji oraz profilu gracza.</p>'],
    ['<strong>Kanały wsparcia</strong><span>The <span>strona kontaktowa</span> reklamuje całodobową pocztę elektroniczną i czat na żywo. Pytania ogólne kieruję do <span>support@silverplay.com</span>. Sprawdziliśmy opublikowane kanały, a nie czas reakcji i wyniki sporów.</span>', '<strong>Kanały wsparcia</strong><span>Strona kontaktowa informuje o całodobowym wsparciu przez e-mail i czat na żywo. Ogólne pytania należy wysyłać na support@silverplay.com. Sprawdziliśmy opublikowane kanały, ale nie czas odpowiedzi ani wyniki sporów.</span>'],
    ['<strong>Dostęp przez przeglądarkę i prywatność</strong><span>Witryna promuje dostęp na komputerach PC, Mac i urządzeniach mobilnych. Nie zweryfikowano żadnego oficjalnego wpisu w sklepie z aplikacjami. The <span>polityka prywatności</span> opisuje sposób postępowania z danymi identyfikacyjnymi, kontaktowymi i bankowymi; używaj wyłącznie bezpiecznego interfejsu profilu dla dokumentów.</span>', '<strong>Dostęp przez przeglądarkę i prywatność</strong><span>Serwis działa na komputerach PC i Mac oraz na urządzeniach mobilnych. Nie potwierdziliśmy oficjalnej aplikacji w żadnym sklepie. Polityka prywatności opisuje przetwarzanie danych identyfikacyjnych, kontaktowych i bankowych; dokumenty należy przesyłać wyłącznie przez zabezpieczony profil.</span>'],
    ['<strong>Samowykluczenie nie jest opisywane jako natychmiastowe</strong><span>The <span>politykę samowykluczenia</span> kieruje prośby do <span>obsługa customercare@silverplay.com</span> i pozwala na podjęcie działań w ciągu do 10 dni roboczych. Opóźnienie to stanowi istotne ograniczenie, a nie bezpośrednią gwarancję bezpieczeństwa.</span>', '<strong>Samowykluczenie nie działa natychmiast</strong><span>Zgodnie z polityką samowykluczenia wnioski należy wysyłać na customercare@silverplay.com, a ich realizacja może potrwać do 10 dni roboczych. To istotne ograniczenie, a nie gwarancja natychmiastowej blokady.</span>'],
    ['<td>Kwalifikujące się kursy</td><td>Co najmniej 1</td>', '<td>Minimalny kurs</td><td>Co najmniej 1,80</td>'],
    ['<p>Oddzielne <span>sportowa promocja powitalna</span> używa kodu <code translate="no">100PLAY</code>. Kasyno i zakłady sportowe są oddzielne, a my nie obstawialiśmy zakładów w celu przetestowania rozliczenia lub wypłaty gotówki.</p>', '<p>Oddzielna sportowa promocja powitalna wykorzystuje kod <code translate="no">100PLAY</code>. Promocje kasynowe i sportowe są rozliczane osobno; nie zawieraliśmy zakładów ani nie testowaliśmy rozliczeń lub wypłaty środków.</p>'],
    ['<strong>GEO</strong><span>Skorzystaj z <span>lobby kasyna</span> I <span>lobby na żywo</span> aby sprawdzić aktualną dostępność. Link do wersji demonstracyjnej lub widoczny kafelek gry nie są dowodem na to, że w Twoim kraju dostępna jest gra na prawdziwe pieniądze.</span>', '<strong>Dostępność</strong><span>Sprawdź aktualną ofertę w lobby kasyna i kasyna na żywo. Link do wersji demonstracyjnej lub widoczna gra nie oznaczają, że gra na prawdziwe pieniądze jest dostępna w Twoim kraju.</span>'],
    ['<p>Punkty te pochodzą z <span>warunki ogólne</span>. Mogą również obowiązywać opłaty bankowe, przeliczenie waluty i opłaty dostawcy. Minimalne czasy wypłat i przetwarzania nie zostały niezależnie potwierdzone.</p>', '<p>Dane pochodzą z ogólnych warunków. Mogą obowiązywać dodatkowe opłaty bankowe, za przewalutowanie lub po stronie dostawcy płatności. Nie potwierdziliśmy niezależnie minimalnych kwot ani czasu realizacji wypłat.</p>'],
    ['<strong>18+</strong><span>Przeczytaj nasze <a href="/pl/responsible-gambling/">przewodnik odpowiedzialnego hazardu</a> i operatora <span>politykę bezpieczniejszej zabawy</span>. Hazard nie jest sposobem na zarabianie pieniędzy ani odrabianie strat.</span>', '<strong>18+</strong><span>Przeczytaj nasz <a href="/pl/responsible-gambling/">przewodnik po odpowiedzialnej grze</a> oraz politykę bezpiecznej gry operatora. Hazard nie jest sposobem na zarabianie ani odrabianie strat.</span>'],
    ['PREMIA I BEZPŁATNE ZAKRĘCENIA', 'BONUS I DARMOWE SPINY'],
    ['KLUCZOWE WYRAŻENIA', 'NAJWAŻNIEJSZY WARUNEK'],
    ['Minimalna wpłata</td>', 'Minimalna wpłata 20 €</td>'],
    ['Reklamacja po pierwszym etapie', 'Odbierz po ukończeniu pierwszego etapu'],
    ['Reklamacja po drugim etapie', 'Odbierz po ukończeniu drugiego etapu'],
    ['Zasady bonusów kasynowych i zakłady', 'Zasady bonusu kasynowego i warunki obrotu'],
    ['LINIJKA', 'ZASADA'],
    ['AKTUALNE ZAPOTRZEBOWANIE', 'AKTUALNY WARUNEK'],
    ['PODSUMOWANIE ZAWODNIKA', 'ZNACZENIE DLA GRACZA'],
    ['<td>Hazard</td>', '<td>Warunek obrotu</td>'],
    ['Depozyt w wysokości 20 EUR plus premia w wysokości 20 EUR tworzą 1400 EUR obrotu.', 'Wpłata 20 € wraz z bonusem 20 € oznacza 1 400 € wymaganego obrotu.'],
    ['SPRAWDZAĆ', 'SPRAWDŹ'],
    ['Zakłady z wypłatą gotówki, anulowane i zwrócone nie kwalifikują się', 'Zakłady rozliczone przez cash-out, anulowane lub zwrócone nie są uwzględniane'],
    ['reflektory dostawców', 'wyróżnione gry dostawców'],
    ['głównego kanału automatów', 'głównej listy automatów'],
    ['nie jest to inwentaryzacja na żywo ani rekomendacja oparta na wygranych', 'nie przedstawia ona katalogu w czasie rzeczywistym ani rekomendacji opartej na możliwych wygranych'],
    ['Depozyty dożywotnie powyżej', 'Łączne wpłaty powyżej'],
    ['Dodatkowe wyzwalacze', 'Dodatkowe przesłanki'],
    ['Odtwarzacze przeglądarki mobilnej', 'Gracze korzystający z przeglądarki mobilnej'],
    ['niezależnej pomocy technicznej', 'niezależnej pomocy'],
  ],
  uk: [
    ['<p>Поточний <span>Вітаємо просування</span> списки до <strong>€2500 + 250 безкоштовних обертань</strong> на перших чотирьох родовищах. головна сторінка також містить іншу виноску на 1000 євро; у цьому огляді використовується детальна реклама, а не загальний банер. Наведені нижче цифри є розглянутою пропозицією в євро, а не конвертацією валюти чи обіцянкою для кожної країни.</p>', '<p>Чинна вітальна акція передбачає загалом до <strong>2 500 € + 250 безкоштовних обертань</strong> за перші чотири депозити. На головній сторінці також показано загальну пропозицію на 1 000 €; у цьому огляді ми використовуємо докладні умови акції. Наведені суми стосуються перевіреної пропозиції в EUR і не діють автоматично в кожній країні.</p>'],
    ['<p>The <span>Політика KYC</span> пояснює, коли потрібна верифікація і які документи можна запросити. Реєстрація та доступ до оплати можуть також відрізнятися залежно від місця розташування та профілю гравця.</p>', '<p>Політика KYC пояснює, коли потрібна верифікація та які документи можуть запросити. Реєстрація і доступ до платежів залежать від країни та профілю гравця.</p>'],
    ['<strong>Канали підтримки</strong><span>The <span>Сторінка контактів</span> рекламує 24/7 електронну пошту та онлайн-чат. Загальні питання перейдіть до <span>support@silverplay.com</span>. Ми перевіряли опубліковані канали, а не час відповіді чи результати суперечок.</span>', '<strong>Канали підтримки</strong><span>На сторінці контактів заявлена цілодобова підтримка електронною поштою та в онлайн-чаті. Загальні запити слід надсилати на support@silverplay.com. Ми перевірили опубліковані канали, але не швидкість відповідей чи результати розгляду спорів.</span>'],
    ['<strong>Доступ до браузера та конфіденційність</strong><span>Сайт рекламує доступ до ПК, Mac і мобільних пристроїв. Офіційний список додатків не підтверджено. The <span>Політика конфіденційності</span> описує обробку ідентифікаційної, контактної та банківської інформації; використовуйте лише безпечний інтерфейс профілю для документів.</span>', '<strong>Доступ із браузера та конфіденційність</strong><span>Сайт працює на ПК, Mac і мобільних пристроях. Офіційний застосунок у магазинах не підтверджено. Політика конфіденційності описує обробку ідентифікаційних, контактних і банківських даних; документи слід надсилати лише через захищений профіль.</span>'],
    ['<strong>Самовиключення не описується як миттєве</strong><span>The <span>Політика самовиключення</span> направляє запити до <span>customercare@silverplay.com</span> і надає до 10 робочих днів для виконання. Ця затримка є суттєвим обмеженням, а не негайною гарантією безпеки.</span>', '<strong>Самовиключення не спрацьовує миттєво</strong><span>Політика самовиключення вимагає надсилати запити на customercare@silverplay.com; обробка може тривати до 10 робочих днів. Це суттєве обмеження, а не гарантія негайного блокування.</span>'],
    ['<p>Окремий <span>Спортивна вітальна акція</span> Використовує код <code translate="no">100PLAY</code>. Казино та спортивні ставки — це окремо, і ми не робили ставки для перевірки розрахунку чи виплати.</p>', '<p>Для окремої спортивної вітальної акції використовується код <code translate="no">100PLAY</code>. Казино та спортивні ставки розраховуються окремо; ми не робили ставок і не перевіряли розрахунок чи виведення коштів.</p>'],
    ['Ласкава пропозиція', 'Вітальна пропозиція'],
    ['12 разів більше бонусу за 21 день', 'Відіграш бонусу 12× протягом 21 дня'],
    ['У 10 разів більше, ніж нарахований бонус', 'Максимум 10× від нарахованого бонусу'],
    ['Віртуальний спорт не сприяє цим промоціям', 'Віртуальний спорт не враховується в умовах цих акцій'],
    ['<strong>GEO</strong><span>Використовуйте <span>Лобі казино</span> і <span>Актуальне лобі</span>, щоб перевірити поточну наявність. Демо-посилання чи видима картка гри не є доказом того, що гра на реальні гроші доступна у вашій країні.</span>', '<strong>Доступність</strong><span>Перевіряйте актуальний асортимент у лобі казино та live-казино. Демо-посилання або видима гра не означають, що гра на реальні гроші доступна у вашій країні.</span>'],
    ['<p>Ці точки походять від <span>Загальні умови</span>. Також можуть стягуватися банківські збори, конвертація валюти та комісія провайдера. Мінімальні виплати і час обробки не були незалежно підтверджені.</p>', '<p>Ці дані взято із загальних умов. Додатково можуть стягуватися банківські комісії, плата за конвертацію валюти або комісії платіжного провайдера. Ми не підтверджували незалежно мінімальні суми та строки обробки виплат.</p>'],
    ['<strong>18+</strong><span>Читайте наш <a href="/uk/responsible-gambling/">відповідальний посібник з азартних ігор</a> і оператора <span>Політика безпечної гри</span>. Азартні ігри не є способом отримати дохід або відшкодувати збитки.</span>', '<strong>18+</strong><span>Прочитайте наш <a href="/uk/responsible-gambling/">посібник із відповідальної гри</a> та політику безпечної гри оператора. Азартні ігри не є способом заробітку чи повернення програних коштів.</span>'],
    ['SilverPlay Бонус казино', 'Бонус казино SilverPlay'],
    ['БОНУСИ ТА БЕЗКОШТОВНІ ОБЕРТАННЯ', 'БОНУС І ФРІСПІНИ'],
    ['КЛЮЧОВІ ТЕРМІНИ', 'КЛЮЧОВА УМОВА'],
    ['Вимога після першого етапу', 'Отримати після завершення першого етапу'],
    ['Вимога після другого етапу', 'Отримати після завершення другого етапу'],
    ['Правила та ставки бонусів казино', 'Правила бонусу казино та умови відіграшу'],
    ['ВИНОС ГРАВЦЯ', 'ЩО ЦЕ ОЗНАЧАЄ ДЛЯ ГРАВЦЯ'],
    ['У 5 разів більший бонус', 'Максимум 5× від нарахованого бонусу'],
    ['Виплати блокується', 'Виплати блокуються'],
    ['Ставка становить лише до 50% від бонусу', 'Зараховуються лише ставки до 50% від суми бонусу'],
    ['Коефіцієнти кваліфікації', 'Мінімальний коефіцієнт'],
    ['Виплати, скасовані та повернені ставки не підпадають під це', 'Ставки з cash-out, скасовані та повернені ставки не зараховуються'],
    ['прожектори провайдерів', 'добірки від провайдерів'],
    ['основному каналу слотів', 'основному каталогу слотів'],
    ['живий інвентар', 'актуальний каталог'],
    ['Верифікація виплати з експлуатації', 'Верифікація для виплати'],
    ['Довічні депозити понад', 'Сукупні депозити понад'],
    ['Додаткові тригери', 'Додаткові підстави для перевірки'],
    ['нижній колонтитул', 'футер'],
    ['У полісі обговорюються', 'У правилах описано'],
    ['Мобільні браузерні плеєри', 'Гравці з мобільних браузерів'],
    ['Цей чутливий сайт', 'Адаптивний сайт'],
    ['SilverPlay поєднує велике лобі казино з живими столами, спортом, кіберспортом і віртуальним спортом.', 'SilverPlay поєднує велике лобі казино з live-столами, ставками на спорт, кіберспортом і віртуальним спортом.'],
    ['Загальнодоступний огляд сайту від SpinCresta; відсутність депозиту або перевірки виплат.', 'Огляд загальнодоступної версії сайту від SpinCresta; депозити та виплати не тестувалися.'],
    ['Чотиридепозитний пакет', 'Пакет на чотири депозити'],
    ['Оголошені 2500 євро є сумарним максимумом, а не виплатою першого депозиту.', 'Заявлені 2 500 € — це загальний максимум за чотири етапи, а не бонус на перший депозит.'],
    ['Окреме актуальне лобі', 'Окреме live-лобі'],
    ['Опубліковані правила виплати', 'Опубліковані правила виведення коштів'],
    ['Постійний тижневий ліміт у 5000 євро, продовження депозиту та можливі комісії є важливими застереженнями.', 'Тижневий ліміт у 5 000 €, вимога відіграшу депозиту та можливі комісії є важливими обмеженнями.'],
    ['Доступ до країни', 'Доступність за країнами'],
    ['Реєстрація, оплата та доступність підтвердження все ще можуть відрізнятися залежно від місця розташування.', 'Реєстрація, платіжні методи та верифікація можуть відрізнятися залежно від країни.'],
    ['Бонуси ТА безкоштовні ОБЕРТАННЯ', 'Бонус і фріспіни'],
    ['Бонус код', 'Бонусний код'],
    ['Ключові терміни', 'Ключова умова'],
    ['4й', '4-й'],
    ['Поточна вимога', 'Чинна умова'],
    ['Винос гравця', 'Що це означає для гравця'],
    ['35-кратний депозит плюс бонус протягом 21 дня', 'Відіграш депозиту разом із бонусом — 35× протягом 21 дня'],
    ['Депозит у розмірі € 20 плюс бонус у розмірі € 20 створює оборот у розмірі € 1400.', 'Депозит 20 € і бонус 20 € означають 1 400 € необхідного обороту.'],
    ['Найменша з € 12 або 5% від присудженого бонусу', 'Менше з двох значень: 12 € або 5% від нарахованого бонусу'],
    ['Термін дії закінчується через 7 днів і має бути використаний перед іншими ставками', 'Фріспіни діють 7 днів і мають бути використані до інших ставок'],
    ['Потрібно перевірити допустимі ігри та ставки внесків.', 'Перевірте перелік дозволених ігор і відсоток їхнього внеску у відіграш.'],
    ['Перевірте</th><th scope="col">Опублікований термін', 'Параметр</th><th scope="col">Опублікована умова'],
    ['Обмежені ринки та правила розрахунків досі діють', 'Додаткові обмеження ринків і правила розрахунку ставок залишаються чинними'],
    ['Ілюстрація нової гри, показана тут, була представлена ​​для огляду у вересні 2026 року;', 'Ілюстрацію нової гри надано для огляду у вересні 2026 року;'],
    ['Опубліковано правило', 'Опублікована умова'],
    ['Тижневий ліміт виплати', 'Тижневий ліміт виведення коштів'],
    ['5000 євро або еквівалент у валюті за 7 днів', '5 000 € або еквівалент в іншій валюті протягом 7 днів'],
    ['5x перенесення депозиту; кваліфікаційні розрахункові ставки на спорт вимагають коефіцієнта не менше 1,60', 'Відіграш депозиту — 5×; зараховуються розраховані спортивні ставки з коефіцієнтом не нижче 1,60'],
    ['Оператор залишає за собою відмову або адміністративний збір до 8%', 'Оператор може відхилити запит або стягнути адміністративну комісію до 8%'],
    ['Повторні виплати', 'Повторні виведення коштів'],
    ['Кілька разів протягом 30-денного періоду може призвести до комісії до 8%', 'Кілька виведень коштів протягом 30 днів можуть передбачати комісію до 8%'],
    ['Не описуйте виплати як безумовно безкоштовне.', 'Виведення коштів не завжди є безкоштовним.'],
    ['Перевірка та призначення', 'Верифікація та платіжний метод'],
    ['Перевірка особи може передувати зняттю; зазвичай потрібен початковий спосіб оплати', 'Перед виведенням коштів може знадобитися верифікація; зазвичай використовується початковий платіжний метод'],
    ['Очікує на виплати', 'Запит на виведення коштів'],
    ['Припиніть ставки на кошти, які вже запитані для виплати.', 'Не використовуйте для ставок кошти, які вже запитані до виведення.'],
    ['обмеження країни', 'обмеження за країнами'],
    ['Підготуйте перевірку перед очікуванням виплати', 'Підготуйте документи до подання запиту на виведення'],
    ['Перевірки також можуть бути запитані раніше', 'Верифікацію можуть запросити й раніше'],
    ['Документи про ідентифікацію', 'Документи для підтвердження особи'],
    ['Докази адреси', 'Підтвердження адреси'],
    ['Посвідчення посвідчення має бути щонайменше за три місяці до закінчення терміну дії', 'Посвідчення особи має бути чинним ще щонайменше три місяці'],
    ['Перевірка ліцензії залишається відкритою', 'Статус ліцензії не підтверджено остаточно'],
    ['Переглянутий футер посилається на Ardevar Logo Ltd як провайдера технологій', 'У перевіреному футері Ardevar Logo Ltd зазначено як технологічного провайдера'],
    ['Закриття профілю - окремий процес', 'Закриття акаунта — окремий процес'],
    ['Опублікована політика закриття використовує customerassist@silverplay.com, говорить, що запит можна зробити', 'У політиці закриття акаунта вказано адресу customerassist@silverplay.com; запит можна подати'],
    ['Обмеження та самостійна допомога', 'Ліміти та незалежна допомога'],
    ['Хто SilverPlay найкраще підходить', 'Кому найкраще підходить SilverPlay'],
    ['Казино та спортивні гравці', 'Гравці в казино та ставки на спорт'],
    ['Окремі казино та спортивні пропозиції мають більше сенсу', 'Окремі пропозиції для казино та ставок на спорт найкраще підходять'],
    ['без необхідності завантаження в магазині додатків', 'без завантаження застосунку з магазину'],
    ['Подумай двічі, якщо', 'Краще порівняти альтернативи, якщо'],
    ['проста ставка, миттєве самовиключення, необмежене виплати або ліцензія, незалежно перевірена для перевіреного домену', 'прості умови відіграшу, негайне самовиключення, виведення без обмежень або незалежно підтверджена ліцензія для цього домену'],
    ['Так. Державна політика вимагає повного KYC', 'Так. Опублікована політика вимагає повної KYC-верифікації'],
    ['сукупних довічних депозитів', 'сукупних депозитів'],
    ['Чеки також можна запросити раніше.', 'Верифікацію також можуть запросити раніше.'],
    ['Виплати реальних грошей', 'Виведення реальних коштів'],
    ['обмеження щодо виплати і KYC', 'обмеження щодо виведення коштів і KYC'],
    ['Привітальна акція EUR', 'Вітальна акція в EUR'],
    ['100% до € 500 + 50 FS', '100% до 500 € + 50 FS'],
    ['50% до € 500 + 50 FS', '50% до 500 € + 50 FS'],
    ['100% до 1000 € + 100 FS', '100% до 1 000 € + 100 FS'],
    ['Мінімальний депозит € 20', 'Мінімальний депозит 20 €'],
    ['Платежі, ліміти на виплати та комісії', 'Платежі, ліміти виведення коштів і комісії'],
    ['<th scope="col">Перевірте</th>', '<th scope="col">Параметр</th>'],
    ['Жодна з них не встановлює поточну ліцензію для цього домену.', 'У цих матеріалах немає однозначного підтвердження чинної ліцензії для цього домену.'],
    ['запит можна подати не раніше, ніж через 90 днів після першого депозиту, і надає до 60 днів для його виконання.', 'запит можна подати не раніше ніж через 90 днів після першого депозиту, а його обробка може тривати до 60 днів.'],
    ['якщо вам потрібна прості умови', 'якщо вам потрібні прості умови'],
    ['можливі комісії за виплату', 'можливі комісії за виведення коштів'],
  ],
  pt: [
    ['<p>O actual <span>promoção de boas-vindas</span> lista até <strong>2.500€ + 250 jogadas grátis</strong> nos primeiros quatro depósitos. A página inicial também contém uma frase de destaque diferente de € 1.000; esta revisão usa a promoção detalhada, não aquele banner genérico. Os números abaixo são a oferta revisada em EUR, não conversões de moeda ou uma promessa para cada país.</p>', '<p>A promoção de boas-vindas atual oferece um total de até <strong>2 500 € + 250 jogadas grátis</strong> nos primeiros quatro depósitos. A página inicial também apresenta uma chamada genérica de 1 000 €; esta análise utiliza as condições detalhadas da promoção. Os valores referem-se à oferta verificada em EUR e não se aplicam automaticamente a todos os países.</p>'],
    ['<p>O separado <span>promoção de boas-vindas desportivas</span> Usa código <code translate="no">100PLAY</code>. Apostas em casino e desportivas são separadas, e não fizemos apostas para testar o acordo ou o levantamento.</p>', '<p>A promoção de boas-vindas desportiva utiliza o código <code translate="no">100PLAY</code>. As promoções de casino e de apostas desportivas são calculadas separadamente; não fizemos apostas nem testámos a liquidação ou o levantamento.</p>'],
    ['<p>O rodapé público SilverPlay exibe as marcas Skrill, Visa, Mastercard, Neteller, ecoPayz, Rapid Transfer, Interac, MiFinity, criptomoeda, Volt e PayRedeem. O <span>perguntas frequentes oficiais</span> Agrupa as opções disponíveis como transferências bancárias, cartões, carteiras eletrónicas e cartões pré-pagos. Uma marca exibida não garante que o método esteja disponível para todos os países, moedas ou transações.</p>', ''],
    ['Jogo de azar', 'Requisito de apostas'],
    ['Apenas apostas até 50% da contagem de bónus', 'Apenas contam apostas até 50% do valor do bónus'],
    ['desportos virtuais não contribuem para essas promoções', 'Os desportos virtuais não contribuem para estas promoções'],
    ['<strong>GEO</strong><span>Use o <span>lobby do casino</span> e <span>lobby ao vivo</span> para verificar a disponibilidade atual. Um link de demonstração ou um bloco de jogo visível não é prova de que o jogo com dinheiro real esteja disponível em seu país.</span>', '<strong>Disponibilidade</strong><span>Consulte os lobbies de casino e casino ao vivo para confirmar a oferta atual. Uma ligação de demonstração ou um jogo visível não provam que o jogo a dinheiro real esteja disponível no seu país.</span>'],
    ['<p>Esses pontos vêm do <span>termos gerais</span>. Taxas bancárias, conversão de moeda e taxas de fornecedor também podem ser aplicadas. As levantamentos mínimas e os tempos de processamento não foram confirmados de forma independente.</p>', '<p>Estes dados provêm dos termos gerais. Também podem aplicar-se taxas bancárias, de conversão cambial ou do fornecedor de pagamentos. Não confirmámos de forma independente os montantes mínimos nem os prazos de processamento dos levantamentos.</p>'],
    ['<p>O <span>Política KYC</span> Explica quando a verificação é necessária e quais documentos podem ser solicitados. O acesso ao registo e pagamento ainda pode variar conforme a localização e o perfil do jogador.</p>', '<p>A política KYC explica quando é necessária a verificação e quais documentos podem ser solicitados. O registo e o acesso aos pagamentos podem variar consoante a localização e o perfil do jogador.</p>'],
    ['<strong>Canais de suporte</strong><span>O <span>página de contacto</span> anuncia e-mail 24 horas por dia, 7 dias por semana e chat ao vivo. Dúvidas gerais acesse <span>support@silverplay.com</span>. Verificamos os canais publicados, não os tempos de resposta ou os resultados das disputas.</span>', '<strong>Canais de apoio</strong><span>A página de contacto anuncia apoio por e-mail e chat ao vivo 24 horas por dia. As questões gerais devem ser enviadas para support@silverplay.com. Verificámos os canais publicados, mas não os tempos de resposta nem os resultados de litígios.</span>'],
    ['<strong>Acesso e privacidade do navegador</strong><span>O site promove acesso para PC, Mac e dispositivos móveis. Nenhuma listagem oficial da app store foi verificada. O <span>Política de Privacidade</span> descreve como lidar com informações de identidade, contacto e bancárias; use apenas a interface de perfil seguro para documentos.</span>', '<strong>Acesso pelo navegador e privacidade</strong><span>O site funciona em PC, Mac e dispositivos móveis. Não foi confirmada uma aplicação oficial nas lojas. A política de privacidade descreve o tratamento de dados de identidade, contacto e bancários; os documentos devem ser enviados apenas através da área protegida do perfil.</span>'],
    ['<strong>A autoexclusão não é descrita como instantânea</strong><span>O <span>política de autoexclusão</span> direciona pedidos para <span>customercare@silverplay.com</span> e permite até 10 dias úteis para ação. Este atraso é uma limitação material, não uma garantia imediata de segurança.</span>', '<strong>A autoexclusão não é imediata</strong><span>A política de autoexclusão indica que os pedidos devem ser enviados para customercare@silverplay.com e que o processamento pode demorar até 10 dias úteis. Este prazo é uma limitação importante, não uma garantia de bloqueio imediato.</span>'],
    ['<strong>18+</strong><span>Leia nosso <a href="/pt/responsible-gambling/">guia de jogo responsável</a> e o operador <span>política de jogo responsável</span>. O jogo não é uma forma de obter rendimentos ou recuperar perdas.</span>', '<strong>18+</strong><span>Consulte o nosso <a href="/pt/responsible-gambling/">guia de jogo responsável</a> e a política de jogo responsável do operador. O jogo não é uma forma de obter rendimentos nem de recuperar perdas.</span>'],
  ],
  fr: [
    ['<p>Le courant <span>promotion de bienvenue</span> listes jusqu\'à <strong>2 500 € + 250 tours gratuits</strong> sur les quatre premiers dépôts. La page d\'accueil contient également une autre légende de 1 000 € ; cette revue utilise la promotion détaillée, pas cette bannière générique. Les chiffres ci-dessous représentent l\'offre en EUR examinée, et non des conversions de devises ou une promesse pour chaque pays.</p>', '<p>La promotion de bienvenue actuelle offre jusqu\'à <strong>2 500 € + 250 tours gratuits</strong> répartis sur les quatre premiers dépôts. La page d\'accueil affiche aussi une offre générique de 1 000 € ; cette analyse s\'appuie sur les conditions détaillées de la promotion. Les montants concernent l\'offre vérifiée en EUR et ne s\'appliquent pas automatiquement à chaque pays.</p>'],
    ['<p>Le séparé <span>promotion de bienvenue sportive</span> Utilisation du code <code translate="no">100PLAY</code>. Les paris sur les casinos et les paris sportifs sont séparés, et nous ne faisions pas de paris pour tester le règlement ou le retrait de l\'argent.</p>', '<p>La promotion de bienvenue sportive utilise le code <code translate="no">100PLAY</code>. Les promotions de casino et de paris sportifs sont calculées séparément ; nous n\'avons placé aucun pari ni testé le règlement ou le retrait.</p>'],
    ['<td>Cotes de qualification</td>', '<td>Cote minimale</td>'],
    ['<td>Jeu de hasard</td>', '<td>Conditions de mise</td>'],
    ['12 fois la prime en 21 jours', 'Miser 12 fois le bonus sous 21 jours'],
    ['Les paris de retrait d\'argent, annulés ou remboursés ne sont pas éligibles', 'Les paris encaissés, annulés ou remboursés ne sont pas éligibles'],
    ['1<g id="466">er</g>', '1er'],
    ['<strong>GEO</strong><span>Utilisez le <span>hall du casino</span> et <span>hall d\'entrée en direct</span> pour vérifier la disponibilité actuelle. Un lien de démonstration ou une vignette de jeu visible ne constitue pas une preuve que le jeu en argent réel est disponible dans votre pays.</span>', '<strong>Disponibilité</strong><span>Consultez les lobbies du casino et du casino en direct pour vérifier l\'offre actuelle. Un lien de démonstration ou un jeu visible ne prouve pas que le jeu en argent réel est disponible dans votre pays.</span>'],
    ['<p>Ces points proviennent du <span>conditions générales</span>. Des frais bancaires, de conversion de devises et des frais de fournisseur peuvent également s\'appliquer. Les retraits minimaux et les délais de traitement n’ont pas été confirmés de manière indépendante.</p>', '<p>Ces données proviennent des conditions générales. Des frais bancaires, de conversion de devises ou du prestataire de paiement peuvent également s\'appliquer. Nous n\'avons pas confirmé indépendamment les montants minimums ni les délais de traitement des retraits.</p>'],
    ['<p>Le <span>Politique KYC</span> Explique quand une vérification est requise et quels documents peuvent être demandés. L\'accès à l\'inscription et au paiement peut encore varier selon la localisation et le profil du joueur.</p>', '<p>La politique KYC précise quand une vérification est requise et quels documents peuvent être demandés. L\'inscription et l\'accès aux paiements peuvent varier selon la localisation et le profil du joueur.</p>'],
    ['<strong>Canaux d\'assistance</strong><span>Le <span>page de contact</span> annonce une messagerie électronique et un chat en direct 24h/24 et 7j/7. Les questions générales vont à <span>support@silverplay.com</span>. Nous avons vérifié les chaînes publiées, et non les temps de réponse ou les résultats des litiges.</span>', '<strong>Canaux d\'assistance</strong><span>La page de contact annonce une assistance par e-mail et chat en direct 24 h/24. Les demandes générales doivent être envoyées à support@silverplay.com. Nous avons vérifié les canaux publiés, mais pas les délais de réponse ni l\'issue des litiges.</span>'],
    ['<strong>Accès au navigateur et confidentialité</strong><span>Le site favorise l\'accès aux PC, Mac et mobiles. Aucune liste officielle de l\'App Store n\'a été vérifiée. Le <span>Politique de confidentialité</span> décrit le traitement des informations d\'identité, de contact et bancaires ; utilisez uniquement l’interface de profil sécurisée pour les documents.</span>', '<strong>Accès par navigateur et confidentialité</strong><span>Le site fonctionne sur PC, Mac et appareils mobiles. Aucune application officielle en boutique n\'a été confirmée. La politique de confidentialité décrit le traitement des données d\'identité, de contact et bancaires ; les documents doivent être envoyés uniquement via l\'espace sécurisé du profil.</span>'],
    ['<strong>L’auto-exclusion n’est pas décrite comme instantanée</strong><span>Le <span>politique d\'auto-exclusion</span> dirige les demandes vers <span>customercare@silverplay.com</span> et accorde jusqu\'à 10 jours ouvrables pour agir. Ce retard constitue une limitation matérielle et non une garantie de sécurité immédiate.</span>', '<strong>L’auto-exclusion n’est pas immédiate</strong><span>La politique d\'auto-exclusion indique d\'envoyer les demandes à customercare@silverplay.com et prévoit un traitement pouvant durer jusqu\'à 10 jours ouvrables. Ce délai est une limitation importante, pas une garantie de blocage immédiat.</span>'],
    ['<strong>18+</strong><span>Lisez notre <a href="/fr/responsible-gambling/">guide du jeu responsable</a> et celui de l\'opérateur <span>politique de jeu responsable</span>. Le jeu n’est pas un moyen de gagner un revenu ou de récupérer des pertes.</span>', '<strong>18+</strong><span>Consultez notre <a href="/fr/responsible-gambling/">guide du jeu responsable</a> ainsi que la politique de jeu responsable de l\'opérateur. Le jeu n’est pas un moyen de gagner de l\'argent ni de récupérer ses pertes.</span>'],
  ],
  hi: [
    ['सिल्वर500', 'SILVER500'],
    ['<p>द करेंट <span>पदोन्नति का स्वागत है</span> तक की सूची <strong>€2,500 + 250 मुफ्त स्पिन</strong> पहले चार जमाओं में। मुखपृष्ठ पर एक अलग €1,000 कॉलआउट भी शामिल है; यह समीक्षा विस्तृत प्रचार का उपयोग करती है, सामान्य बैनर का नहीं। नीचे दिए गए आंकड़े समीक्षा की गई EUR पेशकश हैं, न कि मुद्रा रूपांतरण या हर देश के लिए कोई वादा।</p>', '<p>मौजूदा स्वागत ऑफ़र में पहले चार जमा पर कुल <strong>€2,500 + 250 मुफ़्त स्पिन</strong> तक मिलते हैं। होमपेज पर €1,000 का एक सामान्य प्रचार भी दिखता है; इस समीक्षा में विस्तृत ऑफ़र की शर्तों को आधार बनाया गया है। ये राशियाँ जाँचे गए EUR ऑफ़र की हैं और हर देश में अपने-आप लागू नहीं होतीं।</p>'],
    ['<p>The <span>केवाईसी नीति</span> बताता है कि सत्यापन की आवश्यकता कब है और किन दस्तावेजों का अनुरोध किया जा सकता है। पंजीकरण और भुगतान पहुंच अभी भी स्थान और खिलाड़ी प्रोफ़ाइल के अनुसार भिन्न हो सकती है।</p>', '<p>केवाईसी नीति बताती है कि सत्यापन कब आवश्यक है और किन दस्तावेज़ों की माँग की जा सकती है। पंजीकरण और भुगतान की उपलब्धता स्थान तथा खिलाड़ी की प्रोफ़ाइल के अनुसार बदल सकती है।</p>'],
    ['<strong>समर्थन चैनल</strong><span>The <span>संपर्क पृष्ठ</span> 24/7 ईमेल और लाइव चैट का विज्ञापन करता है। सामान्य प्रश्न जाते हैं <span>support@silverplay.com</span>. हमने प्रकाशित चैनलों की जाँच की, न कि प्रतिक्रिया समय या विवाद के परिणामों की।</span>', '<strong>सहायता के माध्यम</strong><span>संपर्क पृष्ठ पर 24 घंटे ईमेल और लाइव चैट सहायता का उल्लेख है। सामान्य प्रश्न support@silverplay.com पर भेजे जा सकते हैं। हमने उपलब्ध माध्यमों की जाँच की है, लेकिन प्रतिक्रिया समय या विवादों के परिणामों की नहीं।</span>'],
    ['<strong>स्व-बहिष्करण को तत्काल वर्णित नहीं किया गया है</strong><span>The <span>स्व-बहिष्करण नीति</span> अनुरोधों को निर्देशित करता है <span>customercare@silverplay.com</span> और कार्रवाई के लिए 10 कार्यदिवस तक की अनुमति देता है। यह देरी एक भौतिक सीमा है, तत्काल सुरक्षा की गारंटी नहीं।</span>', '<strong>स्व-बहिष्करण तुरंत लागू नहीं होता</strong><span>स्व-बहिष्करण नीति के अनुसार अनुरोध customercare@silverplay.com पर भेजना होता है और प्रक्रिया में 10 कार्यदिवस तक लग सकते हैं। यह एक महत्वपूर्ण सीमा है, तुरंत रोक लगने की गारंटी नहीं।</span>'],
    ['<p>अलग <span>खेल स्वागत प्रोत्साहन</span> कोड का उपयोग करता है <code translate="no">100PLAY</code>. कैसीनो और खेल जुआ अलग हैं, और हमने निपटान या कैश-आउट का परीक्षण करने के लिए दांव नहीं लगाया । </p>', '<p>अलग स्पोर्ट्स वेलकम ऑफ़र में <code translate="no">100PLAY</code> कोड का उपयोग होता है। कैसीनो और स्पोर्ट्स बोनस की शर्तें अलग हैं; हमने दांव लगाकर सेटलमेंट या कैश-आउट का परीक्षण नहीं किया।</p>'],
    ['<strong>GEO</strong><span>उपयोग <span>कैसीनो लॉबी</span> और <span>लाइव लॉबी</span> वर्तमान उपलब्धता की जांच करने के लिए। एक डेमो लिंक या दृश्यमान गेम टाइल इस बात का प्रमाण नहीं है कि आपके देश में वास्तविक पैसे वाला गेम उपलब्ध है।</span>', '<strong>उपलब्धता</strong><span>मौजूदा गेम देखने के लिए कैसीनो और लाइव कैसीनो लॉबी जाँचें। किसी डेमो लिंक या दिखाई देने वाले गेम का अर्थ यह नहीं है कि आपके देश में असली पैसे से खेलना उपलब्ध है।</span>'],
    ['<p>ये बिंदु आते हैं <span>सामान्य शर्तें</span>. बैंक शुल्क, मुद्रा रूपांतरण और प्रदाता शुल्क भी लागू हो सकते हैं। न्यूनतम निकासी और प्रसंस्करण समय की स्वतंत्र रूप से पुष्टि नहीं की गई थी।</p>', '<p>ये जानकारी सामान्य नियमों और शर्तों से ली गई है। बैंक, मुद्रा रूपांतरण या भुगतान प्रदाता के अतिरिक्त शुल्क लागू हो सकते हैं। हमने न्यूनतम निकासी राशि या प्रसंस्करण समय की स्वतंत्र पुष्टि नहीं की है।</p>'],
    ['<strong>ब्राउज़र पहुंच और गोपनीयता</strong><span>साइट पीसी, मैक और मोबाइल एक्सेस को बढ़ावा देती है। कोई आधिकारिक ऐप-स्टोर सूची सत्यापित नहीं की गई थी। <span>गोपनीयता नीति</span> पहचान, संपर्क और बैंकिंग जानकारी को संभालने का वर्णन करता है; दस्तावेज़ों के लिए केवल सुरक्षित प्रोफ़ाइल इंटरफ़ेस का उपयोग करें।</span>', '<strong>ब्राउज़र पहुँच और गोपनीयता</strong><span>साइट पीसी, मैक और मोबाइल पर चलती है। किसी आधिकारिक ऐप-स्टोर ऐप की पुष्टि नहीं हुई। गोपनीयता नीति पहचान, संपर्क और बैंकिंग डेटा के उपयोग का वर्णन करती है; दस्तावेज़ केवल सुरक्षित प्रोफ़ाइल क्षेत्र से भेजें।</span>'],
    ['<strong>18+</strong><span>हमारा पढ़ें <a href="/hi/responsible-gambling/">जिम्मेदार जुआ गाइड</a> और ऑपरेटर का <span>सुरक्षित खेल नीति</span>. जुआ आय अर्जित करने या घाटे की भरपाई करने का एक तरीका नहीं है।</span>', '<strong>18+</strong><span>हमारी <a href="/hi/responsible-gambling/">जिम्मेदार गेमिंग गाइड</a> और ऑपरेटर की सुरक्षित गेमिंग नीति पढ़ें। जुआ कमाई करने या नुकसान की भरपाई का तरीका नहीं है।</span>'],
  ],
  fi: [
    ['<p>Nykyinen <span>tervetuloa promootioon</span> listat asti <strong>2500 € + 250 ilmaiskierrosta</strong> neljän ensimmäisen talletuksen aikana. Kotisivulla on myös erilainen 1 000 euron huomioteksti; Tässä arvostelussa käytetään yksityiskohtaista mainoskampanjaa, ei yleistä banneria. Alla olevat luvut ovat tarkistettuja eurotarjouksia, eivät valuuttamuunnoksia tai lupauksia jokaiselle maalle.</p>', '<p>Nykyinen tervetulokampanja tarjoaa neljän ensimmäisen talletuksen aikana yhteensä enintään <strong>2 500 € + 250 ilmaiskierrosta</strong>. Etusivulla näkyy myös yleinen 1 000 euron tarjousnosto; tässä arvostelussa käytetään kampanjan yksityiskohtaisia ehtoja. Summat koskevat tarkistettua EUR-tarjousta eivätkä automaattisesti jokaista maata.</p>'],
    ['<p>Erillinen <span>urheilu tervetuloa edistäminen</span> Käyttää koodia <code translate="no">100PLAY</code>. Kasino- ja urheiluvedonlyönti ovat erillisiä, emmekä asettaneet vetoja selvittääksemme selvitystä tai rahastusta.</p>', '<p>Erillisessä urheilun tervetulokampanjassa käytetään koodia <code translate="no">100PLAY</code>. Kasino- ja urheilubonukset lasketaan erikseen; emme asettaneet vetoja emmekä testanneet vetojen selvitystä tai kotiutusta.</p>'],
    ['<p>The <span>KYC-politiikka</span> Selittää, milloin vahvistus vaaditaan ja mitä asiakirjoja voi pyytää. Rekisteröityminen ja maksuoikeudet voivat silti vaihdella sijainnin ja pelaajaprofiilin mukaan.</p>', '<p>KYC-käytäntö kertoo, milloin tunnistautuminen vaaditaan ja mitä asiakirjoja voidaan pyytää. Rekisteröinti ja maksutapojen saatavuus voivat vaihdella sijainnin ja pelaajaprofiilin mukaan.</p>'],
    ['<strong>Tukikanavat</strong><span>The <span>yhteydenottosivu</span> mainostaa 24/7 sähköpostia ja live-chatia. Yleiset kysymykset menevät osoitteeseen <span>support@silverplay.com</span>. Tarkistimme julkaistut kanavat, emme vastausaikoja tai kiistan tuloksia.</span>', '<strong>Tukikanavat</strong><span>Yhteystietosivulla ilmoitetaan ympärivuorokautisesta sähköposti- ja live-chat-tuesta. Yleiset kysymykset voi lähettää osoitteeseen support@silverplay.com. Tarkistimme julkaistut yhteystavat, mutta emme vastausaikoja tai riitojen lopputuloksia.</span>'],
    ['<strong>Selaimen käyttöoikeus ja yksityisyys</strong><span>Sivusto mainostaa PC-, Mac- ja mobiilikäyttöä. Virallisia sovelluskaupan tietoja ei vahvistettu. The <span>tietosuojakäytäntö</span> kuvaa henkilö-, yhteys- ja pankkitietojen käsittelyä; Käytä asiakirjoille vain suojattua profiilirajapintaa.</span>', '<strong>Selaimella käyttö ja tietosuoja</strong><span>Sivusto toimii PC- ja Mac-tietokoneilla sekä mobiililaitteilla. Virallista sovelluskauppasovellusta ei vahvistettu. Tietosuojakäytäntö kuvaa henkilö-, yhteys- ja pankkitietojen käsittelyä; asiakirjat tulee lähettää vain suojatun profiilin kautta.</span>'],
    ['<strong>Itsesyrjäytymistä ei kuvata välittömäksi</strong><span>The <span>itsesyrjäytymispolitiikka</span> ohjaa pyynnöt <span>customercare@silverplay.com</span> ja antaa toimenpiteille jopa 10 arkipäivää. Tämä viive on olennainen rajoitus, ei välitön turvallisuustakuu.</span>', '<strong>Pelikiellon voimaantulo ei ole välitön</strong><span>Pelikiellon pyynnöt tulee käytännön mukaan lähettää osoitteeseen customercare@silverplay.com, ja käsittely voi kestää enintään 10 arkipäivää. Tämä on merkittävä rajoitus, ei takuu välittömästä estosta.</span>'],
    ['Maksut, kotiutusrajat ja maksut', 'Maksutavat, kotiutusrajat ja kulut'],
    ['Mobiiliselaimen Soittimet', 'Mobiiliselaimella pelaavat'],
    ['Mieti Kahdesti, Jos', 'Harkitse vaihtoehtoja, jos'],
    ['<strong>GEO</strong><span>Käytä <span>kasinon aula</span> ja <span>live-aula</span> tarkistaaksesi tämänhetkisen saatavuuden. Demolinkki tai näkyvä peliruutu ei ole todiste siitä, että oikealla rahalla pelaaminen on saatavilla maassasi.</span>', '<strong>Saatavuus</strong><span>Tarkista ajantasainen valikoima kasinon ja live-kasinon aulasta. Demolinkki tai näkyvä peli ei tarkoita, että oikean rahan pelaaminen olisi saatavilla maassasi.</span>'],
    ['<p>Nämä kohdat ovat peräisin <span>yleiset ehdot</span>. Myös pankki-, valuutanvaihto- ja palveluntarjoajan maksuja voidaan periä. Vähimmäisnosto- ja käsittelyaikoja ei vahvistettu itsenäisesti.</p>', '<p>Tiedot perustuvat yleisiin ehtoihin. Lisäksi voidaan periä pankki-, valuutanvaihto- tai maksupalveluntarjoajan kuluja. Emme vahvistaneet itsenäisesti kotiutusten vähimmäissummia tai käsittelyaikoja.</p>'],
    ['<strong>18+</strong><span>Lue meidän <a href="/fi/responsible-gambling/">vastuullisen pelaamisen opas</a> ja operaattorin <span>vastuullisen pelaamisen käytäntö</span>. Rahapelaaminen ei ole tapa ansaita tuloja tai periä tappioita.</span>', '<strong>18+</strong><span>Lue <a href="/fi/responsible-gambling/">vastuullisen pelaamisen oppaamme</a> sekä operaattorin vastuullisen pelaamisen käytäntö. Rahapelaaminen ei ole tapa ansaita tuloja tai kattaa tappioita.</span>'],
  ],
};

const prosConsCopy = {
  de: [
    ['Vorteile', [
      'Casino, Live-Casino, Sportwetten, Esports und virtuelle Sportarten in einem Konto.',
      'Vier klar benannte Casino-Bonuscodes und ein separater Sportbonus-Code.',
      'Öffentlich zugängliche Informationen zu KYC, Auszahlungen, Support und Selbstausschluss.',
      'Übersichtliche Navigation für Spiele, Live-Tische und Anbieter.',
    ]],
    ['Nachteile', [
      '35-facher Umsatz von Einzahlung plus Bonus; einige Spiele tragen nicht vollständig bei.',
      'Einzahlungsumsatz, mögliche Auszahlungsgebühren und ein rollierendes Wochenlimit von 5.000 €.',
      'Die Bearbeitung eines Selbstausschlusses kann bis zu 10 Werktage dauern.',
      'Auszahlungsgeschwindigkeit und Lizenznummer der geprüften Domain wurden nicht unabhängig bestätigt.',
    ]],
  ],
  es: [
    ['Ventajas', [
      'Casino, casino en vivo, apuestas deportivas, esports y deportes virtuales en una sola cuenta.',
      'Cuatro códigos de bono de casino claramente identificados y un código deportivo independiente.',
      'Información pública sobre KYC, retiros, asistencia y autoexclusión.',
      'Navegación clara por juegos, mesas en vivo y proveedores.',
    ]],
    ['Contras', [
      'Apuesta de 35 veces el depósito más el bono; algunos juegos no contribuyen por completo.',
      'Requisito de apuesta del depósito, posibles comisiones de retiro y límite semanal móvil de 5.000 €.',
      'La autoexclusión puede tardar hasta 10 días hábiles.',
      'No confirmamos de forma independiente la velocidad de pago ni el número de licencia del dominio analizado.',
    ]],
  ],
  it: [
    ['Pro', [
      'Casino, live casino, scommesse sportive, esports e sport virtuali in un unico conto.',
      'Quattro codici bonus del casino chiaramente identificati e un codice sportivo separato.',
      'Informazioni pubbliche su KYC, prelievi, assistenza e autoesclusione.',
      'Navigazione chiara tra giochi, tavoli live e provider.',
    ]],
    ['Contro', [
      'Requisito di puntata pari a 35 volte deposito più bonus; alcuni giochi contribuiscono solo in parte o sono esclusi.',
      'Requisito di puntata sul deposito, possibili commissioni di prelievo e limite settimanale mobile di 5.000 €.',
      'L’autoesclusione può richiedere fino a 10 giorni lavorativi.',
      'Velocità dei pagamenti e numero di licenza del dominio recensito non sono stati verificati in modo indipendente.',
    ]],
  ],
  pl: [
    ['Plusy', [
      'Kasyno, kasyno na żywo, zakłady sportowe, esport i sporty wirtualne na jednym koncie.',
      'Cztery jasno wskazane kody bonusowe do kasyna i osobny kod do zakładów sportowych.',
      'Publicznie dostępne informacje o KYC, wypłatach, pomocy i samowykluczeniu.',
      'Przejrzysta nawigacja po grach, stołach na żywo i dostawcach.',
    ]],
    ['Wady', [
      'Obrót 35 razy depozyt plus bonus; część gier ma ograniczony udział lub jest wykluczona.',
      'Wymóg obrotu depozytem, możliwe opłaty za wypłatę i kroczący limit tygodniowy 5 000 €.',
      'Realizacja samowykluczenia może potrwać do 10 dni roboczych.',
      'Nie potwierdziliśmy niezależnie szybkości wypłat ani numeru licencji dla sprawdzanej domeny.',
    ]],
  ],
  uk: [
    ['Переваги', [
      'Казино, live-казино, ставки на спорт, кіберспорт і віртуальний спорт в одному акаунті.',
      'Чотири чітко вказані бонусні коди казино та окремий код для спортивного бонусу.',
      'У відкритому доступі є інформація про KYC, виплати, підтримку та самовиключення.',
      'Зручна навігація за іграми, live-столами та провайдерами.',
    ]],
    ['Недоліки', [
      'Відіграш депозиту разом із бонусом — 35×; окремі ігри враховуються частково або не враховуються.',
      'Є вимога щодо обороту депозиту, можливі комісії за виведення коштів і тижневий ліміт 5 000 €.',
      'Опрацювання запиту на самовиключення може тривати до 10 робочих днів.',
      'Швидкість виплат і номер ліцензії для перевіреного домену не підтверджені незалежно.',
    ]],
  ],
  pt: [
    ['Prós', [
      'Casino, casino ao vivo, apostas desportivas, esports e desportos virtuais numa só conta.',
      'Quatro códigos de bónus de casino claramente identificados e um código desportivo separado.',
      'Informação pública sobre KYC, levantamentos, apoio e autoexclusão.',
      'Navegação clara por jogos, mesas ao vivo e fornecedores.',
    ]],
    ['Contras', [
      'Aposta de 35 vezes o depósito mais o bónus; alguns jogos têm contribuição reduzida ou nula.',
      'Requisito de aposta do depósito, possíveis taxas de levantamento e limite semanal móvel de 5 000 €.',
      'A autoexclusão pode demorar até 10 dias úteis.',
      'Não confirmámos de forma independente a velocidade dos pagamentos nem o número de licença do domínio analisado.',
    ]],
  ],
  fr: [
    ['Avantages', [
      'Casino, casino en direct, paris sportifs, esports et sports virtuels sur un seul compte.',
      'Quatre codes bonus de casino clairement identifiés et un code sportif distinct.',
      'Informations publiques sur le KYC, les retraits, l’assistance et l’auto-exclusion.',
      'Navigation claire entre les jeux, les tables en direct et les fournisseurs.',
    ]],
    ['Inconvénients', [
      'Mise de 35 fois le dépôt plus le bonus ; certains jeux contribuent partiellement ou sont exclus.',
      'Condition de mise du dépôt, éventuels frais de retrait et plafond hebdomadaire glissant de 5 000 €.',
      'Le traitement d’une demande d’auto-exclusion peut prendre jusqu’à 10 jours ouvrables.',
      'La vitesse des paiements et le numéro de licence du domaine examiné n’ont pas été confirmés indépendamment.',
    ]],
  ],
  hi: [
    ['फायदे', [
      'कैसीनो, लाइव कैसीनो, स्पोर्ट्स बेटिंग, ईस्पोर्ट्स और वर्चुअल स्पोर्ट्स एक ही खाते में उपलब्ध हैं।',
      'कैसीनो के चार स्पष्ट बोनस कोड और स्पोर्ट्स बोनस के लिए अलग कोड दिया गया है।',
      'KYC, निकासी, सहायता और स्व-बहिष्करण की जानकारी सार्वजनिक रूप से उपलब्ध है।',
      'गेम, लाइव टेबल और प्रदाताओं के लिए साफ़ नेविगेशन मिलता है।',
    ]],
    ['नुकसान', [
      'जमा और बोनस की कुल राशि पर 35 गुना दांव लगाना होता है; कुछ गेम कम योगदान देते हैं या शामिल नहीं होते।',
      'जमा पर दांव की शर्त, संभावित निकासी शुल्क और €5,000 की चलती साप्ताहिक सीमा लागू हो सकती है।',
      'स्व-बहिष्करण अनुरोध पूरा होने में 10 कार्यदिवस तक लग सकते हैं।',
      'भुगतान की गति और जाँचे गए डोमेन की लाइसेंस संख्या की स्वतंत्र पुष्टि नहीं हुई है।',
    ]],
  ],
  fi: [
    ['Plussat', [
      'Kasino, live-kasino, urheiluvedonlyönti, esports ja virtuaaliurheilu samalla tilillä.',
      'Neljä selkeästi nimettyä kasinobonuskoodia ja erillinen urheilubonuskoodi.',
      'Julkisesti saatavilla olevat tiedot KYC-tarkistuksesta, kotiutuksista, tuesta ja pelikiellosta.',
      'Selkeä navigointi peleihin, live-pöytiin ja pelintarjoajiin.',
    ]],
    ['Miinukset', [
      'Talletus ja bonus on kierrätettävä 35 kertaa; osa peleistä kerryttää ehtoa vain osittain tai ei lainkaan.',
      'Talletuksen kierrätysvaatimus, mahdolliset kotiutusmaksut ja 5 000 €:n liukuva viikkoraja.',
      'Pelikiellon käsittely voi kestää enintään 10 arkipäivää.',
      'Maksunopeutta ja tarkistetun verkkotunnuksen lisenssinumeroa ei vahvistettu riippumattomasti.',
    ]],
  ],
};

const trustSplitCopy = {
  de: [
    ['Browserzugriff', 'Die Website funktioniert auf PC, Mac und mobilen Geräten. Eine offizielle App in einem App-Store wurde nicht bestätigt; mobil sollte daher die responsive Website genutzt werden.'],
    ['Datenschutz und Kontodaten', 'Die Datenschutzrichtlinie beschreibt den Umgang mit Identitäts-, Kontakt- und Bankdaten. Dokumente und Zahlungsdaten sollten ausschließlich über den geschützten Profilbereich übermittelt werden.'],
  ],
  es: [
    ['Acceso desde el navegador', 'El sitio funciona en PC, Mac y dispositivos móviles. No se confirmó una aplicación oficial en ninguna tienda; en el móvil debe utilizarse el sitio web adaptable.'],
    ['Privacidad y datos de la cuenta', 'La política de privacidad describe el tratamiento de los datos de identidad, contacto y banca. Los documentos y datos de pago deben enviarse únicamente mediante el área segura del perfil.'],
  ],
  it: [
    ['Accesso dal browser', 'Il sito è accessibile da PC, Mac e dispositivi mobili. Non è stata confermata un’app ufficiale negli store; da mobile va quindi utilizzato il sito responsive.'],
    ['Privacy e dati del conto', 'L’informativa sulla privacy descrive il trattamento dei dati identificativi, di contatto e bancari. Documenti e dati di pagamento vanno inviati soltanto tramite l’area protetta del profilo.'],
  ],
  pl: [
    ['Dostęp przez przeglądarkę', 'Serwis działa na komputerach PC i Mac oraz na urządzeniach mobilnych. Nie potwierdziliśmy oficjalnej aplikacji w żadnym sklepie, dlatego na telefonie należy korzystać z responsywnej strony.'],
    ['Prywatność i dane konta', 'Polityka prywatności opisuje przetwarzanie danych identyfikacyjnych, kontaktowych i bankowych. Dokumenty oraz dane płatnicze należy przesyłać wyłącznie przez zabezpieczony profil.'],
  ],
  uk: [
    ['Доступ із браузера', 'Сайт працює на ПК, Mac і мобільних пристроях. Офіційний застосунок у магазинах не підтверджено, тому на телефоні варто користуватися адаптивною версією сайту.'],
    ['Конфіденційність і дані акаунта', 'Політика конфіденційності описує обробку ідентифікаційних, контактних і банківських даних. Документи та платіжні дані слід надсилати лише через захищений профіль.'],
  ],
  pt: [
    ['Acesso pelo navegador', 'O site funciona em PC, Mac e dispositivos móveis. Não foi confirmada uma aplicação oficial nas lojas; no telemóvel deve ser utilizada a versão responsiva do site.'],
    ['Privacidade e dados da conta', 'A política de privacidade descreve o tratamento de dados de identidade, contacto e bancários. Os documentos e dados de pagamento devem ser enviados apenas através da área protegida do perfil.'],
  ],
  fr: [
    ['Accès par navigateur', 'Le site fonctionne sur PC, Mac et appareils mobiles. Aucune application officielle en boutique n’a été confirmée ; sur mobile, il convient donc d’utiliser le site adaptatif.'],
    ['Confidentialité et données du compte', 'La politique de confidentialité décrit le traitement des données d’identité, de contact et bancaires. Les documents et données de paiement doivent être envoyés uniquement via l’espace sécurisé du profil.'],
  ],
  hi: [
    ['ब्राउज़र से पहुँच', 'साइट पीसी, मैक और मोबाइल पर चलती है। किसी आधिकारिक ऐप-स्टोर ऐप की पुष्टि नहीं हुई है, इसलिए मोबाइल पर रेस्पॉन्सिव वेबसाइट का उपयोग करें।'],
    ['गोपनीयता और खाता डेटा', 'गोपनीयता नीति पहचान, संपर्क और बैंकिंग डेटा के उपयोग का वर्णन करती है। दस्तावेज़ और भुगतान विवरण केवल सुरक्षित प्रोफ़ाइल क्षेत्र से भेजें।'],
  ],
  fi: [
    ['Käyttö selaimella', 'Sivusto toimii PC- ja Mac-tietokoneilla sekä mobiililaitteilla. Virallista sovelluskauppasovellusta ei vahvistettu, joten mobiilissa kannattaa käyttää responsiivista verkkosivustoa.'],
    ['Tietosuoja ja tilitiedot', 'Tietosuojakäytäntö kuvaa henkilö-, yhteys- ja pankkitietojen käsittelyä. Asiakirjat ja maksutiedot tulee lähettää vain suojatun profiilin kautta.'],
  ],
};

const responsible18Copy = {
  de: 'Das Angebot richtet sich nur an Erwachsene, die das gesetzliche Glücksspielalter ihres Wohnorts erreicht haben. Glücksspiel ist keine Einkommensquelle und gleicht Verluste nicht aus; setzen Sie vor dem Spielen feste Grenzen.',
  es: 'El servicio es solo para adultos que hayan alcanzado la edad legal para jugar en su jurisdicción. El juego no es una forma de obtener ingresos ni de recuperar pérdidas; fija límites antes de jugar.',
  it: 'Il servizio è riservato agli adulti che hanno raggiunto l’età legale per il gioco nel proprio Paese. Il gioco non è un modo per guadagnare né per recuperare le perdite; stabilisci limiti prima di giocare.',
  pl: 'Usługa jest przeznaczona wyłącznie dla osób pełnoletnich, które osiągnęły ustawowy wiek hazardowy w swoim kraju. Hazard nie jest sposobem na zarabianie ani odrabianie strat; przed grą ustal limity.',
  uk: 'Сервіс призначений лише для повнолітніх користувачів, які досягли встановленого законом віку для азартних ігор. Азартні ігри не є способом заробітку чи повернення програних коштів; установіть ліміти до початку гри.',
  pt: 'O serviço destina-se apenas a adultos que tenham atingido a idade legal para jogar na sua jurisdição. O jogo não é uma forma de obter rendimentos nem de recuperar perdas; defina limites antes de jogar.',
  fr: 'Le service est réservé aux adultes ayant atteint l’âge légal pour jouer dans leur juridiction. Le jeu n’est pas un moyen de gagner de l’argent ni de récupérer ses pertes ; fixez des limites avant de jouer.',
  hi: 'यह सेवा केवल उन वयस्कों के लिए है जो अपने क्षेत्र में जुआ खेलने की कानूनी आयु पूरी कर चुके हैं। जुआ कमाई करने या नुकसान की भरपाई का तरीका नहीं है; खेलने से पहले सीमाएँ तय करें।',
  fi: 'Palvelu on tarkoitettu vain aikuisille, jotka ovat saavuttaneet asuinmaansa lakisääteisen rahapelaamisiän. Rahapelaaminen ei ole tapa ansaita tuloja tai kattaa tappioita; aseta rajat ennen pelaamista.',
};

const localizedMetaDescriptions = {
  de: 'SilverPlay-Test: 300 % bis zu 2.500 € + 250 Freispiele, genaue Bonuscodes, 35-facher Umsatz, KYC, Auszahlungen sowie Visa, Skrill und Neteller.',
  es: 'Reseña de SilverPlay: 300 % hasta 2.500 € + 250 giros gratis, códigos exactos, apuesta 35x, KYC, retiros y métodos como Visa, Skrill y Neteller.',
  it: 'Recensione SilverPlay: 300% fino a 2.500 € + 250 giri gratis, codici esatti, requisito 35x, KYC, prelievi e metodi come Visa, Skrill e Neteller.',
  pl: 'Recenzja SilverPlay: 300% do 2 500 € + 250 darmowych spinów, dokładne kody, obrót 35x, KYC, wypłaty oraz Visa, Skrill i Neteller.',
  uk: 'Огляд SilverPlay: 300% до 2 500 € + 250 фріспінів, точні бонусні коди, відіграш 35×, KYC, виведення коштів, Visa, Skrill і Neteller.',
  pt: 'Análise SilverPlay: 300% até 2 500 € + 250 jogadas grátis, códigos exatos, rollover 35x, KYC, levantamentos, Visa, Skrill e Neteller.',
  fr: 'Avis SilverPlay : 300 % jusqu’à 2 500 € + 250 tours gratuits, codes exacts, mise 35x, KYC, retraits, Visa, Skrill et Neteller.',
  hi: 'SilverPlay समीक्षा: 300% में €2,500 तक + 250 मुफ़्त स्पिन, सटीक बोनस कोड, 35x शर्त, KYC, निकासी, Visa, Skrill और Neteller।',
  fi: 'SilverPlay-arvostelu: 300 % enintään 2 500 € + 250 ilmaiskierrosta, tarkat koodit, 35x kierrätys, KYC, kotiutukset, Visa, Skrill ja Neteller.',
};

const localizedFaqCopy = {
  de: [
    ['Was ist der SilverPlay-Casino-Willkommensbonus?', 'Die geprüfte EUR-Aktion bietet über vier Einzahlungen insgesamt 300 % bis zu 2.500 € und 250 Freispiele. Die erste Stufe umfasst 100 % bis zu 500 € plus 50 Freispiele mit dem Code SILVER500. Die Mindesteinzahlung beträgt 20 €; Verfügbarkeit und Währung müssen für das eigene Land geprüft werden.'],
    ['Welche Umsatzbedingungen gelten für das SilverPlay-Casinopaket?', 'Einzahlung und Bonus müssen innerhalb von 21 Tagen 35-mal umgesetzt werden. Freispiele verfallen nach 7 Tagen. Die maximale Umwandlung beträgt das Fünffache des Bonus; der Höchsteinsatz ist der niedrigere Wert aus 12 € und 5 % des Bonus. Live-Casino-Spiele tragen nicht zum Umsatz bei.'],
    ['Gibt es bei SilverPlay einen Sport-Willkommensbonus?', 'Die geprüfte Sportaktion bietet 100 % bis zu 100 € mit dem Code 100PLAY und einer Mindesteinzahlung von 10 €. Der Bonus muss innerhalb von 21 Tagen 12-mal umgesetzt werden; qualifizierende Wetten benötigen eine Quote von mindestens 1,80.'],
    ['Wie viel kann ich bei SilverPlay auszahlen lassen?', 'Das allgemeine Limit beträgt 5.000 € oder den Gegenwert in einer anderen Währung je rollierendem 7-Tage-Zeitraum, sofern nichts anderes angegeben ist. Zusätzlich gelten Umsatz-, Gebühren- und Verifizierungsregeln. Eine Echtgeld-Auszahlung und feste Bearbeitungszeiten wurden nicht getestet.'],
    ['Verlangt SilverPlay eine KYC-Verifizierung?', 'Ja. Die veröffentlichte Richtlinie verlangt eine vollständige Verifizierung bei jeder Auszahlung, bei Einzahlungen von insgesamt mehr als 5.000 € oder bei verdächtigen Transaktionen. Genannt werden Lichtbildausweis, Selfie mit Ausweis sowie Kontoauszug oder Versorgerrechnung.'],
    ['In welchen Ländern ist SilverPlay verfügbar?', 'Die aktuelle SpinCresta-Liste steht auf dieser Seite. Da die veröffentlichten Einschränkungen teilweise davon abweichen, sollten Registrierung, Zahlungsarten und Teilnahmeberechtigung direkt beim Anmeldevorgang geprüft werden. Verwenden Sie kein VPN, um Beschränkungen zu umgehen.'],
    ['Wie kontaktiere ich SilverPlay oder beantrage einen Selbstausschluss?', 'Die Kontaktseite nennt E-Mail- und Live-Chat-Support rund um die Uhr sowie support@silverplay.com. Anträge auf Selbstausschluss gehen an customercare@silverplay.com; laut Richtlinie kann die Bearbeitung bis zu 10 Werktage dauern.'],
  ],
  es: [
    ['¿Cuál es el bono de bienvenida de casino de SilverPlay?', 'La promoción en EUR analizada ofrece un 300 % hasta 2.500 € y 250 giros gratis en total, repartidos entre cuatro depósitos. La primera etapa es un 100 % hasta 500 € más 50 giros con el código SILVER500. El depósito mínimo es de 20 €; comprueba la disponibilidad y la divisa para tu país.'],
    ['¿Qué requisito de apuesta tiene el paquete de casino?', 'El depósito y el bono deben apostarse 35 veces en un plazo de 21 días. Los giros gratis caducan a los 7 días. La conversión máxima es cinco veces el bono y la apuesta máxima es el menor importe entre 12 € y el 5 % del bono. El casino en vivo no contribuye.'],
    ['¿SilverPlay tiene un bono de bienvenida deportivo?', 'La promoción deportiva analizada ofrece un 100 % hasta 100 € con el código 100PLAY y un depósito mínimo de 10 €. El bono debe apostarse 12 veces en 21 días y las apuestas válidas requieren una cuota mínima de 1,80.'],
    ['¿Cuánto puedo retirar de SilverPlay?', 'El límite general es de 5.000 € o su equivalente por cada periodo móvil de 7 días, salvo que se indique otro límite. También se aplican reglas de apuesta, comisiones y verificación. No hemos probado un retiro real ni confirmado un plazo fijo de pago.'],
    ['¿SilverPlay exige verificación KYC?', 'Sí. La política publicada exige verificación completa para cualquier retiro, cuando los depósitos acumulados superan 5.000 € o ante operaciones sospechosas. Puede solicitarse un documento con foto, una selfie con el documento y un extracto bancario o factura de servicios.'],
    ['¿En qué países está disponible SilverPlay?', 'La lista actual de SpinCresta aparece en esta página. Como algunas restricciones publicadas no coinciden con ella, comprueba durante el registro la elegibilidad, los métodos de pago y la disponibilidad. No utilices una VPN para eludir restricciones.'],
    ['¿Cómo contacto con SilverPlay o solicito la autoexclusión?', 'La página de contacto anuncia asistencia por correo electrónico y chat en vivo las 24 horas, además de support@silverplay.com. Las solicitudes de autoexclusión se envían a customercare@silverplay.com y pueden tardar hasta 10 días hábiles.'],
  ],
  it: [
    ['Qual è il bonus di benvenuto del casinò SilverPlay?', 'La promozione in EUR esaminata offre complessivamente il 300% fino a 2.500 € e 250 giri gratuiti, suddivisi su quattro depositi. La prima fase prevede il 100% fino a 500 € più 50 giri con il codice SILVER500. Il deposito minimo è 20 €; verifica disponibilità e valuta per il tuo Paese.'],
    ['Quali sono i requisiti di puntata del pacchetto casinò?', 'Deposito e bonus devono essere giocati 35 volte entro 21 giorni. I giri gratuiti scadono dopo 7 giorni. La conversione massima è pari a cinque volte il bonus; la puntata massima è il valore più basso tra 12 € e il 5% del bonus. Il casinò live non contribuisce.'],
    ['SilverPlay offre un bonus di benvenuto sportivo?', 'La promozione sportiva esaminata offre il 100% fino a 100 € con il codice 100PLAY e un deposito minimo di 10 €. Il bonus richiede un volume di gioco di 12 volte entro 21 giorni e una quota minima di 1,80.'],
    ['Quanto posso prelevare da SilverPlay?', 'Il limite generale è di 5.000 € o l’equivalente in altra valuta per ogni periodo mobile di 7 giorni, salvo diversa indicazione. Si applicano anche regole su volume di gioco, commissioni e verifica. Non abbiamo testato un prelievo reale né confermato tempi fissi.'],
    ['SilverPlay richiede la verifica KYC?', 'Sì. La politica pubblicata richiede la verifica completa per qualsiasi prelievo, quando i depositi complessivi superano 5.000 € o in presenza di operazioni sospette. Possono essere richiesti documento con foto, selfie con il documento ed estratto conto o bolletta.'],
    ['In quali Paesi è disponibile SilverPlay?', 'L’elenco attuale di SpinCresta è riportato in questa pagina. Poiché alcune restrizioni pubblicate non coincidono con l’elenco, verifica durante la registrazione idoneità, pagamenti e disponibilità. Non usare una VPN per aggirare i limiti.'],
    ['Come contatto SilverPlay o richiedo l’autoesclusione?', 'La pagina dei contatti indica assistenza via e-mail e live chat 24 ore su 24 e l’indirizzo support@silverplay.com. Le richieste di autoesclusione vanno inviate a customercare@silverplay.com e possono richiedere fino a 10 giorni lavorativi.'],
  ],
  pl: [
    ['Jaki jest bonus powitalny w kasynie SilverPlay?', 'Sprawdzona promocja w EUR oferuje łącznie 300% do 2 500 € i 250 darmowych spinów w ramach czterech wpłat. Pierwszy etap to 100% do 500 € oraz 50 spinów z kodem SILVER500. Minimalna wpłata wynosi 20 €; sprawdź dostępność i walutę dla swojego kraju.'],
    ['Jakie są warunki obrotu pakietu kasynowego?', 'Wpłatę i bonus trzeba obrócić 35 razy w ciągu 21 dni. Darmowe spiny wygasają po 7 dniach. Maksymalna konwersja to pięciokrotność bonusu, a maksymalna stawka to niższa wartość z 12 € i 5% bonusu. Kasyno na żywo nie zalicza się do obrotu.'],
    ['Czy SilverPlay oferuje sportowy bonus powitalny?', 'Sprawdzona promocja sportowa daje 100% do 100 € z kodem 100PLAY przy minimalnej wpłacie 10 €. Bonus wymaga obrotu 12 razy w ciągu 21 dni, a kwalifikujące się zakłady muszą mieć kurs co najmniej 1,80.'],
    ['Ile mogę wypłacić z SilverPlay?', 'Ogólny limit wynosi 5 000 € lub równowartość w innej walucie w każdym ruchomym okresie 7 dni, o ile nie podano inaczej. Obowiązują też zasady obrotu, opłat i weryfikacji. Nie testowaliśmy prawdziwej wypłaty ani stałego czasu realizacji.'],
    ['Czy SilverPlay wymaga weryfikacji KYC?', 'Tak. Opublikowana polityka wymaga pełnej weryfikacji przy każdej wypłacie, po przekroczeniu 5 000 € łącznych wpłat lub przy podejrzanych transakcjach. Może być potrzebny dokument ze zdjęciem, selfie z dokumentem oraz wyciąg bankowy albo rachunek za media.'],
    ['W jakich krajach dostępny jest SilverPlay?', 'Aktualna lista SpinCresta znajduje się na tej stronie. Ponieważ część opublikowanych ograniczeń jest z nią sprzeczna, podczas rejestracji sprawdź dostępność, płatności i uprawnienia. Nie używaj VPN do omijania ograniczeń.'],
    ['Jak skontaktować się z SilverPlay lub poprosić o samowykluczenie?', 'Strona kontaktowa podaje całodobowe wsparcie e-mail i czat na żywo oraz adres support@silverplay.com. Wnioski o samowykluczenie należy wysyłać na customercare@silverplay.com; ich obsługa może potrwać do 10 dni roboczych.'],
  ],
  uk: [
    ['Який вітальний бонус казино пропонує SilverPlay?', 'Перевірена пропозиція в EUR передбачає загалом 300% до 2 500 € і 250 фріспінів за чотири депозити. Перший етап — 100% до 500 € і 50 фріспінів із кодом SILVER500. Мінімальний депозит становить 20 €; перевірте доступність і валюту для своєї країни.'],
    ['Які умови відіграшу пакета казино?', 'Депозит разом із бонусом потрібно відіграти 35 разів протягом 21 дня. Фріспіни діють 7 днів. Максимальна конверсія становить п’ятикратну суму бонусу, а максимальна ставка — менше з двох значень: 12 € або 5% бонусу. Live-казино не враховується.'],
    ['Чи є у SilverPlay спортивний вітальний бонус?', 'Перевірена спортивна пропозиція дає 100% до 100 € з кодом 100PLAY за мінімального депозиту 10 €. Бонус потрібно відіграти 12 разів протягом 21 дня; мінімальний коефіцієнт кваліфікаційної ставки — 1,80.'],
    ['Скільки можна вивести із SilverPlay?', 'Загальний ліміт становить 5 000 € або еквівалент в іншій валюті за кожні 7 днів, якщо не вказано інше. Також діють правила відіграшу, комісій і верифікації. Ми не тестували реальне виведення коштів і не підтверджували фіксований строк обробки.'],
    ['Чи потрібна в SilverPlay KYC-верифікація?', 'Так. Опублікована політика вимагає повної верифікації для будь-якого виведення, коли сукупні депозити перевищують 5 000 € або виявлено підозрілу операцію. Можуть знадобитися посвідчення особи з фото, селфі з документом і банківська виписка або рахунок за комунальні послуги.'],
    ['У яких країнах доступний SilverPlay?', 'Поточний список SpinCresta наведено на цій сторінці. Оскільки частина опублікованих обмежень суперечить цьому списку, перевірте можливість реєстрації, платежі та доступність під час створення акаунта. Не використовуйте VPN для обходу обмежень.'],
    ['Як зв’язатися із SilverPlay або подати запит на самовиключення?', 'На сторінці контактів заявлено цілодобову підтримку електронною поштою та в live-чаті, а також адресу support@silverplay.com. Запити на самовиключення слід надсилати на customercare@silverplay.com; обробка може тривати до 10 робочих днів.'],
  ],
  pt: [
    ['Qual é o bónus de boas-vindas do casino SilverPlay?', 'A promoção em EUR analisada oferece um total de 300% até 2 500 € e 250 jogadas grátis, distribuídos por quatro depósitos. A primeira etapa oferece 100% até 500 € e 50 jogadas com o código SILVER500. O depósito mínimo é 20 €; confirme a disponibilidade e a moeda para o seu país.'],
    ['Quais são os requisitos de apostas do pacote de casino?', 'O depósito e o bónus devem ser apostados 35 vezes em 21 dias. As jogadas grátis expiram após 7 dias. A conversão máxima é cinco vezes o bónus e a aposta máxima é o menor valor entre 12 € e 5% do bónus. O casino ao vivo não contribui.'],
    ['SilverPlay tem um bónus de boas-vindas desportivo?', 'A promoção desportiva analisada oferece 100% até 100 € com o código 100PLAY e depósito mínimo de 10 €. O bónus exige um volume de apostas de 12 vezes em 21 dias e uma cotação mínima de 1,80.'],
    ['Quanto posso levantar da SilverPlay?', 'O limite geral é 5 000 € ou o equivalente noutra moeda em cada período móvel de 7 dias, salvo indicação diferente. Também se aplicam regras de apostas, taxas e verificação. Não testámos um levantamento real nem confirmámos um prazo fixo.'],
    ['A SilverPlay exige verificação KYC?', 'Sim. A política publicada exige verificação completa para qualquer levantamento, quando os depósitos acumulados ultrapassam 5 000 € ou perante operações suspeitas. Podem ser pedidos documento com foto, selfie com o documento e extrato bancário ou fatura de serviços.'],
    ['Em que países está disponível a SilverPlay?', 'A lista atual da SpinCresta está nesta página. Como algumas restrições publicadas não coincidem com ela, confirme durante o registo a elegibilidade, os pagamentos e a disponibilidade. Não utilize uma VPN para contornar restrições.'],
    ['Como contacto a SilverPlay ou peço autoexclusão?', 'A página de contacto anuncia apoio por e-mail e live chat 24 horas por dia e o endereço support@silverplay.com. Os pedidos de autoexclusão são enviados para customercare@silverplay.com e podem demorar até 10 dias úteis.'],
  ],
  fr: [
    ['Quel est le bonus de bienvenue du casino SilverPlay ?', 'La promotion en EUR examinée offre au total 300 % jusqu’à 2 500 € et 250 tours gratuits, répartis sur quatre dépôts. La première étape offre 100 % jusqu’à 500 € et 50 tours avec le code SILVER500. Le dépôt minimum est de 20 € ; vérifiez la disponibilité et la devise pour votre pays.'],
    ['Quelles sont les conditions de mise du bonus casino ?', 'Le dépôt et le bonus doivent être misés 35 fois sous 21 jours. Les tours gratuits expirent après 7 jours. La conversion maximale est égale à cinq fois le bonus et la mise maximale correspond au montant le plus faible entre 12 € et 5 % du bonus. Le casino en direct ne contribue pas.'],
    ['SilverPlay propose-t-il un bonus de bienvenue sportif ?', 'La promotion sportive examinée offre 100 % jusqu’à 100 € avec le code 100PLAY et un dépôt minimum de 10 €. Le bonus doit être misé 12 fois sous 21 jours et les paris admissibles nécessitent une cote minimale de 1,80.'],
    ['Combien puis-je retirer de SilverPlay ?', 'La limite générale est de 5 000 € ou l’équivalent dans une autre devise par période glissante de 7 jours, sauf indication contraire. Des règles de mise, de frais et de vérification s’appliquent également. Nous n’avons pas testé de retrait réel ni confirmé de délai fixe.'],
    ['SilverPlay exige-t-il une vérification KYC ?', 'Oui. La politique publiée exige une vérification complète pour tout retrait, lorsque les dépôts cumulés dépassent 5 000 € ou en cas d’opération suspecte. Une pièce d’identité avec photo, un selfie avec cette pièce et un relevé bancaire ou une facture peuvent être demandés.'],
    ['Dans quels pays SilverPlay est-il disponible ?', 'La liste actuelle de SpinCresta figure sur cette page. Certaines restrictions publiées étant incompatibles avec cette liste, vérifiez lors de l’inscription l’éligibilité, les paiements et la disponibilité. N’utilisez pas de VPN pour contourner les restrictions.'],
    ['Comment contacter SilverPlay ou demander une auto-exclusion ?', 'La page de contact annonce une assistance par e-mail et live chat 24 h/24 ainsi que l’adresse support@silverplay.com. Les demandes d’auto-exclusion sont envoyées à customercare@silverplay.com et peuvent prendre jusqu’à 10 jours ouvrables.'],
  ],
  hi: [
    ['SilverPlay कैसीनो स्वागत बोनस क्या है?', 'जाँचे गए EUR ऑफ़र में चार जमा पर कुल 300% में €2,500 तक और 250 मुफ़्त स्पिन मिलते हैं। पहले चरण में SILVER500 कोड के साथ 100% में €500 तक और 50 स्पिन हैं। न्यूनतम जमा €20 है; अपने देश के लिए उपलब्धता और मुद्रा जाँचें।'],
    ['कैसीनो पैकेज की वेजरिंग शर्तें क्या हैं?', 'जमा और बोनस की कुल राशि को 21 दिनों में 35 गुना वेजर करना होता है। मुफ़्त स्पिन 7 दिनों में समाप्त होते हैं। अधिकतम रूपांतरण बोनस का पाँच गुना है और अधिकतम दांव €12 या बोनस के 5% में से कम राशि है। लाइव कैसीनो का योगदान नहीं होता।'],
    ['क्या SilverPlay स्पोर्ट्स स्वागत बोनस देता है?', 'जाँचे गए स्पोर्ट्स ऑफ़र में 100PLAY कोड और €10 न्यूनतम जमा के साथ 100% में €100 तक मिलता है। बोनस को 21 दिनों में 12 गुना वेजर करना होता है और योग्य दांव के ऑड्स कम से कम 1.80 होने चाहिए।'],
    ['SilverPlay से कितनी राशि निकाली जा सकती है?', 'सामान्य सीमा हर 7 दिन की चलती अवधि में €5,000 या दूसरी मुद्रा में उसके बराबर है, जब तक अलग सीमा न दी गई हो। वेजरिंग, शुल्क और सत्यापन के नियम भी लागू होते हैं। हमने वास्तविक निकासी या तय भुगतान समय की जाँच नहीं की है।'],
    ['क्या SilverPlay में KYC सत्यापन जरूरी है?', 'हाँ। प्रकाशित नीति किसी भी निकासी, कुल जमा €5,000 से अधिक होने या संदिग्ध लेनदेन पर पूर्ण सत्यापन माँगती है। फोटो पहचान पत्र, उसे पकड़े हुए सेल्फी और बैंक स्टेटमेंट या उपयोगिता बिल माँगा जा सकता है।'],
    ['SilverPlay किन देशों में उपलब्ध है?', 'SpinCresta की मौजूदा सूची इस पेज पर है। प्रकाशित प्रतिबंधों में कुछ अंतर होने के कारण पंजीकरण के समय पात्रता, भुगतान और उपलब्धता की पुष्टि करें। प्रतिबंधों से बचने के लिए VPN का उपयोग न करें।'],
    ['SilverPlay से संपर्क या स्व-बहिष्करण का अनुरोध कैसे करें?', 'संपर्क पेज 24 घंटे ईमेल और लाइव चैट सहायता तथा support@silverplay.com बताता है। स्व-बहिष्करण अनुरोध customercare@silverplay.com पर भेजे जाते हैं और उनकी प्रक्रिया में 10 कार्यदिवस तक लग सकते हैं।'],
  ],
  fi: [
    ['Mikä on SilverPlay-kasinon tervetulobonus?', 'Tarkistettu EUR-tarjous antaa neljälle talletukselle yhteensä 300 % enintään 2 500 € ja 250 ilmaiskierrosta. Ensimmäinen vaihe on 100 % enintään 500 € ja 50 kierrosta koodilla SILVER500. Vähimmäistalletus on 20 €; tarkista saatavuus ja valuutta omalle maallesi.'],
    ['Mitkä ovat kasinopaketin kierrätysehdot?', 'Talletus ja bonus on kierrätettävä 35 kertaa 21 päivän kuluessa. Ilmaiskierrokset vanhenevat 7 päivässä. Enimmäismuunto on viisinkertainen bonus ja enimmäispanos on pienempi arvoista 12 € ja 5 % bonuksesta. Livekasino ei kerrytä ehtoa.'],
    ['Tarjoaako SilverPlay urheilun tervetulobonuksen?', 'Tarkistettu urheilutarjous antaa 100 % enintään 100 € koodilla 100PLAY ja 10 €:n vähimmäistalletuksella. Bonus on kierrätettävä 12 kertaa 21 päivän aikana, ja hyväksyttävän vedon kertoimen on oltava vähintään 1,80.'],
    ['Kuinka paljon SilverPlaystä voi kotiuttaa?', 'Yleinen raja on 5 000 € tai vastaava summa muussa valuutassa jokaisella liukuvalla 7 päivän jaksolla, ellei muuta ilmoiteta. Myös kierrätys-, maksu- ja vahvistussäännöt koskevat kotiutuksia. Emme testanneet oikean rahan kotiutusta tai vahvistaneet kiinteää käsittelyaikaa.'],
    ['Vaatiiko SilverPlay KYC-tunnistautumisen?', 'Kyllä. Julkaistu käytäntö vaatii täyden tunnistautumisen jokaiseen kotiutukseen, kun talletuksia on yhteensä yli 5 000 € tai tapahtuma vaikuttaa epäilyttävältä. Pyydettäviä asiakirjoja voivat olla kuvallinen henkilötodistus, selfie sen kanssa sekä tiliote tai lasku.'],
    ['Missä maissa SilverPlay on saatavilla?', 'SpinCrestan nykyinen luettelo näkyy tällä sivulla. Koska osa julkaistuista rajoituksista on ristiriidassa sen kanssa, tarkista rekisteröityessäsi kelpoisuus, maksutavat ja saatavuus. Älä kierrä rajoituksia VPN-yhteydellä.'],
    ['Miten SilverPlayhin otetaan yhteyttä tai pyydetään pelikieltoa?', 'Yhteystietosivu ilmoittaa ympärivuorokautisen sähköposti- ja live chat -tuen sekä osoitteen support@silverplay.com. Pelikieltopyynnöt lähetetään osoitteeseen customercare@silverplay.com, ja käsittely voi kestää enintään 10 arkipäivää.'],
  ],
};

const verifiedTableCopy = {
  de: {
    sports: {
      0: ['Willkommensangebot', '100 % bis zu 100 € mit dem Code <code translate="no">100PLAY</code>', 'Geprüfte Mindesteinzahlung für das EUR-Angebot: 10 €'],
      2: ['Mindestquote', 'Mindestens 1,80', 'Wetten mit niedrigeren Quoten verstoßen gegen die Aktionsbedingungen'],
      4: ['Ausgeschlossene Wetten', 'Rückerstattete, unentschiedene, stornierte und abgelehnte Wetten zählen nicht', 'Mehrfachwetten auf dasselbe Ergebnis und weitere aufgeführte Strategien sind ebenfalls ausgeschlossen'],
    },
    kyc: ['Veröffentlichte Länderbeschränkungen', 'Die KYC-Richtlinie nennt Österreich, Frankreich, Deutschland, die Niederlande, Spanien, die Komoren, das Vereinigte Königreich, die USA und FATF-Blacklist-Staaten', 'Dies steht im Widerspruch zu einigen Märkten der aktuellen Verfügbarkeitsdaten. Prüfen Sie die Teilnahmeberechtigung bei der Registrierung und verwenden Sie niemals ein VPN'],
  },
  es: {
    sports: {
      0: ['Oferta de bienvenida', '100 % hasta 100 € con el código <code translate="no">100PLAY</code>', 'Depósito mínimo comprobado para la oferta en EUR: 10 €'],
      2: ['Cuota mínima', 'Al menos 1,80', 'Las apuestas con cuotas inferiores incumplen las condiciones de la promoción'],
      4: ['Apuestas excluidas', 'Las apuestas reembolsadas, empatadas, canceladas y rechazadas no cuentan', 'También se restringen las apuestas múltiples al mismo resultado y otras estrategias enumeradas'],
    },
    kyc: ['Restricciones territoriales publicadas', 'La política KYC incluye Austria, Francia, Alemania, Países Bajos, España, Comoras, Reino Unido, Estados Unidos y jurisdicciones de la lista negra del GAFI', 'Esto entra en conflicto con algunos mercados de los datos actuales de disponibilidad. Confirma tu elegibilidad durante el registro y no utilices una VPN'],
  },
  it: {
    sports: {
      0: ['Offerta di benvenuto', '100% fino a 100 € con il codice <code translate="no">100PLAY</code>', 'Deposito minimo verificato per l’offerta in EUR: 10 €'],
      2: ['Quota minima', 'Almeno 1,80', 'Le scommesse con quote inferiori violano le condizioni della promozione'],
      4: ['Scommesse escluse', 'Le scommesse rimborsate, pareggiate, annullate e rifiutate non vengono conteggiate', 'Sono inoltre vietate le scommesse multiple sullo stesso esito e le altre strategie indicate'],
    },
    kyc: ['Restrizioni territoriali pubblicate', 'La politica KYC elenca Austria, Francia, Germania, Paesi Bassi, Spagna, Comore, Regno Unito, Stati Uniti e giurisdizioni nella lista nera FATF', 'Questo contrasta con alcuni mercati presenti nei dati di disponibilità attuali. Verifica l’idoneità durante la registrazione e non utilizzare una VPN'],
  },
  pl: {
    sports: {
      0: ['Oferta powitalna', '100% do 100 € z kodem <code translate="no">100PLAY</code>', 'Sprawdzona minimalna wpłata dla oferty w EUR: 10 €'],
      2: ['Minimalny kurs', 'Co najmniej 1,80', 'Zakłady z niższym kursem naruszają warunki promocji'],
      4: ['Wykluczone zakłady', 'Zakłady zwrócone, remisowe, anulowane i odrzucone nie są zaliczane', 'Ograniczone są również wielokrotne zakłady na ten sam wynik oraz inne wymienione strategie'],
    },
    kyc: ['Opublikowane ograniczenia krajowe', 'Polityka KYC wymienia Austrię, Francję, Niemcy, Holandię, Hiszpanię, Komory, Wielką Brytanię, USA i jurysdykcje z czarnej listy FATF', 'Jest to sprzeczne z niektórymi rynkami w aktualnych danych dostępności. Potwierdź możliwość rejestracji i nigdy nie używaj VPN do omijania ograniczeń'],
  },
  uk: {
    sports: {
      0: ['Вітальна пропозиція', '100% до 100 € з кодом <code translate="no">100PLAY</code>', 'Перевірений мінімальний депозит для пропозиції в EUR: 10 €'],
      2: ['Мінімальний коефіцієнт', 'Не нижче 1,80', 'Ставки з нижчим коефіцієнтом порушують умови акції'],
      4: ['Виключені ставки', 'Повернені, нічийні, скасовані та відхилені ставки не зараховуються', 'Також заборонені повторні ставки на той самий результат та інші перелічені стратегії'],
    },
    kyc: ['Опубліковані обмеження за країнами', 'У політиці KYC зазначені Австрія, Франція, Німеччина, Нідерланди, Іспанія, Коморські Острови, Велика Британія, США та юрисдикції з чорного списку FATF', 'Це суперечить частині ринків у поточних даних доступності. Підтвердьте можливість реєстрації та ніколи не використовуйте VPN для обходу обмежень'],
  },
  pt: {
    sports: {
      0: ['Oferta de boas-vindas', '100% até 100 € com o código <code translate="no">100PLAY</code>', 'Depósito mínimo verificado para a oferta em EUR: 10 €'],
      2: ['Cotação mínima', 'Pelo menos 1,80', 'As apostas com cotações inferiores violam as condições da promoção'],
      4: ['Apostas excluídas', 'As apostas reembolsadas, empatadas, canceladas e recusadas não contam', 'Também são restringidas apostas múltiplas no mesmo resultado e outras estratégias indicadas'],
    },
    kyc: ['Restrições territoriais publicadas', 'A política KYC inclui Áustria, França, Alemanha, Países Baixos, Espanha, Comores, Reino Unido, Estados Unidos e jurisdições da lista negra do GAFI', 'Isto entra em conflito com alguns mercados dos dados atuais de disponibilidade. Confirme a elegibilidade durante o registo e nunca utilize uma VPN'],
  },
  fr: {
    sports: {
      0: ['Offre de bienvenue', '100 % jusqu’à 100 € avec le code <code translate="no">100PLAY</code>', 'Dépôt minimum vérifié pour l’offre en EUR : 10 €'],
      2: ['Cote minimale', 'Au moins 1,80', 'Les paris à une cote inférieure enfreignent les conditions de la promotion'],
      4: ['Paris exclus', 'Les paris remboursés, nuls, annulés et refusés ne sont pas pris en compte', 'Les paris multiples sur le même résultat et les autres stratégies indiquées sont également restreints'],
    },
    kyc: ['Restrictions territoriales publiées', 'La politique KYC cite l’Autriche, la France, l’Allemagne, les Pays-Bas, l’Espagne, les Comores, le Royaume-Uni, les États-Unis et les juridictions figurant sur la liste noire du GAFI', 'Cela contredit certains marchés des données de disponibilité actuelles. Confirmez votre éligibilité lors de l’inscription et n’utilisez jamais de VPN'],
  },
  hi: {
    sports: {
      0: ['स्वागत ऑफ़र', '<code translate="no">100PLAY</code> कोड के साथ 100% में €100 तक', 'EUR ऑफ़र के लिए जाँची गई न्यूनतम जमा राशि: €10'],
      2: ['न्यूनतम ऑड्स', 'कम से कम 1.80', 'इससे कम ऑड्स वाले दांव प्रचार की शर्तों का उल्लंघन करते हैं'],
      4: ['शामिल न होने वाले दांव', 'रिफंड, टाई, रद्द और अस्वीकृत दांव की गणना नहीं होती', 'एक ही नतीजे पर कई दांव और सूचीबद्ध अन्य रणनीतियाँ भी प्रतिबंधित हैं'],
    },
    kyc: ['प्रकाशित देश प्रतिबंध', 'KYC नीति में ऑस्ट्रिया, फ़्रांस, जर्मनी, नीदरलैंड, स्पेन, कोमोरोस, यूनाइटेड किंगडम, अमेरिका और FATF ब्लैकलिस्ट वाले क्षेत्र शामिल हैं', 'यह मौजूदा उपलब्धता डेटा के कुछ बाज़ारों से मेल नहीं खाता। पंजीकरण के समय पात्रता की पुष्टि करें और प्रतिबंधों से बचने के लिए VPN का उपयोग न करें'],
  },
  fi: {
    sports: {
      0: ['Tervetulotarjous', '100 % enintään 100 € koodilla <code translate="no">100PLAY</code>', 'Tarkistettu EUR-tarjouksen vähimmäistalletus: 10 €'],
      2: ['Vähimmäiskerroin', 'Vähintään 1,80', 'Pienemmällä kertoimella tehdyt vedot rikkovat kampanjan ehtoja'],
      4: ['Poissuljetut vedot', 'Palautettuja, tasatulokseen päättyneitä, peruttuja ja hylättyjä vetoja ei lasketa', 'Myös useat vedot samasta lopputuloksesta ja muut luetellut strategiat on rajoitettu'],
    },
    kyc: ['Julkaistut maarajoitukset', 'KYC-käytännössä mainitaan Itävalta, Ranska, Saksa, Alankomaat, Espanja, Komorit, Yhdistynyt kuningaskunta, Yhdysvallat ja FATF:n mustan listan lainkäyttöalueet', 'Tämä on ristiriidassa joidenkin nykyisten saatavuustietojen markkinoiden kanssa. Vahvista kelpoisuus rekisteröityessäsi äläkä käytä VPN-yhteyttä rajoitusten kiertämiseen'],
  },
};

const rewriteTableRows = (section, replacementsByIndex) => section.replace(
  /<tbody>[\s\S]*?<\/tbody>/,
  tbody => {
    let rowIndex = 0;
    return tbody.replace(/<tr>[\s\S]*?<\/tr>/g, row => {
      const cells = replacementsByIndex[rowIndex++];
      return cells ? `<tr>${cells.map(cell => `<td>${cell}</td>`).join('')}</tr>` : row;
    });
  },
);

for (const [locale, pairs] of Object.entries(replacements)) {
  const file = `${locale}/brands/silverplay/index.html`;
  let html = fs.readFileSync(file, 'utf8');
  let changed = 0;
  for (const [from, to] of pairs) {
    if (!html.includes(from)) continue;
    html = html.replaceAll(from, to);
    changed += 1;
  }
  const trustCards = trustSplitCopy[locale];
  if (trustCards) {
    html = html.replace(
      /<section class="container" id="trust">[\s\S]*?<\/section>/,
      section => {
        const cards = [...section.matchAll(/<div class="feature-card glass-card">[\s\S]*?<\/div>/g)];
        if (cards.length !== 3) return section;
        const replacement = trustCards
          .map(([heading, content]) => `<div class="feature-card glass-card"><strong>${heading}</strong><span>${content}</span></div>`)
          .join('\n');
        return section.replace(cards[2][0], replacement);
      },
    );
  }
  const ageCopy = responsible18Copy[locale];
  if (ageCopy) {
    html = html.replace(
      /<section class="container" id="responsible-gambling">[\s\S]*?<\/section>/,
      section => section.replace(
        /<div class="feature-card glass-card"><strong>18\+<\/strong><span>[\s\S]*?<\/span><\/div>/,
        `<div class="feature-card glass-card"><strong>18+</strong><span>${ageCopy}</span></div>`,
      ),
    );
  }
  const verifiedCopy = verifiedTableCopy[locale];
  if (verifiedCopy) {
    html = html.replace(
      /<section class="container" id="sports-bonus">[\s\S]*?<\/section>/,
      section => rewriteTableRows(section, verifiedCopy.sports),
    );
    html = html.replace(
      /<section class="container" id="kyc">[\s\S]*?<\/section>/,
      section => rewriteTableRows(section, { 4: verifiedCopy.kyc }),
    );
  }
  for (const sectionId of ['bonuses', 'sports-bonus', 'cashier', 'kyc']) {
    html = html.replace(
      new RegExp(`<section class="container" id="${sectionId}">[\\s\\S]*?<\\/section>`),
      section => section.replace(/\n?<p>[\s\S]*?<\/p>/g, ''),
    );
  }
  const metaDescription = localizedMetaDescriptions[locale];
  if (metaDescription) {
    html = html.replace(
      /(<meta\s+(?:name|property)="(?:description|og:description|twitter:description)"\s+content=")[^"]*/g,
      `$1${metaDescription}`,
    );
  }
  const localizedFaq = localizedFaqCopy[locale];
  if (localizedFaq) {
    html = html.replace(
      /<section class="container" id="faq">([\s\S]*?)<\/section>/,
      (section, content) => {
        const heading = content.match(/<h2 class="title">[\s\S]*?<\/h2>/)?.[0] || '<h2 class="title">SilverPlay FAQ</h2>';
        const timeline = localizedFaq.map(([question, answer]) => `<h3>${question}</h3><p>${answer}</p>`).join('\n');
        return `<section class="container" id="faq">${heading}\n<div class="timeline">${timeline}</div>\n</section>`;
      },
    );
  }
  html = html.replace(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
    (match, jsonText) => {
      try {
        const data = JSON.parse(jsonText);
        for (const entity of data['@graph'] || []) {
          if (entity['@type'] === 'Article') entity.dateModified = '2026-09-07';
          if (metaDescription && ['Article', 'WebPage'].includes(entity['@type'])) entity.description = metaDescription;
          if (localizedFaq && entity['@type'] === 'FAQPage') {
            entity.mainEntity = localizedFaq.map(([question, answer]) => ({
              '@type': 'Question',
              name: question,
              acceptedAnswer: { '@type': 'Answer', text: answer },
            }));
          }
        }
        return `<script type="application/ld+json">${JSON.stringify(data, null, 2)}</script>`;
      } catch {
        return match;
      }
    },
  );
  let prosConsCardIndex = 0;
  html = html.replace(
    /<section class="container" id="pros-cons">[\s\S]*?<\/section>/,
    section => section.replace(
      /<div class="feature-card glass-card"><strong>([^<]+)<\/strong>([\s\S]*?)<\/div>/g,
      (_match, heading, content) => {
        const localized = prosConsCopy[locale]?.[prosConsCardIndex++];
        const normalizedHeading = localized?.[0] || heading;
        const items = localized?.[1] || content
          .replaceAll('<span>', '')
          .replaceAll('</span>', '')
          .split(/<br\s*\/>/)
          .map(item => item.replace(/^[-–]\s*/, '').trim())
          .filter(Boolean);
        return `<div class="feature-card glass-card"><strong>${normalizedHeading}</strong>${items
          .map(item => `<span>- ${item}</span>`)
          .join('<br />')}</div>`;
      },
    ),
  );
  fs.writeFileSync(file, html);
  console.log(`${locale}: ${changed}/${pairs.length} editorial replacements`);
}
