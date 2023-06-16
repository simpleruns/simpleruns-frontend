import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import { instance } from 'helpers/axios';
import { idAtom } from "helpers/authorize";
import { SlPlus, SlClose } from "react-icons/sl";

const SingleCustomerForm = (props) => {
    const { data, id } = props;
    const [user, __] = useAtom(idAtom);
    const [checked, setChecked] = useState(data.approved);
    const [photo, setPhoto] = useState(null);
    const [imageDataUrl, setImageDataUrl] = useState(data.photo.url);
    const [address, setAddress] = useState(data.address);
    const [predictions, setPredictions] = useState([]);
    const [predictions1, setPredictions1] = useState([]);
    const [isValidAddress, setIsValidAddress] = useState(true);
    const [api, setApi] = useState('');
    const router = useRouter();
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [tableData, setTableData] = useState(JSON.parse(data.job));

    useEffect(() => {
        user && instance.get(`/settings/googleapi/${user}`)
            .then((res) => {
                setApi(res.data);
                const existingScript = document.getElementById('googleMaps');

                if (!existingScript) {
                    const script = document.createElement('script');
                    script.src = `https://maps.googleapis.com/maps/api/js?key=${res.data}&libraries=places`;
                    script.id = 'googleMaps'
                    script.async = true;
                    document.body.appendChild(script);
                    setTimeout(() => {
                        setScriptLoaded(true);
                    }, 2000);
                }
            }).catch(error => {
                console.log(error.message);
            });
        scriptLoaded && addressValidateHandler();
    }, [api, address, scriptLoaded]);

    const addressValidateHandler = () => {
        const existingScript = document.getElementById('googleMaps');
        if (existingScript && api && scriptLoaded) {
            // The Google Maps API is now loaded and ready to use
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address }, (results, status) => {
                if (status == 'OK' && address != '') {
                    setIsValidAddress(true);
                } else {
                    setIsValidAddress(false);
                }
            });
        }
    }

    const addressValidateHandler1 = (address) => {
        const existingScript = document.getElementById('googleMaps');
        if (existingScript && api && scriptLoaded) {
            // The Google Maps API is now loaded and ready to use
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address }, (results, status) => {
                if (status === 'OK' && address !== '') {
                    return true;
                }
            });
        }
        return false;
    }

    const handleAddressAutoComplete = (value) => {
        const service = new google.maps.places.AutocompleteService();
        service.getPlacePredictions({ input: value }, (predictions, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                setPredictions(predictions);
            }
        });
    };

    const handleAddressAutoComplete1 = (value) => {
        const service = new google.maps.places.AutocompleteService();
        service.getPlacePredictions({ input: value }, (predictions, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                setPredictions1(predictions);
            }
        });
    };

    const handlePredictionClick = (prediction) => {
        setAddress(prediction.description);
        setPredictions([]);
        addressValidateHandler();
    };

    const handlePredictionClick1 = async (e, index, prediction) => {
        const address = prediction.description;
        const { lat, lng } = await getGeocodingData(address);
        setTableData(tableData.map((r, i) => i === index ? { ...r, name: address, lat: lat, lng: lng } : r));
        setPredictions1([]);
    };

    useEffect(() => {
        handleAvatarSelect(data.photo);
    }, []);

    const getGeocodingData = async (address) => {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${api}`);
        const { results } = response.data;
        const { lat, lng } = results[0].geometry.location;
        return { lat, lng };
    };

    async function handleAvatarSelect(data) {
        const blob = await loadFile(data.url);
        const newFile = new File([blob], 'Avatar', { type: data.type });
        setPhoto(newFile);
    }

    async function loadFile(filePath) {
        const response = await fetch(filePath);
        const blob = await response.blob();
        return blob;
    }

    const formik = useFormik({
        initialValues: {
            companyName: data.companyName,
            lastname: data.lastname,
            email: data.email,
            phone: data.phone,
            role: data.role,
            rateType: data.rateType,
            localRate: data.localRate ? data.localRate : '',
            countryRate: data.countryRate ? data.countryRate : '',
            loadRate: data.loadRate ? data.loadRate : '',
            fuelLevy: data.fuelLevy,
            abn: data.abn
        },
        validationSchema: Yup.object({
            companyName: Yup.string().required('Company Name is required'),
            email: Yup.string().email('Invalid Email').required('Email is required'),
            phone: Yup.string().required('Phone number is required'),
            rateType: Yup.string().required('Please select an option'),
            abn: Yup.string().required('ABN is required'),
        }),
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            const formData = new FormData();
            if (photo == null || photo == undefined)
                alert("You didn'nt uploaded customer user image.");
            else if (!isValidAddress)
                alert("You entered Invalid Address.");
            else {
                try {
                    formData.append('companyName', values.companyName);
                    formData.append('email', values.email);
                    formData.append('phone', values.phone);
                    formData.append('address', address);
                    formData.append('rateType', values.rateType);
                    formData.append('localRate', values.localRate);
                    formData.append('countryRate', values.countryRate);
                    formData.append('fuelLevy', values.fuelLevy);
                    formData.append('loadRate', values.loadRate);
                    formData.append('approved', checked);
                    formData.append('abn', values.abn);
                    formData.append('job', JSON.stringify(tableData));
                    photo && formData.append('photo', photo, photo.name);

                    var changedData = `name: ${values.companyName}, email: ${values.email}, phone: ${values.phone}, address: ${address}, rate type: ${values.rateType}, local rate: ${values.localRate}, country rate: ${values.countryRate}, fuel levy: ${values.fuelLevy},load rate: ${values.loadRate}, abn: ${values.abn}, approved: ${checked}`
                    alert(`You changed customer detail as ${changedData}`)
                    await saveEditedCustomer(formData);
                    setSuccess(true);
                } catch (error) {
                    console.log(error.message);
                } finally {
                    setSubmitting(false);
                }
            }
        },
    });

    const saveEditedCustomer = async (data) => {
        (user && isValidAddress) && instance.put(`/admin/customers/${id}`, data, {
            headers: {
                'content-Type': 'multipart/form-data'
            }
        })
            .then((res) => {
                res.status == 200 && router.push('/customers');
            }).catch(error => {
                console.log(error.message);
            });
    };

    const photoChangeHandler = (e) => {
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

    const handleAddRow = () => {
        setTableData([...tableData, { name: '', lat: '', lng: '' }]);
    };

    const handleDeleteRow = (id) => {
        setTableData(tableData.filter((row, index) => index !== id));
    };

    return (
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
                                <input type="file" accept="image/*" id="photo" name="photo" className="hidden" onChange={photoChangeHandler} />
                            </label>
                            <p className="block mt-2 text-xs font-medium text-gray-700 dark:text-white" id="file_input_help">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
                        </div>
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="companyName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company Name</label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        type="text"
                        name="companyName"
                        id="companyName"
                        value={formik.values.companyName}
                        placeholder={formik.values.companyName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur} />
                    {formik.touched.companyName && formik.errors.companyName ? (
                        <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.companyName}</div>
                    ) : null}
                </div>
                <div className="w-full">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company Email</label>
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
                    <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company Phone</label>
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
                                    required
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
                                    required
                                />
                                {formik.touched.countryRate && formik.errors.countryRate ? (
                                    <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.countryRate}</div>
                                ) : null}
                            </div>
                            <div className="w-full">
                                <label htmlFor="fuelLevy" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fuel Levy</label>
                                <input
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    type="number"
                                    name="fuelLevy"
                                    id="fuelLevy"
                                    value={formik.values.fuelLevy}
                                    placeholder={formik.values.fuelLevy}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    required
                                />
                                {formik.touched.fuelLevy && formik.errors.fuelLevy ? (
                                    <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.fuelLevy}</div>
                                ) : null}
                            </div>
                        </> : formik.values.rateType == 'load' ?
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
                                        required
                                    />
                                    {formik.touched.loadRate && formik.errors.loadRate ? (
                                        <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.loadRate}</div>
                                    ) : null}
                                </div>
                                <div className="w-full">
                                    <label htmlFor="fuelLevy" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fuel Levy</label>
                                    <input
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                        type="number"
                                        name="fuelLevy"
                                        id="fuelLevy"
                                        value={formik.values.fuelLevy}
                                        placeholder={formik.values.fuelLevy}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        required
                                    />
                                    {formik.touched.fuelLevy && formik.errors.fuelLevy ? (
                                        <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.fuelLevy}</div>
                                    ) : null}
                                </div>
                            </> : ''
                }

                <div className="w-full">
                    <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company Address</label>
                    <input
                        type="text"
                        name="address"
                        id="address"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        value={address}
                        placeholder={address}
                        onChange={(e) => {
                            setIsValidAddress(true);
                            setAddress(e.target.value);
                            scriptLoaded && handleAddressAutoComplete(e.target.value);
                            addressValidateHandler();
                            e.target.value == null || e.target.value == '' ? setPredictions([]) : '';
                        }}
                        onBlur={(e) => { addressValidateHandler() }}
                        required
                    />
                    {predictions.length > 0 && (
                        <div className="mt-1 flex flex-col absolute z-30 bg-white max-w-[300px] shadow-md py-2">
                            {predictions.map((prediction) => (
                                <div
                                    className="py-2 px-4 bg-white border-x-shadow-500 hover:opacity-80 overflow-hidden text-ellipsis whitespace-nowrap"
                                    key={prediction.place_id}
                                    onClick={() => handlePredictionClick(prediction)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {prediction.description}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="w-full">
                    <label htmlFor="abn" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company ABN</label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        type="number"
                        name="abn"
                        id="abn"
                        value={formik.values.abn}
                        placeholder={formik.values.abn}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        required
                    />
                    {formik.touched.abn && formik.errors.abn ? (
                        <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.abn}</div>
                    ) : null}
                </div>

                <div className="sm:col-span-2 relative">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Add Job Sites</label>

                    <table className="w-full mt-4">
                        <thead>
                            <tr>
                                <th className="cursor-pointer border-y border-blue-gray-100 dark:border-white-100  bg-blue-gray-50/50 dark:border-navy-700 p-4 transition-colors hover:bg-blue-gray-50 dark:text-white w-[10%]">ID</th>
                                <th className="cursor-pointer border-y border-blue-gray-100 dark:border-white-100  bg-blue-gray-50/50 dark:border-navy-700 p-4 transition-colors hover:bg-blue-gray-50 dark:text-white">Site Name</th>
                                <th className="cursor-pointer border-y border-blue-gray-100 dark:border-white-100  bg-blue-gray-50/50 dark:border-navy-700 p-4 transition-colors hover:bg-blue-gray-50 dark:text-white">Site Address</th>
                                <th className="cursor-pointer border-y border-blue-gray-100 dark:border-white-100  bg-blue-gray-50/50 dark:border-navy-700 p-4 transition-colors hover:bg-blue-gray-50 dark:text-white">latitude</th>
                                <th className="cursor-pointer border-y border-blue-gray-100 dark:border-white-100  bg-blue-gray-50/50 dark:border-navy-700 p-4 transition-colors hover:bg-blue-gray-50 dark:text-white">longitude</th>
                                <th className="cursor-pointer border-y border-blue-gray-100 dark:border-white-100  bg-blue-gray-50/50 dark:border-navy-700 p-4 transition-colors hover:bg-blue-gray-50 dark:text-white">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row, index) => (
                                <tr key={index} className="pt-4 pb-4 h-[3rem]">
                                    <td className="border-b border-blue-gray-50 dark:border-navy-700 text-center">{index + 1}</td>
                                    <td className="border-b border-blue-gray-50 dark:border-navy-700 text-center">
                                        <input
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            type="text"
                                            name={"name" + index}
                                            id={"name" + index}
                                            value={tableData[index].name}
                                            onChange={(e) => {
                                                setTableData(tableData.map((r, i) => i === index ? { ...r, name: e.target.value } : r));
                                            }}
                                            required={true}
                                        />
                                    </td>
                                    <td className="border-b border-blue-gray-50 dark:border-navy-700 text-center relative address">
                                        <input
                                            type="text"
                                            name={"address" + index}
                                            id={"address" + index}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                            value={tableData[index].address}
                                            onChange={(e) => {
                                                scriptLoaded && handleAddressAutoComplete1(e.target.value);
                                                setTableData(tableData.map((r, i) => i === index ? { ...r, address: e.target.value } : r));
                                                e.target.value == null || e.target.value == '' ? setPredictions1([]) : '';
                                            }}
                                            onBlur={(e) => {
                                                addressValidateHandler1(e.target.value) ? setTableData(tableData.map((r, i) => i === index ? { ...r, addres: e.target.value } : r)) : '';
                                            }}
                                            required={true}
                                        />
                                        {predictions1.length > 0 && (
                                            <div className="mt-1 flex flex-col absolute z-30 bg-white max-w-[300px] shadow-md py-2 prediction">
                                                {predictions1.map((prediction) => (
                                                    <div
                                                        className="py-2 px-4 bg-white border-x-shadow-500 hover:opacity-80 overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer"
                                                        key={prediction.place_id}
                                                        onClick={(e) => {
                                                            handlePredictionClick1(e, index, prediction);
                                                            addressValidateHandler1(prediction) ? alert("Invalid Job Site address.") : '';
                                                        }}
                                                    >
                                                        {prediction.description}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                    <td className="border-b border-blue-gray-50 dark:border-navy-700 text-center">{row.lat}</td>
                                    <td className="border-b border-blue-gray-50 dark:border-navy-700 text-center">{row.lng}</td>
                                    <td className="border-b border-blue-gray-50 dark:border-navy-700 text-center">
                                        <button type="primary" onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            handleDeleteRow(index)
                                        }} className=""><SlClose className="text-red-600 hover:text-red-900 transition-colors text-2xl" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="sm:col-span-2">
                    <button type="primary" onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleAddRow();
                    }
                    } className="text-white bg-gradient-to-r transition from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 items-center inline-flex mb-2"><SlPlus className="mr-2 text-lg" /> Add New</button>
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

export default SingleCustomerForm;