import React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Link from "next/link";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { instance } from '../../helpers/axios';
import authImg from "../../public/assets/img/auth/auth-register.jpg";

const Register = () => {
    const validationSchema = Yup.object().shape({
        firstname: Yup.string().required('First Name is required'),
        lastname: Yup.string().required('Last Name is required'),
        email: Yup.string().email('Invalid Email').required('email is required'),
        phone: Yup.string().matches(/^\d{10}$/, 'Phone number must be 10 digits').required('phone number is required'),
        password: Yup.string().required('Password is required'),
        confirm: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Password is required')
    });

    const router = useRouter();

    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, handleSubmit, setError, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(data) {
        instance.post('/users', data)
            .then((response) => { (response.status == 200) && router.push('/auth/login'); })
            .catch((err) => { console.log(err); });
    }

    return (
        <div className='relative float-right h-full min-h-screen w-full !bg-white dark:!bg-navy-900'>
            <main className="mx-auto min-h-screen">
                <div className="relative flex">
                    <div className="mx-auto flex w-full justify-start pt-12 md:max-w-[75%] lg:max-w-[1013px] min-h-screen lg:pt-0 xl:max-w-[1383px] xl:px-0 pl-0 no-scrollbar">
                        <div className="flex flex-col pl-5 pr-5 w-full lg:max-w-full">
                            <div className="flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:items-center lg:justify-end">
                                <div className="w-full max-w-full flex-col items-center md:pr-4 lg:pr-0 xl:pr-[70px] pt-10 pb-10 lg:max-w-[420px] xl:max-w-[580px]">
                                    <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
                                        Sign Up
                                    </h4>
                                    <p className="mb-5 ml-1 text-base text-gray-600">
                                        Create your simpleruns account!
                                    </p>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="mt-4">
                                                <label className="block text-sm text-navy-700 dark:text-white font-medium" htmlFor="First Name">First Name*</label>
                                                <input type="text" placeholder="First Name..." {...register('firstname')}
                                                    name="firstname" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
                                                {errors.firstname && <p className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{errors.firstname.message}</p>}
                                            </div>
                                            <div className="mt-4">
                                                <label className="block text-sm text-navy-700 dark:text-white font-medium" htmlFor="Last Name">Last Name*</label>
                                                <input type="text" placeholder="Last Name..." {...register('lastname')}
                                                    name="lastname" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
                                                {errors.lastname && <p className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{errors.lastname.message}</p>}
                                            </div>
                                            <div className="mt-4">
                                                <label className="block text-sm text-navy-700 dark:text-white font-medium" htmlFor="email">Email*</label>
                                                <input type="text" placeholder="Email..." {...register('email')}
                                                    name="email" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
                                                {errors.email && <p className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{errors.email.message}</p>}
                                            </div>
                                            <div className="mt-4">
                                                <label className="block text-sm text-navy-700 dark:text-white font-medium" htmlFor="phone">Phone*</label>
                                                <input type="tel" placeholder="Phone..." {...register('phone')}
                                                    name="phone" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
                                                {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{errors.phone.message}</p>}
                                            </div>
                                            <div className="mt-4">
                                                <label className="block text-sm text-navy-700 dark:text-white font-medium" htmlFor="password">Password*</label>
                                                <input type="password" placeholder="Password..." {...register('password')}
                                                    name="password" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
                                                {errors.password && <p className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{errors.password.message}</p>}
                                            </div>
                                            <div className="mt-4">
                                                <label className="block text-sm text-navy-700 dark:text-white font-medium" htmlFor="confirm">Confirm*</label>
                                                <input type="text" placeholder="Rewrite Password..." {...register('confirm')}
                                                    name="confirm" className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
                                                {errors.confirm && <p className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{errors.confirm.message}</p>}
                                            </div>
                                        </div>
                                        <div className="flex mt-4">
                                            <button type='submit' className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">Create
                                                Account</button>
                                        </div>
                                    </form>
                                    <div className="mt-6 text-grey-dark">
                                        <span className=" text-sm font-medium text-navy-700 dark:text-gray-600 mr-4">
                                            Already have an account?
                                        </span>
                                        <Link className="ml-1 text-sm font-medium text-brand-300 hover:text-brand-600 dark:text-white dark:hover:text-white-600 transition" href="/auth/login">
                                            Log in
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute left-0 hidden h-full min-h-screen md:block lg:w-[49vw] 2xl:w-[44vw]">
                                <div
                                    className="absolute flex h-full w-full items-end justify-center bg-cover bg-center bg-contain bg-no-repeat bg-left-bottom"
                                    style={{ backgroundImage: `url(${authImg.src})` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
export default Register;