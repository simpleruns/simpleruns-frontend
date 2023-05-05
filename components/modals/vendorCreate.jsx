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
        width: '50%',
        height: '60%',

    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.2)'
    }
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#__next');

function VendorModal({ modalIsOpen, closeModal }) {
    let subtitle;

    // function afterOpenModal() {
    //     // references are now sync'd and can be accessed.
    //     subtitle.style.color = '#332';
    // }
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const onSubmit = (data) => {
        instance.post("/vendor/create", data).then((res) => {
            if (res.status) {
                reset();
                closeModal();
            }
        })
    };



    return (

        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
        >
            <div className=' pt-10'>
                <h2 className='text-3xl mb-10 font-bold'>Create a Vendor</h2>
                <div className='w-8/9'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="md:flex  mb-6">
                            <div className='md:w-1/4'>
                                <label className="block text-gray-500 font-bold  mb-1 md:mb-0 pr-4" htmlFor="name">
                                    Name*
                                </label>
                            </div>
                            <div className='md:w-1/3'>
                                <input className='bg-white  appearance-none border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500' type="text" name="name" {...register("name")} />
                            </div>
                        </div>
                        <div className="md:flex  mb-6">
                            <div className='md:w-1/4'>
                                <label className="block text-gray-500 font-bold  mb-1 md:mb-0 pr-4" htmlFor="email">
                                    Email*
                                </label>
                            </div>
                            <div className='md:w-1/3'>
                                <input className='bg-white  appearance-none border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500' type="text" name="name" {...register("email")} />
                            </div>
                        </div>
                        <div className="md:flex  mb-6">
                            <div className='md:w-1/4'>
                                <label className="block text-gray-500 font-bold mb-1 md:mb-0 pr-4" htmlFor="rtn">
                                    Sales Tax
                                </label>
                            </div>
                            <div className='md:w-1/3'>
                                <input className='bg-white  appearance-none border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500' type="number" name="method" {...register("method")} />
                            </div>
                        </div>
                        <div className="md:flex ">
                            <div className="md:w-1/3">
                                <button className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
                                    Create
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
}

export default VendorModal;