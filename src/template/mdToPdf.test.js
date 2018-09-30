import mdToPdf from './mdToPdf'

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
