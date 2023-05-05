import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import InvoiceModal from '../../components/modals/invoiceCreate';
import LicenseModal from '../../components/modals/licenseModal';
import { instance } from '../../helpers/axios';
import moment from 'moment';

const Invoices = () => {
    const [openModal, setOpenModal] = useState(false);
    const [openState, setOpenState] = useState(false);
    const [license, setLicense] = useState(new Object);
    const [licensed, setLicensed] = useState(false);
    const [expired, setExpired] = useState(false);
    const [rangeOut, setRangeOut] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [overDue, setOverDue] = useState(0);
    const [nextDue, setNextDue] = useState(0);
    const [average, setAverage] = useState(0);
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [filterCount, setFilterCount] = useState(0);
    const [products, setProducts] = useState([]);


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        instance.get('/license')
            .then((res) => {
                if (res.data.length > 0) {
                    setLicense(res.data[0]);
                    setLicensed(true);


                }
            });
        instance.get('/product')
            .then((res) => {
                setProducts(res.data.filter((item) => item.option == 'sell'))
            });

    }, [])

    useEffect(() => {
        instance.get('/invoice')
            .then((res) => {
                setInvoices(res.data);

                let lastInvoiceNumber = parseInt(res.data[res.data.length - 1]?.invoiceNumber.split('-')[3]),
                    lastInvoice = parseInt(license.lastInvoice ? license.lastInvoice.split('-')[3] : null);
                setRangeOut(lastInvoiceNumber > lastInvoice);
                setExpired(moment().diff(license.expireDate) > 0);
            });

        instance.get('/customer')
            .then((res) => {
                setCustomers(res.data);
            });
    }, [licensed]);

    useEffect(() => {
        overDueCal();
        nextDueCal();
        averageCal();
    }, [invoices]);

    const openModalHandler = () => {
        if (licensed && !expired && !rangeOut) {
            instance.get('/customer')
                .then((res) => {
                    setCustomers(res.data);
                });
            instance.get("/invoice")
                .then((res) => {
                    if (res.data.length > 0) {
                        let arr = res.data[res.data.length - 1].invoiceNumber.split('-');
                        let tmp = arr[3];
                        let length = arr[3].split('').length;
                        arr[3] = String(parseInt(tmp) + 1).padStart(length, '0');

                        setInvoiceNumber(arr.join('-'));

                        setInvoices(res.data);
                    } else {
                        setInvoiceNumber(license.firstInvoice);
                    }
                });
            setOpenModal(true);
        } else {
            window.alert("Pls you have issued license!");
        }
    }

    const openLicenseHandler = () => {
        setOpenState(true);
    }

    const closeModal = () => {
        setOpenModal(false);
        instance.get("/invoice")
            .then((res) => {
                setInvoices(res.data);
            });
    }

    const closeLicense = () => {
        setOpenState(false);
        instance.get('/license')
            .then((res) => {
                if (res.data.length > 0) {
                    setLicense(res.data[0]);
                    setLicensed(true);
                }
            })
    }

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    function overDueCal() {
        let over = invoices.filter((element) => moment().diff(element.invoiceDate) > 0);
        let value = 0;
        over.forEach((el) => {
            value += el.amountDue;
        });
        setOverDue(value);
    }

    function nextDueCal() {
        let over = invoices.filter((element) => (moment().diff(element.invoiceDate) < 0 && moment().diff(element.invoiceDate) > -30 * 24 * 3600 * 1000));
        let value = 0;
        over.forEach((el) => {
            value += el.amountDue;
        });
        setNextDue(value);
    }

    function averageCal() {
        let value = 0;
        invoices.forEach((item) => {
            value += ((invoices.length > 0) ? moment().diff(item.invoiceDate) : 0);
        });
        setAverage(value / invoices.length);
    }

    function changeHandler(e) {
        document.querySelector('.filter-form-submit').click();
    }

    const onSubmit = (data) => {
        instance.get('/invoice').then((res) => {
            let tmp = res.data;
            let count = 0;
            if (data.customer != 'default') {
                count++;
                tmp = tmp.filter((item) => item.customerID._id == data.customer);
            }
            if (data.status != 'default') {
                count++;
                tmp = tmp.filter((item) => (data.status == 'overDue') ? (moment().diff(item.invoiceDate) > 0) : (moment().diff(item.invoiceDate) < 0));
            }
            if (data.from != '') {
                count++;
                tmp = tmp.filter((item) => (new Date(item.invoiceDate).getTime() - new Date(data.from).getTime()) >= 0);
            }
            if (data.to != '') {
                count++;
                tmp = tmp.filter((item) => (new Date(item.invoiceDate).getTime() - new Date(data.to).getTime()) <= 0);
            }
            setFilterCount(count);
            setInvoices(tmp);
        })
    };



    return (
        <>
            <div className='container px-32 py-20'>
                <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-2xl font-bold'>Invoices</h2>
                    {
                        (!licensed || expired || rangeOut) && (
                            <div>
                                <button onClick={openLicenseHandler} className="  py-1 px-4 text-white text-sm font-semibold bg-blue-800 rounded-2xl">License</button>
                            </div>
                        )
                    }

                    <div>
                        <button onClick={openModalHandler} className="  py-1 px-4 text-white text-sm font-semibold bg-blue-800 rounded-2xl">Create an invoice</button>
                    </div>
                </div>
                <div className='flex  justify-between px-4 py-4 border border-gray-200 rounded-md mb-8'>
                    <div>
                        <span className=' block text-xs font-semibold text-gray-600 mb-2'>Overdue</span>
                        <span className=' block text-xs text-gray-400 font-semibold mb-4'><span className=' text-lg text-neutral-600'>L{overDue}</span>HNL</span>
                        <span className='block text-xs text-gray-400 font-semibold'>Last update just a minute ago</span>
                    </div>
                    <div>
                        <span className='block text-xs font-semibold text-gray-600 mb-2'>Due with in next 30 days</span>
                        <span className=' block text-xs text-gray-400 font-semibold'><span className=' text-lg text-neutral-600'>L{nextDue}</span>HNL</span>
                    </div>
                    <div>
                        <span className='block text-xs font-semibold text-gray-600 mb-2'>Average time to get paid</span>
                        <span className=' block text-xs text-gray-400 font-semibold text-right'>
                            {
                                (invoices.length > 0) ? (

                                    <span className=' text-lg text-neutral-600'>{parseInt(-average / (3600 * 24 * 1000))}</span>
                                ) : (
                                    <span className=' text-lg text-neutral-600'>0</span>
                                )
                            }
                            days</span>
                    </div>
                </div>
                <div className='text-gray-400 text-xs'><span className='px-2 rounded-full text-blue-800 text-xs font-semibold bg-blue-100  mb-4'>{filterCount}</span> active filters</div>
                <form id='filterForm' onSubmit={handleSubmit(onSubmit)}>

                    <div className='grid grid-cols-12 gap-1   italic text-base text-gray-400 mt-4 mb-4'>
                        <div className=' col-span-5   '>
                            <select name="customer" id="customer" {...register('customer', { onChange: (e) => { changeHandler(e) } })} className=' w-full py-1 px-2 leading-normal border border-gray-200 rounded-lg'>
                                <option value="default" >All customers</option>
                                {
                                    customers.map((customer, index) => {
                                        return (
                                            <option key={'cutomer' + index} value={customer._id} >{customer.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className=' col-span-2'>
                            <select name="status" id="status" {...register('status', { onChange: (e) => { changeHandler(e) } })} className=' w-full py-1 px-2 leading-normal border border-gray-200 rounded-lg'>
                                <option value="default" >All statueses</option>
                                <option value="overDue">OverDue</option>
                                <option value="paymentDue">PaymentDue</option>
                            </select>
                        </div>
                        <div className='col-span-3 grid grid-cols-12'>
                            <div className='col-span-6'>
                                <input type="date" id='from' name='from' {...register('from', { onChange: (e) => { changeHandler(e) } })} className='w-full py-1 px-2 leading-normal border border-gray-200 rounded-tl-lg rounded-bl-lg' placeholder='From' />
                            </div>
                            <div className='col-span-6'>
                                <input type="date" id='to' name='to' {...register('to', { onChange: (e) => { changeHandler(e) } })} className='w-full py-1 px-2 leading-normal border border-gray-200 rounded-br-lg rounded-tr-lg' placeholder='To' />
                            </div>
                        </div>
                        <div className='col-span-2'>
                            <input type="search" id='search' name='search' {...register('search', { onChange: (e) => { changeHandler(e) } })} className=' w-full py-1 px-2 leading-normal border border-gray-200 rounded-lg' placeholder="Enter Invoice#" />
                        </div>
                        <button type='submit' className='hidden filter-form-submit'>Submit</button>
                    </div>
                </form>
                <div className='relative mb-6'>
                    <div className='relative w-1/3 bg-blue-50 rouned-lg mx-auto grid grid-cols-12 gap-1 rounded-xl py-1 px-1 text-center '>
                        <div className='col-span-4 text-xs font-semibold px-4 py-1 rounded-lg  transition-colors cursor-pointer duration-300 hover:bg-white'>
                            Unpaid
                            <span className='px-2 rounded-full text-blue-800 text-xs font-semibold bg-blue-200  mb-4 ml-2'>4</span>
                        </div>
                        <div className='col-span-4 text-xs font-semibold  px-4 py-1 rounded-lg transition-colors duration-300 cursor-pointer hover:bg-white'>
                            Paid
                            <span className='px-2 rounded-full text-blue-800 text-xs font-semibold bg-blue-200  mb-4 ml-2'>4</span>
                        </div>
                        <div className='col-span-4 text-xs font-semibold  px-4 py-1 rounded-lg transition-colors duration-300 cursor-pointer hover:bg-white'>
                            All invoices
                        </div>
                    </div>
                    <div className='absolute top-1/2 left-0 w-full border-b border-solid border-gray-200 z-[-1]'></div>
                </div>
                <table className='table-auto w-full'>
                    <thead className=' border-b-2 border-gray-400'>
                        <tr className=' text-xs font-semibold text-left'>
                            <th className='py-2'>Status</th>
                            <th className='py-2'>Due</th>
                            <th className='py-2'>Date</th>
                            <th className='py-2'>Number</th>
                            <th className='py-2'>Customer</th>
                            <th className='py-2 text-right'>Amount Due</th>
                        </tr>
                    </thead>
                    <tbody className='text-xs font-medium text-gray-600'>
                        {
                            invoices.map((item, index) => {
                                return (
                                    <tr key={'invoice' + index} className='border-b border-solid border-gray-200'>
                                        <td className=' py-2'>{(moment().diff(item.invoiceDate) > 0) ? (<span className='px-1  bg-red-200 text-red-700 rounded-md'>Overdue</span>) : (<span className='px-1  bg-emerald-300 text-emerald-700 rounded-md'>Paymentdue</span>)} </td>
                                        <td className=' py-2 text-red-700'>{moment.duration(moment().diff(item.invoiceDate)).humanize() + ((moment().diff(item.invoiceDate) > 0) ? " ago" : " remain")}</td>
                                        <td className=' py-2'>{formatDate(item.invoiceDate)}</td>
                                        <td className=' py-2'>{item.invoiceNumber}</td>
                                        <td className=' py-2'>{item.customerID.name}</td>
                                        <td className=' py-2 text-right'>L{item.amountDue}HNL</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            <InvoiceModal modalIsOpen={openModal} closeModal={closeModal} license={license} invoiceNumber={invoiceNumber} customers={customers} products={products}></InvoiceModal>
            <LicenseModal modalIsOpen={openState} closeModal={closeLicense}></LicenseModal>
        </>
    );
}

export default Invoices;