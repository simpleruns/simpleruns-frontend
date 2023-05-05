import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useForm, useFieldArray } from 'react-hook-form';
import { instance } from '../../helpers/axios';

const customStyles = {
    content: {
        top: '50%',
        left: '60%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '60%',
        height: '70%',

    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.2)'
    }
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#__next');

function BillModal({ modalIsOpen, closeModal, vendors, products }) {


    // function afterOpenModal() {
    //     // references are now sync'd and can be accessed.
    //     subtitle.style.color = '#332';
    // }

    const [subTotal, setSubTotal] = useState(0.00);


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
            items: [{ vendor: 'default', description: '', qty: 1, price: 0, tax: 0 }]
        }
    });

    const { fields, append, prepend, remove } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "items", // unique name for your Field Array
    });

    const onSubmit = (data) => {
        instance.post('/bill/create', { ...data, subTotal }).then((res) => {
            if (res.status == 200) {
                reset();
                closeModal();
            }
        })
    };

    function calSubTotalHandler(event, index) {
        let item = getValues('item');
        var totalPrice = 0;
        item[index].subTotal = item[index].price * item[index].qty * (parseInt(item[index].tax) + 100) / 100;
        setValue(`item[${index}].subTotal`, item[index].subTotal.toFixed(2));
        item.map((el) => {
            totalPrice += parseFloat(el.subTotal);
        })
        setSubTotal(totalPrice.toFixed(2));
    }



    return (

        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <div className=' pt-10'>
                <h2 className='text-3xl mb-10 font-bold'>Add a Bill</h2>
                <div className='w-8/9 '>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='flex'>
                            <div className='w-1/3'>
                                <div className="md:flex md:items-center mb-6">
                                    <div className='md:w-1/3'>
                                        <label className="block text-gray-500 font-bold  mb-1 md:mb-0 pr-4" htmlFor="name">
                                            Vendor*
                                        </label>
                                    </div>
                                    <div className='md:w-1/2'>
                                        <select className='bg-white appearance-none border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500' name="vendor" id="vendor" {...register("vendor")}>
                                            <option value="default">Choose</option>
                                            {
                                                vendors.map((item, index) => {
                                                    return (<option key={'index-' + index} value={item._id}>{item.name}</option>)
                                                })
                                            }

                                        </select>
                                    </div>
                                </div>
                                <div className="md:flex md:items-center mb-6">
                                    <div className='md:w-1/3'>
                                        <label className="block text-gray-500 font-bold  mb-1 md:mb-0 pr-4" htmlFor="currency">
                                            Currency*
                                        </label>
                                    </div>
                                    <div className='md:w-1/2'>
                                        <select className='bg-white appearance-none border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500' name="currency" id="currency" {...register("currency")}>
                                            < option value="default" > Choose</option>
                                            <option value="HNL">HNL-Lempira</option>
                                            <option value="USD">USD</option>

                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className='w-1/3'>
                                <div className="md:flex md:items-center mb-6">
                                    <div className='md:w-1/3'>
                                        <label className="block text-gray-500 font-bold  mb-1 md:mb-0 pr-4" htmlFor="billDate">
                                            Bill Date*
                                        </label>
                                    </div>
                                    <div className='md:w-1/2'>
                                        <input className='bg-white  appearance-none border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500' type="date" name="billDate" id='billDate' placeholder='Bill Date' {...register("billDate")} />
                                    </div>
                                </div>
                                <div className="md:flex md:items-center mb-6">
                                    <div className='md:w-1/3'>
                                        <label className="block text-gray-500 font-bold  mb-1 md:mb-0 pr-4" htmlFor="bill">
                                            Bill *
                                        </label>
                                    </div>
                                    <div className='md:w-1/2'>
                                        <input className='bg-white  appearance-none border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500' type="text" name="bill" id='bill' placeholder='Bill#' {...register("bill")} />
                                    </div>
                                </div>
                            </div>
                            <div className='w-1/3'>
                                <div className="md:flex  mb-6">
                                    <div className='md:w-1/3'>
                                        <label className="block text-gray-500 font-bold  mb-1 md:mb-0 pr-4" htmlFor="note">
                                            Note*
                                        </label>
                                    </div>
                                    <div className='md:w-1/2'>
                                        <textarea className='bg-white  appearance-none border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500' type="text" name="note" id='note'  {...register("note")} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='pt-4 pb-6 px-4 border border-gray-400 rounded-md'>
                            <table className='table-auto w-full'>
                                <thead className=' border-b-2 border-gray-400'>
                                    <tr className=' text-xs font-semibold text-left'>
                                        <th className='w-1/6 py-2'>Item</th>
                                        <th className='w-1/6 py-2'>Description</th>
                                        <th className='w-1/12 py-2'>Qty</th>
                                        <th className='w-1/12 py-2'>Price</th>
                                        <th className='w-1/6 py-2'>Tax</th>
                                        <th className='w-1/3 py-2 text-right'>Amount</th>
                                    </tr>
                                </thead>
                                <tbody className='text-xs font-medium text-gray-600'>
                                    {
                                        fields.map((item, index) => {
                                            return (
                                                <tr key={'item-' + index} className='border-b border-solid border-gray-200'>
                                                    <td className='py-2 px-2 '>
                                                        <select className=' w-full pt-1 pb-2 px-2 leading-normal border border-gray-200 rounded-lg' name={`item[${index}].vendor`} {...register(`item.${index}.vendor`)}>
                                                            <option value="default">Choose</option>
                                                            {
                                                                products.map((item, index) => {
                                                                    return (
                                                                        <option key={'product-' + index} value={item._id}>{item.name}</option>
                                                                    )
                                                                })
                                                            }
                                                        </select>
                                                    </td>
                                                    <td className='py-2 px-2'>
                                                        <textarea className='w-full py-1 px-2 leading-normal border border-gray-200 rounded-lg' name={`item[${index}].description`} {...register(`item.${index}.description`)} cols="10" rows="1"></textarea>
                                                    </td>
                                                    <td className='py-2 px-2'>
                                                        <input className='w-full py-1 px-2 leading-normal border border-gray-200 rounded-lg' type="number" name={`item[${index}].qty`} {...register(`item.${index}.qty`, { onChange: (e) => { calSubTotalHandler(e, index) } })} defaultValue={1} />
                                                    </td>
                                                    <td className='py-2 px-2'>
                                                        <input className='w-full py-1 px-2 leading-normal border border-gray-200 rounded-lg' type="number" name={`item[${index}].price`} {...register(`item.${index}.price`, { onChange: (e) => { calSubTotalHandler(e, index) } })} step="0.01" />
                                                    </td>
                                                    <td className='py-2 px-2'>
                                                        <input className='w-full py-1 px-2 leading-normal border border-gray-200 rounded-lg' type="number" name={`item[${index}].tax`} {...register(`item.${index}.tax`, { onChange: (e) => { calSubTotalHandler(e, index) } })} defaultValue={0} />

                                                    </td>
                                                    <td className='py-2 px-2 text-right'>
                                                        <input className='  w-20 py-1 px-2 leading-normal border border-gray-200 rounded-lg  focus:outline-none' type="number" step="0.001" name={`item[${index}].subTotal`} {...register(`item.${index}.subTotal`)} defaultValue={0} />
                                                        <button type="button" className='ml-4 text-red-600' onClick={() => remove(index)}>Delete</button></td>
                                                </tr>
                                            )
                                        })
                                    }

                                </tbody>
                            </table>
                            <div className='flex justify-between items-center'>
                                <button
                                    type="button"
                                    onClick={() => append({})}
                                    className=" text-blue-600 px-2 py-2"
                                >
                                    Add a line
                                </button>
                                <div className='inline-block text-right ml-auto mr-0'>
                                    <span className='mr-4'>subtotal:</span>
                                    <span>L{subTotal}HNL</span>
                                </div>

                            </div>
                            <div className='text-right'>
                                <span className='mr-4'>Total(HLN):</span>
                                <span>L{subTotal}HNL</span>
                            </div>

                        </div>
                        <button type="submit" className="shadow ml-auto mt-6 border border-blue-800 text-blue-800 hover:bg-blue-800 focus:shadow-outline focus:outline-none hover:text-white text-xs font-semibold py-1 px-4 rounded-full transition-colors duration-300" >
                            Add New Bill
                        </button>
                    </form>
                </div >
            </div >
        </Modal >
    );
}

export default BillModal;