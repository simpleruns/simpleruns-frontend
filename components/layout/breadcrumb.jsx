import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Link from "next/link";

import {
    Typography,
    Breadcrumbs
} from "@material-tailwind/react";

import authImg from "public/assets/img/page-header.jpg";

const Breadcrumb = () => {
    const [pageTitle, setPageTitle] = useState('Home');
    const router = useRouter();

    useEffect(() => {
        var title = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
        title === '/' || title === '' ? setPageTitle('Welcome') : window.location.pathname.includes('drivers/single') ? setPageTitle('Driver Detail') : window.location.pathname.includes('drivers/edit') ? setPageTitle('Edit Driver Detail') : window.location.pathname.includes('customers/single') ? setPageTitle('Customer Detail') : window.location.pathname.includes('customers/edit') ? setPageTitle('Edit Customer Detail') : window.location.pathname.includes('invoices/single') ? setPageTitle('Invoice Detail') : setPageTitle(title);
    }, [router]);

    const pathSegments = window.location.pathname
        .split('/')
        .filter((segment) => segment !== '');

    const breadcrumbItems = pathSegments.map((segment, index) => {
        return (
            <span key={segment} className="text-white transition">
                {segment}
            </span>
        );
    });

    return (
        <div className="bg-cover bg-center h-28 mb-[20px] lg:h-[12rem] flex items-center justify-between rounded-b-md page-header overflow-hidden relative" style={{ backgroundImage: `url('${authImg.src}')` }}>
            <div className="container mx-auto px-[20px] max-w-full z-10">
                <div className="flex items-center justify-between mt-6">
                    <Typography variant="h2" className="text-3xl font-bold text-white transition capitalize">{pageTitle}</Typography>
                    <Breadcrumbs className="text-white">
                        <Link href="/" className="opacity-60 text-white hover:opacity-100 transition">
                            Home
                        </Link>
                        {breadcrumbItems}
                    </Breadcrumbs>
                </div>
            </div>
        </div>
    );
};

export default Breadcrumb;