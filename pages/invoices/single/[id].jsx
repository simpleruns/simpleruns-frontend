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
                                        text: `$${row.tolls.toFixed(2)}`,
                                        style: "tableRow",
                                        margin: [0, 5, 0, 5],
                                    },
                                    {
                                        text: row.status == 'completed' ? row.totalHour.toFixed(2) : 4,
                                        style: "tableRow",
                                        margin: [0, 5, 0, 5],
                                    },
                                    {
                                        text: `$${row.hourlyRate}`,
                                        style: "tableRow",
                                        margin: [0, 5, 0, 5],
                                    },
                                    {
                                        text: `$${row.fuelLevy.toFixed(2)}`,
                                        style: "tableRow",
                                        margin: [0, 5, 0, 5],
                                    },
                                    {
                                        text: `$${row.status == 'completed' ? row.subTotal.toFixed(2) : (row.subTotal + (4 - row.totalHour) * row.hourlyRate).toFixed(2)}`,
                                        style: "tableRow",
                                        margin: [0, 5, 0, 5],
                                    },
                                    {
                                        text: `$${row.status == 'completed' ? row.GST.toFixed(2) : ((row.subTotal + (4 - row.totalHour) * row.hourlyRate) * 0.1).toFixed(2)}`,
                                        style: "tableRow",
                                        margin: [0, 5, 0, 5],
                                    },
                                    {
                                        text: `$${row.status == 'completed' ? (row.subTotal + row.GST).toFixed(2) : (row.subTotal + (4 - row.totalHour) * row.hourlyRate + ((row.subTotal + (4 - row.totalHour) * row.hourlyRate) * 0.1)).toFixed(2)}`,
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
                                        text: `$${subTotal().toFixed(2)}`,
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
        <>
            {
                invoice && <div className='font-sans text-gray-900 font-medium p-4 md:pt-20 pt-10 pb-20 bg-white rounded-md'>
                    <div className="grid grid-cols-3 gap-2">
                        <div className='col-span-3 md:col-span-2'>
                            <img className="h-[3rem] my-[3rem]" id="imageid" crossOrigin="anonymous" src={invoice.logo ? invoice.logo.url : invoiceImage.src} alt='logo' height={100} width="auto" />
                            <h4 className="block text-sm font-medium text-gray-900 mt-2 ms-[10rem]">ABN: {invoice.abn}</h4>

                            <h4 className="block text-sm font-medium text-gray-900 mt-2">Address: {invoice.adminAddress}</h4>
                            <h4 className="block text-sm font-medium text-gray-900 mt-2">Phone: {invoice.adminPhone
                            }</h4>
                            <h4 className="block text-sm font-medium text-gray-900 mt-2">Email: {invoice.adminEmail
                            }</h4>
                        </div>

                        <div className='col-span-3 md:col-span-1'>
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
                                                        {row.tolls.toFixed(2)}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                                        {row.status == 'completed' ? row.totalHour.toFixed(2) : '4'}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                                        {row.hourlyRate}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                                        {row.fuelLevy.toFixed(2)}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                                        {row.status == 'completed' ? row.subTotal.toFixed(2) : (row.subTotal + (4 - row.totalHour) * row.hourlyRate).toFixed(2)}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                                        {row.status == 'completed' ? row.GST.toFixed(2) : ((row.subTotal + (4 - row.totalHour) * row.hourlyRate) * 0.1).toFixed(2)}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                                        {row.status == 'completed' ? (row.subTotal + row.GST).toFixed(2) : (row.subTotal + (4 - row.totalHour) * row.hourlyRate + ((row.subTotal + (4 - row.totalHour) * row.hourlyRate) * 0.1)).toFixed(2)}
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
                        <div className='col-span-12 md:col-span-7 text-center font-medium'>
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
                        <div className='col-span-12 md:col-span-2'></div>
                        <div className='col-span-12 md:col-span-3'>
                            <div className=' flex justify-between px-2 py-2  border-b border-solid border-gray-800'>
                                <span>SUBTOTAL</span>
                                <span>${subTotal().toFixed(2)}</span>
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

                    <div className="flex items-center mt-6">
                        <Link href={`/invoices/edit/${id}?start=${start}&end=${end}`} className='mr-4'>
                            <button type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center opacity-90">Edit</button>
                        </Link>
                        <button className="text-white bg-gradient-to-r transition from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex" onClick={() => downloadInvoice()}>Download <ArrowDownIcon strokeWidth={2} className="h-4 w-4 ml-2" /></button>
                    </div>
                </div>
            }

            <div className='font-sans text-gray-900 font-medium p-4 pt-20 pb-20 bg-white rounded-md mt-5'>
                <div className='grid grid-cols-5 gap-2'>
                    <div className='col-span-5 md:col-span-3 xl:col-span-4 flex flex-col justify-end mb-4 md:mb-0'>
                        <div className='grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
                            <div className='col-span-2 xl:col-span-1'>
                                <img className="h-[3rem] mt-[3rem] mb-0 xl:my-[3rem] object-contain" id="imageid" crossOrigin="anonymous" src={invoice.logo ? invoice.logo.url : invoiceImage.src} alt='logo' height={100} width="auto" />
                            </div>

                            <div className='col-span-2'>
                                <div className='flex items-center flex-wrap justify-between mb-4'>
                                    <h3 className='text-lg font-bold leading-6 text-dark mr-4'>ABN: 22609607954</h3>

                                    <h2 className='text-3xl font-bold leading-8 text-dark mr-4'>RUN SHEET NO: <span className='text-red-600 text-4xl font-medium'>10546</span></h2>
                                </div>

                                <h3 className='text-xl leading-6 text-dark mr-4 max-w-[250px]'>600 Cowpasture Road, Elizabeth Hills NSW 2171</h3>

                                <h3 className='text-xl leading-6 text-dark mr-4'><span className='font-bold'>Phone: </span>0457 407 357</h3>

                                <h3 className='text-xl leading-6 text-dark mr-4'><span className='font-bold'>Website: </span>www.spinningwheels.com.au</h3>
                            </div>
                        </div>

                        <h3 className='text-xl leading-6 text-dark mr-4 mb-2'><span className='font-bold'>CHARGE TO: </span><span className='border-b-2 border-dashed border-gray-600'>www.spinningwheels.com.au</span></h3>
                    </div>

                    <div className='col-span-5 md:col-span-2 xl:col-span-1 flex items-end'>
                        <table className='table-auto text-left w-full'>
                            <tbody>
                                <tr className='border-dark border-solid border-2'>
                                    <td className='text-sm font-semibold leading-none opacity-100 hover:opacity-90 transition-opacity py-4 pl-2'>DATE:</td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 transition-opacity py-4 px-2'>20/10/22</td>
                                </tr>
                                <tr className='border-dark border-solid border-2'>
                                    <td className='text-sm font-semibold leading-none opacity-100 hover:opacity-90 transition-opacity py-4 pl-2'>DAY:</td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 transition-opacity py-4 px-2'>Thurs</td>
                                </tr>
                                <tr className='border-dark border-solid border-2'>
                                    <td className='text-sm font-semibold leading-none opacity-100 hover:opacity-90 transition-opacity py-4 pl-2'>TRAILER REGO:</td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 transition-opacity py-4 px-2'>Jog</td>
                                </tr>
                                <tr className='border-dark border-solid border-2'>
                                    <td className='text-sm font-semibold leading-none opacity-100 hover:opacity-90 transition-opacity py-4 pl-2'>DRIVER:</td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 transition-opacity py-4 px-2'>abg</td>
                                </tr>
                                <tr className='border-dark border-solid border-2'>
                                    <td className='text-sm font-semibold leading-none opacity-100 hover:opacity-90 transition-opacity py-4 pl-2'>TRUCK REGO:</td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 transition-opacity py-4 px-2'>Lveco</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className='grid grid-cols-5 gap-2 mt-4'>
                    <div className='col-span-3 xl:col-span-4 overflow-x-scroll custom-scroller'>
                        <table className='table-auto text-center min-w-max w-full text-xs'>
                            <thead className='bg-gray-900 text-white max-h-[4rem] h-[4rem]'>
                                <tr>
                                    <th className='p-3 w-[25%]'>COMPANY NAME</th>
                                    <th className='p-3 w-[30%]'>ADDRESS</th>
                                    <th className='p-3 w-[45%]'>DETAILS</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className='col-span-2 xl:col-span-1 overflow-x-scroll custom-scroller'>
                        <table className='table-auto text-center w-full min-w-max text-xs'>
                            <thead className='bg-gray-900 text-white h-[4rem]'>
                                <tr>
                                    <th className='p-3'>ARRIVE</th>
                                    <th className='p-3'>DEPART</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr className=''>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr className=''>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr className=''>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr className=''>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr className=''>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr className=''>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr className=''>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr className=''>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr className=''>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr className=''>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr className=''>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr className=''>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr className=''>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr className=''>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr className=''>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr className=''>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr className=''>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr className=''>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr className=''>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                                <tr className=''>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 pr-2'></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className='grid grid-cols-5 gap-2 mt-4'>
                    <div className='col-span-5 md:col-span-3 xl:col-span-4 mb-4 md:mb-0'>
                        <h3 className='text-xl leading-6 font-bold text-dark mb-2'>SPECIAL INSTRUCTIONS DELAYS (Given Reasons)</h3>

                        <table className='table-auto w-full mb-4'>
                            <tbody>
                                <tr className='border-dark border-dotted border-b-2'>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] transition-opacity py-3'></td>
                                </tr>
                                <tr className='border-dark border-dotted border-b-2'>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] transition-opacity py-3'></td>
                                </tr>
                                <tr className='border-dark border-dotted border-b-2'>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] transition-opacity py-3'></td>
                                </tr>
                            </tbody>
                        </table>

                        <h3 className='text-xl leading-6 font-bold text-dark mb-2'>BREAKS-</h3>
                        <h3 className='text-xl leading-6 text-dark mb-3'>(Please ensure all RTA & Lunch breaks are taken as required)</h3>

                        <div className='overflow-x-scroll custom-scroller'>
                            <table className='table-auto min-w-max w-full text-xs'>
                                <thead>
                                    <tr>
                                        <th className='text-center border-dark border-solid border-2 p-3 w-40' colSpan={4}>PRE-TRIP INSPECTION</th>
                                        <th className='text-center border-dark border-solid border-2 p-3 w-60' colSpan={2}>CHECKS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className='border-dark border-solid border-2 p-3'>AIR TANKS DRAINED</td>
                                        <td className='border-dark border-solid border-2 p-3 w-14'></td>
                                        <td className='border-dark border-solid border-2 p-3'>LIGHTS</td>
                                        <td className='border-dark border-solid border-2 p-3 w-14'></td>
                                        <td className='border-dark border-solid border-2 p-3'>I HAVE HAD THE REQUIRED REST & SUFFICIENT SLEEP IN THE LAST 24 HOURS</td>
                                        <td className='border-dark border-solid border-2 p-3 w-14'></td>
                                    </tr>
                                    <tr>
                                        <td className='border-dark border-solid border-2 p-3'>ANY DAMAGE</td>
                                        <td className='border-dark border-solid border-2 p-3 w-14'></td>
                                        <td className='border-dark border-solid border-2 p-3'>OIL</td>
                                        <td className='border-dark border-solid border-2 p-3 w-14'></td>
                                        <td className='border-dark border-solid border-2 p-3'>I HAVE HAD THE REQUIRED REST & SUFFICIENT SLEEP IN THE LAST 48 HOURS</td>
                                        <td className='border-dark border-solid border-2 p-3 w-14'></td>
                                    </tr>
                                    <tr>
                                        <td className='border-dark border-solid border-2 p-3'>BRAKES</td>
                                        <td className='border-dark border-solid border-2 p-3 w-14'></td>
                                        <td className='border-dark border-solid border-2 p-3'>WATER</td>
                                        <td className='border-dark border-solid border-2 p-3 w-14'></td>
                                        <td className='border-dark border-solid border-2 p-3'>I AM FIT FOR DUTY</td>
                                        <td className='border-dark border-solid border-2 p-3 w-14'></td>
                                    </tr>
                                    <tr>
                                        <td className='border-dark border-solid border-2 p-3'>FUEL</td>
                                        <td className='border-dark border-solid border-2 p-3 w-14'></td>
                                        <td className='border-dark border-solid border-2 p-3'>KM&apos;S</td>
                                        <td className='border-dark border-solid border-2 p-3 w-14'></td>
                                        <td className='border-dark border-solid border-2 p-3'>ARE YOU WEARING YOUR PPE?</td>
                                        <td className='border-dark border-solid border-2 p-3 w-14'></td>
                                    </tr>
                                    <tr>
                                        <td className='border-dark border-solid border-2 p-3'>LIFTING GEAR</td>
                                        <td className='border-dark border-solid border-2 p-3 w-14'></td>
                                        <td className='border-dark border-solid border-2 p-3'>CRANE</td>
                                        <td className='border-dark border-solid border-2 p-3 w-14'></td>
                                        <td className='border-dark border-solid border-2 p-3'>DID YOU RECORD TOLLS?</td>
                                        <td className='border-dark border-solid border-2 p-3 w-14'></td>
                                    </tr>
                                    <tr>
                                        <td className='border-dark border-solid border-2 p-3' colSpan={4}></td>
                                        <td className='border-dark border-solid border-2 p-3'>DID YOU GET A NAME & SIGNATURE</td>
                                        <td className='border-dark border-solid border-2 p-3 w-14'></td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td className="bg-gray-900 text-white text-center p-3 w-full" colSpan={6}>I HAVE CARRIED OUT DAILY & WEEKLY VEHICLE CHECK</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div className='overflow-x-scroll custom-scroller'>
                            <table className='table-auto min-w-max w-full mt-4'>
                                <tbody>
                                    <tr className=''>
                                        <td className='text-xl font-bold leading-none h-[3rem] py-3 w-[180px]'>Drivers Signature:</td>
                                        <td className='text-xl font-bold leading-none h-[3rem] py-3 border-b-2 border-dashed border-gray-600 w-[60%-180px] min-w-[200px]'></td>
                                        <td className='text-xl font-bold leading-none h-[3rem] py-3 w-[115px]'>Print Name:</td>
                                        <td className='text-xl font-bold leading-none h-[3rem] py-3 border-b-2 border-dashed border-gray-600 w-[40%-115px] min-w-[200px]'></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className='col-span-5 md:col-span-2 xl:col-span-1 overflow-x-scroll custom-scroller'>
                        <table className='table-auto text-left w-full min-w-max mb-4'>
                            <tbody>
                                <tr className='border-dark border-solid border-2'>
                                    <td className='text-sm font-semibold leading-none opacity-100 hover:opacity-90 transition-opacity py-4 pl-2'>START TIME:</td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 transition-opacity py-4 px-2'>10:15AM</td>
                                </tr>
                                <tr className='border-dark border-solid border-2'>
                                    <td className='text-sm font-semibold leading-none opacity-100 hover:opacity-90 transition-opacity py-4 pl-2'>END TIME:</td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 transition-opacity py-4 px-2'>06:15AM</td>
                                </tr>
                                <tr className='border-dark border-solid border-2'>
                                    <td className='text-sm font-semibold leading-none opacity-100 hover:opacity-90 transition-opacity py-4 pl-2'>TOTAL HOURS:</td>
                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 transition-opacity py-4 px-2'>8HRS</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Invoice;