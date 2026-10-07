# Curadoria Instagram — ID Hairstudio

## Análise antes da implementação

Foram lidas as skills locais `frontend-design` e `webapp-testing`, todos os
componentes, CSS, configuração Vite, HTML e workflow de deployment. Não existem
AGENTS.md ou skills específicos dentro deste projeto. O site é uma única página,
com âncoras Studio, Lookbook, Services e Book. Foram preservadas a ordem das
secções, tipografia, paleta (#EDE8D0, preto, branco, verde neon e azul) e animações.

A pasta Instagram disponível no workspace é `/home/rrego/gallery-dl/instagram`.
Todas as **226 fotografias** foram inspecionadas visualmente em folhas de contacto
numeradas, com orientação e resolução; a shortlist foi revista em maior escala.
Também foram inspecionados frames dos 67 vídeos para substituir os reels genéricos.
As fotografias totalizam 82,3 MB; predominam retratos de 1440 × 1800, mas existem
imagens quadradas de 4096 × 4096 e quatro fotografias horizontais de 1440 × 812.

## Universos visuais encontrados

- **Editorial clean:** cortes curtos, alfaiataria, fundos cinza/branco, retratos
  a preto e branco; formas claras e composição controlada.
- **Natural e quotidiano:** louros com dimensão, camadas e ondas, fotografados
  no salão com madeira, plantas e espelhos iluminados.
- **Construção e backstage:** mãos a trabalhar, clips, secções, tranças,
  ponytails suspensos e cabelo envolvido em cordão. A técnica torna-se visível.
- **Experimental e cor:** pontas laranja com argolas, face paint azul, styling
  fúcsia, volumes assimétricos e referências punk/fashion.
- **Fashion com luz dramática:** tranças escultóricas, looks grungy, fundos
  escuros, contrastes fortes e editoriais com sombra marcada.
- **Humano e ocasião:** preparação de noivas, styling de eventos, sorrisos,
  momentos espontâneos e retratos de maternidade, em cores quentes ou monocromia.
- **Publicações gráficas:** capas e páginas de revistas, slogans, colagens,
  polaroids, capturas com texto e interface. Não são intercambiáveis com fotos.

Não foi aplicado nenhum filtro comum. As cores e luz originais foram mantidas.

## Matching final

Os identificadores seguintes correspondem à configuração em
`src/content/salonImages.js`. A origem exata de cada ficheiro está em
`src/content/salon-media.json`, juntamente com alt, resolução e pontos de foco.

| Secção | Fotografias / sets | Intenção e adaptação |
| --- | --- | --- |
| Hero | `sculptural-blue` | Penteado com cordão branco sobre azul. Foto inteira numa composição lateral; texto em preto separado. Em tablet/mobile, imagem acima da marca, afastada da navegação fixa. |
| Studio / About | `studio-interior`, `consultation` | Apresentar o espaço real e a relação entre profissional e cliente. Díptico no bege existente; crop da consulta preserva a cabeça do profissional e as ondas. |
| Lookbook / Gallery | `short-editorial`, `blonde-layers`, `braided-editorial`, `runway-shapes` | Sequência de corte clean para cor natural, tranças e formas escultóricas. Rail existente preservado, cards mais verticais e pontos de foco próprios. |
| Neon | `orange-spikes`, `blue-editorial`, `pink-texture` | Punk laranja → construção editorial azul → textura fúcsia. Tríptico sob o poster neon existente; em mobile, duas imagens e uma terceira central. Foi preferido o plano azul mais aberto ao close-up que já cortava o topo do cabelo. |
| In the chair | `behind-the-chair` | Fotografia a preto e branco através de uma porta, com profissional a trabalhar. Substitui o loop genérico; texto separado da ação e sem crop da foto. |
| Services | `precision-cut`, `dimensional-blonde`, `event-waves` | Corte curto com contorno legível; louro com raízes e dimensão; ondas polidas para ocasião. Alturas equilibradas em desktop, formatos verticais em mobile. |
| Reels | `blonde-in-progress`, `sculpture-in-progress` | Dois vídeos reais: acabamento de louro e construção com cordão. Posters fotográficos dos mesmos universos, responsive; frames dos vídeos preservados com contain. |

São **16 fotografias únicas** e **2 vídeos reais**, sem repetição do mesmo ficheiro
entre secções. Um corte curto aparece em duas perspetivas, separado pelas áreas
Neon e In the chair. O louro do lookbook é um set diferente do louro dos serviços.

## Material não utilizado

As 210 fotografias restantes continuam intactas na pasta de origem.

- Variações quase idênticas dos louros, do espelho, retratos e preparação:
  apenas o plano mais claro ou mais expressivo de cada seleção.
- Capas de revistas, páginas com margens, slogans e colagens: texto embutido,
  hierarquia concorrente com o website ou composição pouco adaptável a cards.
- Capturas com menus/interface e screenshots de testemunhos: ruído visual e
  qualidade inadequada para imagem editorial principal.
- Fashion de corpo inteiro e imagens centradas em roupa/sapatos: o cabelo perde
  protagonismo nos espaços disponíveis. Incluem editoriais pastel e alfaiataria.
- Retratos de maternidade e grandes séries de casamento/evento: conteúdo real,
  mas pouco relevante para a narrativa principal escolhida e redundante face
  às imagens de styling e trabalho já incluídas.
- Selfies, momentos menos nítidos e planos escuros com pouca definição do cabelo:
  menor legibilidade, sobretudo em thumbnails.
- As quatro fotos horizontais de produção com flores não foram escolhidas só
  pela proporção: o resultado escultórico em azul representa melhor o cabelo.
- Não foi identificado nenhum retrato de equipa suficientemente inequívoco
  para ser apresentado como tal; as fotos de profissionais em ação cumprem a
  função humana de About sem inventar nomes ou funções.

## Assets e carregamento

Foram retirados **5 ficheiros fotográficos genéricos**, antes usados em **8 locais**
(hero, quatro cards e três posters), e **3 vídeos genéricos**. Dois vídeos foram
substituídos por reels reais e o terceiro por uma fotografia de backstage.
Os ficheiros antigos foram removidos do public para não seguirem no build.

As fotos selecionadas têm quatro variantes WebP (360, 640, 960 e largura original),
sem upscaling, com qualidade 84. `srcSet`/`sizes` selecionam a dimensão adequada;
dimensões intrínsecas e aspect ratios reservam espaço. Apenas o hero é eager e
tem prioridade alta; restantes fotos são lazy. Posters usam as mesmas variantes.
Os vídeos foram comprimidos para H.264, sem áudio e com faststart; mantêm as
dimensões originais. Carregamento e playback continuam associados ao viewport.
Não foram adicionadas dependências ao projeto.

Para regenerar usando Pillow e ffmpeg já disponíveis no ambiente:

```sh
python scripts/prepare-salon-media.py --source-root /home/rrego/gallery-dl/instagram
```

Todos os alts descrevem o conteúdo efetivamente observado. Não foram atribuídos
nomes de pessoas ou eventos com base apenas na imagem.

As variantes em largura original totalizam 2,45 MB, contra 4,26 MB dos JPEGs
selecionados (cerca de 43% menos). O conjunto de variantes de 640 px totaliza
667 KB; o browser só carrega a variante adequada a cada posição e densidade.

## Verificação final

- Revisão visual de todas as secções em Chrome: desktop 1440 × 1000,
  tablet 820 × 1180 e mobile 390 × 844, incluindo os extremos da gallery.
- 22 verificações de browser passaram: fontes responsive e alts, prioridade
  do hero, menu/Escape, rail por teclado, movimento reduzido, playback/pausa,
  pausa fora do viewport, fallback fotográfico em falha de vídeo e ausência de
  exceções JavaScript. Sem overflow a 320, 390, 768, 820, 1024, 1440 e 1920 px.
- `npm run build` e `git diff --check` passaram. As 64 variantes de fotografia
  e os dois vídeos foram verificados no output de produção.
- O projeto não define lint, TypeScript ou uma suite de testes. A revisão
  utilizou Chrome headless através de CDP; Playwright Python não está instalado
  neste ambiente. Não foi instalada nenhuma dependência para contornar isso.

As capturas e resultados da revisão estão em `/tmp/idstudio-review`.
