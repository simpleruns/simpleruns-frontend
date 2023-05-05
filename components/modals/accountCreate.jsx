import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import { accountType } from '../../helpers/account-type';
import { instance } from '../../helpers/axios';

const customStyles = {
    content: {
        top: '50%',
        left: '60%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '30%',
        height: '60%',

    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.2)'
    }
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#__next');

function AccountModal({ modalIsOpen, closeModal }) {

    const [typeKeys, setTypeKeys] = useState([]);

    useEffect(() => {
        setTypeKeys(Object.keys(accountType));
    }, []);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const onSubmit = (data) => {
        let parent = 'Asset';
        for (const [key, value] of Object.entries(accountType)) {

            if (value.includes(data.type)) {
                parent = key;
            }

        }

        instance.post('/account/create', { ...data, parent }).then((res) => {
            if (res.status == 200) {
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
            contentLabel="Example Modal"
        >
            <div className=' pt-4'>
                <h2 className='text-base mb-6 pb-3 font-semibold border-b border-gray-200'>Add an Account</h2>
                <div className='w-8/9'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='mb-4'>
                            <label htmlFor="type" className='block pl-4 mb-2 text-xs font-semibold '>Account Type*</label>
                            <select className='bg-white appearance-none border border-gray-200 rounded w-full py-2 px-4 italic text-xs text-gray-400  leading-tight focus:outline-none focus:bg-white focus:border-purple-500' name="type" id="type" {...register("type")}>
                                {
                                    typeKeys.map((item, index1) => (
                                        <optgroup key={"group-" + index1} label={item}>
                                            {
                                                accountType[item].map((type, index2) => (
                                                    <option value={type} key={'option' + index2}>{type}</option>
                                                ))
                                            }
                                        </optgroup>
                                    ))
                                }
                            </select>

                        </div>
                        <div className='mb-4'>
                            <label htmlFor="name" className='block pl-4 mb-2 text-xs font-semibold '>Account Name*</label>
                            <input className='bg-white appearance-none border border-gray-200 rounded w-full py-2 px-4 italic text-xs text-gray-400  leading-tight focus:outline-none focus:bg-white focus:border-purple-500' name="name" id="name" placeholder='Write an Account Name' {...register("name")} />
                        </div>
                        <div className='pb-3 mb-2 border-b border-gray-200'>
                            <label htmlFor="name" className='block pl-4 mb-2 text-xs font-semibold '>Description*</label>
                            <textarea rows={4} className='bg-white appearance-none border border-gray-200 rounded w-full py-2 px-4 italic text-xs text-gray-400  leading-tight focus:outline-none focus:bg-white focus:border-purple-500' name="description" id="description" {...register("description")} />
                        </div>

                        <div className="md:flex md:items-center">
                            <button className="shadow ml-auto mr-2 border border-purple-500 text-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none hover:text-white text-xs font-semibold py-1 px-4 rounded-full" onClick={closeModal} type="button">
                                Cancel
                            </button>
                            <button className="shadow border border-purple-500 bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white text-xs font-semibold py-1 px-4 rounded-full" type="submit">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
}

export default AccountModal;