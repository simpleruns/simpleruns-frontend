import { useState } from "react";
import { useRouter } from "next/router";
import { useFormik } from 'formik';
import Image from "next/image";
// import fs from 'fs';

import * as Yup from 'yup';
import Datepicker from "tailwind-datepicker-react"
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';

import { instance } from 'helpers/axios';

import Dropzone from 'components/forms/dropZone';

const options = {
    todayBtn: false,
    maxDate: new Date("2030-01-01"),
    minDate: new Date("1950-01-01"),
    theme: {
        background: "bg-white dark:bg-navy-800 dark:hover:bg-nav-700",
        icons: "dark:bg-navy-900 dark:hover:bg-navy-700 transition",
        text: "dark:hover:bg-navy-700",
        disabledText: "bg-gray-50 dark:bg-navy-900",
        input: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500",
        inputIcon: "hidden",
    },
    icons: {
        prev: () => <SlArrowLeft />,
        next: () => <SlArrowRight />,
    },
    datepickerClassNames: "top-10",
    defaultDate: new Date()
}

const DriverCreate = () => {
    const [checked, setChecked] = useState(true);
    const [birthDate, setBirthDate] = useState('1990-01-01');
    const [publishedDate, setPublishedDate] = useState('1990-01-01');
    const [expireDate, setExpireDate] = useState('2050-01-01');
    const [licensePhoto, setLicensePhoto] = useState(null);
    const [birthShow, setBirthShow] = useState(false);
    const [publishShow, setPublishShow] = useState(false);
    const [expireShow, setExpireShow] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [imageDataUrl, setImageDataUrl] = useState(null);
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            firstname: "John",
            lastname: "Doe",
            email: "your@email.com",
            phone: "+61123456789",
            role: "",
            password: "",
            confirm: "",
            licenseNumber: "AB123456",
            cardNumber: "1651981561526895",
            licenseClass: "",
            licenseState: "CA",
            insurances: '',
            workCompensation: '',
            truckRegistration: '',
            year: 2023,
            numberPlate: "AB12CD3456",
            VIN: "1GNEK13Z14R167545",
            make: "Mercedez",
            model: "C63"
        },
        validationSchema: Yup.object({
            firstname: Yup.string().required('First Name is required'),
            lastname: Yup.string().required('Last Name is required'),
            email: Yup.string().email('Invalid Email').required('Email is required'),
            phone: Yup.string()
                .matches(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number')
                .required('Phone number is required'),
            role: Yup.string().required('Please select an option'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
            confirm: Yup.string().
                oneOf([Yup.ref('password'), null], 'Passwords does not match')
                .required('Password is required'),
            licenseNumber: Yup.string()
                .matches(/^[A-Z]{2}\d{6}$/i, 'Invalid driver license number')
                .required('Driver license number is required'),
            cardNumber: Yup.string()
                .matches(/^[0-9]{16}$/, 'Driver card number must be 16 digits')
                .required('Driver card number is required'),
            licenseClass: Yup.string().required('Please select an class'),
            licenseState: Yup.string()
                .required('Driver license state is required'),
            year: Yup.number()
                .min(1900, 'Year must be greater than or equal to 1900')
                .max(new Date().getFullYear(), 'Year must be less than or equal to the current year')
                .required('Year is required'),
            numberPlate: Yup.string()
                .matches(/^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/, 'Invalid number plate')
                .required('Number plate is required'),
            VIN: Yup.string()
                .matches(/^[A-HJ-NPR-Z\d]{8}[\dX][A-HJ-NPR-Z\d]{2}\d{6}$/, 'Invalid VIN')
                .required('VIN is required'),
            make: Yup.string().required('Please select an Make'),
            model: Yup.string().required('Model is required'),
        }),
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            const formData = new FormData();
            if (avatar == null)
                alert("You didn'nt uploaded driver user image.");
            else if (licensePhoto == null)
                alert("You didn't uploaded driver license photo.");
            else {
                avatar && formData.append('avatar', avatar, avatar.name);
                licensePhoto && licensePhoto.map((item, i) => {
                    formData.append('licensePhoto', item, item.name);
                })
                formData.append('firstname', values.firstname);
                formData.append('lastname', values.lastname);
                formData.append('email', values.email);
                formData.append('phone', values.phone);
                formData.append('birthDate', birthDate);
                formData.append('role', values.role);
                formData.append('password', values.password);
                formData.append('licenseNumber', values.licenseNumber);
                formData.append('cardNumber', values.cardNumber);
                formData.append('publishedDate', publishedDate);
                formData.append('expireDate', expireDate);
                formData.append('licenseClass', values.licenseClass);
                formData.append('licenseState', values.licenseState);
                formData.append('insurances', values.insurances);
                formData.append('workCompensation', values.workCompensation);
                formData.append('truckRegistration', values.truckRegistration);
                formData.append('year', values.year);
                formData.append('numberPlate', values.numberPlate);
                formData.append('VIN', values.VIN);
                formData.append('make', values.make);
                formData.append('model', values.model);
                formData.append('approved', checked);

                try {
                    await createDriver(formData);
                    setSuccess(true);
                } catch (error) {
                    console.log(error.message);
                } finally {
                    setSubmitting(false);
                }
            }
        },
    });

    const createDriver = async (data) => {
        instance.post('/admin/drivers/create', data, {
            headers: {
                'content-Type': 'multipart/form-data'
            }
        })
            .then(() => {
                router.push('/drivers')
            }).catch(error => {
                console.log(error.message);
            });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setAvatar(file);
        } else {
            setAvatar(null);
        }

        const reader = new FileReader();
        reader.onload = () => {
            setImageDataUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (licensePhoto) => {
        setLicensePhoto(licensePhoto);
    };

    const handleBirthChange = (birthDate) => {
        setBirthDate(birthDate);
    }

    const handleBirthClose = (state) => {
        setBirthShow(state)
    }

    const handlePublishChange = (publishedDate) => {
        setPublishedDate(publishedDate);
    }

    const handlePublishClose = (state) => {
        setPublishShow(state)
    }

    const handleExpireChange = (expireDate) => {
        setExpireDate(expireDate);
    }

    const handleExpireClose = (state) => {
        setExpireShow(state)
    }

    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="max-w-100 md:max-w-[75%] px-4 py-8 mx-auto lg:py-16">
                <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Register New Driver</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                        <div className="sm:col-span-2">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload User Image</label>

                            <div className="flex items-center w-full flex-wrap">
                                {
                                    imageDataUrl && <Image className="mb-0 mr-4 rounded-full w-[10rem] object-cover mb-2" src={imageDataUrl} width={80} height={80} alt="Driver avatar" />
                                }
                                <div className="mb-2">
                                    <label className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 cursor-pointer flex items-center">
                                        <span className="py-2.5 px-5 flex items-center bg-navy-900 dark:bg-blue-500 text-white rounded-l-lg hover:opacity-90 transition">
                                            Choose Image
                                        </span>
                                        <input type="file" accept="image/*" id="avatar" name="avatar" className="hidden" onChange={handleAvatarChange} />
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
                        <div className="w-full">
                            <label htmlFor="birthDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date of Birth</label>
                            <div className="relative">
                                <Datepicker
                                    key="birthDate"
                                    options={options}
                                    onChange={handleBirthChange}
                                    show={birthShow}
                                    setShow={handleBirthClose} />
                            </div>
                        </div>
                        <div className="w-full">
                            <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role</label>

                            <select id="role" name="role" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-50" value={formik.values.role} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                                <option value="">Choose a Role</option>
                                <option value="driver">Driver</option>
                                <option value="subcontractor">Subcontractor</option>
                            </select>
                            {formik.touched.role && formik.errors.role ? (
                                <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.role}</div>
                            ) : null}
                        </div>
                        <div className="w-full">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input
                                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                type="password"
                                name="password"
                                placeholder="Password..."
                                id="password"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                            />
                            {formik.touched.password && formik.errors.password ? (
                                <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.password}</div>
                            ) : null}
                        </div>
                        <div className="w-full">
                            <label htmlFor="confirm" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm</label>
                            <input
                                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                type="text"
                                name="confirm"
                                placeholder="Rewrite Password..."
                                id="confirm"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.confirm}
                            />
                            {formik.touched.confirm && formik.errors.confirm ? (
                                <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.confirm}</div>
                            ) : null}
                        </div>

                        <h2 className="sm:col-span-2 mt-6 mb-4 text-xl font-bold text-gray-900 dark:text-white">License Info</h2>

                        <div className="w-full">
                            <label htmlFor="licenseNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">License Number</label>
                            <input
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                type="text"
                                name="licenseNumber"
                                id="licenseNumber"
                                value={formik.values.licenseNumber}
                                placeholder={formik.values.licenseNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} />
                            {formik.touched.licenseNumber && formik.errors.licenseNumber ? (
                                <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.licenseNumber}</div>
                            ) : null}
                        </div>
                        <div className="w-full">
                            <label htmlFor="cardNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Card Number</label>
                            <input
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                type="text"
                                name="cardNumber"
                                id="cardNumber"
                                value={formik.values.cardNumber}
                                placeholder={formik.values.cardNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.cardNumber && formik.errors.cardNumber ? (
                                <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.cardNumber}</div>
                            ) : null}
                        </div>
                        <div className="w-full">
                            <label htmlFor="publishedDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Published Date</label>
                            <div className="relative">
                                <Datepicker
                                    key="publishDate"
                                    options={options}
                                    onChange={handlePublishChange}
                                    show={publishShow}
                                    setShow={handlePublishClose} />
                            </div>
                        </div>
                        <div className="w-full">
                            <label htmlFor="expirationDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Expire Date</label>
                            <div className="relative">
                                <Datepicker
                                    key="expireDate"
                                    id="expireDate"
                                    options={options}
                                    onChange={handleExpireChange}
                                    show={expireShow}
                                    setShow={handleExpireClose} />
                            </div>
                        </div>
                        <div className="w-full">
                            <label htmlFor="licenseClass" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">License Class</label>

                            <select id="licenseClass" name="licenseClass" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-50" value={formik.values.licenseClass} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                                <option value="">Choose a license Class</option>
                                <option value="R">R Motorcycle</option>
                                <option value="R-DATE">R-Date</option>
                                <option value="C">C Car.</option>
                                <option value="LR">LR Light Rigid.</option>
                                <option value="MR">MR Medium Rigid.</option>
                                <option value="HR">HR Heavy Rigid.</option>
                                <option value="HC">HC Heavy Combination.</option>
                                <option value="MC">MC Multi Combination.</option>
                            </select>
                            {formik.touched.licenseClass && formik.errors.licenseClass ? (
                                <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.licenseClass}</div>
                            ) : null}
                        </div>
                        <div className="w-full">
                            <label htmlFor="licenseState" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">License State</label>
                            <select id="licenseState" name="licenseState" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-50" value={formik.values.licenseState} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                                <option value="">Choose a license State</option>
                                <option value="NSW">New South Wales</option>
                                <option value="VT">Victoria</option>
                                <option value="QL">Queensland</option>
                                <option value="SA">South Australia</option>
                                <option value="WA">Western Australia</option>
                                <option value="TM">Tasmania</option>
                                <option value="NT">Northern Territory</option>
                                <option value="ACT">Australia Capital Territory</option>
                            </select>
                            {formik.touched.licenseState && formik.errors.licenseState ? (
                                <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.licenseState}</div>
                            ) : null}
                        </div>
                        {
                            formik.values.role === 'subcontractor' ?
                                <>
                                    <div className="w-full">
                                        <label htmlFor="insurances" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Insurances</label>

                                        <select id="insurances" name="insurances" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-50" value={formik.values.insurances} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                                            <option value="">Choose a Insurances</option>
                                            <option value="Liability">Liability Insurance</option>
                                            <option value="Collision">Collision Insurance</option>
                                            <option value="Comprehensive">Comprehensive Insurance</option>
                                            <option value="PIP">Personal Injury Protection (PIP) Insurance</option>
                                            <option value="UMI">Uninsured/Underinsured Motorist Insurance</option>
                                        </select>
                                        {formik.touched.insurances && formik.errors.insurances ? (
                                            <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.insurances}</div>
                                        ) : null}
                                    </div>

                                    <div className="w-full">
                                        <label htmlFor="workCompensation" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Work Compensation</label>
                                        <input
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            type="text"
                                            name="workCompensation"
                                            id="workCompensation"
                                            value={formik.values.workCompensation}
                                            placeholder={formik.values.workCompensation}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.workCompensation && formik.errors.workCompensation ? (
                                            <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.workCompensation}</div>
                                        ) : null}
                                    </div>

                                    <div className="w-full">
                                        <label htmlFor="truckRegistration" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Truck Registration</label>
                                        <input
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            type="text"
                                            name="truckRegistration"
                                            id="truckRegistration"
                                            value={formik.values.truckRegistration}
                                            placeholder={formik.values.truckRegistration}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.truckRegistration && formik.errors.truckRegistration ? (
                                            <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.truckRegistration}</div>
                                        ) : null}
                                    </div>
                                </> : <></>
                        }
                        <div className="sm:col-span-2">
                            <label htmlFor="licesePhoto" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">License Photo</label>
                            <Dropzone onDrop={handleDrop} id={licensePhoto} setLicensePhotoHandler={handleDrop} />
                        </div>

                        <h2 className="sm:col-span-2 mt-6 mb-4 text-xl font-bold text-gray-900 dark:text-white">Vehicle Info</h2>

                        <div className="w-full">
                            <label htmlFor="year" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Year</label>
                            <input
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                type="text"
                                name="year"
                                id="year"
                                value={formik.values.year}
                                placeholder={formik.values.year}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} />
                            {formik.touched.year && formik.errors.year ? (
                                <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.year}</div>
                            ) : null}
                        </div>
                        <div className="w-full">
                            <label htmlFor="numberPlate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Number Plate</label>
                            <input
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                type="text"
                                name="numberPlate"
                                id="numberPlate"
                                value={formik.values.numberPlate}
                                placeholder={formik.values.numberPlate}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} />
                            {formik.touched.numberPlate && formik.errors.numberPlate ? (
                                <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.numberPlate}</div>
                            ) : null}
                        </div>
                        <div className="w-full">
                            <label htmlFor="VIN" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">VIN</label>
                            <input
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                type="text"
                                name="VIN"
                                id="VIN"
                                value={formik.values.VIN}
                                placeholder={formik.values.VIN}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} />
                            {formik.touched.VIN && formik.errors.VIN ? (
                                <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.VIN}</div>
                            ) : null}
                        </div>
                        <div className="w-full">
                            <label htmlFor="make" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Make</label>

                            <select id="make" name="make" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-50" value={formik.values.make} onChange={formik.handleChange} onBlur={formik.handleBlur}>
                                <option value="">Choose a Make Class</option>
                                <option value="Toyota">Toyota</option>
                                <option value="Ford">Ford</option>
                                <option value="Honda">Honda</option>
                                <option value="Chevrolet">Chevrolet</option>
                                <option value="Nissan">Nissan</option>
                                <option value="BMW">BMW</option>
                                <option value="Mercedes-Benz">Mercedes-Benz</option>
                                <option value="Audi">Audi</option>
                                <option value="Volkswagen">Volkswagen</option>
                                <option value="Hyundai">Hyundai</option>
                                <option value="Kia">Kia</option>
                                <option value="Porsche">Porsche</option>
                                <option value="Ferrari">Ferrari</option>
                                <option value="Lamborghini">Lamborghini</option>
                                <option value="Aston Martin">Aston Martin</option>
                                <option value="McLaren">McLaren</option>
                                <option value="Jeep">Jeep</option>
                                <option value="Dodge">Dodge</option>
                                <option value="Chrysler">Chrysler</option>
                                <option value="Tesla">Tesla</option>
                            </select>
                            {formik.touched.make && formik.errors.make ? (
                                <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.make}</div>
                            ) : null}
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="model" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Model</label>
                            <input
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                type="text"
                                name="model"
                                id="model"
                                value={formik.values.model}
                                placeholder={formik.values.model}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} />
                            {formik.touched.model && formik.errors.model ? (
                                <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.model}</div>
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

export default DriverCreate;