import React, { useState } from 'react';
import moment from 'moment';
import { useAtom } from "jotai";
import { Typography } from '@material-tailwind/react';
import { useRouter } from 'next/router';
import Link from "next/link";

import { idAtom } from "helpers/authorize";
import { instance } from 'helpers/axios';

import invoiceImage from "public/assets/img/invoice.png";

const headers = [
    { text: 'Status', key: 'status' },
    { text: 'Start Time', key: 'startTime' },
    { text: 'End Time', key: 'endTime' },
    { text: 'Total Hour', key: 'totalHour' },
    { text: 'REF', key: 'ref' },
    { text: 'Docket', key: 'docket' },
    { text: 'Job', key: 'job' },
    { text: 'Load#', key: 'load' },
    { text: 'PO', key: 'po' },
    { text: 'Description', key: 'description' },
    { text: 'Tolls', key: 'tolls' },
    { text: 'Rate', key: 'rate' },
    { text: 'Fuel Levy<br/>@15.00%', key: 'fuel' },
    { text: 'SubTotal', key: 'subtotal' },
    { text: 'GST', key: 'gst' },
    { text: 'Total', key: 'total' },
];

const Invoice = ({ data: invoiceData }) => {
    const [user, __] = useAtom(idAtom);
    const [invoice, setInvoice] = useState(invoiceData);
    const router = useRouter();
    const { id } = router.query;

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

    const saveInvoiceHandler = () => {
        user && instance.post(`/invoices/edit/${id}`, { params: { user: user, data: invoice.deliveries } })
            .then((res) => {
                router.push('/invoices');
            }).catch(error => {
                console.log(error.message);
            });
    }

    return (
        invoice && <div className='font-sans text-gray-900 font-medium'>
            <div className="grid grid-cols-3 gap-2">
                <div className='sm:col-span-2'>
                    <img className="h-[3rem] my-[3rem]" id="imageid" src={invoice.logo ? invoice.logo.url : invoiceImage.src} alt='logo' height={100} width="auto" />
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
                                            <Typography variant="small" color="blue-gray" className="font-medium capitalize">
                                                {row.status}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <input
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                                type="datetime-local"
                                                step="1"
                                                name="startTime"
                                                id={"startTime" + index}
                                                onChange={(e) => {
                                                    const updatedInvoices = {
                                                        ...invoice,
                                                        deliveries: invoice.deliveries.map((delivery, id) => {
                                                            if (id === index) {
                                                                return {
                                                                    ...delivery,
                                                                    startTime: e.target.value,
                                                                    totalHour: (new Date(delivery.endTime) - new Date(e.target.value)) / (1000 * 60 * 60),
                                                                    subTotal: (new Date(delivery.endTime) - new Date(e.target.value)) / (1000 * 60 * 60) * delivery.hourlyRate + delivery.fuelLevy + delivery.tolls,
                                                                    GST: ((new Date(delivery.endTime) - new Date(e.target.value)) / (1000 * 60 * 60) * delivery.hourlyRate + delivery.fuelLevy + delivery.tolls) * 0.1,
                                                                }
                                                            } else {
                                                                return delivery;
                                                            }
                                                        })
                                                    }
                                                    setInvoice(updatedInvoices);
                                                }}
                                                value={moment(row.startTime).format("YYYY-MM-DDTkk:mm:ss.SSS")}
                                                readOnly={row.status == 'completed' ? false : true}
                                            />
                                        </td>
                                        <td className={classes}>
                                            <input
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                                type="datetime-local"
                                                step="1"
                                                name="endTime"
                                                id={"endTime" + index}
                                                onChange={(e) => {
                                                    const updatedInvoices = {
                                                        ...invoice,
                                                        deliveries: invoice.deliveries.map((delivery, id) => {
                                                            if (id === index) {
                                                                return {
                                                                    ...delivery,
                                                                    endTime: e.target.value,
                                                                    totalHour: (new Date(e.target.value) - new Date(delivery.startTime)) / (1000 * 60 * 60),
                                                                    subTotal: (new Date(e.target.value) - new Date(delivery.startTime)) / (1000 * 60 * 60) * delivery.hourlyRate + delivery.fuelLevy + delivery.tolls,
                                                                    GST: ((new Date(e.target.value) - new Date(delivery.startTime)) / (1000 * 60 * 60) * delivery.hourlyRate + delivery.fuelLevy + delivery.tolls) * 0.1,
                                                                }
                                                            } else {
                                                                return delivery;
                                                            }
                                                        })
                                                    };
                                                    setInvoice(updatedInvoices);
                                                }}
                                                value={moment(row.endTime).format("YYYY-MM-DDTkk:mm:ss.SSS")}
                                                readOnly={row.status == 'completed' ? false : true}
                                            />
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-medium">
                                                {row.status == 'completed' ? row.totalHour.toFixed(3) : '4'}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <input
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                                type="text"
                                                name="ref"
                                                id={"ref" + index}
                                                onChange={(e) => {
                                                    const updatedRef = {
                                                        ...invoice,
                                                        deliveries: invoice.deliveries.map((delivery, id) => {
                                                            if (id === index) {
                                                                return {
                                                                    ...delivery,
                                                                    ref: e.target.value
                                                                }
                                                            } else {
                                                                return delivery;
                                                            }
                                                        })
                                                    }
                                                    setInvoice(updatedRef);
                                                }}
                                                value={row.ref}
                                                readOnly={row.status == 'completed' ? false : true}
                                            />
                                        </td>
                                        <td className={classes}>
                                            <input
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                                type="text"
                                                name="docket"
                                                id={"docket" + index}
                                                onChange={(e) => {
                                                    const updatedDocket = {
                                                        ...invoice,
                                                        deliveries: invoice.deliveries.map((delivery, id) => {
                                                            if (id === index) {
                                                                return {
                                                                    ...delivery,
                                                                    docket: e.target.value
                                                                }
                                                            } else {
                                                                return delivery;
                                                            }
                                                        })
                                                    }
                                                    setInvoice(updatedDocket);
                                                }}
                                                value={row.docket}
                                                readOnly={row.status == 'completed' ? false : true}
                                            />
                                        </td>
                                        <td className={classes}>
                                            <input
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                                type="text"
                                                name="job"
                                                id={"job" + index}
                                                onChange={(e) => {
                                                    const updatedJob = {
                                                        ...invoice,
                                                        deliveries: invoice.deliveries.map((delivery, id) => {
                                                            if (id === index) {
                                                                return {
                                                                    ...delivery,
                                                                    job: e.target.value
                                                                }
                                                            } else {
                                                                return delivery;
                                                            }
                                                        })
                                                    }
                                                    setInvoice(updatedJob);
                                                }}
                                                value={row.job}
                                                readOnly={row.status == 'completed' ? false : true}
                                            />
                                        </td>
                                        <td className={classes}>
                                            <input
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                                type="text"
                                                name="load"
                                                id={"load" + index}
                                                onChange={(e) => {
                                                    const updatedLoad = {
                                                        ...invoice,
                                                        deliveries: invoice.deliveries.map((delivery, id) => {
                                                            if (id === index) {
                                                                return {
                                                                    ...delivery,
                                                                    load: e.target.value
                                                                }
                                                            } else {
                                                                return delivery;
                                                            }
                                                        })
                                                    }
                                                    setInvoice(updatedLoad);
                                                }}
                                                value={row.load}
                                                readOnly={row.status == 'completed' ? false : true}
                                            />
                                        </td>
                                        <td className={classes}>
                                            <input
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                                type="text"
                                                name="PO"
                                                id={"PO" + index}
                                                onChange={(e) => {
                                                    const updatedPO = {
                                                        ...invoice,
                                                        deliveries: invoice.deliveries.map((delivery, id) => {
                                                            if (id === index) {
                                                                return {
                                                                    ...delivery,
                                                                    PO: e.target.value
                                                                }
                                                            } else {
                                                                return delivery;
                                                            }
                                                        })
                                                    }
                                                    setInvoice(updatedPO);
                                                }}
                                                value={row.PO}
                                                readOnly={row.status == 'completed' ? false : true}
                                            />
                                        </td>
                                        <td className={classes}>
                                            <textarea
                                                className="bg-gray-50 border !h-[10rem] border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                                type="text"
                                                name="description"
                                                id={"description" + index}
                                                onChange={(e) => {
                                                    const updatedInvoices = {
                                                        ...invoice,
                                                        deliveries: invoice.deliveries.map((delivery, id) => {
                                                            if (id === index) {
                                                                return {
                                                                    ...delivery,
                                                                    description: e.target.value
                                                                }
                                                            } else {
                                                                return delivery;
                                                            }
                                                        })
                                                    }
                                                    setInvoice(updatedInvoices);
                                                }}
                                                value={row.description}
                                                readOnly={row.status == 'completed' ? false : true}
                                            />
                                        </td>
                                        <td className={classes}>
                                            <input
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                                type="number"
                                                name="tolls"
                                                id={"tolls" + index}
                                                step="0.001"
                                                onChange={(e) => {
                                                    const updatedInvoices = {
                                                        ...invoice,
                                                        deliveries: invoice.deliveries.map((delivery, id) => {
                                                            if (id === index) {
                                                                return {
                                                                    ...delivery,
                                                                    tolls: parseInt(e.target.value),
                                                                    subTotal: delivery.totalHour * delivery.hourlyRate + delivery.fuelLevy + parseInt(e.target.value),
                                                                    GST: (delivery.totalHour * delivery.hourlyRate + delivery.fuelLevy + parseInt(e.target.value)) * 0.1,
                                                                }
                                                            } else {
                                                                return delivery;
                                                            }
                                                        })
                                                    }
                                                    setInvoice(updatedInvoices);
                                                }}
                                                value={row.tolls}
                                                readOnly={row.status == 'completed' ? false : true}
                                            />
                                        </td>
                                        <td className={classes}>
                                            <input
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                                type="number"
                                                name="hourlyRate"
                                                id={"hourlyRate" + index}
                                                onChange={(e) => {
                                                    const updatedInvoices = {
                                                        ...invoice,
                                                        deliveries: invoice.deliveries.map((delivery, id) => {
                                                            if (id === index) {
                                                                return {
                                                                    ...delivery,
                                                                    hourlyRate: e.target.value,
                                                                    subTotal: delivery.totalHour * e.target.value + delivery.fuelLevy + delivery.tolls,
                                                                    GST: (delivery.totalHour * e.target.value + delivery.fuelLevy + delivery.tolls) * 0.1,
                                                                }
                                                            } else {
                                                                return delivery;
                                                            }
                                                        })
                                                    }
                                                    setInvoice(updatedInvoices);
                                                }}
                                                value={row.hourlyRate}
                                                readOnly={row.status == 'completed' ? false : true}
                                            />
                                        </td>
                                        <td className={classes}>
                                            <input
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                                type="number"
                                                name="fuelLevy"
                                                id={"fuelLevy" + index}
                                                step="0.001"
                                                onChange={(e) => {
                                                    const updatedInvoices = {
                                                        ...invoice,
                                                        deliveries: invoice.deliveries.map((delivery, id) => {
                                                            if (id === index) {
                                                                return {
                                                                    ...delivery,
                                                                    fuelLevy: e.target.value,
                                                                    subTotal: delivery.totalHour * delivery.hourlyRate + delivery.tolls + parseInt(e.target.value),
                                                                    GST: (delivery.totalHour * delivery.hourlyRate + delivery.tolls + parseInt(e.target.value)) * 0.1,
                                                                }
                                                            } else {
                                                                return delivery;
                                                            }
                                                        })
                                                    }
                                                    setInvoice(updatedInvoices);
                                                }}
                                                value={row.fuelLevy}
                                                readOnly={row.status == 'completed' ? false : true}
                                            />
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

            <button className="text-white bg-gradient-to-r transition from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-20 mr-4" onClick={saveInvoiceHandler}>Save</button>

            <Link href="/invoices">
                <button type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center opacity-90 mt-20">Back</button>
            </Link>
        </div >
    );
};

export default Invoice;