import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useForm, useFieldArray } from 'react-hook-form';
import { instance } from '../../helpers/axios';
import html2pdf from 'html2pdf.js';

const customStyles = {
    content: {
        top: '50%',
        left: '60%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '70%',
        height: '70%',

    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.2)'
    }
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#__next');

function InvoiceModal({ modalIsOpen, closeModal, license, invoiceNumber, customers, products }) {

    const [subTotal, setSubTotal] = useState(0.00);
    const [total, setTotal] = useState(0.00);
    const [tax, setTax] = useState(0.00);

    const [customerRTN, setCustomerRTN] = useState('');
    const [invoices, setInvoices] = useState([]);


    const {
        control,
        register,
        handleSubmit,
        getValues,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
        }
    });
    const { fields, append, prepend, remove } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "items", // unique name for your Field Array
    });
    const onSubmit = (data) => {
        instance.post('/invoice/create', { ...data, invoiceNumber, total, })
            .then((res) => {

                if (res.status == 200) {
                    reset();
                    closeModal();
                }
            });
    };

    function calSubTotalHandler(event, index) {
        let item = getValues('item');
        var totalPrice = 0;
        item[index].subTotal = item[index].price * item[index].qty * (100 - item[index].discount) / 100;
        setValue(`item[${index}].subTotal`, item[index].subTotal);
        item.map((el) => {
            totalPrice += el.subTotal;
        })
        setSubTotal(totalPrice.toFixed(2));
        setTotal(totalPrice.toFixed(2));
    }

    function productChangeHandler(event, index) {
        let id = event.currentTarget.value;
        let item = products.find((item) => item._id == id);
        setValue(`item[${index}].price`, item.price);
        calSubTotalHandler(event, index);

    }

    function taxChangeHandler(event) {
        let taxType = event.currentTarget.value;
        setTotal((subTotal * (100 + parseInt(taxType)) / 100).toFixed(2));
        setTax(subTotal * taxType / 100);
    }

    function customerChangeHandler(event) {
        let customer = customers.find((elements) => elements._id == event.currentTarget.value);
        setCustomerRTN(customer.RTN);
    }

    function pdfHandler() {
        const element = document.getElementById('invoice-modal');
        html2pdf(element);
    }


    return (

        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <form id='invoice-modal' onSubmit={handleSubmit(onSubmit)} >
                <div className='grid grid-cols-12 gap-5 mb-10'>
                    <div className='col-span-3'>
                        <select className='text-sm font-bold text-gray-900 bg-white appearance-none border border-gray-200 rounded-lg w-full py-14 px-20 leading-tight focus:outline-none focus:bg-white' name="salutation" id="salutation" {...register("salutation")}>
                            <option value="default" className='text-sm font-bold text-gray-800'>Add a Customer</option>
                            <option value="Mr">Mr</option>
                            <option value="Mrs">Mrs</option>
                            <option value="Ms">Ms</option>
                            <option value="Miss">Miss</option>
                            <option value="Dr">Dr</option>
                        </select>
                    </div>
                    <div className='col-span-6 text-xs text-gray-900 font-semibold pl-10'>
                        <p>CONSTRUCCIONES CREATIVAS S.de R.L.</p>
                        <p>R.T.N.0801-9019-085303</p>
                        <p>RUBEN DARIO, CENTRO COMERCIAL GOYO, LOCAL #2</p>
                        <p>TEL.8887-3570</p>
                        <p>E-MAIL.concrehn@gmail.com</p>
                        <p className='flex items-center'> <span className='mr-1'>CAI:</span><span className=' inline-block text-center bg-white    text-gray-900 font-semibold leading-tight  ' type="text" name="CAI"   >{license.CAI} </span>
                        </p>
                        <p className='flex items-center'> <span className='mr-1'>RANGO:</span><span className=' inline-block text-center bg-white    text-gray-900 font-semibold leading-tight  ' type="text" name="firstInvoice"> {license ? license.firstInvoice : ''}</span><span className='mx-1'>ai</span>  <span className=' inline-block text-center bg-white   text-gray-900 font-semibold leading-tight  '>{license ? license.lastInvoice : ''}</span>
                        </p>
                        <p className='flex items-center'> <span className='mr-1'>FECHA LIMITE EMISION:</span><span className=' inline-block text-center bg-white   text-gray-900 font-semibold leading-tight  '>{license ? license.expireDate : ''}</span>
                        </p>

                    </div>
                    <div className='col-span-3 '>
                        <label className="block bg-gray-900 text-white text-md font-bold mb-1 md:mb-0 pr-4 py-2 text-center uppercase" htmlFor="invoiceNumber">
                            Invoice Number
                        </label>
                        <span className='block text-center bg-white  w-full py-2 px-4 text-lg text-gray-900 font-semibold leading-tight  '  >{invoiceNumber}</span>

                    </div>
                </div>
                <div className='grid grid-cols-12'>
                    <div className='flex items-center col-span-4'>
                        <label className="block  text-md font-semibold mb-1 md:mb-0 pr-4 py-2 text-center " htmlFor="customer">
                            Client:
                        </label>
                        <select className=' text-center bg-white  appearance-none border-none outline-none rounded w-full py-2 px-4 text-lg text-gray-900 font-semibold leading-tight  focus:bg-white autofill:bg-none' type="text" name="customer" {...register("customer")} onChange={customerChangeHandler}>
                            <option value="default">Click here</option>
                            {
                                customers.map((item, index) => {
                                    return (

                                        <option key={"option" + index} value={item._id}>{item.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className='flex items-center col-span-4'>
                        <label className="block  text-md font-semibold mb-1 md:mb-0 pr-4 py-2 text-center " htmlFor="customer">
                            RTN:
                        </label>
                        <span className=' text-center bg-white  appearance-none border-none outline-none rounded w-full py-2 px-4 text-lg text-gray-900 font-semibold leading-tight  focus:bg-white autofill:bg-none' type="text"  >{customerRTN}</span>
                    </div>
                    <div className='flex items-center col-span-4'>
                        <label className="block  text-md font-semibold mb-1 md:mb-0 pr-4 py-2 text-center " htmlFor="invoiceDate">
                            Fecha:
                        </label>
                        <input type="Date" className=' text-center bg-white  appearance-none border-none outline-none rounded w-full py-2 px-4 text-lg text-gray-900 font-semibold leading-tight  focus:bg-white autofill:bg-none' name='invoiceDate' {...register('invoiceDate')} />
                    </div>

                </div>
                <table className='table-auto w-full'>
                    <thead className=' border-b-2 bg-gray-200 border-gray-400'>
                        <tr className='px-4 text-xs font-semibold text-left'>
                            <th className='py-1 px-4 w-1/6'>Item</th>
                            <th className='py-2 px-4 w-2/5'>Description</th>
                            <th className='py-2 px-4 w-1/12'>Amount</th>
                            <th className='py-2 px-4 w-1/6'>Percio</th>
                            <th className='py-2 px-4 w-1/6'>Descuetos</th>
                            <th className='py-2 px-4 w-1/12'>Sub-Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            fields.map((item, index) => {
                                return (
                                    <tr key={'item-' + index} className='border-b border-solid border-gray-200'>
                                        <select className=' w-full pt-1 pb-2 px-2 leading-normal border border-gray-200 rounded-lg' name={`item[${index}].product`} {...register(`item.${index}.product`, { onChange: (e) => { productChangeHandler(e, index) } })}>
                                            <option value="default">Choose</option>
                                            {
                                                products.map((product, index) => {
                                                    return (
                                                        <option key={'product-' + index} value={product._id}>{product.name}</option>
                                                    )
                                                })
                                            }
                                        </select>

                                        <td className='py-2 px-2 w-2/5'>
                                            <textarea className='w-full py-1 px-2 leading-normal border border-gray-200 rounded-lg focus:outline-none' name={`item[${index}].description`} {...register(`item.${index}.description`)} cols="10" rows="1"></textarea>
                                        </td>
                                        <td className='py-2 px-2 w-1/6'>
                                            <input className='w-full py-1 px-2 leading-normal border border-gray-200 rounded-lg  focus:outline-none' type="number" step="0.001" name={`item[${index}].qty`} {...register(`item.${index}.qty`, { onChange: (e) => { calSubTotalHandler(e, index) } })} defaultValue={1} />
                                        </td>
                                        <td className='py-2 px-2 w-1/6'>
                                            <input className='w-full py-1 px-2 leading-normal border border-gray-200 rounded-lg  focus:outline-none' type="number" step="0.001" name={`item[${index}].price`} {...register(`item.${index}.price`, { onChange: (e) => { calSubTotalHandler(e, index) } })} />
                                        </td>
                                        <td className='py-2 px-2 w-1/6'>
                                            <input className='w-full py-1 px-2 leading-normal border border-gray-200 rounded-lg  focus:outline-none' type="number" step="0.001" name={`item[${index}].discount`} {...register(`item.${index}.discount`, { onChange: (e) => { calSubTotalHandler(e, index) } })} defaultValue={0} />
                                        </td>
                                        <td className='py-2 px-2 w-1/6 flex items-center'>
                                            <input className='  w-20 py-1 px-2 leading-normal border border-gray-200 rounded-lg  focus:outline-none' type="number" step="0.001" name={`item[${index}].subTotal`} {...register(`item.${index}.subTotal`)} />
                                            <button type="button" className='ml-4 text-red-600' onClick={() => remove(index)}>Delete</button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>

                </table>
                <button type="button" onClick={() => append({})} className='block w-full py-2 font-semibold text-xs border-b border-gray-200 text-left'>Add an item</button>
                <div className='grid grid-cols-12'>
                    <div className='col-span-6'>
                        <div className='flex items-center'>
                            <span>total:</span>
                            <span>{total}</span>
                        </div>
                        <div className='flex items-center'>
                            <span>total without tax:</span>
                            <span>{subTotal}</span>
                        </div>
                    </div>
                </div>
                <div className='text-xs text-right  font-medium mt-10'>
                    <span>Subtotal</span>
                    <span className=' inline-block ml-10'>L {subTotal}HNL</span>
                </div>
                <div className='flex justify-end items-center py-2 font-semibold text-xs'>
                    <label htmlFor="tax">Tax Type:</label>
                    <select onChange={taxChangeHandler} name="tax" id="tax">
                        <option value="0">0%</option>
                        <option value="15">15%</option>
                        <option value="18">18%</option>
                    </select>
                </div>
                <div className='flex justify-end items-center py-2 font-semibold text-xs'>
                    <label htmlFor="tax">Tax:</label>
                    <span>L {tax.toFixed(2)}HNL</span>
                </div>
                <div className='text-xs text-right  font-medium mt-4'>
                    <span>Total</span>
                    <select name="invoiceCurrency" id="invoiceCurrency" className='ml-5'>
                        <option value="HNL">HNL(L)-Lempira</option>
                        <option value="USD">United States Dollar</option>
                    </select>
                    <span className=' inline-block ml-10'>L {total}HNL</span>
                </div>
                <button type="submit" className="shadow ml-auto mt-6 border border-blue-800 text-blue-800 hover:bg-blue-800 focus:shadow-outline focus:outline-none hover:text-white text-xs font-semibold py-1 px-4 rounded-full transition-colors duration-300" >
                    Add New Invoice
                </button>
                <button onClick={pdfHandler} className="shadow ml-auto mt-6 border border-blue-800 text-blue-800 hover:bg-blue-800 focus:shadow-outline focus:outline-none hover:text-white text-xs font-semibold py-1 px-4 rounded-full transition-colors duration-300" >
                    Print as pdf
                </button>

            </form>
        </Modal>
    );
}

export default InvoiceModal;