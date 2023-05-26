import { Typography } from '@material-tailwind/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const PageOverlay = () => {
    const [show, setShow] = useState(false);

    const router = useRouter();

    const handleRouteChangeStart = () => {
        setShow(true);
    };

    const handleRouteChangeComplete = () => {
        setTimeout(() => {
            setShow(false);
        }, 300);
    };

    useEffect(() => {
        router.events.on('routeChangeStart', handleRouteChangeStart);
        router.events.on('routeChangeComplete', handleRouteChangeComplete);
        window.addEventListener('load', handleRouteChangeStart);

        return () => {
            router.events.off('routeChangeStart', handleRouteChangeStart);
            router.events.off('routeChangeComplete', handleRouteChangeComplete);
            window.removeEventListener('load', handleRouteChangeStart);
        }
    }, [router.events]);

    return (
        <div className={`page-overlay fixed inset-0 z-[100] bg-[#000000] transition-all bg-opacity-90 ${show ? "" : "hidden"}`}>
            <div className='w-full h-full bg-white flex items-center justify-center'>
                <Typography variant="h2" className="text-3xl font-bold text-[#000] transition capitalize">Loading...</Typography>
            </div>
        </div>
    );
};

export default PageOverlay;