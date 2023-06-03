import { useState } from "react";
import { useRouter } from "next/router";
import { useFormik } from 'formik';
import Link from "next/link";

import * as Yup from 'yup';
import Datepicker from "tailwind-datepicker-react"
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';

import { instance } from 'helpers/axios';

import Dropzone from 'components/forms/dropZone';
import DropzoneForFile from 'components/forms/dropZoneForFile';
import { useEffect } from "react";

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

const categoryArray = ['truck', 'van', 'ute'];
const makeArray1 = ['Ford', "FreightLiner", "Fuso", "Hino", "Isuzu", "Iveco", "KenWorth", "Mack", "M.A.N", "Mercedes-Benz", "Mitsubishi", "Volvo", "Western Star", "CaterPillar", "Daf", "International", "Scania", "Sinotruck", "Sterling", "U.D", "other"];
const makeArray2 = ["Audi", "Ford", "Holden", "Honda", "Hyundai", "Kia", "Mitsubishi", "Nissan", "Toyota", "Volkswagon", "LDV", "Mercedes-Benz", "Peugeot", "Renault", "Citreon", "Daihatsu", "other"];

const SingleDriverForm = (props) => {
    const { data, id } = props;
    const [checked, setChecked] = useState(data.approved);
    const [resetPassword, setResetPassword] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [imageDataUrl, setImageDataUrl] = useState(data.avatar.url);
    const [birthDate, setBirthDate] = useState(data.birthDate || '1990-01-01');
    const [expireDate, setExpireDate] = useState(data.expireDate || '1990-01-01');
    const [licensePhoto, setLicensePhoto] = useState(null);
    const [licensePhotoURL, setLicensePhotoURL] = useState(data.licensePhoto);
    const [insuranceFile, setInsuranceFile] = useState(null);
    const [insuranceFileURL, setInsuranceFileURL] = useState(data.insuranceFile);
    const [workCompensationFile, setWorkCompensationFile] = useState(null);
    const [workCompensationFileURL, setWorkCompensationFileURL] = useState(data.workCompensationFile);
    const [truckRegistrationFile, setTruckRegistrationFile] = useState(null);
    const [truckRegistrationFileURL, setTruckRegistrationFileURL] = useState(data.truckRegistrationFile);
    const [birthShow, setBirthShow] = useState(false);
    const [expireShow, setExpireShow] = useState(false);
    const [selectedCategoryOption, setSelectedCategoryOption] = useState(categoryArray.includes(data.category) ? data.category : 'other');
    const [inputCategoryValue, setInputCategoryValue] = useState(data.category);
    const [selectedMakeOption, setSelectedMakeOption] = useState((data.category == 'truck' && makeArray1.includes(data.make) || ((data.category == 'van' || data.category == 'ute') && makeArray2.includes(data.make))) ? data.make : 'other');
    const [inputMakeValue, setInputMakeValue] = useState(data.make);

    const router = useRouter();
    const birthDateOptions = { ...options, defaultDate: new Date(birthDate) };
    const expireDateOptions = { ...options, defaultDate: new Date(expireDate) };

    useEffect(() => {
        handleFileSelect(licensePhotoURL, 1);
        handleFileSelect(insuranceFileURL, 2);
        handleFileSelect(workCompensationFileURL, 3);
        handleFileSelect(truckRegistrationFileURL, 4);

        handleAvatarSelect(data.avatar);
    }, []);

    async function handleFileSelect(data, index) {
        var filesList = [];
        for (let i = 0; i < data.length; i++) {
            const blob = await loadFile(data[i].url);
            const newFile = new File([blob], `${index == 1 ? 'License Photo' : index == 2 ? 'Insurance File' : index == 3 ? 'Worker Compensation' : index == 4 ? 'Truck Registration' : 'Other'} ` + (i + 1), { type: data[i].type });
            filesList[i] = newFile;
            console.log(filesList)
        }

        index == 1 ? setLicensePhoto(filesList) : index == 2 ? setInsuranceFile(filesList) : index == 3 ? setWorkCompensationFile(filesList) : index == 4 ? setTruckRegistrationFile(filesList) : '';
    }

    async function handleAvatarSelect(data) {
        const blob = await loadFile(data.url);
        const newFile = new File([blob], 'Avatar', { type: data.type });
        setAvatar(newFile);
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
            phone: data.phone,
            role: data.role,
            password: data.password,
            confirm: data.password,
            licenseNumber: data.licenseNumber,
            cardNumber: data.cardNumber,
            licenseClass: data.licenseClass,
            licenseState: data.licenseState,
            year: data.year,
            numberPlate: data.numberPlate,
            VIN: data.VIN,
            model: data.model
        },
        validationSchema: Yup.object({
            firstname: Yup.string().required('First Name is required'),
            lastname: Yup.string().required('Last Name is required'),
            email: Yup.string().email('Invalid Email').required('Email is required'),
            phone: Yup.string().required('Phone number is required'),
            role: Yup.string().required('Please select an option'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters'),
            confirm: Yup.string().
                oneOf([Yup.ref('password'), null], 'Passwords does not match')
                .required('Password is required'),
            licenseNumber: Yup.string()
                .required('Driver license number is required'),
            cardNumber: Yup.string()
                .required('Driver card number is required'),
            licenseClass: Yup.string().required('Please select an class'),
            licenseState: Yup.string()
                .required('Driver license state is required'),
            year: Yup.number()
                .min(1900, 'Year must be greater than or equal to 1900')
                .max(new Date().getFullYear(), 'Year must be less than or equal to the current year')
                .required('Year is required'),
            numberPlate: Yup.string()
                .required('Number plate is required'),
            VIN: Yup.string().required('VIN is required'),
            model: Yup.string().required('Model is required'),
        }),
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            const formData = new FormData();
            if (avatar == null)
                alert("You didn'nt uploaded driver user image.");
            else if (licensePhoto == null || !licensePhoto.length)
                alert("You didn't uploaded driver license photo.");
            else if ((insuranceFile == null || !insuranceFile.length) && values.role === 'subcontractor')
                alert("You didn't uploaded insurance doc.");
            else if ((workCompensationFile == null || !workCompensationFile.length) && values.role === 'subcontractor')
                alert("You didn't uploaded workers compensation doc.");
            else if ((truckRegistrationFile == null || !truckRegistrationFile.length) && values.role === 'subcontractor')
                alert("You didn't uploaded gools in transit doc.");
            else {
                try {
                    formData.append('avatar', avatar, avatar.name);
                    licensePhoto && licensePhoto.map((item, i) => {
                        formData.append('licensePhoto', item, item.name);
                    });
                    insuranceFile && insuranceFile.map((item, i) => {
                        formData.append('insuranceFile', item, item.name);
                    });
                    workCompensationFile && workCompensationFile.map((item, i) => {
                        formData.append('workCompensationFile', item, item.name);
                    });
                    truckRegistrationFile && truckRegistrationFile.map((item, i) => {
                        formData.append('truckRegistrationFile', item, item.name);
                    });
                    formData.append('firstname', values.firstname);
                    formData.append('lastname', values.lastname);
                    formData.append('email', values.email);
                    formData.append('phone', values.phone);
                    formData.append('birthDate', birthDate);
                    formData.append('role', values.role);
                    formData.append('password', values.password);
                    formData.append('licenseNumber', values.licenseNumber);
                    formData.append('cardNumber', values.cardNumber);
                    formData.append('expireDate', expireDate);
                    formData.append('licenseClass', values.licenseClass);
                    formData.append('licenseState', values.licenseState);
                    formData.append('year', values.year);
                    formData.append('numberPlate', values.numberPlate);
                    formData.append('VIN', values.VIN);
                    inputMakeValue == '' ? formData.append('make', 'other') : formData.append('make', inputMakeValue);
                    inputCategoryValue == '' ? formData.append('category', 'other') : formData.append('category', inputCategoryValue);
                    formData.append('model', values.model);
                    formData.append('approved', checked);
                    formData.append('resetPassword', resetPassword);

                    var changedData = `name: ${values.firstname + ' ' + values.lastname}, email: ${values.email}, phone: ${values.phone}${values.resetPassword ? ', password: ' : ''}${values.resetPassword ? values.password : ''}, year: ${values.year}, numberPlate: ${values.numberPlate}, VIN: ${values.VIN}, approved: ${checked}`
                    alert(`You changed driver detail as ${changedData}`)
                    await saveEditedDriver(formData);
                    setSuccess(true);
                } catch (error) {
                    console.log(error.message);
                } finally {
                    setSubmitting(false);
                }
            }
        },
    });

    const saveEditedDriver = async (data) => {
        instance.put(`/admin/drivers/${id}`, data)
            .then((res) => {
                console.log(res.data);
                res.status == 200 && router.push('/drivers');
            }).catch(error => {
                console.log(error.message);
            });
    };

    const resetPasswordHandler = () => {
        setResetPassword(!resetPassword);
        formik.values.password = '123456';
        formik.values.confirm = '123456';
    };

    const handleDrop = (licensePhoto) => {
        setLicensePhoto(licensePhoto);
    };

    const handleInsuranceFile = (File) => {
        setInsuranceFile(File);
    }

    const handleWorkCompensationFile = (File) => {
        setWorkCompensationFile(File);
    }

    const handleTruckRegistrationFile = (File) => {
        setTruckRegistrationFile(File);
    }

    const handleBirthChange = (birthDate) => {
        setBirthDate(birthDate);
    };

    const handleBirthClose = (state) => {
        setBirthShow(state)
    };

    const handleExpireChange = (expireDate) => {
        setExpireDate(expireDate);
    };

    const handleExpireClose = (state) => {
        setExpireShow(state)
    };

    const avatarChangeHandler = (e) => {
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

    const handleCategoryOptionChange = (event) => {
        setSelectedCategoryOption(event.target.value);
        event.target.value == 'other' ? setInputCategoryValue('') : setInputCategoryValue(event.target.value);
        setInputMakeValue('');
        setSelectedMakeOption('');
    };

    const handleCategoryInputChange = (event) => {
        setInputCategoryValue(event.target.value);
    };

    const handleMakeOptionChange = (event) => {
        setSelectedMakeOption(event.target.value);
        setInputMakeValue(event.target.value);
        event.target.value == 'other' ? setInputMakeValue('') : setInputMakeValue(event.target.value);
    };

    const handleMakeInputChange = (event) => {
        setInputMakeValue(event.target.value);
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                <div className="sm:col-span-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload avatar</label>

                    <div className="flex items-center w-full flex-wrap">
                        {
                            imageDataUrl && <img className="mb-0 mr-4 rounded-full w-[10rem] object-cover mb-2" src={imageDataUrl} width={80} height={80} alt="Driver avatar" />
                        }
                        <div className="mb-2">
                            <label className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 cursor-pointer flex items-center">
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
                <div className="w-full">
                    <label htmlFor="birthDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date of Birth</label>
                    <div className="relative">
                        <Datepicker
                            options={birthDateOptions}
                            onChange={handleBirthChange}
                            show={birthShow}
                            setShow={handleBirthClose} />
                    </div>
                </div>
                <div className="w-full">
                    <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role</label>

                    <select id="role" name="role" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-50" value={formik.values.role} onChange={formik.handleChange} onBlur={formik.handleBlur} required>
                        <option value="">Choose a Role</option>
                        <option value="driver">Driver</option>
                        <option value="subcontractor">Subcontractor</option>
                    </select>
                    {formik.touched.role && formik.errors.role ? (
                        <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.role}</div>
                    ) : null}
                </div>

                <div className="sm:col-span-2">
                    <button type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" onClick={resetPasswordHandler}>{resetPassword ? "No, I don't want password reset" : 'Reset Password'}</button>
                </div>
                <div className={`w-full ${!resetPassword ? 'hidden' : ''}`}>
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
                        required
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.password}</div>
                    ) : null}
                </div>
                <div className={`w-full ${!resetPassword ? 'hidden' : ''}`}>
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
                        required
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
                        onBlur={formik.handleBlur}
                        required
                    />
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
                        required
                    />
                    {formik.touched.cardNumber && formik.errors.cardNumber ? (
                        <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.cardNumber}</div>
                    ) : null}
                </div>
                <div className="w-full">
                    <label htmlFor="expirationDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Expire Date</label>
                    <div className="relative">
                        <Datepicker
                            options={expireDateOptions}
                            onChange={handleExpireChange}
                            show={expireShow}
                            setShow={handleExpireClose} />
                    </div>
                </div>
                <div className="w-full">
                    <label htmlFor="licenseClass" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">License Class</label>

                    <select id="licenseClass" name="licenseClass" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-50" value={formik.values.licenseClass} onChange={formik.handleChange} onBlur={formik.handleBlur} required>
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
                    <select id="licenseState" name="licenseState" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-50" value={formik.values.licenseState} onChange={formik.handleChange} onBlur={formik.handleBlur} required>
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

                <div className="sm:col-span-2">
                    <label htmlFor="licesePhoto" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">License Photo</label>
                    {
                        licensePhoto ? <Dropzone onDrop={handleDrop} id="licensePhoto" selectedFiles={licensePhoto} setLicensePhotoHandler={handleDrop} /> : <div className="text-xs text-navy-800 dark:text-white">Loading...</div>
                    }
                </div>

                <h2 className="sm:col-span-2 mt-6 mb-4 text-xl font-bold text-gray-900 dark:text-white">Vehicle Info</h2>

                <div className="w-full">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Category</label>
                    <div className="relative flex items-center">
                        <select id="category" name="category" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={selectedCategoryOption} onChange={handleCategoryOptionChange} required>
                            <option value="">Select a Category</option>
                            <option value="truck">Truck</option>
                            <option value="van">VAN</option>
                            <option value="ute">UTE</option>
                            <option value="other">Other</option>
                        </select>
                        {
                            selectedCategoryOption == 'other' && <input type="text" id="categoryInput" name="categoryInput" value={inputCategoryValue} onChange={handleCategoryInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ml-6" placeholder="Enter an option" required />
                        }
                    </div>
                </div>

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
                        onBlur={formik.handleBlur}
                        required
                    />
                    {formik.touched.year && formik.errors.year ? (
                        <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.year}</div>
                    ) : null}
                </div>

                <div className="w-full">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Make</label>

                    {
                        selectedCategoryOption == 'other' || selectedCategoryOption == '' ?
                            <input
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                type="text"
                                name="makeInput1"
                                id="makeInput1"
                                value={inputMakeValue}
                                onChange={handleMakeInputChange}
                                required
                            />
                            :
                            <div className="relative flex items-center">
                                <select id="make" name="make" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-50" value={selectedMakeOption} onChange={handleMakeOptionChange} required>
                                    <option value="">Choose a Make</option>
                                    {
                                        selectedCategoryOption == 'truck' ?
                                            <>
                                                <option value="Ford">Ford</option>
                                                <option value="FreightLiner">FreightLiner</option>
                                                <option value="Fuso">Fuso</option>
                                                <option value="Hino">Hino</option>
                                                <option value="Isuzu">Isuzu</option>
                                                <option value="Iveco">Iveco</option>
                                                <option value="KenWorth">KenWorth</option>
                                                <option value="Mack">Mack</option>
                                                <option value="M.A.N">M.A.N</option>
                                                <option value="Mercedes-Benz">Mercedes-Benz</option>
                                                <option value="Mitsubishi">Mitsubishi</option>
                                                <option value="Volvo">Volvo</option>
                                                <option value="Western Star">Western Star</option>
                                                <option value="CaterPillar">CaterPillar</option>
                                                <option value="Daf">Daf</option>
                                                <option value="International">International</option>
                                                <option value="Scania">Scania</option>
                                                <option value="Sinotruck">Sinotruck</option>
                                                <option value="Sterling">Sterling</option>
                                                <option value="U.D">U.D</option>
                                                <option value="other">Other</option>
                                            </>
                                            :
                                            selectedCategoryOption == 'van' || selectedCategoryOption == 'ute' ?
                                                <>
                                                    <option value="Audi">Audi</option>
                                                    <option value="Ford">Ford</option>
                                                    <option value="Holden">Holden</option>
                                                    <option value="Honda">Honda</option>
                                                    <option value="Hyundai">Hyundai</option>
                                                    <option value="Kia">Kia</option>
                                                    <option value="Mitsubishi">Mitsubishi</option>
                                                    <option value="Nissan">Nissan</option>
                                                    <option value="Toyota">Toyota</option>
                                                    <option value="Volkswagon">Volkswagon</option>
                                                    <option value="LDV">LDV</option>
                                                    <option value="Mercedes-Benz">Mercedes-Benz</option>
                                                    <option value="Peugeot">Peugeot</option>
                                                    <option value="Renault">Renault</option>
                                                    <option value="Citreon">Citreon</option>
                                                    <option value="Daihatsu">Daihatsu</option>
                                                    <option value="other">Other</option>
                                                </> : <></>
                                    }
                                </select>
                                {
                                    selectedMakeOption == 'other' && <input type="text" id="makeInput" value={inputMakeValue} onChange={handleMakeInputChange} name="makeInput" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ml-6" placeholder="Enter an option" />
                                }
                            </div>
                    }
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
                        onBlur={formik.handleBlur}
                        required
                    />
                    {formik.touched.VIN && formik.errors.VIN ? (
                        <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.VIN}</div>
                    ) : null}
                </div>

                <div className="w-full">
                    <label htmlFor="model" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Model</label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        type="text"
                        name="model"
                        id="model"
                        value={formik.values.model}
                        placeholder={formik.values.model}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        required
                    />
                    {formik.touched.model && formik.errors.model ? (
                        <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.model}</div>
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
                        onBlur={formik.handleBlur}
                        required
                    />
                    {formik.touched.numberPlate && formik.errors.numberPlate ? (
                        <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.numberPlate}</div>
                    ) : null}
                </div>

                {
                    formik.values.role === 'subcontractor' ?
                        <>
                            <div className="sm:col-span-2">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload Insurance (Vehicle)</label>
                                {
                                    insuranceFile ? <DropzoneForFile onDrop={handleInsuranceFile} id="insuranceFile" selectedFiles={insuranceFile} setLicensePhotoHandler={handleInsuranceFile} /> : <div className="text-xs text-navy-800 dark:text-white">Loading...</div>
                                }
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload Workers Compensation</label>
                                {
                                    workCompensationFile ? <DropzoneForFile onDrop={handleWorkCompensationFile} id="workCompensationFile" selectedFiles={workCompensationFile} setLicensePhotoHandler={handleWorkCompensationFile} /> : <div className="text-xs text-navy-800 dark:text-white">Loading...</div>
                                }
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload Goods in Transit</label>
                                {
                                    truckRegistrationFile ? <DropzoneForFile onDrop={handleTruckRegistrationFile} id="truckRegistrationFile" selectedFiles={truckRegistrationFile} setLicensePhotoHandler={handleTruckRegistrationFile} /> : <div className="text-xs text-navy-800 dark:text-white">Loading...</div>
                                }
                            </div>
                        </> : <></>
                }

                <div className="w-full">
                    <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer" checked={checked} onChange={() => setChecked(!checked)} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 hidden">Toggle me</span>
                    </label>
                </div>
            </div>

            <button type="submit" className="text-white bg-gradient-to-r transition from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" disabled={licensePhoto ? false : true}>Save</button>

            <Link href="/drivers">
                <button type="button" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 opacity-90">Back</button>
            </Link>
        </form>
    );
}

export default SingleDriverForm;