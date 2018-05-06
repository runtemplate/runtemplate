import Header from './template.test-Header'
import Notes from './template.test-Notes'

export default {
  Header: {
    fontSize: 16,
    ibTemplateStr: Header,
  },

  Table: {
    Item: {
      ibTemplateStr: `[
        [
          {
            text: "{{type}}",
            style: { bold: true },
          },
          {
            text: "{{name}}",
            style: { italics: true, fontSize: 11 },
          },
        ],
        {
          text: "{{quantity}}",
          style: { margin: [0, 5, 0, 5], alignment: 'center' },
        },
        {
          text: "\${{price}}",
          style: { margin: [0, 5, 0, 5], alignment: 'center' },
        },
      ],`,
    },
    ibTemplateStr: `{
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
          {{#each items}}
          {{{ render ../template.Item }}}
          {{/each}}
        ],
      },
    }`,
  },

  Total: {
    ibTemplateStr: `[
      { text: "\${{sumBy items 'price'}}" }
    ]`,
  },
  Notes: { ibTemplateStr: Notes },

  layout: ['Header', 'Table', 'Total', 'Notes'],

  ibTemplateStr: `
  { content: {{{ render template }}} }
  `,
}
