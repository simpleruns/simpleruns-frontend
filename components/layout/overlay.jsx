import { Typography } from '@material-tailwind/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const PageOverlay = () => {
    const [show, setShow] = useState(false);

    const router = useRouter();

    useEffect(() => {
        router.events.on('routeChangeStart', () => {
            setShow(true);
        });

        router.events.on('routeChangeComplete', () => {
            setTimeout(() => {
                setShow(false);
            }, 300);
        });

        return () => {
            router.events.off('routeChangeStart', () => {
            });

            router.events.off('routeChangeComplete', () => {
            });
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