import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { instance } from 'helpers/axios';

import SingleCustomerForm from "components/forms/editCustomer";

const CustomerEdit = () => {
    const [data, setData] = useState(null);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        id && instance.get(`/admin/customers/${id}`)
            .then((res) => {
                setData({
                    photo: res.data.photo,
                    firstname: res.data.firstname,
                    lastname: res.data.lastname,
                    email: res.data.email,
                    phone: res.data.phone,
                    address: res.data.address,
                    rateType: res.data.rateType,
                    localRate: res.data.localRate,
                    countryRate: res.data.countryRate,
                    loadRate: res.data.loadRate,
                    fuelRate: res.data.fuelRate,
                    abn: res.data.abn,
                    approved: res.data.approved
                });
            }).catch(error => {
                console.log(error.message);
            });
    }, [router, id]);

    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="max-w-100 md:max-w-[75%] px-4 py-8 mx-auto lg:py-16">
                <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Edit Customer</h2>

                {
                    (id && data) ?
                        <SingleCustomerForm data={data} id={id} /> : <div>Loading...</div>
                }
            </div>
        </section>
    );
}

export default CustomerEdit;