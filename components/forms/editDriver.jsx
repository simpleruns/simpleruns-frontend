import { useState } from "react";
import { useRouter } from "next/router";
import { useFormik } from 'formik';

import * as Yup from 'yup';

import { instance } from 'helpers/axios';

const SingleDriverForm = (props) => {
    const { data, id } = props;
    const [checked, setChecked] = useState(data.approved);
    const [resetPassword, setResetPassword] = useState(false);
    const router = useRouter();

    const formik = useFormik({
        initialValues: data || {
            firstname: "",
            lastname: "",
            email: "",
            phone: "",
            password: "",
            confirm: "",
            year: 2023,
            numberPlate: "",
            VIN: "",
            resetPassword: false
        },
        validationSchema: Yup.object({
            firstname: Yup.string().required('First Name is required'),
            lastname: Yup.string().required('Last Name is required'),
            email: Yup.string().email('Invalid Email').required('email is required'),
            phone: Yup.string().matches(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number').required('Phone number is required'),
            password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
            confirm: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords does not match').required('Password is required'),
            year: Yup.number().min(1900, 'Year must be greater than or equal to 1900').max(new Date().getFullYear(), 'Year must be less than or equal to the current year').required('Year is required'),
            numberPlate: Yup.string().matches(/^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/, 'Invalid number plate').required('Number plate is required'),
            VIN: Yup.string().matches(/^[A-HJ-NPR-Z\d]{8}[\dX][A-HJ-NPR-Z\d]{2}\d{6}$/, 'Invalid VIN').required('VIN is required')
        }),
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            try {
                await saveEditedDriver({
                    firstname: values.firstname,
                    lastname: values.lastname,
                    email: values.email,
                    phone: values.phone,
                    password: values.password,
                    year: values.year,
                    numberPlate: values.numberPlate,
                    VIN: values.VIN,
                    approved: checked,
                    resetPassword: resetPassword
                });
                router.push('/drivers')
                setSuccess(true);
            } catch (error) {
                console.log(error.message);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const resetPasswordHandler = () => {
        setResetPassword(!resetPassword);
        formik.values.password = '123456';
        formik.values.confirm = '123456';
    }

    const saveEditedDriver = async (data) => {
        var changedData = `name: ${data.firstname + ' ' + data.lastname}, email: ${data.email}, phone: ${data.phone}${data.resetPassword ? ', password: ' : ''}${data.resetPassword ? data.password : ''}, year: ${data.year}, numberPlate: ${data.numberPlate}, VIN: ${data.VIN}, approved: ${data.approved}`
        alert(`You changed driver detail as ${changedData}`)
        instance.put(`/admin/drivers/${id}`, data)
            .then((res) => {
            }).catch(error => {
                console.log(error.message);
            });
        router.push('/drivers')
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                <div className="sm:col-span-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload avatar</label>
                    <div className="flex items-center w-full">
                        <img className="mb-0 mr-4 w-[5rem] h-[5rem] rounded-full" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/helene-engels.png" alt="Helene avatar" />
                        <div className="w-full">
                            <label className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 cursor-pointer">
                                <span className="py-2.5 px-5 inline-block bg-navy-900 dark:bg-blue-500 text-white rounded-l-lg hover:opacity-90 transition">
                                    Choose Image
                                </span>
                                <input type="file" className="hidden" />
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
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.phone && formik.errors.phone ? (
                        <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.phone}</div>
                    ) : null}
                </div>
                <div className="sm:col-span-2">
                    <button type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" onClick={resetPasswordHandler}>{resetPassword ? "No, I don't want password reset" : 'Reset Password'}</button>
                </div>
                <div className={`w-full ${!resetPassword ? 'hidden' : ''}`}>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                    <input
                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
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
                <div className={`w-full ${!resetPassword ? 'hidden' : ''}`}>
                    <label htmlFor="confirm" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm</label>
                    <input
                        className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
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

                <h2 className="sm:col-span-2 mt-6 mb-4 text-xl font-bold text-gray-900 dark:text-white">Vehicle Info</h2>

                <div className="w-full">
                    <label htmlFor="year" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        type="text"
                        name="year"
                        id="year"
                        value={formik.values.year}
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
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur} />
                    {formik.touched.numberPlate && formik.errors.numberPlate ? (
                        <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.numberPlate}</div>
                    ) : null}
                </div>
                <div className="sm:col-span-2">
                    <label htmlFor="VIN" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">VIN</label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        type="text"
                        name="VIN"
                        id="VIN"
                        value={formik.values.VIN}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur} />
                    {formik.touched.VIN && formik.errors.VIN ? (
                        <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.VIN}</div>
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
    );
}

export default SingleDriverForm;