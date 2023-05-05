import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import { instance } from '../../helpers/axios';

const customStyles = {
    content: {
        top: '50%',
        left: '60%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '40%',
        height: '40%',
        backgroundColor: 'rgb(0,0,0)',

    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.2)'
    }
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#__next');

function LicenseModal({ modalIsOpen, closeModal }) {
    let subtitle;


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const onSubmit = (data) => {
        instance.post('/license', data)
            .then((res) => {
                closeModal();
            })

    };





    return (

        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <div className=' bg-black'>
                <h4 className='text-xl mb-6 text-white font-bold'>Please Complete this information</h4>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="md:flex md:items-center mb-4">
                            <div className='md:w-1/4'>
                                <label className="block text-white font-bold  mb-1 md:mb-0 pr-4" htmlFor="CAI">
                                    CAI*
                                </label>
                            </div>
                            <div className='md:w-1/2'>
                                <input className='bg-white  appearance-none border  rounded w-full py-2 px-4 text-black leading-tight focus:outline-none focus:bg-white' type="text" name="CAI" {...register("CAI")} />
                            </div>
                        </div>
                        <div className="md:flex md:items-center mb-4">
                            <div className='md:w-1/4'>
                                <label className="block text-white font-bold mb-1 md:mb-0 pr-4" htmlFor="RANGO">
                                    RANGO*
                                </label>
                            </div>
                            <div className='md:w-3/4 grid grid-cols-12 gap-3'>
                                <div className='col-span-6'>
                                    <input className='bg-white  appearance-none border border-gray-200 rounded w-full py-2 px-4 text-black leading-tight focus:outline-none focus:bg-white' type="text" name="firstInvoice" id='firstInvoice' {...register("firstInvoice")} />
                                </div>
                                <div className='col-span-6'>
                                    <input className='bg-white  appearance-none border border-gray-200 rounded w-full py-2 px-4 text-black leading-tight focus:outline-none focus:bg-white' type="text" name="lastInvoice" id='lastInvoice' {...register("lastInvoice")} />
                                </div>
                            </div>
                        </div>
                        <div className="md:flex md:items-center mb-4">
                            <div className='md:w-1/4'>
                                <label className="block text-white font-bold mb-1 md:mb-0 pr-4" htmlFor="rtn">
                                    FECHA LIMITE
                                </label>
                            </div>
                            <div className='md:w-1/3'>
                                <input className='bg-white  appearance-none border border-gray-200 rounded w-full py-2 px-4 text-black leading-tight focus:outline-none focus:bg-white' type="date" name="expireDate" {...register("expireDate")} />
                            </div>
                        </div>
                        <div className="md:flex md:items-center">
                            <div className="md:w-1/3">
                                <button type="submit" className="shadow bg-red-700 hover:bg-red-800 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" >
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
}

export default LicenseModal;