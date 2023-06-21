import React, { useEffect, useState } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import moment from 'moment';
import { useAtom } from "jotai";
import { Typography } from '@material-tailwind/react';
import { useRouter } from 'next/router';
import Link from "next/link";

import { idAtom } from "helpers/authorize";
import { instance } from 'helpers/axios';

import { ArrowDownIcon } from "@heroicons/react/24/solid";
import { RxCheck } from "react-icons/rx";

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
        invoice && invoice.deliveries && invoice.deliveries.forEach((item) => {
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

    const logo1 = () => {
        base64Image = document && getBase64Image(document.getElementById("imageid"));
        return {
            image: `${base64Image}`,
            margin: [0, 0, 0, 40],
            height: 15,
            fit: ['auto', 15],
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
                                        text: row.status == 'completed' ? /*row.job + ' - LOAD ' + row.load + ' ' +*/ row.description.split(' ').map(word => {
                                            const suffixes = ['st', 'rd', 'nd', 'th'];
                                            if (suffixes.includes(word.toLowerCase().slice(-2))) {
                                                return word.slice(0, -2);
                                            } else {
                                                return word[0];
                                            }
                                        }).filter(word => word !== '').join('').match(/.{1,36}/g).join('\n') : '',
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
                                        style: "tableFooter",
                                        colSpan: 2,
                                        alignment: 'center',
                                    },
                                    {
                                    },
                                ],
                            ],
                        },
                        width: "25%",
                        alignment: "right",
                        margin: [0, 0, 0, 0],
                    },
                ]
            },
            {
                stack: [
                    {
                        text: [
                            {
                                text: `1. By accepting and utilizing the payment invoice, the payee agrees to fulfill the payment obligation(s) outlined in the invoice within the specified due date.\n`,
                                style: "subHeaderList",
                                margin: [20, 10, 20, 10],
                            },
                            {
                                text: `2. In the event of late payment, the payee shall be charged an additional interest of 5% per day on the outstanding amount until the payment is recieved in full. Please refer to `,
                                style: "subHeaderList",
                                margin: [20, 10, 20, 10],
                            },
                            {
                                text: `Spinning Wheels Transport payment policy part(6) payments`,
                                style: "subHeaderListATag",
                                link: 'https://simpleruns.com/wp-content/uploads/2023/06/Terms-and-Conditions-Spinning-Wheels-Transport-Pty-Ltd.pdf',
                                tag: 'yTag',
                            },
                            {
                                text: ` - clause 6.4\n`,
                                style: "subHeaderList",
                                margin: [20, 10, 20, 10],
                            },
                            {
                                text: `3. Late payment charges will be calculated daily starting from the day immediately following the due date until the outstanding payment is settled in full.\n`,
                                style: "subHeaderList",
                                margin: [20, 10, 20, 10],
                            },
                            {
                                text: `4. The payment invoice is non-transferable, and the payee shall not assign, transfer, or delegate their payment obligations to any third party without the explicit written consent of the invoice issuer.\n`,
                                style: "subHeaderList",
                                margin: [20, 10, 20, 10],
                            },
                            {
                                text: `5. If the payment remains outstanding beyond the specified due date, Spinning Wheels Transport reserves the right to take appropriate legal action(s) or engage the services of a debt collection agency to recover the outstanding amount. All associated costs incurred in the process will be the payee’s responsibility.\n`,
                                style: "subHeaderList",
                                margin: [20, 10, 20, 10],
                            },
                        ]
                    }
                ],
                margin: [0, 30, 0, 0]
            },
            ...(invoice.deliveries
                ? invoice.deliveries.map((row, index) => {
                    const time1 = JSON.parse(row.runsheet)[JSON.parse(row.runsheet).length - 1].arriveTime;
                    const time2 = JSON.parse(row.runsheet)[0].startTime;
                    const [hours1, minutes1] = time1.split(':').map(Number);
                    const [hours2, minutes2] = time2.split(':').map(Number);

                    const totalMinutes1 = hours1 * 60 + minutes1;
                    const totalMinutes2 = hours2 * 60 + minutes2;

                    const differenceInMinutes = totalMinutes1 - totalMinutes2;

                    const hours = Math.floor(differenceInMinutes / 60);
                    const minutes = differenceInMinutes % 60;

                    const difference = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

                    return [
                        {
                            text: '',
                            pageBreak: 'before',
                        },
                        {
                            columns: [
                                {
                                    width: "80%",
                                    stack: [
                                        {
                                            columns: [
                                                {
                                                    width: "35%",
                                                    stack: [
                                                        logo1(),
                                                    ],
                                                    margin: [0, 30, 30, 0]
                                                },
                                                {
                                                    width: "65%",
                                                    stack: [
                                                        {
                                                            columns: [
                                                                {
                                                                    width: "35%",
                                                                    text: `ABN: ${invoice.abn}`,
                                                                    style: "runHeader",
                                                                    margin: [0, 5, 0, 0]
                                                                },
                                                                {
                                                                    width: "65%",
                                                                    text: `RUN SHEET NO: ${index + 1}`,
                                                                    style: "runHeader1",
                                                                    alignment: "right",
                                                                },
                                                            ],
                                                            margin: [0, 0, 0, 15],
                                                        },
                                                        {
                                                            text: [
                                                                {
                                                                    text: `${invoice.adminAddress}\n`,
                                                                    style: "runHeader",
                                                                },
                                                                {
                                                                    text: `Phone: ${invoice.adminPhone}\n`,
                                                                    style: "runHeader",
                                                                },
                                                                {
                                                                    text: `Website: ${invoice.adminWebSite}\n`,
                                                                    style: "runHeader",
                                                                },
                                                            ]
                                                        }
                                                    ],
                                                },
                                            ]
                                        },
                                        {
                                            columns: [
                                                {
                                                    width: "auto",
                                                    text: "CHAEGE TO: ",
                                                    style: "borderDot",
                                                    margin: [0, 0, 0, 5]
                                                },
                                                {
                                                    width: "auto",
                                                    text: invoice.customerName,
                                                    style: "borderDot",
                                                    margin: [0, 0, 0, 0]
                                                },
                                            ]
                                        }
                                    ],
                                    margin: [0, 15, 0, 0]
                                },
                                {
                                    table: {
                                        widths: ["50%", "50%"],
                                        body: [
                                            [
                                                {
                                                    text: "DATE: ",
                                                    style: "tableFooter",
                                                },
                                                {
                                                    text: moment(row.endTime).format('DD/MM/YYYY'),
                                                    style: "tableFooter",
                                                },
                                            ],
                                            [
                                                {
                                                    text: "DAY: ",
                                                    style: "tableFooter",
                                                },
                                                {
                                                    text: moment(row.endTime).format('ddd'),
                                                    style: "tableFooter",
                                                },
                                            ],
                                            [
                                                {
                                                    text: "TRAILOR REGO",
                                                    style: "tableFooter",
                                                },
                                                {
                                                    text: row.trailerID,
                                                    style: "tableFooter",
                                                },
                                            ],
                                            [
                                                {
                                                    text: "Driver",
                                                    style: "tableFooter",
                                                },
                                                {
                                                    text: row.driverName,
                                                    style: "tableFooter",
                                                },
                                            ],
                                            [
                                                {
                                                    text: "TRUCK REGO",
                                                    style: "tableFooter",
                                                },
                                                {
                                                    text: row.truckID,
                                                    style: "tableFooter",
                                                },
                                            ],
                                        ],
                                    },
                                    width: "20%",
                                },
                            ],
                        },
                        {
                            columns: [
                                {
                                    width: "79.9%",
                                    table: {
                                        headerRows: 1,
                                        widths: ["23%", "57%", "20%"],
                                        body: [
                                            [
                                                {
                                                    text: "COMPANY NAME",
                                                    style: "tableHeader",
                                                },
                                                {
                                                    text: "ADDRESS",
                                                    style: "tableHeader",
                                                },
                                                {
                                                    text: "DETAILS",
                                                    style: "tableHeader",
                                                },
                                            ],
                                            ...(row.runsheet
                                                ? JSON.parse(row.runsheet).map((item, index1) => {
                                                    return [
                                                        {
                                                            text: item.company,
                                                            style: "tableRow",
                                                            margin: [0, 5, 0, 5],
                                                        },
                                                        {
                                                            text: item.address,
                                                            style: "tableRow",
                                                            margin: [0, 5, 0, 5],
                                                        },
                                                        {
                                                            text: `${Object.entries(JSON.parse(row.runsheet)[1].details).slice(index1, index1 + 1)[0][0]} : ${Object.entries(JSON.parse(row.runsheet)[1].details).slice(index1, index1 + 1)[0][1]}`,
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
                                            ...(JSON.parse(row.runsheet).length < 5 && new Array(5 - JSON.parse(row.runsheet).length).fill(0).map((item, index1) => {
                                                return [
                                                    {
                                                        text: '',
                                                        style: "tableRow",
                                                        margin: [0, 5, 0, 5],
                                                    },
                                                    {
                                                        text: '',
                                                        style: "tableRow",
                                                        margin: [0, 5, 0, 5],
                                                    },
                                                    {
                                                        text: `${Object.entries(JSON.parse(row.runsheet)[1].details).slice(JSON.parse(row.runsheet).length + index1, JSON.parse(row.runsheet).length + index1 + 1)[0][0]} : ${Object.entries(JSON.parse(row.runsheet)[1].details).slice(JSON.parse(row.runsheet).length + index1, JSON.parse(row.runsheet).length + index1 + 1)[0][1]}`,
                                                        style: "tableRow",
                                                        margin: [0, 5, 0, 5],
                                                    },
                                                ];
                                            })),
                                        ],
                                    },
                                    margin: [0, 5, 5, 0],
                                },
                                {
                                    width: "20%",
                                    alignment: "right",
                                    table: {
                                        headerRows: 1,
                                        widths: ["50%", "50%"],
                                        body: [
                                            [
                                                {
                                                    text: "ARRIVE",
                                                    style: "tableHeader",
                                                },
                                                {
                                                    text: "DEPART",
                                                    style: "tableHeader",
                                                },
                                            ],
                                            ...(row.runsheet
                                                ? JSON.parse(row.runsheet).map((item, index) => {
                                                    return [
                                                        {
                                                            text: item.arriveTime,
                                                            style: "tableRow",
                                                            margin: [0, 5, 0, 5],
                                                        },
                                                        {
                                                            text: item.startTime,
                                                            style: "tableRow",
                                                            margin: [0, 5, 0, 5],
                                                        },
                                                    ];
                                                })
                                                : [
                                                    [
                                                        {
                                                            text: "",
                                                            style: "tableRow",
                                                            colSpan: 2,
                                                            margin: [0, 5, 0, 5],
                                                        },
                                                    ],
                                                ]),
                                            ...(JSON.parse(row.runsheet).length < 5 && new Array(5 - JSON.parse(row.runsheet).length).fill(0).map(() => {
                                                return [
                                                    {
                                                        text: ' ',
                                                        style: "tableRow",
                                                        margin: [0, 5, 0, 5],
                                                        padding: [60, 60, 60, 60]
                                                    },
                                                    {
                                                        text: ' ',
                                                        style: "tableRow",
                                                        margin: [0, 5, 0, 5],
                                                        padding: [60, 60, 60, 60]
                                                    },
                                                ];
                                            })),
                                        ],
                                    },
                                    margin: [0, 5, 0, 0],
                                }
                            ]
                        },
                        {
                            columns: [
                                {
                                    width: "79.9%",
                                    stack: [
                                        {
                                            text: [
                                                {
                                                    text: "BREAKS-\n(Please ensure all RTA & Lunch breaks are taken as required)",
                                                    style: "borderDot",
                                                }
                                            ],
                                            margin: [0, 15, 15, 15],
                                        },
                                        {
                                            table: {
                                                widths: ["14.3%", "4.7%", "14.3%", "4.7%", "57.2%", "4.7%"],
                                                headerRows: 1,
                                                body: [
                                                    [
                                                        { text: 'PRE-TRIP INSPECTION', colSpan: 4, style: 'tableRow' },
                                                        {},
                                                        {},
                                                        {},
                                                        { text: 'CHECKS', colSpan: 2, style: 'tableRow' },
                                                        {}
                                                    ],
                                                    [
                                                        { text: 'AIR TANKS DRAINED', style: 'tableRow' },
                                                        { text: '', style: 'tableRow', alignment: 'center' },
                                                        { text: 'LIGHTS', style: 'tableRow' },
                                                        { text: '', style: 'tableRow', alignment: 'center' },
                                                        { text: 'I HAVE HAD THE REQUIRED REST & SUFFICIENT SLEEP IN THE LAST 24 HOURS', style: 'tableRow' },
                                                        { text: '', style: 'tableRow', alignment: 'center' },
                                                    ],
                                                    [
                                                        { text: 'ANY DAMAGE', style: 'tableRow' },
                                                        { text: '', style: 'tableRow', alignment: 'center' },
                                                        { text: 'OIL', style: 'tableRow' },
                                                        { text: '', style: 'tableRow', alignment: 'center' },
                                                        { text: 'I HAVE HAD THE REQUIRED REST & SUFFICIENT SLEEP IN THE LAST 48 HOURS', style: 'tableRow' },
                                                        { text: '', style: 'tableRow', alignment: 'center' },
                                                    ],
                                                    [
                                                        { text: 'BRAKES', style: 'tableRow' },
                                                        { text: '', style: 'tableRow', alignment: 'center' },
                                                        { text: 'WATER', style: 'tableRow' },
                                                        { text: '', style: 'tableRow', alignment: 'center' },
                                                        { text: 'I AM FIT FOR DUTY', style: 'tableRow' },
                                                        { text: '', style: 'tableRow', alignment: 'center' },
                                                    ],
                                                    [
                                                        { text: 'FUEL', style: 'tableRow' },
                                                        { text: '', style: 'tableRow', alignment: 'center' },
                                                        { text: "KM'S", style: 'tableRow' },
                                                        { text: '', style: 'tableRow', alignment: 'center' },
                                                        { text: 'ARE YOU WEARING YOUR PPE?', style: 'tableRow' },
                                                        { text: '', style: 'tableRow', alignment: 'center' },
                                                    ],
                                                    [
                                                        { text: 'LIFTING GEAR', style: 'tableRow' },
                                                        { text: '', style: 'tableRow', alignment: 'center' },
                                                        { text: 'CRANE', style: 'tableRow' },
                                                        { text: '', style: 'tableRow', alignment: 'center' },
                                                        { text: 'DID YOU RECORD TOLLS?', style: 'tableRow' },
                                                        { text: '', style: 'tableRow', alignment: 'center' },
                                                    ],
                                                    [
                                                        { text: '', colSpan: 4, style: 'tableRow' },
                                                        {},
                                                        {},
                                                        {},
                                                        { text: 'DID YOU RECORD TOLLS?', style: 'tableRow' },
                                                        { text: '', style: 'tableRow', alignment: 'center' },
                                                    ],
                                                ],
                                            },
                                        },
                                        {
                                            text: [
                                                {
                                                    text: "DRIVERS SIGNATURE: ",
                                                    style: "borderDot",
                                                    margin: [15, 15, 15, 15],
                                                },
                                                {
                                                    text: "                                              ",
                                                    width: '40%',
                                                    style: "borderDot",
                                                    margin: [15, 15, 15, 15],
                                                },
                                                {
                                                    text: "Print Name: ",
                                                    style: "borderDot",
                                                    margin: [15, 15, 15, 15],
                                                },
                                                {
                                                    text: `${row.driverName}`,
                                                    width: '40%',
                                                    style: "borderDot",
                                                    margin: [15, 15, 15, 15],
                                                }
                                            ],
                                            margin: [0, 20, 0, 0],
                                        },
                                    ],
                                    margin: [0, 10, 5, 0],
                                },
                                {
                                    width: "20%",
                                    alignment: "right",
                                    table: {
                                        widths: ["50%", "50%"],
                                        body: [
                                            [
                                                {
                                                    text: "START TIME: ",
                                                    style: "tableFooter",
                                                },
                                                {
                                                    text: JSON.parse(row.runsheet)[0].startTime,
                                                    style: "tableFooter",
                                                },
                                            ],
                                            [
                                                {
                                                    text: "END TIME: ",
                                                    style: "tableFooter",
                                                },
                                                {
                                                    text: JSON.parse(row.runsheet)[JSON.parse(row.runsheet).length - 1].arriveTime,
                                                    style: "tableFooter",
                                                },
                                            ],
                                            [
                                                {
                                                    text: "TOTAL HOURS",
                                                    style: "tableFooter",
                                                },
                                                {
                                                    text: difference,
                                                    style: "tableFooter",
                                                },
                                            ],
                                        ],
                                    },
                                    margin: [0, 10, 0, 0],
                                }
                            ]
                        },
                    ]
                })
                : [
                    {
                        text: "No Invoices to Show",
                        style: "tableRow",
                        colSpan: 10,
                        margin: [0, 5, 0, 5],
                    },
                ]),
        ],
        styles: {
            header: {
                fontSize: 20,
                color: "#000",
                bold: true,
                margin: [10, 10, 10, 10],
            },
            subHeader: {
                fontSize: 6,
                color: "#000",
                margin: [20, 10, 20, 10],
            },
            subHeaderList: {
                fontSize: 6,
                color: "#000",
            },
            subHeaderListATag: {
                fontSize: 6,
                color: "#000",
                color: "#728fea",
                transition: "0.3s",
                hovercolor: "#1b3bbb"
            },
            runHeader: {
                fontSize: 9,
                color: "#000",
                margin: [0, 0, 0, 0],
                lineHeight: 1.66,
            },
            runHeader1: {
                fontSize: 15,
                color: "#000",
                margin: [10, 0, 10, 10],
                lineHeight: 1,
            },
            borderDot: {
                border: [false, false, false, { width: 2, style: 'dashed' }],
                fontSize: 10,
                textTransform: "uppercase",
            },
            tableHeader: {
                fontSize: 6,
                bold: true,
                color: "#000",
                fillColor: "#f2f2f2",
                margin: [5, 5, 5, 5],
                alignment: 'center',
                valign: 'middle',
                noWrap: true
            },
            tableRow: {
                fontSize: 6,
                color: "#000",
                margin: [5, 5, 5, 5],
                alignment: 'center',
                valign: 'middle',
                noWrap: true
            },
            tableFooter: {
                fontSize: 6,
                bold: true,
                color: "#000",
                margin: [5, 5, 5, 5],
                alignment: 'center',
                valign: 'middle',
                noWrap: true
            },
            tableFooterBold: {
                fontSize: 6,
                bold: true,
                color: "#000",
                fillColor: "#f2f2f2",
                margin: [5, 5, 5, 5],
                alignment: 'center',
                valign: 'middle',
                noWrap: true
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
        pdf.download(`Invoice.pdf`);
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
                                                        {row.endTime ? moment(row.endTime).format('YYYY-MM-DD') : ''}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                                        {row.status == 'completed' ? row.ref : ''}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                                        {/* {
                                                            row.status == 'completed' ? row.job + ' - LOAD ' + row.load + ' ' : ''
                                                        } */}
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
                                                        {row.tolls ? row.tolls.toFixed(2) : ''}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                                        {row.status == 'completed' ? row.totalHour.toFixed(2) : '4'}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                                        {row.hourlyRate ? row.hourlyRate : ''}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                                        {row.fuelLevy ? row.fuelLevy.toFixed(2) : ''}
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

                    <div className='grid grid-cols-12 mt-20'>
                        <div className='col-span-12 text-start font-normal'>
                            <ol className='px-6 list-decimal'>
                                <li>By accepting and utilizing the payment invoice, the payee agrees to fulfill the payment obligation(s) outlined in the invoice within the specified due date.</li>
                                <li>In the event of late payment, the payee shall be charged an additional interest of 5% per day on the outstanding amount until the payment is recieved in full. Please refer to <Link href="https://simpleruns.com/wp-content/uploads/2023/06/Terms-and-Conditions-Spinning-Wheels-Transport-Pty-Ltd.pdf" target="_blank" className='text-navy-300 hover:text-navy-500 transition-colors'>Spinning Wheels Transport payment policy part(6) payments</Link> - clause 6.4</li>
                                <li>Late payment charges will be calculated daily starting from the day immediately following the due date until the outstanding payment is settled in full.</li>
                                <li>The payment invoice is non-transferable, and the payee shall not assign, transfer, or delegate their payment obligations to any third party without the explicit written consent of the invoice issuer.</li>
                                <li>If the payment remains outstanding beyond the specified due date, Spinning Wheels Transport reserves the right to take appropriate legal action(s) or engage the services of a debt collection agency to recover the outstanding amount. All associated costs incurred in the process will be the payee’s responsibility.</li>
                            </ol>
                        </div>
                    </div>

                    <div className="flex items-center mt-10">
                        <Link href={`/invoices/edit/${id}?start=${start}&end=${end}`} className='mr-4'>
                            <button type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center opacity-90">Edit</button>
                        </Link>
                        <button className="text-white bg-gradient-to-r transition from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex" onClick={() => downloadInvoice()}>Download <ArrowDownIcon strokeWidth={2} className="h-4 w-4 ml-2" /></button>
                    </div>
                </div>
            }

            {
                invoice.deliveries ? invoice.deliveries.map((row, index) => {
                    const time1 = JSON.parse(row.runsheet)[JSON.parse(row.runsheet).length - 1].arriveTime;
                    const time2 = JSON.parse(row.runsheet)[0].startTime;
                    const [hours1, minutes1] = time1.split(':').map(Number);
                    const [hours2, minutes2] = time2.split(':').map(Number);

                    const totalMinutes1 = hours1 * 60 + minutes1;
                    const totalMinutes2 = hours2 * 60 + minutes2;

                    const differenceInMinutes = totalMinutes1 - totalMinutes2;

                    const hours = Math.floor(differenceInMinutes / 60);
                    const minutes = differenceInMinutes % 60;

                    const difference = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

                    return (
                        <div key={"delivery" + index} className='font-sans text-gray-900 font-medium p-4 pt-20 pb-20 bg-white rounded-md mt-5'>
                            <div className='grid grid-cols-5 gap-2'>
                                <div className='col-span-5 md:col-span-3 xl:col-span-4 flex flex-col justify-end mb-4 md:mb-0'>
                                    <div className='grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
                                        <div className='col-span-2 xl:col-span-1'>
                                            <img className="h-[3rem] mt-[3rem] mb-0 xl:my-[3rem] object-contain" id="imageid" crossOrigin="anonymous" src={invoice.logo ? invoice.logo.url : invoiceImage.src} alt='logo' height={100} width="auto" />
                                        </div>

                                        <div className='col-span-2'>
                                            <div className='flex items-center flex-wrap justify-between mb-4'>
                                                <h3 className='text-lg font-bold leading-6 text-dark mr-4'>ABN: {invoice.abn}</h3>

                                                <h2 className='text-3xl font-bold leading-8 text-dark mr-4'>RUN SHEET NO: <span className='text-red-600 text-4xl font-medium'>{index + 1}</span></h2>
                                            </div>

                                            <h3 className='text-xl leading-6 text-dark mr-4 max-w-[250px]'>{invoice.adminAddress}</h3>

                                            <h3 className='text-xl leading-6 text-dark mr-4'><span className='font-bold'>Phone: </span>{invoice.adminPhone}</h3>

                                            <h3 className='text-xl leading-6 text-dark mr-4'><span className='font-bold'>Website: </span>
                                                <Link href={'https://' + invoice.adminWebSite} target='_blank'>
                                                    {invoice.adminWebSite}
                                                </Link>
                                            </h3>
                                        </div>
                                    </div>

                                    <h3 className='text-xl leading-6 text-dark mr-4 mb-2'>
                                        <span className='font-bold'>CHARGE TO: </span>
                                        <span className='border-b-2 border-dashed border-gray-600 uppercase'>{invoice.customerName}</span>
                                    </h3>
                                </div>

                                <div className='col-span-5 md:col-span-2 xl:col-span-1 flex items-end'>
                                    <table className='table-auto text-left w-full'>
                                        <tbody>
                                            <tr className='border-dark border-solid border-2'>
                                                <td className='text-sm font-semibold leading-none opacity-100 hover:opacity-90 transition-opacity py-4 pl-2'>DATE:</td>
                                                <td className='text-sm leading-none opacity-100 hover:opacity-90 transition-opacity py-4 px-2'>{moment(row.endTime).format('DD/MM/YYYY')}</td>
                                            </tr>
                                            <tr className='border-dark border-solid border-2'>
                                                <td className='text-sm font-semibold leading-none opacity-100 hover:opacity-90 transition-opacity py-4 pl-2'>DAY:</td>
                                                <td className='text-sm leading-none opacity-100 hover:opacity-90 transition-opacity py-4 px-2'>{moment(row.endTime).format('ddd')}</td>
                                            </tr>
                                            <tr className='border-dark border-solid border-2'>
                                                <td className='text-sm font-semibold leading-none opacity-100 hover:opacity-90 transition-opacity py-4 pl-2'>TRAILER REGO:</td>
                                                <td className='text-sm leading-none opacity-100 hover:opacity-90 transition-opacity py-4 px-2'>{row.trailerID}</td>
                                            </tr>
                                            <tr className='border-dark border-solid border-2'>
                                                <td className='text-sm font-semibold leading-none opacity-100 hover:opacity-90 transition-opacity py-4 pl-2'>DRIVER:</td>
                                                <td className='text-sm leading-none opacity-100 hover:opacity-90 transition-opacity py-4 px-2'>{row.driverName}</td>
                                            </tr>
                                            <tr className='border-dark border-solid border-2'>
                                                <td className='text-sm font-semibold leading-none opacity-100 hover:opacity-90 transition-opacity py-4 pl-2'>TRUCK REGO:</td>
                                                <td className='text-sm leading-none opacity-100 hover:opacity-90 transition-opacity py-4 px-2'>{row.truckID}</td>
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
                                            {
                                                JSON.parse(row.runsheet).map((item, id) => {
                                                    return (
                                                        <tr key={item._id + ' ' + id}>
                                                            <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 px-2'>
                                                                {item.company}
                                                            </td>
                                                            <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 px-2'>
                                                                {item.address}
                                                            </td>
                                                            <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 px-2'>
                                                                {
                                                                    Object.entries(JSON.parse(row.runsheet)[1].details).slice(id, id + 1)[0][0]
                                                                } : {
                                                                    Object.entries(JSON.parse(row.runsheet)[1].details).slice(id, id + 1)[0][1]
                                                                }
                                                            </td>
                                                        </tr>
                                                    )

                                                })
                                            }
                                            {
                                                JSON.parse(row.runsheet).length < 5 && new Array(5 - JSON.parse(row.runsheet).length).fill(0).map((item, id) => {
                                                    return (
                                                        <tr key={'tempdata' + ' ' + id}>
                                                            <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 px-2'></td>
                                                            <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 px-2'></td>
                                                            <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 px-2'>
                                                                {
                                                                    Object.entries(JSON.parse(row.runsheet)[1].details).slice(JSON.parse(row.runsheet).length + id, JSON.parse(row.runsheet).length + id + 1)[0][0]
                                                                } : {
                                                                    Object.entries(JSON.parse(row.runsheet)[1].details).slice(JSON.parse(row.runsheet).length + id, JSON.parse(row.runsheet).length + id + 1)[0][1]
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
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
                                            {
                                                JSON.parse(row.runsheet).map((item, id) => {
                                                    return (
                                                        <tr key={item._id + ' ' + id}>
                                                            <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 px-2'>
                                                                {item.arriveTime}
                                                            </td>
                                                            <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 px-2'>
                                                                {item.startTime}
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                            {
                                                JSON.parse(row.runsheet).length < 5 && new Array(5 - JSON.parse(row.runsheet).length).fill(0).map((item, id) => {
                                                    return (
                                                        <tr key={'tempdata' + ' ' + id}>
                                                            <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 px-2'></td>
                                                            <td className='text-sm leading-none opacity-100 hover:opacity-90 h-[3rem] border-dark border-solid border-2 transition-opacity py-4 px-2'></td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className='grid grid-cols-5 gap-2 mt-4'>
                                <div className='col-span-5 md:col-span-3 xl:col-span-4 mb-4 md:mb-0'>
                                    {/* <h3 className='text-xl leading-6 font-bold text-dark mb-2'>SPECIAL INSTRUCTIONS DELAYS (Given Reasons)</h3>

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
                                    </table> */}

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
                                                    <td className='border-dark border-solid border-2 p-3 w-14'><RxCheck className='text-lg ml-auto mr-auto' /></td>
                                                    <td className='border-dark border-solid border-2 p-3'>LIGHTS</td>
                                                    <td className='border-dark border-solid border-2 p-3 w-14'><RxCheck className='text-lg ml-auto mr-auto' /></td>
                                                    <td className='border-dark border-solid border-2 p-3'>I HAVE HAD THE REQUIRED REST & SUFFICIENT SLEEP IN THE LAST 24 HOURS</td>
                                                    <td className='border-dark border-solid border-2 p-3 w-14'><RxCheck className='text-lg ml-auto mr-auto' /></td>
                                                </tr>
                                                <tr>
                                                    <td className='border-dark border-solid border-2 p-3'>ANY DAMAGE</td>
                                                    <td className='border-dark border-solid border-2 p-3 w-14'><RxCheck className='text-lg ml-auto mr-auto' /></td>
                                                    <td className='border-dark border-solid border-2 p-3'>OIL</td>
                                                    <td className='border-dark border-solid border-2 p-3 w-14'><RxCheck className='text-lg ml-auto mr-auto' /></td>
                                                    <td className='border-dark border-solid border-2 p-3'>I HAVE HAD THE REQUIRED REST & SUFFICIENT SLEEP IN THE LAST 48 HOURS</td>
                                                    <td className='border-dark border-solid border-2 p-3 w-14'><RxCheck className='text-lg ml-auto mr-auto' /></td>
                                                </tr>
                                                <tr>
                                                    <td className='border-dark border-solid border-2 p-3'>BRAKES</td>
                                                    <td className='border-dark border-solid border-2 p-3 w-14'><RxCheck className='text-lg ml-auto mr-auto' /></td>
                                                    <td className='border-dark border-solid border-2 p-3'>WATER</td>
                                                    <td className='border-dark border-solid border-2 p-3 w-14'><RxCheck className='text-lg ml-auto mr-auto' /></td>
                                                    <td className='border-dark border-solid border-2 p-3'>I AM FIT FOR DUTY</td>
                                                    <td className='border-dark border-solid border-2 p-3 w-14'><RxCheck className='text-lg ml-auto mr-auto' /></td>
                                                </tr>
                                                <tr>
                                                    <td className='border-dark border-solid border-2 p-3'>FUEL</td>
                                                    <td className='border-dark border-solid border-2 p-3 w-14'><RxCheck className='text-lg ml-auto mr-auto' /></td>
                                                    <td className='border-dark border-solid border-2 p-3'>KM&apos;S</td>
                                                    <td className='border-dark border-solid border-2 p-3 w-14'><RxCheck className='text-lg ml-auto mr-auto' /></td>
                                                    <td className='border-dark border-solid border-2 p-3'>ARE YOU WEARING YOUR PPE?</td>
                                                    <td className='border-dark border-solid border-2 p-3 w-14'><RxCheck className='text-lg ml-auto mr-auto' /></td>
                                                </tr>
                                                <tr>
                                                    <td className='border-dark border-solid border-2 p-3'>LIFTING GEAR</td>
                                                    <td className='border-dark border-solid border-2 p-3 w-14'><RxCheck className='text-lg ml-auto mr-auto' /></td>
                                                    <td className='border-dark border-solid border-2 p-3'>CRANE</td>
                                                    <td className='border-dark border-solid border-2 p-3 w-14'><RxCheck className='text-lg ml-auto mr-auto' /></td>
                                                    <td className='border-dark border-solid border-2 p-3'>DID YOU RECORD TOLLS?</td>
                                                    <td className='border-dark border-solid border-2 p-3 w-14'><RxCheck className='text-lg ml-auto mr-auto' /></td>
                                                </tr>
                                                <tr>
                                                    <td className='border-dark border-solid border-2 p-3' colSpan={4}></td>
                                                    <td className='border-dark border-solid border-2 p-3'>DID YOU GET A NAME & SIGNATURE</td>
                                                    <td className='border-dark border-solid border-2 p-3 w-14'><RxCheck className='text-lg ml-auto mr-auto' /></td>
                                                </tr>
                                            </tbody>
                                            {/* <tfoot>
                                                <tr>
                                                    <td className="bg-gray-900 text-white text-center p-3 w-full" colSpan={6}>I HAVE CARRIED OUT DAILY & WEEKLY VEHICLE CHECK</td>
                                                </tr>
                                            </tfoot> */}
                                        </table>
                                    </div>

                                    <div className='overflow-x-scroll custom-scroller'>
                                        <table className='table-auto min-w-max w-full mt-4'>
                                            <tbody>
                                                <tr className=''>
                                                    <td className='text-xl font-bold leading-none h-[3rem] py-3 w-[180px]'>Drivers Signature:</td>
                                                    <td className='text-xl font-bold leading-none h-[3rem] py-3 border-b-2 border-dashed border-gray-600 w-[60%-180px] min-w-[200px]'></td>
                                                    <td className='text-xl font-bold leading-none h-[3rem] py-3 w-[115px]'>Print Name:</td>
                                                    <td className='text-xl font-bold leading-none h-[3rem] py-3 border-b-2 border-dashed border-gray-600 w-[40%-115px] min-w-[200px]'>{row.driverName}</td>
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
                                                <td className='text-sm leading-none opacity-100 hover:opacity-90 transition-opacity py-4 px-2'>{JSON.parse(row.runsheet)[0].startTime}</td>
                                            </tr>
                                            <tr className='border-dark border-solid border-2'>
                                                <td className='text-sm font-semibold leading-none opacity-100 hover:opacity-90 transition-opacity py-4 pl-2'>END TIME:</td>
                                                <td className='text-sm leading-none opacity-100 hover:opacity-90 transition-opacity py-4 px-2'>{JSON.parse(row.runsheet)[JSON.parse(row.runsheet).length - 1].arriveTime}</td>
                                            </tr>
                                            <tr className='border-dark border-solid border-2'>
                                                <td className='text-sm font-semibold leading-none opacity-100 hover:opacity-90 transition-opacity py-4 pl-2'>TOTAL HOURS:</td>
                                                <td className='text-sm leading-none opacity-100 hover:opacity-90 transition-opacity py-4 px-2'>
                                                    {difference}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="flex items-center mt-10">
                                <Link href={`/invoices/runsheet/${id}?start=${start}&end=${end}&order=${index}`} className='mr-4'>
                                    <button type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center opacity-90">Edit</button>
                                </Link>
                                <button className="text-white bg-gradient-to-r transition from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex" onClick={() => downloadInvoice()}>Download <ArrowDownIcon strokeWidth={2} className="h-4 w-4 ml-2" /></button>
                            </div>
                        </div>
                    )
                }) : ''
            }
        </>
    );
};

export default Invoice;