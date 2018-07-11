import Header from './template.test-Header'
import Notes from './template.test-Notes'

export default {
  Header: {
    Font_Size: 16,
    render: Header,
  },

  Item: {
    render(data) {
      return [
        [
          {
            text: `${data.type}`,
            style: { bold: true },
          },
          {
            text: `${data.name}`,
            style: { italics: true, fontSize: 11 },
          },
        ],
        {
          text: `${data.quantity}`,
          style: { margin: [0, 5, 0, 5], alignment: 'center' },
        },
        {
          text: `$${data.price}`,
          style: { margin: [0, 5, 0, 5], alignment: 'center' },
        },
      ]
    },
  },

  Table: {
    render(data, template, util) {
      return {
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 80],
          body: [
            [
              {
                text: 'Item',
                style: 'itemsHeader',
              },
              {
                text: 'Quantity',
                style: ['itemsHeader', 'center'],
              },
              {
                text: 'Price',
                style: ['itemsHeader', 'center'],
              },
            ],
            ...util.map(data.items, item => util.render(item, template.Item)),
          ],
        },
      }
    },
  },

  Total: {
    render(data, template, util) {
      return [{ text: `$${util.sumBy(data.items, 'price')}` }]
    },
  },
  Notes: { render: Notes },

  layout: ['Header', 'Table', 'Total', 'Notes'],

  render(data, template, util) {
    return { content: util.render(data, template) }
  },
}
