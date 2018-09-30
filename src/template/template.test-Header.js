export default (data, template, util) => ({
  columns: [
    {
      image: 'http://via.placeholder.com/100x100',
      text: 'dataUrl image 150x100',
      width: 150,
    },

    [
      {
        text: 'Receipt',
        style: ['invoiceTitle', { fontSize: template.Font_Size }],
        width: '*',
      },
      {
        stack: [
          {
            columns: [
              {
                text: 'Receipt #',
                style: 'invoiceSubTitle',
                width: '*',
              },
              {
                text: `${data.number}`,
                style: 'invoiceSubValue',
                width: 100,
              },
            ],
          },
          {
            columns: [
              {
                text: 'Date Issued',
                style: 'invoiceSubTitle',
                width: '*',
              },
              {
                text: util.dateFnsFormat(data.timeAt, 'YYYY-MM-DD'),
                style: 'invoiceSubValue',
                width: 100,
              },
            ],
          },
          {
            columns: [
              {
                text: 'Due Date',
                style: 'invoiceSubTitle',
                width: '*',
              },
              {
                text: util.dateFnsFormat(data.timeAt, 'YYYY-MM-DD'),
                style: 'invoiceSubValue',
                width: 100,
              },
            ],
          },
        ],
      },
    ],
  ],
})
