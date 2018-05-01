export default `{
  "columns": [
    {
      "image": "http://via.placeholder.com/100x100",
      "text": "dataUrl image 150x100",
      "width": 150,
    },

    [
      {
        "text": "Receipt",
        "style": ["invoiceTitle", { "fontSize": {{template.fontSize}} }],
        "width": '*',
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
                text: '{{number}}',
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
                text: '{{dateFnsFormat timeAt "YYYY-MM-DD"}}',
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
                text: '{{dateFnsFormat timeAt "YYYY-MM-DD"}}',
                style: 'invoiceSubValue',
                width: 100,
              },
            ],
          },
        ],
      },
    ],
  ],
}`
