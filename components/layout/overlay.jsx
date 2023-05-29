import { Typography } from '@material-tailwind/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const PageOverlay = () => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, [router]);

    return (
        <div className={`page-overlay fixed inset-0 z-[100] bg-[#000000] transition-all bg-opacity-90 ${loading ? "" : "hidden"}`}>
            <div className='w-full h-full bg-white dark:bg-[#000000] flex items-center justify-center'>
                <Typography variant="h2" className="text-3xl font-bold text-[#000] dark:text-white transition capitalize">Loading...</Typography>
            </div>
        </div>
    );
};

export default PageOverlay;