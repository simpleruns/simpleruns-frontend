import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Typography, avatar } from "@material-tailwind/react";
import Link from "next/link";

import { SlDocs } from 'react-icons/sl';

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
                    avatar: res.data.avatar,
                    licensePhoto: res.data.licensePhoto,
                    firstname: res.data.firstname,
                    lastname: res.data.lastname,
                    email: res.data.email,
                    phone: res.data.phone,
                    birthDate: res.data.birthDate,
                    role: res.data.role,
                    password: res.data.password,
                    licenseNumber: res.data.licenseNumber,
                    cardNumber: res.data.cardNumber,
                    publishedDate: res.data.publishedDate,
                    expireDate: res.data.expireDate,
                    licenseClass: res.data.licenseClass,
                    licenseState: res.data.licenseState,
                    insuranceFile: res.data.insuranceFile,
                    workCompensationFile: res.data.workCompensationFile,
                    truckRegistrationFile: res.data.truckRegistrationFile,
                    year: res.data.year,
                    numberPlate: res.data.numberPlate,
                    VIN: res.data.VIN,
                    category: res.data.category,
                    make: res.data.make,
                    model: res.data.model,
                    approved: res.data.approved
                });
                setStatus(res.data.approved);
            }).catch(error => {
                console.log(error.message);
            });
    }, [router, id]);

    const setStatusHandler = () => {
        instance.put(`/admin/drivers/approve/${id}`)
            .then((res) => {
                setStatus(!status);
            }).catch(error => {
                console.log(error.message);
            });
    }

    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="max-w-100 md:max-w-[75%] px-4 py-8 mx-auto lg:py-16">
                <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Driver Detail</h2>

                {
                    data ?
                        <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                            <div className="sm:col-span-2">
                                <div className="flex items-center w-full">
                                    <img className="mr-4 mb-4 w-[20rem] object-cover" width={130} height={130} src={data.avatar.url} alt="Driver User Image" />
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
                            <div className="w-full">
                                <InfoBoxCard title="Date of Birth" content={data.birthDate} />
                            </div>
                            <div className="w-full">
                                <InfoBoxCard title="Role" content={data.role} />
                            </div>
                            <div className="w-full">
                                <InfoBoxCard title="License Number" content={data.licenseNumber} />
                            </div>
                            <div className="w-full">
                                <InfoBoxCard title="Card Number" content={data.cardNumber} />
                            </div>
                            <div className="w-full">
                                <InfoBoxCard title="Published Date" content={data.publishedDate} />
                            </div>
                            <div className="w-full">
                                <InfoBoxCard title="Expiration Date" content={data.expireDate} />
                            </div>
                            <div className="w-full">
                                <InfoBoxCard title="License Class" content={data.licenseClass} />
                            </div>
                            <div className="w-full">
                                <InfoBoxCard title="License State" content={data.licenseState} />
                            </div>

                            <div className="sm:col-span-2">
                                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-navy-800 dark:border-navy-700">
                                    <Typography variant="h5" className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">License Photo</Typography>
                                    <div className="flex item-center flex-wrap">
                                        {
                                            data.licensePhoto.map((item, index) => (
                                                <img key={"Driver License Image " + index} className={`inline-block mb-4 w-[calc(33%-10px)] object-cover ${data.licensePhoto.length == index + 1 ? '' : 'mr-4'}`} width={130} height={130} src={item.url} alt="Driver License Image" />
                                            ))
                                        }
                                    </div>
                                </div>
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
                            <div className="w-full">
                                <InfoBoxCard title="Category" content={data.category} />
                            </div>
                            <div className="w-full">
                                <InfoBoxCard title="Make" content={data.make} />
                            </div>
                            <div className="w-full">
                                <InfoBoxCard title="Model" content={data.model} />
                            </div>

                            <div className="w-full">
                                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-navy-800 dark:border-navy-700">
                                    <Typography variant="h5" className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">Insurances</Typography>
                                    <Typography variant="large" title="insurances" className="font-normal text-gray-700 dark:text-gray-400 flex">
                                        {
                                            data.insuranceFile.map((item, index) => {
                                                return <Link href={item.url} target="_blank" key={"insuranceDoc" + index} className="mr-2"><SlDocs /></Link>
                                            })
                                        }
                                    </Typography>
                                </div>
                            </div>

                            <div className="w-full">
                                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-navy-800 dark:border-navy-700">
                                    <Typography variant="h5" className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">Work Compensation</Typography>
                                    <Typography variant="large" title="workers compensation" className="font-normal text-gray-700 dark:text-gray-400 flex">
                                        {
                                            data.workCompensationFile.map((item, index) => {
                                                return <Link href={item.url} target="_blank" key={"workcompensation" + index} className="mr-2"><SlDocs /></Link>
                                            })
                                        }
                                    </Typography>
                                </div>
                            </div>

                            <div className="w-full">
                                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-navy-800 dark:border-navy-700">
                                    <Typography variant="h5" className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">Truck Registration</Typography>
                                    <Typography variant="large" title="truck registration" className="font-normal text-gray-700 dark:text-gray-400 flex">
                                        {
                                            data.truckRegistrationFile.map((item, index) => {
                                                return <Link href={item.url} target="_blank" key={"truckregistration" + index} className="mr-2"><SlDocs /></Link>
                                            })
                                        }
                                    </Typography>
                                </div>
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