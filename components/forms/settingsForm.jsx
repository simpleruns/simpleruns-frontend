import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useFormik } from 'formik';
import Link from "next/link";

import * as Yup from 'yup';

import { instance } from 'helpers/axios';

import invoiceImage from "public/assets/img/invoice.png";

const settingsForm = (props) => {
    const { data, user } = props;
    const router = useRouter();
    const [logo, setlogo] = useState(null);
    const [imageDataUrl, setImageDataUrl] = useState(data.logo == undefined ? null : data.logo.url);

    useEffect(() => {
        handleLogoSelect(data.logo);
    }, []);

    async function handleLogoSelect(data) {
        const blob = data ? await loadFile(data.url) : await loadFile(invoiceImage.src);
        const newFile = new File([blob], 'logo.png', { type: data ? data.type : 'image/png' });
        setlogo(newFile);
        !data || data.logo ? setImageDataUrl(invoiceImage.src) : '';
    }

    async function loadFile(filePath) {
        const response = await fetch(filePath);
        const blob = await response.blob();
        return blob;
    }

    const formik = useFormik({
        initialValues: {
            bank: data.bank,
            address: data.address,
            bsb: data.bsb,
            accountNo: data.accountNo,
            company: data.company,
            api: data.api,
        },
        validationSchema: Yup.object({
            bank: Yup.string().required('Bank Name is required'),
            address: Yup.string().required('Address is required'),
            bsb: Yup.string().matches(/^\d{3}-\d{3}$/, 'Invalid BSB')
                .required('BSB is required'),
            accountNo: Yup.string().matches(/^\d{9}$/, 'Invalid account number')
                .required('Account number is required'),
            company: Yup.string()
                .required('Company Name is required'),
            api: Yup.string().min(39, 'API key must be at least 39 characters long').test('is-api-key', 'Invalid API key', (value) => {
                const apiKeyRegex = /^[A-Za-z0-9-_]{39}$/;
                return apiKeyRegex.test(value);
            })
        }),
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            const formData = new FormData();
            if (logo == null)
                alert("You didn'nt uploaded logo image.");
            else {
                try {
                    formData.append('logo', logo, logo.name);
                    formData.append('bank', values.bank);
                    formData.append('address', values.address);
                    formData.append('bsb', values.bsb);
                    formData.append('accountNo', values.accountNo);
                    formData.append('company', values.company);
                    formData.append('api', values.api);

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
        instance.put(`/settings/user/${user}`, data)
            .then((res) => {
                res.status == 200 && router.push('/settings');
            }).catch(error => {
                console.log(error.message);
            });
    };

    const logoChangeHandler = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setlogo(file);
        } else {
            setlogo(null);
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
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload logo</label>

                    <div className="flex items-center w-full flex-wrap">
                        {
                            imageDataUrl && <img className="mr-4 h-[3rem] object-cover mb-2" src={imageDataUrl} width="auto" height={80} alt="Driver logo" />
                        }
                        <div className="mb-2">
                            <label className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 cursor-pointer flex items-center">
                                <span className="py-2.5 px-5 flex items-center bg-navy-900 dark:bg-blue-500 text-white rounded-l-lg hover:opacity-90 transition">
                                    Choose Image
                                </span>
                                <input type="file" accept="image/*" id="logo" name="logo" className="hidden" onChange={logoChangeHandler} />
                            </label>
                            <p className="block mt-2 text-xs font-medium text-gray-700 dark:text-white" id="file_input_help">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
                        </div>
                    </div>
                </div>

                <div className="w-full">
                    <label htmlFor="bank" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Bank</label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        type="text"
                        name="bank"
                        id="bank"
                        value={formik.values.bank}
                        placeholder={formik.values.bank}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur} />
                    {formik.touched.bank && formik.errors.bank ? (
                        <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.bank}</div>
                    ) : null}
                </div>
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
                        onBlur={formik.handleBlur} />
                    {formik.touched.address && formik.errors.address ? (
                        <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.address}</div>
                    ) : null}
                </div>
                <div className="w-full">
                    <label htmlFor="bsb" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">BSB</label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        type="text"
                        name="bsb"
                        id="bsb"
                        value={formik.values.bsb}
                        placeholder={formik.values.bsb}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.bsb && formik.errors.bsb ? (
                        <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.bsb}</div>
                    ) : null}
                </div>
                <div className="w-full">
                    <label htmlFor="accountNo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Account Number</label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        type="text"
                        name="accountNo"
                        id="accountNo"
                        value={formik.values.accountNo}
                        placeholder={formik.values.accountNo}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.accountNo && formik.errors.accountNo ? (
                        <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.accountNo}</div>
                    ) : null}
                </div>

                <div className="w-full">
                    <label htmlFor="company" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company Name</label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        type="text"
                        name="company"
                        id="company"
                        value={formik.values.company}
                        placeholder={formik.values.company}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.company && formik.errors.company ? (
                        <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.company}</div>
                    ) : null}
                </div>

                <div className="w-full">
                    <label htmlFor="api" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Google Map API key</label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        type="text"
                        name="api"
                        id="api"
                        value={formik.values.api}
                        placeholder={formik.values.api}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.api && formik.errors.api ? (
                        <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.api}</div>
                    ) : null}
                </div>
            </div>

            <button type="submit" className="text-white bg-gradient-to-r transition from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" disabled={logo ? false : true}>Save</button>

            <Link href="/">
                <button type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 opacity-90">Back</button>
            </Link>
        </form>
    );
}

export default settingsForm;