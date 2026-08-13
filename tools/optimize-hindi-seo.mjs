#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const updates = {
  'hi/about/index.html': {
    description: 'SpinCresta की संपादकीय प्रक्रिया, समीक्षा मानदंड, स्रोत, विशेषज्ञ जांच और कैसीनो जानकारी को अपडेट करने का तरीका जानें।',
  },
  'hi/casinos-and-betting/index.html': {
    description: 'कैसीनो और सट्टेबाजी ब्रांड A-Z देखें। उपलब्ध देश, बोनस, भुगतान विधियां, विस्तृत समीक्षाएं और आधिकारिक ऑफर लिंक की तुलना करें।',
  },
  'hi/brands/fortunica-es/index.html': {
    description: 'स्पेन के लिए Fortunica की समीक्षा: बोनस, गेम, भुगतान, निकासी, KYC, मोबाइल अनुभव और उपलब्धता की जानकारी देखें।',
  },
  'hi/brands/fortunica-nl/index.html': {
    description: 'नीदरलैंड के लिए Fortunica की समीक्षा: बोनस, गेम, भुगतान, निकासी, KYC, मोबाइल अनुभव और उपलब्धता की जानकारी देखें।',
  },
  'hi/brands/ggbet/index.html': {
    title: 'GG.BET समीक्षा 2026 | कैसीनो, ईस्पोर्ट्स और भुगतान',
    description: 'GG.BET समीक्षा: कैसीनो, ईस्पोर्ट्स, बोनस, भुगतान, निकासी, KYC, मोबाइल अनुभव और क्षेत्रीय उपलब्धता की जानकारी देखें।',
  },
  'hi/brands/spinboss/index.html': {
    title: 'SpinBoss समीक्षा 2026 | कैसीनो, बेटिंग और भुगतान',
  },
  'hi/brands/wildsino/index.html': {
    title: 'Wildsino समीक्षा 2026 | कैसीनो, बेटिंग और भुगतान',
  },
  'hi/online-casinos/south-korea/index.html': {
    title: 'दक्षिण कोरिया के सर्वश्रेष्ठ ऑनलाइन कैसीनो 2026 | KRW गाइड',
  },
  'hi/online-casinos/united-states/index.html': {
    title: 'अमेरिका के सर्वश्रेष्ठ ऑनलाइन कैसीनो 2026 | USD गाइड',
  },
  'hi/responsible-gambling/index.html': {
    title: 'ज़िम्मेदारी से खेलना | SpinCresta सुरक्षा गाइड',
  },
};

const decode = value => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'");
const encode = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
const plain = value => decode(value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
const replaceMeta = (html, selector, value) => html.replace(
  new RegExp(`<meta\\b(?=[^>]*${selector})[^>]*>`, 'i'),
  match => match.replace(/\bcontent=(['"])[\s\S]*?\1/i, `content="${encode(value)}"`),
);

let changed = 0;
for (const [relative, update] of Object.entries(updates)) {
  const file = path.join(ROOT, relative);
  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  const currentTitle = plain(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '');
  const descriptionTag = html.match(/<meta\b(?=[^>]*\bname=['"]description['"])[^>]*>/i)?.[0] || '';
  const currentDescription = decode(descriptionTag.match(/\bcontent=(['"])([\s\S]*?)\1/i)?.[2] || '');
  const title = update.title || currentTitle;
  const description = update.description || currentDescription;

  if (title !== currentTitle) {
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
    html = replaceMeta(html, `\\bproperty=['"]og:title['"]`, title);
    html = replaceMeta(html, `\\bname=['"]twitter:title['"]`, title);
  }
  if (description !== currentDescription) {
    html = replaceMeta(html, `\\bname=['"]description['"]`, description);
    html = replaceMeta(html, `\\bproperty=['"]og:description['"]`, description);
    html = replaceMeta(html, `\\bname=['"]twitter:description['"]`, description);
  }

  html = html.replace(/<script\b[^>]*type=['"]application\/ld\+json['"][^>]*>([\s\S]*?)<\/script>/gi, (full, json) => {
    try {
      const data = JSON.parse(json);
      const nodes = data['@graph'] || [data];
      const webPage = nodes.find(node => node?.['@type'] === 'WebPage');
      if (webPage) {
        webPage.name = title;
        webPage.description = description;
      } else if (data?.['@type'] === 'WebPage') {
        data.name = title;
        data.description = description;
      }
      return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`;
    } catch {
      return full;
    }
  });

  if (html !== before) {
    fs.writeFileSync(file, html);
    changed += 1;
  }
}

console.log(`Optimized Hindi SEO: ${changed} pages updated.`);
