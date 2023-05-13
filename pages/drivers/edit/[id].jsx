import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { instance } from 'helpers/axios';

import SingleDriverForm from "components/forms/editDriver";

const SingleDriverEdit = () => {
    const [data, setData] = useState(null);
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
                    insurances: res.data.insurances,
                    workCompensation: res.data.workCompensation,
                    truckRegistration: res.data.truckRegistration,
                    year: res.data.year,
                    numberPlate: res.data.numberPlate,
                    make: res.data.make,
                    model: res.data.model,
                    VIN: res.data.VIN,
                    approved: res.data.approved
                });
            }).catch(error => {
                console.log(error.message);
            });
    }, [router, id]);

    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="max-w-100 md:max-w-[75%] px-4 py-8 mx-auto lg:py-16">
                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Edit Driver</h2>

                {
                    (id && data) ?
                        <SingleDriverForm data={data} id={id} /> : <div>Loading...</div>
                }
            </div>
        </section>
    );
}

export default SingleDriverEdit;