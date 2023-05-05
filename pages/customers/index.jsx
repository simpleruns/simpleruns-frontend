import React, { useState, useEffect } from 'react';
import CustomerModal from '../../components/modals/customerCreate';
import CustomerEdit from '../../components/modals/customerEdit';
import { instance } from '../../helpers/axios';
import moment from 'moment';

const Customers = () => {
    const [openModal, setOpenModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [content, setContent] = useState(new Object);

    const openModalHandler = () => {
        setOpenModal(true);
    }

    const changeHandler = (e) => {
        var search = e.currentTarget.value;
        instance.get('/customer').then((res) => {
            let tmp = res.data.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
            setCustomers(tmp);

        })
    }

    const editHandler = (e, item) => {
        e.preventDefault();

        setContent(item);
        setEditModal(true);
    }

    const closeEditModal = () => {
        setEditModal(false);
        instance.get('/customer').then((res) => {
            setCustomers(res.data);
        })
    }

    const closeModal = () => {
        setOpenModal(false);
        instance.get('/customer').then((res) => {
            setCustomers(res.data);
        })
    }

    const total = (customer) => {
        let tmp = invoices.filter((item) => item.customerID._id == customer._id);
        let value = 0;
        tmp.forEach((element) => {
            value += element.amountDue;
        });
        return value;
    }
    const overDue = (customer) => {
        let tmp = invoices.filter((item) => (item.customerID._id == customer._id) && (moment().diff(item.invoiceDate) > 0));
        let value = 0;
        tmp.forEach((element) => {
            value += element.amountDue;
        });
        return value;
    }

    useEffect(() => {
        instance.get('/customer').then((res) => {
            setCustomers(res.data);
        });

        instance.get('/invoice').then((res) => {
            setInvoices(res.data);
        })
    }, []);
    return (
        <>
            <div className='px-40 py-20'>

                <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-2xl font-bold'>Customers</h2>
                    <div>

                        <button onClick={openModalHandler} className="  py-1 px-4 ml-2 text-white font-light border-blue-800 bg-blue-800 rounded-2xl">Add a customer</button>

                    </div>
                </div>
                <div className='flex items-center'>
                    <input type="search" className=' w-72  py-1 px-2 leading-normal border border-gray-200 rounded-lg' placeholder="Search by name" onChange={changeHandler} />
                    <div className='flex items-center ml-4'>
                        <span className='px-2 rounded-full text-blue-800 text-xs font-semibold bg-blue-200'>{customers.length}</span>
                        <span className='text-xs ml-2 font-medium text-gray-600'>customers found</span>

                    </div>
                </div>

                <table className='table-auto w-full'>
                    <thead className=' border-b-2 border-gray-400'>
                        <tr className=' text-xs font-semibold text-left'>
                            <th className='py-2 w-2/5'>Name</th>
                            <th className='py-2 w-1/5'>RTN</th>
                            <th className='py-2 w-3/10 text-right'>Balance | Overdue</th>
                            <th className='py-2 w-1/10 text-right'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            customers.map((customer, index) => {
                                return (
                                    <tr key={'customer' + index} className='border-b border-gray-200'>
                                        <td className='py-2'>{customer.name}</td>
                                        <td>{customer.RTN}</td>
                                        <td className='text-right'>
                                            <span className='block'>L{total(customer)}HNL</span>
                                            <span className='block text-red-600'>L{overDue(customer)}HNL Overdue</span>
                                        </td>
                                        <td className='col-span-4 pr-4 text-blue-700 text-right font-semibold'>
                                            <button onClick={(e) => editHandler(e, customer)}>Edit</button>
                                        </td>
                                    </tr>
                                )
                            })
                        }

                    </tbody>
                </table>

                <CustomerModal modalIsOpen={openModal} closeModal={closeModal}></CustomerModal>
                <CustomerEdit modalIsOpen={editModal} closeModal={closeEditModal} content={content}></CustomerEdit>
            </div>
        </>
    );
}
export default Customers;