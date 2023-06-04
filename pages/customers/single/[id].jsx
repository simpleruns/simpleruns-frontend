import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { instance } from 'helpers/axios';

import InfoBoxCard from "components/card/info";

const CustomerDetail = () => {
    const [data, setData] = useState(null);
    const [status, setStatus] = useState(true);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        id && instance.get(`/admin/customers/${id}`)
            .then((res) => {
                setData({
                    photo: res.data.photo,
                    companyName: res.data.companyName,
                    email: res.data.email,
                    phone: res.data.phone,
                    rateType: res.data.rateType,
                    loadRate: res.data.loadRate,
                    fuelRate: res.data.fuelRate,
                    localRate: res.data.localRate,
                    countryRate: res.data.countryRate,
                    address: res.data.address,
                    abn: res.data.abn,
                    approved: res.data.approved
                });
                setStatus(res.data.approved);
            }).catch(error => {
                console.log(error.message);
            });
    }, [router, id]);

    const setStatusHandler = () => {
        instance.put(`/admin/customers/approve/${id}`)
            .then((res) => {
                setStatus(!status);
            }).catch(error => {
                console.log(error.message);
            });
    }

    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="max-w-100 md:max-w-[75%] px-4 py-8 mx-auto lg:py-16">
                <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Customer Detail</h2>

                {
                    data ?
                        <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                            <div className="sm:col-span-2">
                                <div className="flex items-center w-full">
                                    <img className="mr-4 mb-4 w-[20rem] object-cover" width={130} height={130} src={data.photo.url} alt="Customer User Image" />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <InfoBoxCard title="Company Name" content={data.companyName} />
                            </div>
                            <div className="w-full">
                                <InfoBoxCard title="Company Email" content={data.email} />
                            </div>
                            <div className="w-full">
                                <InfoBoxCard title="Company Phone" content={data.phone} />
                            </div>
                            <div className="w-full">
                                <InfoBoxCard title="Company ABN" content={data.abn} />
                            </div>
                            <div className="w-full">
                                <InfoBoxCard title="Rate Type" content={data.rateType} />
                            </div>
                            <div className="w-full">
                                <InfoBoxCard title="Load Rate" content={data.loadRate} />
                            </div>
                            <div className="w-full">
                                <InfoBoxCard title="Fuel Levy" content={data.fuelRate} />
                            </div>
                            <div className="w-full">
                                <InfoBoxCard title="Local Rate" content={data.localRate} />
                            </div>
                            <div className="w-full">
                                <InfoBoxCard title="Country Rate" content={data.countryRate} />
                            </div>
                            <div className="w-full">
                                <InfoBoxCard title="Company Address" content={data.address} />
                            </div>
                            <div className="sm:col-span-2">
                                {
                                    status ?
                                        <button type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" onClick={setStatusHandler}>Disable This Account</button> :
                                        <button type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" onClick={setStatusHandler}>Activate This Account</button>
                                }
                                <Link href="/customers">
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

export default CustomerDetail;