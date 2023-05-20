import { useState } from "react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { instance } from 'helpers/axios';
import { idAtom } from "helpers/authorize";

const CustomerCreate = () => {
    const [user, __] = useAtom(idAtom);
    const [checked, setChecked] = useState(true);
    const [photo, setPhoto] = useState(null);
    const [imageDataUrl, setImageDataUrl] = useState(null);
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            firstname: "John",
            lastname: "Doe",
            email: "your@email.com",
            phone: "+61123456789",
            address: "",
            rateType: "hourly",
            localRate: 115,
            countryRate: 140,
            fuelRate: 15,
            loadRate: 20,
            abn: null
        },
        validationSchema: Yup.object({
            firstname: Yup.string().required('First Name is required'),
            lastname: Yup.string().required('Last Name is required'),
            email: Yup.string().email('Invalid Email').required('Email is required'),
            phone: Yup.string()
                .matches(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number')
                .required('Phone number is required'),
            address: Yup.string().required('Address is required'),
            rateType: Yup.string().required('Please select an option'),
            localRate: Yup.number().required('Local Rate is required'),
            countryRate: Yup.number().required('Country Rate is required'),
            fuelRate: Yup.number().required('Fuel Rate is required'),
            loadRate: Yup.number().required('Load Rate is required'),
            abn: Yup.string()
                .matches(/^\d{11}$/, 'ABN must be 11 digits')
                .test('valid-abn', 'Invalid ABN', (value) => {
                    if (!value) {
                        return true;
                    }
                    const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
                    const abn = value.replace(/\D/g, '');
                    const sum = weights.reduce((acc, weight, index) => {
                        const digit = parseInt(abn.charAt(index), 10);
                        return acc + (digit * weight);
                    }, 0);
                    return sum % 89 === 0;
                }),
        }),
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            const formData = new FormData();
            if (photo == null)
                alert("You didn'nt uploaded customer user image.");
            else {
                formData.append('userId', user);
                formData.append('firstname', values.firstname);
                formData.append('lastname', values.lastname);
                formData.append('email', values.email);
                formData.append('phone', values.phone);
                formData.append('address', values.address);
                formData.append('rateType', values.rateType);
                formData.append('localRate', values.localRate);
                formData.append('countryRate', values.countryRate);
                formData.append('fuelRate', values.fuelRate);
                formData.append('loadRate', values.loadRate);
                formData.append('approved', checked);
                formData.append('abn', values.abn);
                photo && formData.append('photo', photo, photo.name);

                try {
                    await createCustomer(formData);
                    setSuccess(true);
                } catch (error) {
                    console.log(error.message);
                } finally {
                    setSubmitting(false);
                }
            }
        },
    });

    const createCustomer = async (data) => {
        instance.post('/admin/customers/create', data, {
            headers: {
                'content-Type': 'multipart/form-data'
            }
        })
            .then(() => {
                router.push('/customers')
            }).catch(error => {
                console.log(error.message);
            });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setPhoto(file);
        } else {
            setPhoto(null);
        }

        const reader = new FileReader();
        reader.onload = () => {
            setImageDataUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="max-w-100 md:max-w-[75%] px-4 py-8 mx-auto lg:py-16">
                <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Register New Customer</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                        <div className="sm:col-span-2">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload User Image</label>

                            <div className="flex items-center w-full flex-wrap">
                                {
                                    imageDataUrl && <img className="mb-0 mr-4 rounded-full w-[10rem] object-cover mb-2" src={imageDataUrl} width={80} height={80} alt="Customer photo" />
                                }
                                <div className="mb-2">
                                    <label className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 cursor-pointer flex items-center">
                                        <span className="py-2.5 px-5 flex items-center bg-navy-900 dark:bg-blue-500 text-white rounded-l-lg hover:opacity-90 transition">
                                            Choose Image
                                        </span>
                                        <input type="file" accept="image/*" id="photo" name="photo" className="hidden" onChange={handleAvatarChange} />
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
                        <div className="sm:col-span-2">
                            <label htmlFor="rateType" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rate Type</label>

                            <select id="rateType" name="rateType" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-50" value={formik.values.rateType} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                                <option value="">Choose a Rate Type</option>
                                <option value="hourly">Hourly Rate</option>
                                <option value="load">Load Rate</option>
                            </select>
                            {formik.touched.rateType && formik.errors.rateType ? (
                                <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.rateType}</div>
                            ) : null}
                        </div>
                        {
                            formik.values.rateType == 'hourly' ?
                                <>
                                    <div className="w-full">
                                        <label htmlFor="localRate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Local Rate</label>
                                        <input
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            type="number"
                                            name="localRate"
                                            id="localRate"
                                            value={formik.values.localRate}
                                            placeholder={formik.values.localRate}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.localRate && formik.errors.localRate ? (
                                            <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.localRate}</div>
                                        ) : null}
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="countryRate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Country Rate</label>
                                        <input
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            type="number"
                                            name="countryRate"
                                            id="countryRate"
                                            value={formik.values.countryRate}
                                            placeholder={formik.values.countryRate}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.countryRate && formik.errors.countryRate ? (
                                            <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.countryRate}</div>
                                        ) : null}
                                    </div>
                                </> :
                                <>
                                    <div className="w-full">
                                        <label htmlFor="loadRate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Load Rate</label>
                                        <input
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            type="number"
                                            name="loadRate"
                                            id="loadRate"
                                            value={formik.values.loadRate}
                                            placeholder={formik.values.loadRate}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.loadRate && formik.errors.loadRate ? (
                                            <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.loadRate}</div>
                                        ) : null}
                                    </div>
                                    <div className="w-full">
                                        <label htmlFor="fuelRate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fuel Rate</label>
                                        <input
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            type="number"
                                            name="fuelRate"
                                            id="fuelRate"
                                            value={formik.values.fuelRate}
                                            placeholder={formik.values.fuelRate}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.fuelRate && formik.errors.fuelRate ? (
                                            <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.fuelRate}</div>
                                        ) : null}
                                    </div>
                                </>
                        }
                        <div className="w-full">
                            <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                            <input
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                type="text"
                                name="address"
                                id="address"
                                value={formik.values.address}
                                placeholder={formik.values.address}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.address && formik.errors.address ? (
                                <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.address}</div>
                            ) : null}
                        </div>

                        <div className="w-full">
                            <label htmlFor="abn" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ABN</label>
                            <input
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                type="number"
                                name="abn"
                                id="abn"
                                value={formik.values.abn}
                                placeholder={formik.values.abn}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.abn && formik.errors.abn ? (
                                <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.abn}</div>
                            ) : null}
                        </div>

                        <div className="w-full">
                            <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" value="" className="sr-only peer" checked={checked} onChange={() => setChecked(!checked)} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 hidden">Toggle me</span>
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="text-white bg-gradient-to-r transition from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Save</button>
                </form>
            </div >
        </section >
    );
}

export default CustomerCreate;