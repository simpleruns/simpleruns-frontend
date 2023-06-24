import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useFormik } from 'formik';
import Link from "next/link";

import * as Yup from 'yup';

import { instance } from 'helpers/axios';

import invoiceImage from "public/assets/img/driver.png";

const SettingsForm = (props) => {
    const { data, user } = props;
    const router = useRouter();
    const [avatar, setavatar] = useState(null);
    const [imageDataUrl, setImageDataUrl] = useState(data.avatar == undefined ? null : data.avatar.url);

    useEffect(() => {
        handleAvatarSelect(data.avatar);
    }, []);

    async function handleAvatarSelect(data) {
        const blob = data ? await loadFile(data.url) : await loadFile(invoiceImage.src);
        const newFile = new File([blob], 'avatar.png', { type: data ? data.type : 'image/png' });
        setavatar(newFile);
        !data || data.avatar ? setImageDataUrl(invoiceImage.src) : '';
    }

    async function loadFile(filePath) {
        const response = await fetch(filePath);
        const blob = await response.blob();
        return blob;
    }

    const formik = useFormik({
        initialValues: {
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            phone: data.phone
        },
        validationSchema: Yup.object({
            firstname: Yup.string().required('First Name is required'),
            lastname: Yup.string().required('Last Name is required'),
            email: Yup.string().email('Invalid Email').required('Email is required'),
            phone: Yup.string().required('Phone number is required'),
        }),
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            const formData = new FormData();
            if (avatar == null)
                alert("You didn'nt uploaded avatar image.");
            else {
                try {
                    formData.append('avatar', avatar, avatar.name);
                    formData.append('firstname', values.firstname);
                    formData.append('lastname', values.lastname);
                    formData.append('email', values.email);
                    formData.append('phone', values.phone);

                    await saveEditedSettings(formData);
                    setSuccess(true);
                } catch (error) {
                    console.log(error.message);
                } finally {
                    setSubmitting(false);
                }
            }
        },
    });

    const saveEditedSettings = async (data) => {
        instance.put(`/settings/user/profile/${user}`, data)
            .then((res) => {
                if (res.data == 'The email is already in use.')
                    alert('The email is already in use.')
                else
                    router.push('/');
            }).catch(error => {
                console.log(error.message);
            });
    };

    const avatarChangeHandler = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setavatar(file);
        } else {
            setavatar(null);
        }

        const reader = new FileReader();
        reader.onload = () => {
            setImageDataUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                <div className="sm:col-span-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="avatar">Upload avatar</label>

                    <div className="flex items-center w-full flex-wrap">
                        {
                            imageDataUrl && <img className="mr-4 h-[3rem] object-cover mb-2" src={imageDataUrl} width="auto" height={80} alt="Driver avatar" />
                        }
                        <div className="mb-2">
                            <label className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 cursor-pointer flex items-center">
                                <span className="py-2.5 px-5 flex items-center bg-navy-900 dark:bg-blue-500 text-white rounded-l-lg hover:opacity-90 transition">
                                    Choose Image
                                </span>
                                <input type="file" accept="image/*" id="avatar" name="avatar" className="hidden" onChange={avatarChangeHandler} />
                            </label>
                            <p className="block mt-2 text-xs font-medium text-gray-700 dark:text-white" id="file_input_help">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
                        </div>
                    </div>
                </div>

                <div className="w-full">
                    <label htmlFor="firstname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        type="text"
                        name="firstname"
                        id="firstname"
                        value={formik.values.firstname}
                        placeholder={formik.values.firstname}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur} />
                    {formik.touched.firstname && formik.errors.firstname ? (
                        <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.firstname}</div>
                    ) : null}
                </div>

                <div className="w-full">
                    <label htmlFor="lastname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        type="text"
                        name="lastname"
                        id="lastname"
                        value={formik.values.lastname}
                        placeholder={formik.values.lastname}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur} />
                    {formik.touched.lastname && formik.errors.lastname ? (
                        <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.lastname}</div>
                    ) : null}
                </div>

                <div className="w-full">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        type="text"
                        name="email"
                        id="email"
                        value={formik.values.email}
                        placeholder={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.email}</div>
                    ) : null}
                </div>

                <div className="w-full">
                    <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone</label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        type="text"
                        name="phone"
                        id="phone"
                        value={formik.values.phone}
                        placeholder={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.phone && formik.errors.phone ? (
                        <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.phone}</div>
                    ) : null}
                </div>
            </div>

            <button type="submit" className="text-white bg-gradient-to-r transition from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 disabled:opacity-60" disabled={avatar ? false : true}>Save</button>

            <Link href="/">
                <button type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 opacity-90">Back</button>
            </Link>
        </form>
    );
}

export default SettingsForm;