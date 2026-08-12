#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PT_ROOT = path.join(ROOT, 'pt');
const files = [];

const walk = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.name === 'index.html') files.push(absolute);
  }
};
walk(PT_ROOT);

const replacements = [
  [/CASSINOS/g, 'CASINOS'],
  [/CASSINO/g, 'CASINO'],
  [/BÔNUS/g, 'BÓNUS'],
  [/\bCassinos\b/g, 'Casinos'],
  [/\bcassinos\b/g, 'casinos'],
  [/\bCassino\b/g, 'Casino'],
  [/\bcassino\b/g, 'casino'],
  [/\bBônus\b/g, 'Bónus'],
  [/\bbônus\b/g, 'bónus'],
  [/\bSaques\b/g, 'Levantamentos'],
  [/\bsaques\b/g, 'levantamentos'],
  [/\bSaque\b/g, 'Levantamento'],
  [/\bsaque\b/g, 'levantamento'],
  [/\bRetiradas\b/g, 'Levantamentos'],
  [/\bretiradas\b/g, 'levantamentos'],
  [/\bRetirada\b/g, 'Levantamento'],
  [/\bretirada\b/g, 'levantamento'],
  [/\bRodadas grátis\b/gi, match => /^[A-Z]/.test(match) ? 'Jogadas grátis' : 'jogadas grátis'],
  [/\brodadas gratuitas\b/gi, 'jogadas grátis'],
  [/\brodadas livres\b/gi, 'jogadas grátis'],
  [/\bGiros grátis\b/gi, match => /^[A-Z]/.test(match) ? 'Jogadas grátis' : 'jogadas grátis'],
  [/\bgiros gratuitos\b/gi, 'jogadas grátis'],
  [/\bCaça-níqueis\b/g, 'Slots'],
  [/\bcaça-níqueis\b/g, 'slots'],
  [/\bProvedores\b/g, 'Fornecedores'],
  [/\bprovedores\b/g, 'fornecedores'],
  [/\bProvedor\b/g, 'Fornecedor'],
  [/\bprovedor\b/g, 'fornecedor'],
  [/\bUsuários\b/g, 'Utilizadores'],
  [/\busuários\b/g, 'utilizadores'],
  [/\bUsuário\b/g, 'Utilizador'],
  [/\busuário\b/g, 'utilizador'],
  [/\bEquipe\b/g, 'Equipa'],
  [/\bequipe\b/g, 'equipa'],
  [/\bContatos\b/g, 'Contactos'],
  [/\bcontatos\b/g, 'contactos'],
  [/\bContato\b/g, 'Contacto'],
  [/\bcontato\b/g, 'contacto'],
  [/\bArquivos\b/g, 'Ficheiros'],
  [/\barquivos\b/g, 'ficheiros'],
  [/\bArquivo\b/g, 'Ficheiro'],
  [/\barquivo\b/g, 'ficheiro'],
  [/\bTelas\b/g, 'Ecrãs'],
  [/\btelas\b/g, 'ecrãs'],
  [/\bTela\b/g, 'Ecrã'],
  [/\btela\b/g, 'ecrã'],
  [/\bCelulares\b/g, 'Telemóveis'],
  [/\bcelulares\b/g, 'telemóveis'],
  [/\bCelular\b/g, 'Telemóvel'],
  [/\bcelular\b/g, 'telemóvel'],
  [/\bAplicativos\b/g, 'Aplicações'],
  [/\baplicativos\b/g, 'aplicações'],
  [/\bAplicativo\b/g, 'Aplicação'],
  [/\baplicativo\b/g, 'aplicação'],
  [/\bConfiáveis\b/g, 'Fiáveis'],
  [/\bconfiáveis\b/g, 'fiáveis'],
  [/\bConfiável\b/g, 'Fiável'],
  [/\bconfiável\b/g, 'fiável'],
  [/\bjogo mais seguro\b/gi, 'jogo responsável'],
  [/\bferramentas de jogo mais seguras?\b/gi, 'ferramentas de jogo responsável'],
  [/\bcontroles de jogo mais seguro\b/gi, 'ferramentas de jogo responsável'],
  [/\bjogar com segurança\b/gi, 'jogar de forma responsável'],
  [/\bReembolsos\b/g, 'Cashback'],
  [/\breembolsos\b/g, 'cashback'],
  [/\bReembolso\b/g, 'Cashback'],
  [/\breembolso\b/g, 'cashback'],
  [/\bReivindique\b/g, 'Obtenha'],
  [/\breivindique\b/g, 'obtenha'],
  [/\bCriptografia de dados\b/gi, 'Encriptação de dados'],
  [/\bcriptografia avançada\b/gi, 'encriptação avançada'],
  [/\bofertas de criptografia\b/gi, 'ofertas com criptomoedas'],
  [/\bcasino criptográfico\b/gi, 'casino com criptomoedas'],
  [/\bcriptografia e moedas digitais\b/gi, 'criptomoedas e moedas digitais'],
  [/\bcriptografia\b/gi, 'criptomoedas'],
  [/\bPolítica de privacidade\b/g, 'Política de Privacidade'],
  [/\bpolítica de Privacidade\b/g, 'Política de Privacidade'],
  [/\bDireitos autorais 2026 SpinCresta\.com\. Todos os direitos reservados\./g, '© 2026 SpinCresta.com. Todos os direitos reservados.'],
  [/\bPor favor, jogue com responsabilidade\./g, 'Jogue de forma responsável.'],
  [/\bAvaliações de casinos\b/g, 'Análises de casinos'],
  [/\bavaliações de casinos\b/g, 'análises de casinos'],
  [/\bRevisão de especialistas\b/g, 'Análise do especialista'],
  [/\brevisão editorial\b/gi, 'análise editorial'],
  [/\bdata da revisão\b/gi, 'data da análise'],
  [/\bCassinos Online por País\b/g, 'Casinos online por país'],
  [/\bJogo Responsável\b/g, 'Jogo responsável'],
  [/\bMétodos de pagamento\b/g, 'Métodos de pagamento'],
  [/\bApostas esportivas\b/g, 'Apostas desportivas'],
  [/\bapostas esportivas\b/g, 'apostas desportivas'],
  [/\bEsportes\b/g, 'Desporto'],
  [/\besportes\b/g, 'desporto'],
  [/\bFreqüentemente\b/g, 'Frequentemente'],
  [/\bfreqüentemente\b/g, 'frequentemente'],
  [/\bPôquer\b/g, 'Póquer'],
  [/\bpôquer\b/g, 'póquer'],
  [/\bRegistro\b/g, 'Registo'],
  [/\bregistro\b/g, 'registo'],
  [/\bRegistrar-se\b/g, 'Registar-se'],
  [/\bregistrar-se\b/g, 'registar-se'],
  [/\bRegistrar\b/g, 'Registar'],
  [/\bregistrar\b/g, 'registar'],
  [/\bAcessar\b/g, 'Aceder'],
  [/\bacessar\b/g, 'aceder'],
  [/\bAcessados\b/g, 'Acedidos'],
  [/\bacessados\b/g, 'acedidos'],
  [/\bAcessadas\b/g, 'Acedidas'],
  [/\bacessadas\b/g, 'acedidas'],
  [/\bAcesso\b/g, 'Acesso'],
  [/\bEletrónicas\b/g, 'Eletrónicas'],
  [/\beletrônicas\b/g, 'eletrónicas'],
  [/\bEletrónicos\b/g, 'Eletrónicos'],
  [/\beletrônicos\b/g, 'eletrónicos'],
  [/\bEletrónica\b/g, 'Eletrónica'],
  [/\beletrônica\b/g, 'eletrónica'],
  [/\bEletrónico\b/g, 'Eletrónico'],
  [/\beletrônico\b/g, 'eletrónico'],
  [/\bdesporto eletrónicos\b/gi, 'desportos eletrónicos'],
  [/\bdesporto virtuais\b/gi, 'desportos virtuais'],
  [/\boutros desporto\b/gi, 'outros desportos'],
  [/\besportivas\b/gi, 'desportivas'],
  [/\besportivos\b/gi, 'desportivos'],
  [/\besportiva\b/gi, 'desportiva'],
  [/\besportivo\b/gi, 'desportivo'],
  [/\brotas de reclamações\b/gi, 'canais de reclamação'],
  [/\brotas de suporte\b/gi, 'canais de suporte'],
  [/\brotas de atendimento\b/gi, 'canais de atendimento'],
  [/\brotas de pagamento\b/gi, 'métodos de pagamento'],
  [/\brotas de depósito\b/gi, 'métodos de depósito'],
  [/\brotas de levantamento\b/gi, 'métodos de levantamento'],
  [/\brota de levantamento\b/gi, 'método de levantamento'],
  [/\brota de pagamento\b/gi, 'método de pagamento'],
  [/\brotas de transferência bancária\b/gi, 'opções de transferência bancária'],
  [/\brotas de carteira(?: eletrónica)?\b/gi, 'opções de carteira eletrónica'],
  [/\brotas de criptomoedas\b/gi, 'opções de criptomoedas'],
  [/\brota de processamento\b/gi, 'método de processamento'],
  [/\brotas de\b/gi, 'opções de'],
  [/\brota de\b/gi, 'opção de'],
  [/\brotas para\b/gi, 'opções para'],
  [/\brota para\b/gi, 'opção para'],
  [/\bcontrolos de jogo mais seguros\b/gi, 'ferramentas de jogo responsável'],
  [/\bcontroles de jogo mais seguros\b/gi, 'ferramentas de jogo responsável'],
  [/\bControles\b/g, 'Controlos'],
  [/\bcontroles\b/g, 'controlos'],
  [/\bGerenciamento\b/g, 'Gestão'],
  [/\bgerenciamento\b/g, 'gestão'],
  [/\baplicações dedicados\b/gi, 'aplicações dedicadas'],
  [/\baplicações oficiais dedicados\b/gi, 'aplicações oficiais dedicadas'],
  [/\bVietnã\b/g, 'Vietname'],
  [/\bRevisado editorialmente\b/g, 'Revisto editorialmente'],
  [/\brevisado editorialmente\b/g, 'revisto editorialmente'],
  [/\bOperadoras\b/g, 'Operadores'],
  [/\boperadoras\b/g, 'operadores'],
  [/\bOperadora\b/g, 'Operador'],
  [/\boperadora\b/g, 'operador'],
  [/\bNossa comparação\b/g, 'A nossa comparação'],
  [/\bnossa comparação\b/g, 'a nossa comparação'],
  [/\bReivindicar\b/g, 'Obter'],
  [/\breivindicar\b/g, 'obter'],
  [/\bSacar\b/g, 'Levantar'],
  [/\bsacar\b/g, 'levantar'],
  [/\bAnálise do Casino Casino\b/g, 'Análise do Casino'],
  [/\bRotas\b/g, 'Opções'],
  [/\brotas\b/g, 'opções'],
  [/\bRota\b/g, 'Opção'],
  [/\brota\b/g, 'opção'],
  [/\btítulo de boas-vindas\b/gi, 'oferta de boas-vindas'],
  [/\btítulo do bónus\b/gi, 'destaque do bónus'],
  [/\bcriptografadas\b/gi, 'com criptomoedas'],
  [/\bcriptografados\b/gi, 'com criptomoedas'],
  [/\bcriptografada\b/gi, 'com criptomoedas'],
  [/\bcriptografado\b/gi, 'com criptomoedas'],
  [/\bcrypto casino\b/gi, 'casino com criptomoedas'],
  [/\bPrêmios\b/g, 'Prémios'],
  [/\bprêmios\b/g, 'prémios'],
  [/\bPrêmio\b/g, 'Prémio'],
  [/\bprêmio\b/g, 'prémio'],
  [/\bPorcentagens\b/g, 'Percentagens'],
  [/\bporcentagens\b/g, 'percentagens'],
  [/\bPorcentagem\b/g, 'Percentagem'],
  [/\bporcentagem\b/g, 'percentagem'],
  [/\bSolicitações\b/g, 'Pedidos'],
  [/\bsolicitações\b/g, 'pedidos'],
  [/\bSolicitação\b/g, 'Pedido'],
  [/\bsolicitação\b/g, 'pedido'],
  [/\bem uma\b/gi, 'numa'],
  [/\bem um\b/gi, 'num'],
  [/\bantes de você se registar\b/gi, 'antes de se registar'],
  [/\bse você\b/gi, 'se'],
  [/\bpara você\b/gi, 'para si'],
  [/\bvocê pode\b/gi, 'pode'],
  [/\bvocê deve\b/gi, 'deve'],
  [/\bvocê precisa\b/gi, 'precisa'],
  [/\bvocê deseja\b/gi, 'pretende'],
  [/\bníveis temáticos de carreira\b/gi, 'grupos temáticos'],
  [/\bcheques bancários práticos\b/gi, 'verificações práticas de pagamentos'],
  [/\bcheques de conta\b/gi, 'verificações da conta'],
  [/\bcheques de pagamento\b/gi, 'verificações de pagamento'],
  [/\bcheques que são importantes\b/gi, 'verificações importantes'],
  [/\bFS\b/g, 'jogadas grátis'],
  [/\bGiros\b/g, 'Jogadas'],
  [/\bgiros\b/g, 'jogadas'],
  [/\bRodadas\b/g, 'Rondas'],
  [/\brodadas\b/g, 'rondas'],
  [/<h1>Revisão de ([^<]+)<\/h1>/gi, '<h1>Análise de $1</h1>'],
  [/<h1>Revisão ([^<]+)<\/h1>/gi, '<h1>Análise de $1</h1>'],
  [/>Revisão de ([^<]+)</gi, '>Análise de $1<'],
  [/>Revisão ([^<]+)</gi, '>Análise de $1<'],
  [/\bRevisão em preparação\b/g, 'Análise em preparação'],
  [/\brevisão independente\b/gi, 'análise independente'],
  [/\brevisão do operador\b/gi, 'análise do operador'],
  [/\brevisão do pagamento\b/gi, 'verificação do pagamento'],
  [/\brevisão do documento\b/gi, 'verificação dos documentos'],
  [/\bEsta análise analisa como essa oferta se compara\b/gi, 'Nesta análise, avaliamos como a oferta se articula'],
  [/\bEsta análise analisa\b/gi, 'Nesta análise, avaliamos'],
  [/\bA nossa análise analisa\b/gi, 'Na nossa análise, avaliamos'],
  [/\bao VIP\b/gi, 'com o programa VIP'],
  [/\bantes de você depositar\b/gi, 'antes de depositar'],
  [/\bantes de você se comprometer com\b/gi, 'antes de escolher'],
  [/\bantes de você contar com\b/gi, 'antes de depender de'],
  [/\bvocê realmente\b/gi, 'realmente'],
  [/\bdetalhamento promocional detalhado\b/gi, 'descrição detalhada da promoção'],
  [/\bNosso guia\b/g, 'O nosso guia'],
  [/\bNosso método\b/g, 'O nosso método'],
  [/\bNossa análise\b/g, 'A nossa análise'],
  [/\bNossa equipa\b/g, 'A nossa equipa'],
  [/\bcomo a oferta se articula com o programa VIP, ao lobby filtrado do casino, à profundidade das apostas desportivas, aos pagamentos, à AML e aos cheques práticos que importam antes de depositar\b/gi, 'como a oferta se compara com o programa VIP, o lobby do casino, a variedade das apostas desportivas, os pagamentos, os controlos AML e as verificações práticas antes de depositar'],
  [/\bcheques práticos\b/gi, 'verificações práticas'],
  [/\bcheques bancários\b/gi, 'verificações bancárias'],
  [/\bcheques de países\b/gi, 'verificações por país'],
  [/\bcheques de levantamento\b/gi, 'verificações de levantamento'],
  [/\bcheques de identidade\b/gi, 'verificações de identidade'],
  [/\bcheques de apostas\b/gi, 'verificações de apostas'],
  [/\bcheques de bónus\b/gi, 'verificações dos bónus'],
  [/\bcheques de propriedade do pagamento\b/gi, 'verificações da titularidade do método de pagamento'],
  [/\bcheques contra lavagem de dinheiro\b/gi, 'verificações contra o branqueamento de capitais'],
  [/\bcheques KYC\b/gi, 'verificações KYC'],
  [/\bcheques adicionais\b/gi, 'verificações adicionais'],
  [/\bcheques que protegem seu saldo\b/gi, 'verificações que protegem o seu saldo'],
  [/\bcheques importantes\b/gi, 'verificações importantes'],
  [/\bCheque administrativo\b/g, 'Verificação administrativa'],
  [/\bCheque de pagamento\b/g, 'Verificação de pagamentos'],
  [/\bseu próprio cheque de liquidação\b/gi, 'a sua própria verificação de liquidação'],
  [/\bNós nos concentramos\b/g, 'Concentramo-nos'],
  [/\bprimeira levantamento\b/gi, 'primeiro levantamento'],
  [/\bda levantamento\b/gi, 'do levantamento'],
  [/\buma levantamento\b/gi, 'um levantamento'],
  [/\blevantamento mais rápida\b/gi, 'levantamento mais rápido'],
  [/Os primeiros cheques devem ser aceitos por meio de cartão ou carteira eletrónica, independentemente de métodos com criptomoedas ou regionais estarem disponíveis, e se KYC, propriedade de pagamento ou verificações contra o branqueamento de capitais podem afetar o primeiro levantamento\./gi, 'Antes do primeiro depósito, confirme se são aceites opções como cartões, carteiras eletrónicas, métodos regionais ou criptomoedas e se as verificações KYC, de titularidade do pagamento ou de prevenção do branqueamento de capitais podem afetar o primeiro levantamento.'],
  [/\bBom ajuste\b/gi, 'Ideal para'],
  [/\bMelhor ajuste\b/gi, 'Ideal para'],
  [/\bPense duas vezes se\b/gi, 'Pode não ser ideal se'],
  [/\bníveis de carreira\b/gi, 'níveis VIP'],
  [/\bvisualizações de lobby\b/gi, 'pré-visualizações dos casinos'],
  [/\bAntevisões do lobby do casino\b/g, 'Pré-visualizações dos casinos'],
  [/\bO jogo pode ser viciante\./g, 'O jogo a dinheiro pode causar dependência.'],
  [/\bNa sorte\b/g, 'OnLuck'],
];

const syncHomeCardNames = (html, source) => {
  const syncClass = className => {
    const names = new Map(
      [...source.matchAll(new RegExp(`<a\\b[^>]*class=["'][^"']*${className}[^"']*["'][^>]*href=["']([^"']+)["'][\\s\\S]*?<strong>([^<]+)</strong>`, 'gi'))]
        .map(match => [match[1].replace(/^\/(?:pt\/)?/, '/'), match[2]])
    );
    return html.replace(
      new RegExp(`(<a\\b[^>]*class=["'][^"']*${className}[^"']*["'][^>]*href=["'])([^"']+)(["'][\\s\\S]*?<strong>)([^<]+)(</strong>)`, 'gi'),
      (full, before, href, middle, name, after) => {
        const englishHref = href.replace(/^\/pt(?=\/)/, '');
        return `${before}${href}${middle}${names.get(englishHref) || name}${after}`;
      }
    );
  };
  return syncClass('home-game-card').replace(
    /(<a\b[^>]*class=["'][^"']*home-casino-shot[^"']*["'][^>]*href=["'])([^"']+)(["'][\s\S]*?<strong>)([^<]+)(<\/strong>)/gi,
    (full, before, href, middle, name, after) => {
      const englishHref = href.replace(/^\/pt(?=\/)/, '');
      const match = [...source.matchAll(/<a\b[^>]*class=["'][^"']*home-casino-shot[^"']*["'][^>]*href=["']([^"']+)["'][\s\S]*?<strong>([^<]+)<\/strong>/gi)]
        .find(item => item[1] === englishHref);
      return `${before}${href}${middle}${match?.[2] || name}${after}`;
    }
  );
};

let changed = 0;
for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  const original = html;
  for (const [pattern, replacement] of replacements) html = html.replace(pattern, replacement);

  if (file === path.join(PT_ROOT, 'index.html')) {
    html = syncHomeCardNames(html, fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'));
    html = html
      .replace('RECENTEMENTE ADICIONADO AO SPINCRESTA', 'ADICIONADOS RECENTEMENTE')
      .replace('OLHE PARA DENTRO ANTES DE ESCOLHER', 'VEJA ANTES DE ESCOLHER')
      .replace('NOVIDADE EM CASINOS AVALIADOS', 'NOVIDADES DOS CASINOS ANALISADOS')
      .replace('MAIS DO QUE O BÓNUS DE TÍTULO', 'MUITO ALÉM DO BÓNUS PRINCIPAL')
      .replace('Veja todas as classificações do casino', 'Ver todos os rankings de casinos')
      .replace('Explore todos os melhores casinos', 'Explorar todos os melhores casinos');
  }

  if (file === path.join(PT_ROOT, 'top-casinos/index.html')) {
    html = html
      .replace(/Melhores casinos\. Mundialmente\./g, 'Melhores casinos online no mundo')
      .replace('CLASSIFICAÇÕES GLOBAIS DE CASINO', 'RANKINGS GLOBAIS DE CASINOS');
  }

  if (file === path.join(PT_ROOT, 'brands/gamblezen/index.html')) {
    html = html.replace(
      /O briefing pede aos jogadores que solicitem o slot atual no chat/gi,
      'A informação disponível recomenda que os jogadores confirmem no chat a promoção atualmente disponível',
    );
  }

  if (html !== original) {
    fs.writeFileSync(file, html);
    changed += 1;
  }
}

console.log(`Polished Portuguese content on ${changed}/${files.length} pages.`);
