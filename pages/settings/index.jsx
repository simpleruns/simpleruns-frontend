import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { instance } from 'helpers/axios';

import SettingsForm from "components/forms/settingsForm";

const Settings = () => {
    const [data, setData] = useState(null);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        id && instance.get(`/settings/user/${id}`)
            .then((res) => {
                setData({
                    logo: res.data.logo,
                    bank: res.data.bank,
                    address: res.data.address,
                    BSB: res.data.bsb,
                    accountNo: res.data.accountNo,
                    company: res.data.company,
                });
            }).catch(error => {
                console.log(error.message);
            });
    }, [router, id]);

    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="max-w-100 md:max-w-[75%] px-4 py-8 mx-auto lg:py-16">
                <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Edit Settings</h2>

                {
                    (id && data) ?
                        <SettingsForm data={data} id={id} /> : <div>Loading...</div>
                }
            </div>
        </section>
    );
}

export default Settings;