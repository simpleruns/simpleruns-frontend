import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { instance } from 'helpers/axios';

import InfoBoxCard from "components/card/info";

const SingleDriverDetail = () => {
    const [data, setData] = useState(null);
    const [status, setStatus] = useState(true);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        id && instance.get(`/admin/drivers/${id}`)
            .then((res) => {
                setData({
                    firstname: res.data.firstname,
                    lastname: res.data.lastname,
                    email: res.data.email,
                    phone: res.data.phone,
                    password: res.data.password,
                    confirm: res.data.password,
                    year: res.data.year,
                    numberPlate: res.data.numberPlate,
                    VIN: res.data.VIN,
                    approved: res.data.approved
                });
                setStatus(res.data.approved);
            }).catch(error => {
                console.log(error.message);
            });
    }, [router]);

    const setStatusHandler = () => {
        instance.put(`/admin/drivers/approve/${id}`)
            .then((res) => {
                setStatus(!status);
                console.log(res.data);
            }).catch(error => {
                console.log(error.message);
            });
    }

    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="max-w-[75%] px-4 py-8 mx-auto lg:py-16">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Driver Detail</h2>

                {
                    data ?
                        <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                            <div className="sm:col-span-2">
                                <div className="flex items-center w-full">
                                    <img className="mb-0 mr-4 w-[8rem] h-[8rem] rounded-full" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/helene-engels.png" alt="Helene avatar" />
                                </div>
                            </div>

                            <div className="w-full">
                                <InfoBoxCard title="Name" content={data.firstname + ' ' + data.lastname} />
                            </div>
                            <div className="w-full">
                                <InfoBoxCard title="Email" content={data.email} />
                            </div>
                            <div className="w-full">
                                <InfoBoxCard title="Phone" content={data.phone} />
                            </div>

                            <h2 className="sm:col-span-2 mt-6 mb-4 text-xl font-bold text-gray-900 dark:text-white">Vehicle Info</h2>

                            <div className="w-full">
                                <InfoBoxCard title="Year" content={data.year} />
                            </div>
                            <div className="w-full">
                                <InfoBoxCard title="Number Plate" content={data.numberPlate} />
                            </div>
                            <div className="w-full">
                                <InfoBoxCard title="VIN" content={data.VIN} />
                            </div>
                            <div className="sm:col-span-2">
                                {
                                    status ?
                                        <button type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" onClick={setStatusHandler}>Disable This Account</button> :
                                        <button type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" onClick={setStatusHandler}>Activate This Account</button>
                                }
                                <Link href="/drivers">
                                    <button type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 opacity-90">Back</button>
                                </Link>
                            </div>
                        </div>
                        :
                        <div>Loading...</div>
                }
            </div>
        </section>
    );
}

export default SingleDriverDetail;