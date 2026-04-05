import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts"
import { formatCurrency, formatDate } from "../lib/utils"

// Initialize pdfMake fonts
;(pdfMake as any).vfs = pdfFonts.pdfMake.vfs

export const generateStatementPDF = (buyer: any, allocation: any, schedule: any) => {
  const totalPaid = schedule
    .filter((item: any) => item.status === 'paid')
    .reduce((sum: number, item: any) => sum + item.amount_due, 0)
  
  const balance = allocation.purchase_price - allocation.deposit_amount - totalPaid

  const docDefinition: any = {
    content: [
      { text: 'STANDVAULT STATEMENT', style: 'header' },
      { text: `Date: ${formatDate(new Date())}`, alignment: 'right' },
      { text: '\n\n' },
      
      {
        columns: [
          {
            width: '50%',
            text: [
              { text: 'Buyer Details:\n', style: 'subheader' },
              `${buyer.full_name}\n`,
              `${buyer.email}\n`,
              `${buyer.phone}\n`,
            ]
          },
          {
            width: '50%',
            text: [
              { text: 'Property Details:\n', style: 'subheader' },
              `Development: ${allocation.stand.development.name}\n`,
              `Stand Number: ${allocation.stand.stand_number}\n`,
              `Size: ${allocation.stand.size_sqm} sqm\n`,
            ],
            alignment: 'right'
          }
        ]
      },
      
      { text: '\n\nFinancial Summary', style: 'subheader' },
      {
        table: {
          widths: ['*', 'auto'],
          body: [
            ['Purchase Price', formatCurrency(allocation.purchase_price)],
            ['Deposit Paid', formatCurrency(allocation.deposit_amount)],
            ['Total Instalments Paid', formatCurrency(totalPaid)],
            [{ text: 'OUTSTANDING BALANCE', bold: true }, { text: formatCurrency(balance), bold: true, color: '#2563eb' }],
          ]
        },
        layout: 'lightHorizontalLines'
      },
      
      { text: '\n\nPayment History', style: 'subheader' },
      {
        table: {
          headerRows: 1,
          widths: ['auto', '*', 'auto', 'auto'],
          body: [
            [
              { text: 'Due Date', style: 'tableHeader' },
              { text: 'Description', style: 'tableHeader' },
              { text: 'Amount', style: 'tableHeader' },
              { text: 'Status', style: 'tableHeader' }
            ],
            ...schedule.map((item: any) => [
              formatDate(item.due_date),
              `Monthly Instalment`,
              formatCurrency(item.amount_due),
              { text: item.status.toUpperCase(), color: item.status === 'paid' ? 'green' : item.status === 'overdue' ? 'red' : 'orange' }
            ])
          ]
        }
      },
      
      { text: '\n\nDisclaimer: This is a computer-generated document and does not require a signature.', style: 'small', alignment: 'center' }
    ],
    styles: {
      header: { fontSize: 22, bold: true, color: '#111827', letterSpacing: 2 },
      subheader: { fontSize: 14, bold: true, color: '#374151', margin: [0, 10, 0, 5] },
      tableHeader: { bold: true, fontSize: 10, color: 'black' },
      small: { fontSize: 8, color: 'gray' }
    },
    defaultStyle: {
      font: 'Roboto'
    }
  }

  pdfMake.createPdf(docDefinition).download(`Statement_${buyer.full_name.replace(' ', '_')}.pdf`)
}
