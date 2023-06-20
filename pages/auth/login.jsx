import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from "next/link";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { useCookies } from "react-cookie"
import { useAtom } from 'jotai';
import { idAtom } from 'helpers/authorize';
import { instance } from 'helpers/axios';

import authImg from "public/assets/img/auth/auth-login.jpg";

const Login = () => {
    const router = useRouter();
    const [cookie, setCookie] = useCookies(["rememberMe"]);
    const [user, setUser] = useAtom(idAtom);
    const [rememberMe, setRememberMe] = useState(false);

    const [errorStatus, setErrorStatus] = useState(false);

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid Email').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, setError, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(data) {
        instance.post('/users/login', data)
            .then((res) => {
                setUser(res.data.id);
                setCookie("token", JSON.stringify(res.data.token), {
                    path: '/',
                    maxAge: 3600 * 24,
                    sameSite: true,
                })
                if (rememberMe) {
                    setCookie("rememberMe", true, {
                        path: '/',
                        maxAge: 3600 * 24 * 7,
                        sameSite: true,
                    })
                } else {
                    setCookie("rememberMe", false, { path: '/' });
                }
                setTimeout(() => {
                    const returnUrl = '/';
                    router.push(returnUrl);
                }, 500);
            }).catch(error => {
                setErrorStatus(true);
                setError('apiError', { message: error });
            });
    }

    return (
        <div className='relative float-right h-full min-h-screen w-full !bg-white dark:!bg-navy-900'>
            <main className="mx-auto min-h-screen">
                <div className="relative flex">
                    <div className="mx-auto flex w-full justify-start pt-12 min-h-screen md:pt-0 xl:px-0 pl-0 no-scrollbar">
                        <div className="flex flex-col lg:max-w-[46%] w-full xl:max-w-full">
                            <div className="flex h-full w-full md:w-[50vw] xl:w-[40vw] items-center justify-center px-2 md:mx-0 md:px-0">
                                <div className="w-full max-w-full flex-col items-center xl:pl-[70px] pl-12 pr-12 pt-10 pb-10 lg:max-w-[420px] xl:max-w-[580px]">
                                    <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
                                        Sign In
                                    </h4>
                                    <p className="mb-9 ml-1 text-base text-gray-600">
                                        Enter your email and password to sign in!
                                    </p>

                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <label className="text-sm text-navy-700 dark:text-white font-medium" htmlFor="email">Email*</label>
                                        <input type="email" name="email" placeholder="mail@simmmple.com" {...register('email')}
                                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
                                        {errors.email && <p className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{errors.email.message}</p>}

                                        <label className="block text-sm text-navy-700 dark:text-white font-medium mt-6">Password*</label>
                                        <input type="password" name="password" placeholder="Min. 8 characters" {...register('password')}
                                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
                                        {errors.password && <p className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{errors.password.message}</p>}
                                        {errorStatus && <p className="text-red-500 text-xs mt-4 ml-1.5 font-medium">Wrong Email address or Password. Please try again.</p>}

                                        <div className="mt-6 mb-4 flex items-center justify-between px-2">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="defaultCheckbox relative flex h-[20px] min-h-[20px] w-[20px] min-w-[20px] appearance-none items-center justify-center rounded-md border border-gray-300 outline-none transition duration-[0.2s] checked:text-dark hover:cursor-pointer dark:border-white/10 dark:checked:border-none bg-white dark:bg-dark-900"
                                                    name="rememberMe" checked={rememberMe}
                                                    onChange={() => setRememberMe(!rememberMe)}
                                                />

                                                <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
                                                    Remember me?
                                                </p>
                                            </div>
                                            <Link
                                                className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
                                                href="/auth/forgot"
                                            >
                                                Forgot Password?
                                            </Link>
                                        </div>

                                        <button type='submit' className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
                                            Sign In
                                        </button>
                                    </form>

                                    <div className="mt-4 px-2">
                                        <span className=" text-sm font-medium text-navy-700 dark:text-gray-600 mr-4">
                                            Not registered yet?
                                        </span>
                                        <Link
                                            href="/auth/register"
                                            className="ml-1 text-sm font-medium text-brand-300 hover:text-brand-600 dark:text-white transition"
                                        >
                                            Create an account
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute right-0 hidden h-full min-h-screen md:block w-[50vw] xl:w-[60vw]">
                                <div
                                    className="absolute flex h-full w-full items-end justify-center bg-cover bg-center bg-no-repeat"
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
export default Login;