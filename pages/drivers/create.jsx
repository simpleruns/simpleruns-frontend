import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAtom } from 'jotai';
import { idAtom } from '../../helpers/authorize';
import { instance } from '../../helpers/axios';

const Business = () => {
    const [user, __] = useAtom(idAtom);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const onSubmit = (data) => {
        instance.post('/business/create', { ...data, user })
            .then((res) => {
                console.log(res);
            })
    };


    return (
        <div className=' pt-10'>
            <h2 className='text-3xl ml-96 pl-10 mb-10 font-bold'>Create a Business</h2>
            <div className='w-8/9'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="md:flex md:items-center mb-6">
                        <div className='md:w-1/2'>
                            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-full-name">
                                Company Name*
                            </label>
                        </div>
                        <div className='md:w-1/3'>
                            <input className='bg-white  appearance-none border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500' type="text" name="name" {...register("name")} />

                        </div>
                    </div>
                    <div className="md:flex md:items-center mb-6">
                        <div className='md:w-1/2'>
                            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="inline-password">
                                Business Currency*
                            </label>
                        </div>
                        <div className='md:w-1/3'>
                            <select className='bg-white appearance-none border border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500' name="currency" id="currency" {...register("currency")}>
                                <option value="USD">United States Dollar</option>
                                <option value="HNL">Honduran Lempira</option>
                            </select>

                        </div>
                    </div>
                    <div className="md:flex md:items-center">
                        <div className="md:w-1/2"></div>
                        <div className="md:w-1/3">
                            <button type="submit" className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" >
                                Create Business
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default Business;