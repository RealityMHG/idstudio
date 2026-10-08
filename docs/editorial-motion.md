# ID Hairstudio — evolução editorial e motion

A base continua a ser a versão com curadoria Instagram: mesma ordem de secções,
conteúdo, quatro famílias tipográficas, palette e fotografias. A seleção de
16 fotografias e 2 vídeos foi preservada. Não foi acrescentada uma biblioteca.

## Estudo da referência

Referência: https://spotlight.i-d.co/nike, consultada no Chrome em 8 outubro 2026.
O browser foi usado para percorrer a página inteira, primeiro por posições e
posteriormente com eventos de wheel lentos (~230 px) e rápidos (~2100 px).
Também foi inspecionada a composição mobile e o DOM durante as transições.

Padrões observados:

- Hero fotográfico de grande escala e close crop, com elementos gráficos
  sobrepostos. Um elemento gráfico acompanha o scroll a aproximadamente 10%
  da deslocação da página: cria profundidade sem deslocar a fotografia toda.
- Alternância entre preto e azul claro, retratos full-screen, pausas de texto,
  fotografias pequenas e dípticos. Os blocos não têm uma altura uniforme.
- Quotes serif com quebras deliberadas, em contraste com títulos sans e
  legendas pequenas. Algumas frases são reveladas palavra a palavra com
  deslocação vertical curta e blur que converge de ~10 px para 0.
- Galerias horizontais num wrapper sticky: as fotografias atravessam o ecrã
  durante um percurso vertical longo. Camadas internas deslocam-se em sentidos
  opostos e com amplitudes diferentes.
- Recortes gráficos e fotografias assimétricas, parallax e rotações locais.
  As composições alternam proximidade, escala, espaço vazio e densidade.
- O site carrega uma integração Lenis. Nos eventos rápidos observou-se uma
  pequena diferença entre a posição imediatamente amostrada e a posição final.

A tradução para o ID usa escala, hierarquia, permanência, contraponto de
velocidades e variedade fotográfica. Não utiliza branding, layouts ou assets
da referência.

Não foram adaptados: blur animado, rotações fortes, flashes, inércia adicional,
substituição do scroll nativo, divisão de todas as frases em caracteres ou uma
máscara artificial da pessoa. O blur tem custo de pintura; rotações e flashes
competiriam com o cabelo; o scroll nativo preserva controlo e navegação. Dois
reveals tipográficos escolhidos são suficientes para criar contraste.

## Plano e implementação por secção

| Secção | Composição / motion | Função |
| --- | --- | --- |
| Hero | Fotografia e wordmark a atravessar a imagem; entrance recortada, caption com atraso, escala até 1.045 e deslocações curtas ao sair | Transformar a abertura numa capa, preservando a fotografia e a marca |
| Studio | Pausa bege, quatro linhas explícitas com máscaras; foto do espaço grande junto à margem e consulta menor, desalinhada; parallax oposto e overscan mínimo | Dar tempo à mensagem e tornar o espaço real parte do editorial |
| Lookbook | Tipografia monumental, rail existente com quatro larguras e alturas, offsets e espaço entre frames; palavra desloca-se lentamente, fotos pequenas têm deslocações verticais distintas | Criar uma sequência de imagens com mudanças de escala, mantendo o título como referência |
| NEON | Poster, órbitas e linhas originais; fotos avançam sobre a margem inferior, azul maior, fúcsia sobreposto; type e prints com sentidos opostos, marquee maior | Dar energia à fotografia punk e experimental sem acrescentar efeitos de nightclub |
| In the chair | Fotografia a preto e branco cresce de 0.88 a 1 dentro de um palco sticky; texto permanece e desloca-se apenas 32 px | Pausa cinematográfica depois do NEON e foco na técnica |
| Services | Títulos grandes e imagens com três ritmos verticais; informação estática | Recuperar clareza para escolher um serviço |
| Reels | Título serif e dois vídeos alinhados à mesma altura; larguras proporcionais aos formatos originais 4:5 e 9:16, sem barras nem crop nos vídeos | Mostrar o processo real; manter playback, pause e fallback existentes |
| Booking | Palavras reveladas dentro de máscaras; CTA com preenchimento neon em hover/focus | Encerrar a narrativa e encaminhar para a marcação |

Os novos reveals são one-shot: 850 ms / stagger 75 ms nas linhas do Studio;
650 ms / stagger 35 ms nas palavras de Booking. Disparam ao entrar na região
visível, com margem inferior de 7%. Conteúdo estático é o estado base.

O Lookbook desktop ocupa 280svh, incluindo o palco de 100svh; o percurso
horizontal é proporcional ao scroll vertical, sem easing/inércia no scrub.
In the chair ocupa 170svh, com 70svh de progressão enquanto o palco permanece.
Os outros movimentos usam a passagem completa da secção pelo viewport.

## Mobile, touch e acessibilidade

- Mobile até 780 px: Lookbook transforma-se num ensaio vertical, alternando
  largura e margem. Não existe pin nem necessidade de hover para ver as fotos.
- Tablet com touch: rail nativo horizontal e fotografia assimétrica; sem os
  deslocamentos de desktop. Services alterna foto e texto em mobile.
- Hero mantém a proporção da fotografia nos viewports verificados; o ponto de
  foco e a altura disponível preservam os ponytails. Landscape tem regras próprias.
- NEON conserva sobreposição, mas as legendas ficam fora das zonas cobertas.
- `prefers-reduced-motion` é observado em CSS e JS, incluindo alterações live.
  Texto visível, sem parallax, zoom, pin ou autoplay do marquee. Em desktop o
  Lookbook passa a um rail nativo; em mobile mantém o ensaio vertical.
- Texto visual dividido é `aria-hidden`; a frase completa permanece uma única
  vez na árvore de acessibilidade. As fotografias conservam os alts da curadoria.
- Teclado: Home/End/setas continuam a controlar o rail desktop e reduzido.
  Menu, Escape, restauração de foco e controlos de vídeo foram preservados.
- A pausa do NEON congela também a sua coreografia de scroll. Os vídeos mantêm
  playback manual com movimento reduzido e pausa fora do viewport.

## Implementação e performance

`useEditorialMotion` usa IntersectionObserver, listeners passivos e um rAF
apenas quando há eventos. Mede todas as secções ativas antes de escrever as
variáveis CSS. Não atualiza estado React durante scroll e não mantém um loop
contínuo. ResizeObserver acompanha mudanças de layout. Limpa observers,
listeners, hints e propriedades ao desmontar ou alterar a preferência.

O controller do Lookbook foi extraído e mantém teclado e fallback nativo.
A largura do track e distância do pin são medidas em resize; por frame apenas
se lê a posição da secção. Hints `will-change` existem perto do viewport.
Os novos efeitos animam transform/opacity; não animam tracking, layout ou blur.
O desenho SVG breve e os controlos de media existentes foram preservados.

Mantêm-se WebP, srcSet, dimensões intrínsecas, lazy loading e prioridade do Hero.
`sizes` acompanha agora as larguras de cada frame, sobretudo as pequenas fotos
lado a lado em mobile. Não foram adicionadas fotografias, vídeos ou dependências.

Baseline desta tarefa: JS 54.53 kB gzip, CSS 5.95 kB gzip. O incremento é de
1.16 kB JS + 1.35 kB CSS comprimidos (JS final 55.69 kB, CSS final 7.30 kB).

## Verificação

- Build Vite e `git diff --check` passaram. O projeto não define lint,
  typecheck ou uma suite de testes própria.
- 59 verificações automatizadas através de Chrome/CDP: progressão do Hero,
  reveals, espaços, rail, sticky, teclado, pausa, preferência live, menu,
  vídeos, fast scroll, libertação de hints e ausência de exceções JS.
- Sem overflow e sem quebra/crop incorreto do Hero a 320×740, 390×844,
  540×900, 768×1024, 820×1180, 1024×768, 1440×1000, 1920×1080,
  667×375 e 1440×600.
- Revisão visual completa em desktop 1440×1000, tablet touch 820×1180 e
  mobile 390×844, com imagens carregadas; estados reduzidos também capturados.
- Preview do build de produção verificado em quatro formatos, incluindo
  768×1024 e landscape: assets carregados, separação entre quote e wordmark,
  navegação Book por teclado, reveal de Booking e preenchimento/foco do CTA.
- Trace local de quatro percursos de 1.8 s: medianas 16.7 ms e p95 16.7–16.8 ms,
  sem frames acima de 25 ms. Lookbook, NEON e In the chair tiveram zero eventos
  Layout durante essas amostras. Houve pintura ocasional, sobretudo no Hero;
  não é uma garantia de FPS em todos os dispositivos nem medição de campo.

Capturas, scripts, relatórios de performance e resultados estão em
`/tmp/idstudio-motion-review`. A pasta `before` guarda a baseline fotografada.
A curadoria anterior continua documentada em `docs/instagram-curation.md`.

## Comparação final

“Ainda parece um website standard com boas animações ou parece realmente uma
experiência editorial?”

A primeira passagem já mudou as escalas e o ritmo, mas o Hero ainda separava o
ID da fotografia e o NEON ainda parecia um poster seguido de galeria. A segunda
passagem fez a fotografia interromper o D, aproximou os prints da tipografia e
corrigiu a legibilidade das legendas. O resultado usa uma capa, um ensaio de
fotografia, uma parede em movimento, um poster e uma pausa cinematográfica,
enquanto as secções de serviço e marcação continuam claras. A identidade do
ID e o conteúdo da versão anterior continuam reconhecíveis.

Na revisão pedida pelo utilizador, o ID gigante bege foi retirado do Hero.
A fotografia, o wordmark branco e os restantes movimentos foram mantidos.
Os reels foram depois alinhados no desktop, com formatos nativos e a mesma
altura, retirando as barras causadas pelo frame 3:4. Os posters preenchem o
frame e o mobile mantém a sequência vertical.

A revisão final com Humanizer abrangeu todos os textos do website, incluindo
legendas, controlos, acessibilidade e metadados. A apresentação do Studio,
serviços e marcação foi simplificada; os slogans da marca foram preservados.
O scroll completo e o encaixe dos novos textos foram verificados em desktop,
tablet e mobile, mantendo os links e o alinhamento dos reels.

## Ficheiros principais

- `src/components/Hero.jsx`: capa, planos tipográficos e convite de scroll.
- `src/components/ContentSection.jsx`: composição de Studio, chair, serviços,
  reels e Booking; ordem e conteúdo preservados.
- `src/components/HorizontalLookbook.jsx`: controller extraído, frames,
  teclado, touch/short-screen e movimento reduzido.
- `src/components/StatementPoster.jsx`: prints, pausa e sizes do NEON.
- `src/components/EditorialText.jsx`: máscaras de linhas/palavras e frase
  completa para acessibilidade.
- `src/components/EditorialPhoto.jsx`: frames fotográficos e legendas.
- `src/hooks/useEditorialMotion.js` e `src/App.jsx`: observers e coordenação.
- `src/index.css`: art direction, responsive, motion e micro-interações de
  fotografia, links, preenchimento neon de Book/WhatsApp e focus.
