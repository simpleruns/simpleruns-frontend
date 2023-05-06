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
        var title = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        title === '/' || title === '' ? setPageTitle('Welcome') : setPageTitle(title);
    }, [router]);

    const pathSegments = router.asPath.split('/').filter((segment) => segment !== '');

    const breadcrumbItems = pathSegments.map((segment, index) => {
        const href = `/${pathSegments.slice(0, index + 1).join('/')}`;

        return (
            <Link href={href} key={segment} className="text-white transition">
                {segment}
            </Link>
        );
    });

    return (
        <div className="bg-cover bg-center h-30 mb-[20px] lg:h-40 flex items-center justify-between rounded-b-md" style={{ backgroundImage: `url('${authImg.src}')` }}>
            <div className="container mx-auto px-[20px]">
                <div className="flex items-center justify-between">
                    <Typography variant="h2" className="text-2xl font-bold text-white transition capitalize">{pageTitle}</Typography>
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