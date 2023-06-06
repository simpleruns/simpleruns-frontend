import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import { useRouter } from "next/router";
import Cookies from 'js-cookie';
import Link from "next/link";

import { instance } from 'helpers/axios';
import { idAtom } from "helpers/authorize";

export default function SettingColor(props) {
    const [user, __] = useAtom(idAtom);
    const [data, setData] = useState(null);
    const router = useRouter();
    const [darkmode, setDarkmode] = useState(false);
    const token = Cookies.get('token');

    function changeThemeHandler() {
        setDarkmode(!darkmode);
    }

    useEffect(() => {
        document.body.classList.toggle('dark');
        if (darkmode) {
            !document.body.classList.contains('dark') && document.body.classList.add('dark');
        } else {
            document.body.classList.contains('dark') && document.body.classList.remove('dark');
        }
    }, [darkmode]);

    useEffect(() => {
        user && token && instance.get(`/settings/user/${user}`)
            .then((res) => {
                setData({
                    avatar: res.data.avatar,
                    firstname: res.data.firstname,
                    lastname: res.data.lastname
                });
            }).catch(error => {
                console.log(error.message);
            });
    }, [user, router]);

    function logoutHandler(e) {
        e.preventDefault();
        Cookies.remove('token');
        Cookies.remove('rememberMe');
        router.push('/auth/login');
    }

    return (
        <div className={`mt-[3px] flex h-[61px] backdrop-blur-xl flex-grow items-center justify-around gap-2 rounded-full px-2 py-2 shadow-xl shadow-shadow-500 dark:shadow-none md:flex-grow-0 md:gap-1 xl:gap-2 fixed top-[30px] right-[35px] !z-[99] ${data ? "w-[150px]" : "w-[61px]"}`}>
            <button
                className="border-px flex h-[40px] w-[40px] items-center justify-center rounded-full border-[#6a53ff] bg-gradient-to-br from-brandLinear to-blueSecondary p-0"
                onClick={changeThemeHandler}
            >
                <div className="cursor-pointer text-gray-600">
                    {darkmode ? (
                        <RiSunFill className="h-4 w-4 text-white" />
                    ) : (
                        <RiMoonFill className="h-4 w-4 text-white" />
                    )}
                </div>
            </button>
            {
                data && <div class="relative flex">
                    <div class="flex user-avatar z-[50]">
                        <img class="h-10 w-10 rounded-full object-cover" src={data.avatar.url} alt="User Avatar" /></div>
                    <div class="py-2 top-8 -left-[180px] w-max absolute z-10 origin-top-right transition-all duration-300 ease-in-out scale-100 user-profile-dropdown">
                        <div class="flex w-56 flex-col justify-start rounded-[5px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
                            <div class="mt-3 ml-4">
                                <div class="flex items-center gap-2">
                                    <p class="text-sm font-bold text-navy-700 dark:text-white">👋 Hey, {data.firstname + ' ' + data.lastname}</p>
                                </div>
                            </div>
                            <div class="mt-3 h-px w-full bg-gray-200 dark:bg-white/20 "></div>
                            <div class="mt-3 ml-4 pb-3 flex flex-col">
                                <Link href="/settings/profile" class="text-sm text-gray-800 dark:text-white hover:dark:text-white">Profile Settings</Link>
                                <Link href="/" class="mt-3 text-sm font-medium text-red-500 hover:text-red-500" onClick={logoutHandler}>Sign Out</Link>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}
