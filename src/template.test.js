import { compile, render, extend } from './template'
import defaultTemplate from './template.test-data'

test('basic', () => {
  const t1 = extend({ Header: { fontSize: 22 } }, defaultTemplate)
  expect(t1).toMatchObject({
    Header: {
      fontSize: 22,
    },
    layout: ['Header', 'Table', 'Total', 'Notes'],
  })
  const compiledT1 = compile(t1)

  const data = {
    number: 'Receipt-Number',
    timeAt: '2018-04-15T11:09:55.713Z',
    items: [
      {
        type: 'Product',
        name: 'A',
        quantity: 1,
        price: 12,
      },
      {
        type: 'Product',
        name: 'B',
        quantity: 1,
        price: 1,
      },
    ],
  }

  const dataOut = [
    [
      { style: 'itemsHeader', text: 'Item' },
      { style: ['itemsHeader', 'center'], text: 'Quantity' },
      { style: ['itemsHeader', 'center'], text: 'Price' },
    ],
    [
      [{ style: { bold: true }, text: 'Product' }, { style: { fontSize: 11, italics: true }, text: 'A' }],
      { style: { alignment: 'center', margin: [0, 5, 0, 5] }, text: '1' },
      { style: { alignment: 'center', margin: [0, 5, 0, 5] }, text: '$12' },
    ],
    [
      [{ style: { bold: true }, text: 'Product' }, { style: { fontSize: 11, italics: true }, text: 'B' }],
      { style: { alignment: 'center', margin: [0, 5, 0, 5] }, text: '1' },
      { style: { alignment: 'center', margin: [0, 5, 0, 5] }, text: '$1' },
    ],
  ]
  const o1 = render(compiledT1, data)
  expect(o1.content[0].columns[1][0].style[1]).toEqual({ fontSize: 22 })
  expect(o1.content[0].columns[1][1].stack[2]).toEqual({
    columns: [{ style: 'invoiceSubTitle', text: 'Due Date', width: '*' }, { style: 'invoiceSubValue', text: '2018-04-15', width: 100 }],
  })
  expect(o1.content[1].table.body).toMatchObject(dataOut)

  // header
  expect(o1.content[0]).toMatchObject({
    columns: [
      { text: 'dataUrl image 150x100', width: 150 },
      [
        { style: ['invoiceTitle', { fontSize: 22 }], text: 'Receipt', width: '*' },
        {
          stack: [
            {
              columns: [
                { style: 'invoiceSubTitle', text: 'Receipt #', width: '*' },
                { style: 'invoiceSubValue', text: 'Receipt-Number', width: 100 },
              ],
            },
            {
              columns: [
                { style: 'invoiceSubTitle', text: 'Date Issued', width: '*' },
                { style: 'invoiceSubValue', text: '2018-04-15', width: 100 },
              ],
            },
            {
              columns: [
                { style: 'invoiceSubTitle', text: 'Due Date', width: '*' },
                { style: 'invoiceSubValue', text: '2018-04-15', width: 100 },
              ],
            },
          ],
        },
      ],
    ],
  })

  const out = render(compile(extend({ Header: { fontSize: 22 } }, defaultTemplate)), data)
  expect(out.content[1].table.body).toMatchObject(dataOut)

  expect(out.content[3][1].text).toEqual('Some notes goes here \n Notes second line')
})
