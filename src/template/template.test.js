// import _ from 'lodash'

/* eslint-disable no-template-curly-in-string */

import { renderTemplate, applyPatch, getPatch } from '.'
import testTemplate from './template.test-template'

test('extend-extract', () => {
  const base = {
    $let: { Header: { Font_Size: 16 } },
    in: {
      content: [
        { table: { widths: ['*', 'auto', 80], body: [['1', '2', '3']] } },
        { text: { $eval: 'Notes.Title' }, style: { margin: [0, 50, 0, 3] } },
      ],
    },
  }

  const edited = {
    $let: { Header: { Font_Size: 20 } },
    in: {
      content: [
        { table: { widths: ['*', 'auto', 80], body: [] } },
        { text: { $eval: 'Notes.Title' }, style: { margin: [0, 0, 0, 0] } },
        { text: { $eval: 'Notes.Detail' }, style: { margin: [0, 0, 0, 0] } },
      ],
    },
  }

  const patch = getPatch(base, edited)
  expect(patch).toEqual([
    { op: 'replace', path: '/in/content/1/style/margin/3', value: 0 },
    { op: 'replace', path: '/in/content/1/style/margin/1', value: 0 },
    { op: 'remove', path: '/in/content/0/table/body/0' },
    { op: 'add', path: '/in/content/2', value: { style: { margin: [0, 0, 0, 0] }, text: { $eval: 'Notes.Detail' } } },
    { op: 'replace', path: '/$let/Header/Font_Size', value: 20 },
  ])

  expect(applyPatch(base, patch)).toEqual(edited)
})

test('$formatter', () => {
  expect(renderTemplate({ text: '**a** __b__', $formatter: 'markdown' }, {})).toMatchObject([
    { bold: true, isPlain: false, text: 'a', type: 'text' },
    { text: ' ', type: 'text' },
    { bold: true, isPlain: false, text: 'b', type: 'text' },
  ])
})

test('lodash functions', () => {
  expect(renderTemplate({ content: '${_.sumBy(items, "price")}' }, { items: [{ price: 1 }, { price: 2 }] })).toEqual({
    content: '3',
  })
})

test('renderTemplate', () => {
  const base = {
    $let: { page: { size: 'A5', orientation: 'portrait' } },
    in: { pageSize: { $eval: 'page.size' }, pageOrientation: { $eval: 'page.orientation' } },
  }
  const t = applyPatch(base, { op: 'replace', path: '/$let/page/size', value: 'A4' })
  expect(renderTemplate(t, {})).toEqual({ pageSize: 'A4', pageOrientation: 'portrait' })
})

test('testTemplate', () => {
  expect(
    renderTemplate(testTemplate, {
      timeAt: new Date('2019-01-01'),
      number: 'Num1',
      items: [{ type: 'Type1', name: 'Name1', quantity: 1, price: 8 }, { type: 'Type1', name: 'Name2', quantity: 1, price: 2 }],
    })
  ).toEqual({
    content: [
      { style: { fontSize: 'A5' }, text: 'Receipt' },
      'Num1',
      '2019-01-01',
      {
        table: {
          body: [['Item', 'Quantity', 'Price'], ['Type1 Name1', '1', '$8'], ['Type1 Name2', '1', '$2']],
          headerRows: 1,
          widths: ['*', 'auto', 80],
        },
      },
      '10',
      'Some notes goes here \n Notes second line',
    ],
    pageOrientation: 'portrait',
    pageSize: 'A5',
  })
})
