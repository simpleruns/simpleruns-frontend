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
            }).catch(error => {
                console.log(error.message);
            });
    }, [router]);

    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="max-w-[75%] px-4 py-8 mx-auto lg:py-16">
                <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Edit Driver</h2>

                {
                    data ?
                        <SingleDriverForm data={data} id={id} /> : <div>Loading...</div>
                }
            </div>
        </section>
    );
}

export default SingleDriverEdit;