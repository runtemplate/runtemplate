/* eslint-disable no-template-curly-in-string */

export default {
  $let: { Font_Size: 16, Page_Size: 'A5', Page_Orientation: 'portrait' },
  in: {
    content: [
      // Header:
      {
        text: 'Receipt',
        style: { fontSize: { $eval: 'Page_Size' } },
      },
      '${number}',
      '${dateFns.format(timeAt, "YYYY-MM-DD")}',

      // Table:
      {
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 80],
          body: {
            $flatten: [
              [['Item', 'Quantity', 'Price']],
              {
                $map: { $eval: 'items' },
                'each(item)': ['${item.type} ${item.name}', '${item.quantity}', { $eval: '"$" + str(item.price)' }],
              },
            ],
          },
        },
      },

      // Total:
      '${_.sumBy(items, "price")}',

      // Notes:
      'Some notes goes here \n Notes second line',
    ],
    pageSize: { $eval: 'Page_Size' },
    pageOrientation: { $eval: 'Page_Orientation' },
  },
}
