import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useAtom } from "jotai";

import { useRouter } from 'next/router';
import Link from "next/link";

import { idAtom } from "helpers/authorize";
import { instance } from 'helpers/axios';

import invoiceImage from "public/assets/img/invoice.png";

import { RxCheck } from "react-icons/rx";
import { ArrowDownIcon } from "@heroicons/react/24/solid";

const Invoice = ({ data: invoiceData, order: order }) => {
    const [user, __] = useAtom(idAtom);
    const [invoice, setInvoice] = useState(invoiceData);
    const [siteList, setSiteList] = useState([]);
    const router = useRouter();
    const { id } = router.query;

    const saveRunsheetHandler = () => {
        user && instance.post(`/invoices/edit/${id}`, { params: { user: user, data: invoice.deliveries } })
            .then((res) => {
                res.status = 200 && router.push('/invoices');
            }).catch(error => {
                console.log(error.message);
            });
    }

    useEffect(() => {
        id && instance.get(`/admin/customers/${id}`)
            .then((res) => {
                let tmpSiteList = [];
                if (res.data.job) {
                    const parsedSiteList = JSON.parse(res.data.job);
                    tmpSiteList[0] = { name: 'Depot Base', address: invoice.adminAddress };
                    for (let i = 0; i < parsedSiteList.length; i++) {
                        tmpSiteList.push(parsedSiteList[i]);
                    }
                }
                setSiteList(tmpSiteList);
            }).catch(error => {
                console.log(error.message);
            });
    }, [router, id]);

    return (
        (invoice.deliveries) ? invoice.deliveries.map((row, index) => {
            const rowData = JSON.parse(row.runsheet);
            const time1 = rowData[rowData.length - 1].arriveTime;
            const time2 = rowData[0].startTime;
            const [hours1, minutes1] = time1.split(':').map(Number);
            const [hours2, minutes2] = time2.split(':').map(Number);

            const totalMinutes1 = hours1 * 60 + minutes1;
            const totalMinutes2 = hours2 * 60 + minutes2;

            const differenceInMinutes = totalMinutes1 - totalMinutes2;

            const hours = Math.floor(differenceInMinutes / 60);
            const minutes = differenceInMinutes % 60;

            const difference = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

            return (
                index == order && <div key={"delivery" + index} className='font-sans text-gray-900 font-medium p-4 pt-20 pb-20 bg-white rounded-md mt-5'>
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
                                        <td className='text-sm leading-none opacity-100 hover:opacity-90 transition-opacity py-4 px-2'>{moment(row.date).format('DD/MM/YYYY')}</td>
                                    </tr>
                                    <tr className='border-dark border-solid border-2'>
                                        <td className='text-sm font-semibold leading-none opacity-100 hover:opacity-90 transition-opacity py-4 pl-2'>DAY:</td>
                                        <td className='text-sm leading-none opacity-100 hover:opacity-90 transition-opacity py-4 px-2'>{moment(row.date).format('ddd')}</td>
                                    </tr>
                                    <tr className='border-dark border-solid border-2'>
                                        <td className='text-sm font-semibold leading-none opacity-100 hover:opacity-90 transition-opacity py-4 pl-2'>TRAILER REGO:</td>
                                        <td className='text-sm leading-none opacity-100 hover:opacity-90 transition-opacity py-4 px-2'>
                                            <input
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                                type="text"
                                                name="trailerID"
                                                id="trailerID"
                                                onChange={(e) => {
                                                    const updatedInvoices = {
                                                        ...invoice,
                                                        deliveries: invoice.deliveries.map((delivery, index1) => {
                                                            if (index1 == order) {
                                                                return {
                                                                    ...delivery,
                                                                    trailerID: e.target.value,
                                                                }
                                                            } else {
                                                                return delivery;
                                                            }
                                                        })
                                                    }
                                                    setInvoice(updatedInvoices);
                                                }}
                                                value={row.trailerID}
                                            />
                                        </td>
                                    </tr>
                                    <tr className='border-dark border-solid border-2'>
                                        <td className='text-sm font-semibold leading-none opacity-100 hover:opacity-90 transition-opacity py-4 pl-2'>DRIVER:</td>
                                        <td className='text-sm leading-none opacity-100 hover:opacity-90 transition-opacity py-4 px-2'>
                                            <input
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                                type="text"
                                                name="driverName"
                                                id="driverName"
                                                onChange={(e) => {
                                                    const updatedInvoices = {
                                                        ...invoice,
                                                        deliveries: invoice.deliveries.map((delivery, index1) => {
                                                            if (index1 == order) {
                                                                return {
                                                                    ...delivery,
                                                                    driverName: e.target.value,
                                                                }
                                                            } else {
                                                                return delivery;
                                                            }
                                                        })
                                                    }
                                                    setInvoice(updatedInvoices);
                                                }}
                                                value={row.driverName}
                                            />
                                        </td>
                                    </tr>
                                    <tr className='border-dark border-solid border-2'>
                                        <td className='text-sm font-semibold leading-none opacity-100 hover:opacity-90 transition-opacity py-4 pl-2'>TRUCK REGO:</td>
                                        <td className='text-sm leading-none opacity-100 hover:opacity-90 transition-opacity py-4 px-2'>
                                            <input
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                                type="text"
                                                name="truckID"
                                                id="truckID"
                                                onChange={(e) => {
                                                    const updatedInvoices = {
                                                        ...invoice,
                                                        deliveries: invoice.deliveries.map((delivery, index1) => {
                                                            if (index1 == order) {
                                                                return {
                                                                    ...delivery,
                                                                    truckID: e.target.value,
                                                                }
                                                            } else {
                                                                return delivery;
                                                            }
                                                        })
                                                    }
                                                    setInvoice(updatedInvoices);
                                                }}
                                                value={row.truckID}
                                            />
                                        </td>
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
                                        rowData.map((item, id) => {
                                            return (
                                                <tr key={item._id + ' ' + id}>
                                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 max-w-[7rem] h-[5rem] border-dark border-solid border-2 transition-opacity py-4 px-2'>
                                                        <select
                                                            id="role"
                                                            name="role"
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-50"
                                                            value={item.company}
                                                            onChange={(e) => {
                                                                const updatedInvoice = {
                                                                    ...invoice,
                                                                    deliveries: invoice.deliveries.map((delivery, index1) => {
                                                                        if (index1 == order) {
                                                                            const indexOfSite = siteList.findIndex(siteItem => siteItem.name == e.target.value);
                                                                            return {
                                                                                ...delivery,
                                                                                runsheet: JSON.stringify(rowData.map((item2, index2) => {
                                                                                    if (index2 == id) {
                                                                                        return {
                                                                                            ...item2,
                                                                                            company: siteList[indexOfSite].name,
                                                                                            address: siteList[indexOfSite].address
                                                                                        }
                                                                                    } else {
                                                                                        return item2
                                                                                    }
                                                                                }))
                                                                            }
                                                                        } else {
                                                                            return delivery;
                                                                        }
                                                                    })
                                                                }
                                                                setInvoice(updatedInvoice);
                                                            }}
                                                            required>
                                                            {
                                                                siteList && siteList.map((site, siteID) => {
                                                                    return <option key={"site" + index + ' ' + siteID} value={site.name}>{site.name}</option>
                                                                })
                                                            }
                                                        </select>
                                                    </td>
                                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 max-w-[7rem] h-[5rem] border-dark border-solid border-2 transition-opacity py-4 px-2'>
                                                        {item.address}
                                                    </td>
                                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 max-w-[7rem] h-[5rem] border-dark border-solid border-2 transition-opacity py-4 px-2'>
                                                        <div className='flex items-center'>
                                                            <span className='flex items-center'>
                                                                {
                                                                    Object.entries(rowData[1].details).slice(id, id + 1)[0][0]
                                                                }
                                                            </span>
                                                            :
                                                            <input
                                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ml-2"
                                                                type="text"
                                                                name={Object.entries(rowData[1].details).slice(id, id + 1)[0][0]}
                                                                id={Object.entries(rowData[1].details).slice(id, id + 1)[0][0]}
                                                                onChange={(e) => {
                                                                    const updatedInvoice = {
                                                                        ...invoice,
                                                                        deliveries: invoice.deliveries.map((delivery, index1) => {
                                                                            if (index1 == order) {
                                                                                return {
                                                                                    ...delivery,
                                                                                    runsheet: JSON.stringify(rowData.map((item2, index2) => {
                                                                                        const idText = Object.keys(item2.details).slice(id, id + 1)[0];
                                                                                        var tmpDetails = item2.details;

                                                                                        tmpDetails[idText] = e.target.value;
                                                                                        if (index2 == 1) {
                                                                                            return {
                                                                                                ...item2,
                                                                                                details: tmpDetails
                                                                                            }
                                                                                        } else {
                                                                                            return item2
                                                                                        }
                                                                                    }))
                                                                                }
                                                                            } else {
                                                                                return delivery;
                                                                            }
                                                                        })
                                                                    }
                                                                    setInvoice(updatedInvoice);
                                                                }}
                                                                value={Object.entries(rowData[1].details).slice(id, id + 1)[0][1]}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            )

                                        })
                                    }
                                    {
                                        rowData.length < 5 && new Array(5 - rowData.length).fill(0).map((item, id) => {
                                            return (
                                                <tr key={'tempdata' + ' ' + id}>
                                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 max-w-[7rem] h-[5rem] border-dark border-solid border-2 transition-opacity py-4 px-2'></td>
                                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 max-w-[7rem] h-[5rem] border-dark border-solid border-2 transition-opacity py-4 px-2'></td>
                                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 max-w-[7rem] h-[5rem] border-dark border-solid border-2 transition-opacity py-4 px-2'>
                                                        <div className='flex items-center'>
                                                            <span className='flex items-center'>
                                                                {
                                                                    Object.entries(rowData[1].details).slice(rowData.length + id, rowData.length + id + 1)[0][0]
                                                                }
                                                            </span>
                                                            :
                                                            <input
                                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ml-2"
                                                                type="text"
                                                                name={Object.entries(rowData[1].details).slice(rowData.length + id, rowData.length + id + 1)[0][0]}
                                                                id={Object.entries(rowData[1].details).slice(rowData.length + id, rowData.length + id + 1)[0][0]}
                                                                onChange={(e) => {
                                                                    const updatedInvoice = {
                                                                        ...invoice,
                                                                        deliveries: invoice.deliveries.map((delivery, index1) => {
                                                                            if (index1 == order) {
                                                                                return {
                                                                                    ...delivery,
                                                                                    runsheet: JSON.stringify(rowData.map((item2, index2) => {
                                                                                        const idText = Object.keys(item2.details).slice(rowData.length + id, rowData.length + id + 1)[0];
                                                                                        var tmpDetails = item2.details;

                                                                                        tmpDetails[idText] = e.target.value;
                                                                                        if (index2 == 1) {
                                                                                            return {
                                                                                                ...item2,
                                                                                                details: tmpDetails
                                                                                            }
                                                                                        } else {
                                                                                            return item2
                                                                                        }
                                                                                    }))
                                                                                }
                                                                            } else {
                                                                                return delivery;
                                                                            }
                                                                        })
                                                                    }
                                                                    setInvoice(updatedInvoice);
                                                                }}
                                                                value={Object.entries(rowData[1].details).slice(rowData.length + id, rowData.length + id + 1)[0][1]}
                                                            />
                                                        </div>
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
                                        rowData.map((item, id) => {
                                            return (
                                                <tr key={'arrivetime ' + id}>
                                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 max-w-[7rem] h-[5rem] border-dark border-solid border-2 transition-opacity py-4 px-2'>
                                                        {
                                                            id !== 0 && <input
                                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                                                type="time"
                                                                name="arriveTime"
                                                                id="arriveTime"
                                                                onChange={(e) => {
                                                                    const updatedInvoices = {
                                                                        ...invoice,
                                                                        deliveries: invoice.deliveries.map((delivery, index1) => {
                                                                            if (index1 == order) {
                                                                                return {
                                                                                    ...delivery,
                                                                                    runsheet: JSON.stringify(rowData.map((item2, index2) => {
                                                                                        if (index2 == id) {
                                                                                            return {
                                                                                                ...item2,
                                                                                                arriveTime: e.target.value
                                                                                            }
                                                                                        } else {
                                                                                            return item2
                                                                                        }
                                                                                    }))
                                                                                }
                                                                            } else {
                                                                                return delivery;
                                                                            }
                                                                        })
                                                                    }
                                                                    setInvoice(updatedInvoices);
                                                                }}
                                                                value={item.arriveTime}
                                                            />
                                                        }
                                                    </td>
                                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 max-w-[7rem] h-[5rem] border-dark border-solid border-2 transition-opacity py-4 px-2'>
                                                        {
                                                            rowData.length > id + 1 && <input
                                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                                                type="time"
                                                                name="startTime"
                                                                id="startTime"
                                                                onChange={(e) => {
                                                                    const updatedInvoices = {
                                                                        ...invoice,
                                                                        deliveries: invoice.deliveries.map((delivery, index1) => {
                                                                            if (index1 == order) {
                                                                                return {
                                                                                    ...delivery,
                                                                                    runsheet: JSON.stringify(rowData.map((item2, index2) => {
                                                                                        if (index2 == id) {
                                                                                            return {
                                                                                                ...item2,
                                                                                                startTime: e.target.value
                                                                                            }
                                                                                        } else {
                                                                                            return item2
                                                                                        }
                                                                                    }))
                                                                                }
                                                                            } else {
                                                                                return delivery;
                                                                            }
                                                                        })
                                                                    }
                                                                    setInvoice(updatedInvoices);
                                                                }}
                                                                value={item.startTime}
                                                            />
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                    {
                                        rowData.length < 5 && new Array(5 - rowData.length).fill(0).map((item, id) => {
                                            return (
                                                <tr key={'tempdata' + ' ' + id}>
                                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 max-w-[7rem] h-[5rem] border-dark border-solid border-2 transition-opacity py-4 px-2'></td>
                                                    <td className='text-sm leading-none opacity-100 hover:opacity-90 max-w-[7rem] h-[5rem] border-dark border-solid border-2 transition-opacity py-4 px-2'></td>
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
                                        <td className='text-sm leading-none opacity-100 hover:opacity-90 transition-opacity py-4 px-2'>{rowData[0].startTime}</td>
                                    </tr>
                                    <tr className='border-dark border-solid border-2'>
                                        <td className='text-sm font-semibold leading-none opacity-100 hover:opacity-90 transition-opacity py-4 pl-2'>END TIME:</td>
                                        <td className='text-sm leading-none opacity-100 hover:opacity-90 transition-opacity py-4 px-2'>{rowData[rowData.length - 1].arriveTime}</td>
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
                        <button className="text-white bg-gradient-to-r transition from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-20 mr-4" onClick={saveRunsheetHandler}>Save</button>

                        <Link href="/invoices">
                            <button type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center opacity-90 mt-20">Back</button>
                        </Link>
                    </div>
                </div >
            )
        }) : ''
    );
};

export default Invoice;