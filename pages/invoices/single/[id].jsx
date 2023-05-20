import React, { useEffect } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Typography } from '@material-tailwind/react';
import { ArrowDownIcon } from "@heroicons/react/24/solid";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const headers = [
    { text: 'Date', key: 'date' },
    { text: 'Ref#', key: 'ref' },
    { text: 'Description', key: 'description' },
    { text: 'Tolls', key: 'tolls' },
    { text: 'Hours', key: 'hours' },
    { text: 'Rate', key: 'rate' },
    { text: 'Fuel Levy<br/>@15.00%', key: 'fuel' },
    { text: 'SubTotal', key: 'subtotal' },
    { text: 'GST', key: 'gst' },
    { text: 'Total', key: 'total' },
];

const generateInvoice = (invoice) => {
    var base64Image;

    const subTotal = () => {
        var value = 0;
        invoice.invoiceData.forEach((item) => {
            value += item.subTotal;
        });
        return value;
    }

    const logo = () => {
        base64Image = document && getBase64Image(document.getElementById("imageid"));
        return {
            image: `${base64Image}`,
            margin: [0, 0, 0, 0],
            fit: ['auto', 100],
        }
    }

    function getBase64Image(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        return dataURL.replace(/^data:image\/(png|jpg);base64Image,/, "");
    }

    const docDefinition = {
        content: [
            {
                columns: [
                    {
                        width: "66%",
                        stack: [
                            logo(),
                            {
                                text: [
                                    {
                                        text: `ABN: ${invoice.abn}\n`,
                                        style: "subHeader",
                                    },
                                    {
                                        text: `${invoice.adminAddress}\n`,
                                        style: "subHeader",
                                    },
                                    {
                                        text: `Phone: ${invoice.adminPhone}\n`,
                                        style: "subHeader",
                                    },
                                    {
                                        text: `Email: ${invoice.adminEmail}\n`,
                                        style: "subHeader",
                                    },
                                ]
                            }
                        ],
                    },
                    {
                        stack: [
                            {
                                text: [
                                    {
                                        text: `Tax Invoice`,
                                        style: "header",
                                        bold: true,
                                    },
                                ],
                            },
                            {
                                columns: [
                                    {
                                        width: '25%',
                                        text: [
                                            {
                                                text: `Date: \n`,
                                                style: "subHeader",
                                                bold: true,
                                            },
                                            {
                                                text: `Invoice #: \n`,
                                                style: "subHeader",
                                                bold: true,
                                            },
                                            {
                                                text: "For: \n\n",
                                                style: "subHeader",
                                                bold: true,
                                            },
                                            {
                                                text: `Bill To: \n\n`,
                                                style: "subHeader",
                                                bold: true,
                                            },
                                            {
                                                text: `Address: \n\n`,
                                                style: "subHeader",
                                                bold: true,
                                            },
                                            {
                                                text: `Phone: \n`,
                                                style: "subHeader",
                                                bold: true,
                                            },
                                        ]
                                    },
                                    {
                                        width: '75%',
                                        text: [
                                            {
                                                text: `${invoice.date}\n`,
                                                style: "subHeader",
                                            },
                                            {
                                                text: `${invoice.invoiceNumber}\n`,
                                                style: "subHeader",
                                            },
                                            {
                                                text: "Transport Services Provided\nTransport Division\n",
                                                style: "subHeader",
                                            },
                                            {
                                                text: `${invoice.customerName}\nTransport Division\n`,
                                                style: "subHeader",
                                            },
                                            {
                                                text: `${invoice.customerAddress}\n`,
                                                style: "subHeader",
                                            },
                                            {
                                                text: `${invoice.customerPhone}\n`,
                                                style: "subHeader",
                                            },
                                        ]
                                    }
                                ],
                            }
                        ],
                        width: "33%",
                    },
                ],
            },
            {
                table: {
                    headerRows: 1,
                    widths: ["auto", "auto", "*", "auto", "auto", "auto", "auto", "auto", "auto", "auto"],
                    body: [
                        [
                            {
                                text: "Date",
                                style: "tableHeader",
                            },
                            {
                                text: "Ref",
                                style: "tableHeader",
                            },
                            {
                                text: "Description",
                                style: "tableHeader",
                            },
                            {
                                text: "Tolls",
                                style: "tableHeader",
                            },
                            {
                                text: "Hours",
                                style: "tableHeader",
                            },
                            {
                                text: "Rate",
                                style: "tableHeader",
                            },
                            {
                                text: "Fuel",
                                style: "tableHeader",
                            },
                            {
                                text: "SubTotal",
                                style: "tableHeader",
                            },
                            {
                                text: "GST",
                                style: "tableHeader",
                            },
                            {
                                text: "Total",
                                style: "tableHeader",
                            },
                        ],
                        ...(invoice.invoiceData.length
                            ? invoice.invoiceData.map((row, index) => {
                                const isLast = index === invoice.invoiceData.length - 1;
                                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50 0";
                                return [
                                    {
                                        text: row.date,
                                        style: "tableRow",
                                        margin: [0, 5, 0, 5],
                                    },
                                    {
                                        text: row.ref,
                                        style: "tableRow",
                                        margin: [0, 5, 0, 5],
                                    },
                                    {
                                        text: row.description,
                                        style: "tableRow",
                                        margin: [0, 5, 0, 5],
                                    },
                                    {
                                        text: `$${row.tolls}`,
                                        style: "tableRow",
                                        margin: [0, 5, 0, 5],
                                    },
                                    {
                                        text: row.hours,
                                        style: "tableRow",
                                        margin: [0, 5, 0, 5],
                                    },
                                    {
                                        text: `$${row.rate}`,
                                        style: "tableRow",
                                        margin: [0, 5, 0, 5],
                                    },
                                    {
                                        text: `$${row.fuel}`,
                                        style: "tableRow",
                                        margin: [0, 5, 0, 5],
                                    },
                                    {
                                        text: `$${row.subTotal}`,
                                        style: "tableRow",
                                        margin: [0, 5, 0, 5],
                                    },
                                    {
                                        text: `$${row.gst}`,
                                        style: "tableRow",
                                        margin: [0, 5, 0, 5],
                                    },
                                    {
                                        text: `$${row.total}`,
                                        style: "tableRow",
                                        margin: [0, 5, 0, 5],
                                    },
                                ];
                            })
                            : [
                                [
                                    {
                                        text: "No Invoices to show…",
                                        style: "tableRow",
                                        colSpan: 10,
                                        margin: [0, 5, 0, 5],
                                    },
                                ],
                            ]),
                    ],
                },
                margin: [0, 10, 0, 10],
            },
            {
                columns: [
                    {
                        stack: [
                            {
                                text: [
                                    {
                                        text: `All invoices are payable within 14 days to ${invoice.adminCompany}.\n`,
                                        style: "subHeader",
                                        alignment: 'center',
                                        margin: [0, 10, 0, 10],
                                    },
                                    {
                                        text: `${invoice.adminName} - ${invoice.adminPhone}\nEmail: ${invoice.adminEmail}\n`,
                                        style: "subHeader",
                                        alignment: 'center',
                                        margin: [0, 10, 0, 10],
                                    },
                                ]
                            },
                            {
                                columns: [
                                    {
                                        text: "Direct\nDeposit\n",
                                        style: "subHeader",
                                        margin: [5, 5, 5, 5],
                                        width: "50%",
                                        alignment: "right",
                                    },
                                    {
                                        text: `Bank: ${invoice.adminBank}\nAccountName: ${invoice.adminName}\nBSB: ${invoice.adminBSB}\nAccount No: ${invoice.adminAccountNo}\n`,
                                        style: "subHeader",
                                        margin: [5, 5, 5, 5],
                                        width: "50%",
                                        alignment: "left",
                                    },
                                ]
                            }
                        ],
                        width: "60%",
                        margin: [0, 0, 0, 0],
                    },
                    {
                        columns: [
                        ],
                        width: "15%",
                        margin: [0, 0, 0, 0],
                    },
                    {
                        table: {
                            widths: ["*", "auto"],
                            body: [
                                [
                                    {
                                        text: "SUBTOTAL",
                                        style: "tableFooter",
                                    },
                                    {
                                        text: `$${subTotal()}`,
                                        style: "tableFooter",
                                    },
                                ],
                                [
                                    {
                                        text: "GST",
                                        style: "tableFooter",
                                    },
                                    {
                                        text: `$${(subTotal() * 0.1).toFixed(2)}`,
                                        style: "tableFooter",
                                    },
                                ],
                                [
                                    {
                                        text: "TOTAL",
                                        style: "tableFooterBold",
                                    },
                                    {
                                        text: `$${(subTotal() * 1.1).toFixed(2)}`,
                                        style: "tableFooterBold",
                                    },
                                ],
                                [
                                    {
                                        text: "The Total price includes GST",
                                        style: "subHeader",
                                        colSpan: 2,
                                        margin: [0, 10, 0, 0],
                                    },
                                    {},
                                ],
                            ],
                        },
                        width: "25%",
                        alignment: "right",
                        margin: [0, 0, 0, 0],
                    },
                ]
            }
        ],
        styles: {
            header: {
                fontSize: 20,
                color: "#000",
                bold: true,
                margin: [10, 10, 10, 10],
            },
            subHeader: {
                fontSize: 8,
                color: "#000",
                margin: [20, 10, 20, 10],
            },
            tableHeader: {
                fontSize: 8,
                bold: true,
                color: "#000",
                fillColor: "#f2f2f2",
                margin: [5, 5, 5, 5],
                alignment: 'center',
            },
            tableRow: {
                fontSize: 8,
                color: "#000",
                margin: [5, 5, 5, 5],
                alignment: 'center',
            },
            tableFooter: {
                fontSize: 8,
                bold: true,
                color: "#000",
                margin: [5, 5, 5, 5],
                alignment: 'center',
            },
            tableFooterBold: {
                fontSize: 8,
                bold: true,
                color: "#000",
                fillColor: "#f2f2f2",
                margin: [5, 5, 5, 5],
                alignment: 'center',
            },
        },
    }

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);

    return pdfDocGenerator;
};

const Invoice = () => {
    const invoice = {
        customerName: 'Advanced Precast',
        customerAddress: '499-501 Victoria St Wetherill Park, NSW 2164',
        customerPhone: '02 9756 5631',
        invoiceNumber: '5024',
        abn: '22609607954',
        adminAddress: '600 Cowpature rd Hoxton Park, NSW 2171',
        adminPhone: '0466865383',
        adminEmail: 'james@spinningwheels.com.au',
        adminBank: 'ANZ',
        adminName: 'James Daniel',
        adminBSB: '012-292',
        adminAccountNo: '297279624',
        adminCompany: 'Spinning Wheels Transport',
        date: '23/10/2022',
        invoiceData: [
            { date: '17.10.22', ref: 'AA3344', description: 'PM FT - ADV ST MARYS -> ADV WP', tolls: 25.83, hours: 4.75, rate: 115, fuel: 81.94, subTotal: 654.02, gst: 65.40, total: 719.42 },
            { date: '17.10.22', ref: 'AA3344', description: 'PM FT - ADV ST MARYS -> ADV WP', tolls: 25.83, hours: 4.75, rate: 115, fuel: 81.94, subTotal: 654.02, gst: 65.40, total: 719.42 },
            { date: '17.10.22', ref: 'AA3344', description: 'PM FT - ADV ST MARYS -> ADV WP', tolls: 25.83, hours: 4.75, rate: 115, fuel: 81.94, subTotal: 654.02, gst: 65.40, total: 719.42 },
            { date: '17.10.22', ref: 'AA3344', description: 'PM FT - ADV ST MARYS -> ADV WP', tolls: 25.83, hours: 4.75, rate: 115, fuel: 81.94, subTotal: 654.02, gst: 65.40, total: 719.42 },
        ]
    };

    const subTotal = () => {
        var value = 0;
        invoice.invoiceData.forEach((item) => {
            value += item.subTotal;
        });
        return value;
    }

    const downloadInvoice = () => {
        const pdf = generateInvoice(invoice);
        pdf.download();
    };

    return (
        <div className='font-sans text-gray-900 font-medium'>
            <div className="grid grid-cols-3 gap-2">
                <div className='sm:col-span-2'>
                    <img className="h-[10rem]" id="imageid" src="/assets/img/logo.png" alt='logo' height={100} width="auto" />
                    <h4 className="block text-sm font-medium text-gray-900 mt-2 ms-[10rem]">ABN: {invoice.abn}</h4>

                    <h4 className="block text-sm font-medium text-gray-900 mt-2" dangerouslySetInnerHTML={{ __html: invoice.adminAddress }}></h4>
                    <h4 className="block text-sm font-medium text-gray-900 mt-2">Phone: {invoice.adminPhone
                    }</h4>
                    <h4 className="block text-sm font-medium text-gray-900 mt-2">Email: {invoice.adminEmail
                    }</h4>
                </div>

                <div className='sm:col-span-1'>
                    <h2 className="block text-4xl font-medium text-gray-900 mt-2 uppercase text-right">Tax Invoice</h2>

                    <div className='grid grid-cols-4'>
                        <div className='col-span-1'>
                            <h4 className="block text-sm font-medium text-gray-900 mt-2">Date:</h4>
                        </div>
                        <div className='col-span-3'>
                            <h4 className="block text-sm font-medium text-gray-900 mt-2 text-right">{invoice.date
                            }</h4>
                        </div>
                        <div className='col-span-1'>
                            <h4 className="block text-sm font-medium text-gray-900 mt-2">Invoice #:</h4>
                        </div>
                        <div className='col-span-3'>
                            <h4 className="block text-sm font-medium text-gray-900 mt-2">{invoice.invoiceNumber}</h4>
                        </div>
                        <div className='col-span-1'>
                            <h4 className="block text-sm font-medium text-gray-900 mt-2">For:</h4>
                        </div>
                        <div className='col-span-3'>
                            <h4 className="block text-sm font-medium text-gray-900 mt-2">Transport Services Provided<br />Transport Division</h4>
                        </div>
                        <div className='col-span-1'>
                            <h4 className="block text-sm font-medium text-gray-900 mt-2">Bill To:</h4>
                        </div>
                        <div className='col-span-3'>
                            <h4 className="block text-sm font-medium text-gray-900 mt-2">{invoice.customerName}<br />Transport Division</h4>
                        </div>
                        <div className='col-span-1'>
                            <h4 className="block text-sm font-medium text-gray-900 mt-2">Address:</h4>
                        </div>
                        <div className='col-span-3'>
                            <h4 className="block text-sm font-medium text-gray-900 mt-2">{invoice.customerAddress}</h4>
                        </div>
                        <div className='col-span-1'>
                            <h4 className="block text-sm font-medium text-gray-900 mt-2">Phone:</h4>
                        </div>
                        <div className='col-span-3'>
                            <h4 className="block text-sm font-medium text-gray-900 mt-2">{invoice.customerPhone}</h4>
                        </div>
                    </div>
                </div>
            </div>

            <div className="overflow-x-scroll custom-scroller px-0 border-b-2 border-solid border-gray-800 mt-4">
                <table className="mt-4 w-full min-w-max table-auto text-left mb-40">
                    <thead>
                        <tr className='border-dark border-solid border-y-2 px-0'>
                            {headers.map((head) => (
                                <th
                                    key={head.key}
                                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                                >
                                    <h3
                                        className="flex items-center justify-between gap-2 text-sm font-semibold leading-none opacity-100 hover:opacity-90 transition-opacity"
                                        dangerouslySetInnerHTML={{ __html: head.text }}
                                    ></h3>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            invoice.invoiceData.length ? invoice.invoiceData.map((row, index) => {
                                const isLast = index === invoice.invoiceData.length - 1;
                                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50 0";

                                return (
                                    <tr key={"delivery" + index}>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-medium">
                                                {row.date}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-medium">
                                                {row.ref}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-medium">
                                                {row.description}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-medium">
                                                {row.tolls}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-medium">
                                                {row.hours}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-medium">
                                                {row.rate}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-medium">
                                                {row.fuel}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-medium">
                                                {row.subTotal}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-medium">
                                                {row.gst}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-medium">
                                                {row.total}
                                            </Typography>
                                        </td>
                                    </tr>
                                )
                            }) :
                                <tr>
                                    <td>
                                        <Typography variant="small" color="blue-gray" className="font-semibold py-10 px-4">
                                            No Invoices to show...
                                        </Typography>
                                    </td>
                                </tr>
                        }
                    </tbody>
                </table>
            </div>

            <div className='grid grid-cols-12 mt-4'>
                <div className='col-span-7 text-center font-medium'>
                    <p>All invoices are payable within 14 days to {invoice.adminCompany}.</p>
                    <p>If you have any questions concerning this invoice please contact.</p>
                    <p>{invoice.adminName} - {invoice.adminPhone}</p>
                    <p className=" mb-10">Email:{invoice.adminEmail}</p>
                    <div className='grid grid-cols-12 items-center text-left'>
                        <div className='col-span-3 '>
                            <p className=" ml-2">Direct<br />Deposit</p>
                        </div>
                        <div className='col-span-9'>
                            <p>Bank:{invoice.adminBank}</p>
                            <p>AccountName: {invoice.adminName}</p>
                            <p>BSB: {invoice.adminBSB} Account No:{invoice.adminAccountNo}</p>
                        </div>
                    </div>
                </div>
                <div className='col-span-2'></div>
                <div className='col-span-3'>
                    <div className=' flex justify-between px-2 py-2  border-b border-solid border-gray-800'>
                        <span>SUBTOTAL</span>
                        <span>${subTotal()}</span>
                    </div>
                    <div className=' flex justify-between px-2 py-2  border-b border-solid border-gray-800'>
                        <span>GST</span>
                        <span>${(subTotal() * 0.1).toFixed(2)}</span>
                    </div>
                    <div className=' flex justify-between px-2 py-2 bg-gray-200 border-b border-solid border-gray-800 '>
                        <span className='font-semibold'>TOTAL</span>
                        <span className='font-semibold'>${(subTotal() * 1.1).toFixed(2)}</span>
                    </div>
                    <div className=' flex justify-center px-2 py-2 '>
                        <span className=' font-semibold'>The Total price includes GST</span>
                    </div>
                </div>
            </div>

            <button className="text-white bg-gradient-to-r transition from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-6 mx-auto flex" onClick={() => downloadInvoice()}>Download <ArrowDownIcon strokeWidth={2} className="h-4 w-4 ml-2" /></button>
        </div >
    );
};

export default Invoice;