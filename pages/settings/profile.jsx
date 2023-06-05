import { useState, useEffect } from "react";
import { useAtom } from "jotai";

import ProfileSettingsForm from "components/forms/profileSettingsForm";

import { instance } from 'helpers/axios';
import { idAtom } from "helpers/authorize";

const Settings = () => {
    const [user, __] = useAtom(idAtom);
    const [data, setData] = useState(null);

    useEffect(() => {
        user && instance.get(`/settings/user/${user}`)
            .then((res) => {
                setData({
                    avatar: res.data.avatar,
                    firstname: res.data.firstname,
                    lastname: res.data.lastname,
                    email: res.data.email,
                    phone: res.data.phone
                });
            }).catch(error => {
                console.log(error.message);
            });
    }, []);

    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="max-w-100 md:max-w-[75%] px-4 py-8 mx-auto lg:py-16">
                <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Edit Profile Settings</h2>

                {
                    (user && data) ?
                        <ProfileSettingsForm data={data} user={user} /> : <div>Loading...</div>
                }
            </div>
        </section>
    );
}

export default Settings;