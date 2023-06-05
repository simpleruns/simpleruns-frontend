import React, { useEffect, useState } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import moment from 'moment';
import { useAtom } from "jotai";
import { Typography } from '@material-tailwind/react';
import { ArrowDownIcon } from "@heroicons/react/24/solid";
import { useRouter } from 'next/router';
import Link from "next/link";

import { idAtom } from "helpers/authorize";
import { instance } from 'helpers/axios';

import invoiceImage from "public/assets/img/invoice.png";

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
        console.log("item: ")
        invoice.deliveries.forEach((item) => {
            if (item.status == 'completed') {
                value += item.subTotal;
            } else {
                value += item.subTotal + (4 - item.totalHour) * item.hourlyRate;
            }
        });
        return value;
    }

    const logo = () => {
        base64Image = document && getBase64Image(document.getElementById("imageid"));
        return {
            image: `${base64Image}`,
            margin: [0, 0, 0, 40],
            height: 30,
            fit: ['auto', 30],
        }
    }

    function getBase64Image(img) {
        var canvas = document.createElement("canvas");
        canvas.width = (img.width * 40) / img.height;
        canvas.height = 40;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
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
                                        text: `Address: ${invoice.adminAddress}\n`,
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
                                                text: `Phone: \n`,
                                                style: "subHeader",
                                                bold: true,
                                            },
                                            {
                                                text: `Address: \n\n`,
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
                                                text: `${invoice.customerPhone}\n`,
                                                style: "subHeader",
                                            },
                                            {
                                                text: `${invoice.customerAddress}\n`,
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
                        ...(invoice.deliveries
                            ? invoice.deliveries.map((row, index) => {
                                const isLast = index === invoice.deliveries.length - 1;
                                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50 0";
                                return [
                                    {
                                        text: moment(row.endTime).format('YYYY-MM-DD'),
                                        style: "tableRow",
                                        margin: [0, 5, 0, 5],
                                    },
                                    {
                                        text: row.status == 'completed' ? row.ref : '',
                                        style: "tableRow",
                                        margin: [0, 5, 0, 5],
                                    },
                                    {
                                        text: row.status == 'completed' ? (row.job + ' - LOAD ' + row.load + ' ' + row.description.split(' ').map(word => {
                                            const suffixes = ['st', 'rd', 'nd', 'th'];
                                            if (suffixes.includes(word.toLowerCase().slice(-2))) {
                                                return word.slice(0, -2);
                                            } else {
                                                return word[0];
                                            }
                                        }).filter(word => word !== '').join('')) : '',
                                        style: "tableRow",
                                        margin: [0, 5, 0, 5],
                                    },
                                    {
                                        text: `$${row.tolls.toFixed(3)}`,
                                        style: "tableRow",
                                        margin: [0, 5, 0, 5],
                                    },
                                    {
                                        text: row.status == 'completed' ? row.totalHour.toFixed(3) : 4,
                                        style: "tableRow",
                                        margin: [0, 5, 0, 5],
                                    },
                                    {
                                        text: `$${row.hourlyRate}`,
                                        style: "tableRow",
                                        margin: [0, 5, 0, 5],
                                    },
                                    {
                                        text: `$${row.fuelLevy.toFixed(3)}`,
                                        style: "tableRow",
                                        margin: [0, 5, 0, 5],
                                    },
                                    {
                                        text: `$${row.status == 'completed' ? row.subTotal.toFixed(3) : (row.subTotal + (4 - row.totalHour) * row.hourlyRate).toFixed(3)}`,
                                        style: "tableRow",
                                        margin: [0, 5, 0, 5],
                                    },
                                    {
                                        text: `$${row.status == 'completed' ? row.GST.toFixed(3) : ((row.subTotal + (4 - row.totalHour) * row.hourlyRate) * 0.1).toFixed(3)}`,
                                        style: "tableRow",
                                        margin: [0, 5, 0, 5],
                                    },
                                    {
                                        text: `$${row.status == 'completed' ? (row.subTotal + row.GST).toFixed(3) : (row.subTotal + (4 - row.totalHour) * row.hourlyRate + ((row.subTotal + (4 - row.totalHour) * row.hourlyRate) * 0.1)).toFixed(3)}`,
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
                                        text: `$${subTotal().toFixed(3)}`,
                                        style: "tableFooter",
                                    },
                                ],
                                [
                                    {
                                        text: "GST",
                                        style: "tableFooter",
                                    },
                                    {
                                        text: `$${(subTotal() * 0.1).toFixed(3)}`,
                                        style: "tableFooter",
                                    },
                                ],
                                [
                                    {
                                        text: "TOTAL",
                                        style: "tableFooterBold",
                                    },
                                    {
                                        text: `$${(subTotal() * 1.1).toFixed(3)}`,
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
    const [user, __] = useAtom(idAtom);
    const [invoice, setInvoice] = useState({});
    const router = useRouter();
    const { id, start, end } = router.query;

    useEffect(() => {
        (user && id && start && end) && instance.get(`/invoices/single/${id}?start=${start}&end=${end}&user=${user}`)
            .then((res) => {
                setInvoice(res.data);
            }).catch(error => {
                console.log(error.message);
            });
    }, [router, id]);

    const subTotal = () => {
        var value = 0;
        invoice.deliveries && invoice.deliveries.forEach((item) => {
            if (item.status == 'completed') {
                value += item.subTotal;
            } else {
                value += item.subTotal + (4 - item.totalHour) * item.hourlyRate;
            }
        });
        return value;
    }

    const downloadInvoice = () => {
        const pdf = generateInvoice(invoice);
        pdf.download(`Invoice-${invoice.invoiceNumber}.pdf`);
    };

    return (
        invoice && <div className='font-sans text-gray-900 font-medium'>
            <div className="grid grid-cols-3 gap-2">
                <div className='sm:col-span-2'>
                    <img className="h-[3rem] my-[3rem]" id="imageid" crossOrigin="anonymous" src={invoice.logo ? invoice.logo.url : invoiceImage.src} alt='logo' height={100} width="auto" />
                    <h4 className="block text-sm font-medium text-gray-900 mt-2 ms-[10rem]">ABN: {invoice.abn}</h4>

                    <h4 className="block text-sm font-medium text-gray-900 mt-2">Address: {invoice.adminAddress}</h4>
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
                            <h4 className="block text-sm font-medium text-gray-900 mt-2">Invoice-#:</h4>
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
                            invoice.deliveries ? invoice.deliveries.map((row, index) => {
                                const isLast = index === invoice.deliveries.length - 1;
                                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50 0";

                                return (
                                    <tr key={"delivery" + index}>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-medium">
                                                {moment(row.endTime).format('YYYY-MM-DD')}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-medium">
                                                {row.status == 'completed' ? row.ref : ''}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-medium">
                                                {
                                                    row.status == 'completed' ? row.job + ' - LOAD ' + row.load + ' ' : ''
                                                }
                                                {
                                                    row.status == 'completed' ? row.description.split(' ').map(word => {
                                                        const suffixes = ['st', 'rd', 'nd', 'th'];
                                                        if (suffixes.includes(word.toLowerCase().slice(-2))) {
                                                            return word.slice(0, -2);
                                                        } else {
                                                            return word[0];
                                                        }
                                                    }).filter(word => word !== '').join('') : ''
                                                }
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-medium">
                                                {row.tolls.toFixed(3)}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-medium">
                                                {row.status == 'completed' ? row.totalHour.toFixed(3) : '4'}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-medium">
                                                {row.hourlyRate}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-medium">
                                                {row.fuelLevy.toFixed(3)}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-medium">
                                                {row.status == 'completed' ? row.subTotal.toFixed(3) : (row.subTotal + (4 - row.totalHour) * row.hourlyRate).toFixed(3)}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-medium">
                                                {row.status == 'completed' ? row.GST.toFixed(3) : ((row.subTotal + (4 - row.totalHour) * row.hourlyRate) * 0.1).toFixed(3)}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-medium">
                                                {row.status == 'completed' ? (row.subTotal + row.GST).toFixed(3) : (row.subTotal + (4 - row.totalHour) * row.hourlyRate + ((row.subTotal + (4 - row.totalHour) * row.hourlyRate) * 0.1)).toFixed(3)}
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
                        <span>${subTotal().toFixed(3)}</span>
                    </div>
                    <div className=' flex justify-between px-2 py-2  border-b border-solid border-gray-800'>
                        <span>GST</span>
                        <span>${(subTotal() * 0.1).toFixed(3)}</span>
                    </div>
                    <div className=' flex justify-between px-2 py-2 bg-gray-200 border-b border-solid border-gray-800 '>
                        <span className='font-semibold'>TOTAL</span>
                        <span className='font-semibold'>${(subTotal() * 1.1).toFixed(3)}</span>
                    </div>
                    <div className=' flex justify-center px-2 py-2 '>
                        <span className=' font-semibold'>The Total price includes GST</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center mt-6">
                <Link href={`/invoices/edit/${id}?start=${start}&end=${end}`} className='mr-4'>
                    <button type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center opacity-90">Edit</button>
                </Link>
                <button className="text-white bg-gradient-to-r transition from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex" onClick={() => downloadInvoice()}>Download <ArrowDownIcon strokeWidth={2} className="h-4 w-4 ml-2" /></button>
            </div>
        </div >
    );
};

export default Invoice;