import mdToPdf from './mdToPdf'

test('mdToPdf list-and-paragraphs', () => {
  expect(
    mdToPdf(`
A:
1. A1
2. A2

B:
1) B1
2) B2
`)
  ).toMatchObject([
    { text: 'A:' },
    { ol: [{ text: 'A1' }, { text: 'A2' }] },
    { text: '\nB:' },
    { ol: [{ text: 'B1' }, { text: 'B2' }] },
  ])
})

test('mdToPdf paragraphs', () => {
  expect(
    mdToPdf(`
A
B

C
`)
  ).toBe(`A
B

C`)
})

test('mdToPdf 3list', () => {
  expect(
    mdToPdf(`
Lorem ipsum dolor:
1. English Item 1
2. 周菱之想勝米月地人負株映。玲概摘更評試支経市島禁作説止資質芸。著短保陸爆川聴日城自語食今約別着。
4. 人政高同革掲年岩月生治尋問価保本。都功統栽告保報自模作健。
5. 元無安買球県逮教討禁銀生鳴見関冬。断無多月更気最英掲大氏西男定積右主身治。真日金変当適原念増要立職画悟全翼。

写迅演理:
1) 無陸米多覧護一園際武本。室極田運晶議辱名典政務大。文近写加薄輸一載円動清表政連暮。載全日場康北放牟解必許北点坊。
    南謎示賞性記見台敗変活解政線面越保覚議授。古氏体謙届写呼号帽門和主年役渡画文巨事。
2) 関時道際景察氏夜最樫名却賞億断子陽週深。脱医号化月拡帯事社作木明武高相大。
3) 播八読混磨筋稼次記小陸挙際急顧熊極藤必第。

禁前謙爆2017-2018:
    爆国交端迎際死生見子現相多産試再。芸京平終問使発厚覧復韓安経族主美:
    査護角渡再始評色座漁聞終会吉工。超任軽授旅賀朝検
    断邦声上弟。産載情野転野以間破氷既現。図初盛
    渡男載作郎県均税違泰行伊。特聞島
  `)
  ).toMatchObject([
    { text: 'Lorem ipsum dolor:' },
    {
      ol: [
        { text: 'English Item 1' },
        { text: '周菱之想勝米月地人負株映。玲概摘更評試支経市島禁作説止資質芸。著短保陸爆川聴日城自語食今約別着。' },
        { text: '人政高同革掲年岩月生治尋問価保本。都功統栽告保報自模作健。' },
        { text: '元無安買球県逮教討禁銀生鳴見関冬。断無多月更気最英掲大氏西男定積右主身治。真日金変当適原念増要立職画悟全翼。' },
      ],
    },
    { text: '\n写迅演理:' },
    {
      ol: [
        {
          text: `無陸米多覧護一園際武本。室極田運晶議辱名典政務大。文近写加薄輸一載円動清表政連暮。載全日場康北放牟解必許北点坊。
 南謎示賞性記見台敗変活解政線面越保覚議授。古氏体謙届写呼号帽門和主年役渡画文巨事。`,
        },
        { text: '関時道際景察氏夜最樫名却賞億断子陽週深。脱医号化月拡帯事社作木明武高相大。' },
        { text: '播八読混磨筋稼次記小陸挙際急顧熊極藤必第。' },
      ],
    },
    {
      text: `\n禁前謙爆2017-2018:
    爆国交端迎際死生見子現相多産試再。芸京平終問使発厚覧復韓安経族主美:
    査護角渡再始評色座漁聞終会吉工。超任軽授旅賀朝検
    断邦声上弟。産載情野転野以間破氷既現。図初盛
    渡男載作郎県均税違泰行伊。特聞島`,
    },
  ])
})

test('mdToPdf Scratch', () => {
  expect(mdToPdf('~~Scratch this.~~')).toMatchObject([
    { decoration: 'lineThrough', isPlain: false, text: 'Scratch this.', type: 'text' },
  ])
})

test('mdToPdf emphasis', () => {
  expect(mdToPdf('*a* _b_')).toMatchObject([
    { italic: true, text: 'a' },
    { isPlain: true, text: ' ' },
    { italic: true, text: 'b' },
  ])
  expect(mdToPdf('**a** __b__')).toMatchObject([
    { bold: true, text: 'a' },
    { isPlain: true, text: ' ' },
    { bold: true, text: 'b' },
  ])
})

test('mdToPdf items and trim', () => {
  expect(
    mdToPdf(`
  Hi
  - A
  - B

  1. First ordered list item
  2. Another item
  `)
  ).toMatchObject([
    { text: 'Hi' },
    { ul: [{ text: 'A' }, { text: 'B' }] },
    {
      ol: [{ text: 'First ordered list item' }, { text: 'Another item' }],
    },
  ])
})

test('mdToPdf link', () => {
  expect(mdToPdf('xx http://www.google.com yy')).toBe('xx http://www.google.com yy')
})
