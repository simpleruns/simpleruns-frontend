import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useAtom } from "jotai";
import * as Yup from 'yup';
import GoogleMapReact from 'google-map-react';
import Geocode from 'react-geocode';
import { Typography } from "@material-tailwind/react";

import { SlTrash } from 'react-icons/sl';

import { instance } from 'helpers/axios';
import { idAtom } from "helpers/authorize";
import marker from "public/assets/img/marker.png";

const validationSchema = Yup.object().shape({
    address: Yup.string().required('Address is required'),
});

const AnyReactComponent = () => <div><img className='-translate-x-1/2 -translate-y-full' src={marker.src} width={40} height={40} /></div>;

const headers = [
    { text: 'Name', key: 'name' },
    { text: 'latitude', key: 'latitude' },
    { text: 'longitude', key: 'longitude' },
    { text: 'Actions', key: 'actions' }
];

const Map = () => {
    const [user, __] = useAtom(idAtom);
    const [addresses, setAddresses] = useState([]);
    const GOOGLE_MAPS_API_KEY = "AIzaSyDYfWq15nHdy2eJOpBQZnhOV5RfWP4o0iA";

    useEffect(() => {
        user && instance.get('/settings/positions', { params: { user: user } })
            .then((res) => {
                var arr = [];
                res.data.positions.map(position => {
                    const { _id, addressName, lat, lng } = position;
                    const exists = addresses.some(item => item.addressName === addressName);
                    if (!exists)
                        arr = [...arr, { lat, lng, addressName, _id }];
                })
                setAddresses(arr);
            }).catch(error => {
                console.log(error.message);
            });
    }, []);

    const formik = useFormik({
        initialValues: {
            address: '',
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                Geocode.setApiKey(GOOGLE_MAPS_API_KEY);
                const response = await Geocode.fromAddress(values.address);
                const addressName = response.results[0].formatted_address;
                const { lat, lng } = response.results[0].geometry.location;
                const exists = addresses.some(item => item.addressName === addressName);

                if (!exists) {
                    instance.post('/settings/positions/create',
                        {
                            addressName: addressName,
                            lat: lat,
                            lng: lng,
                            userId: user
                        },
                        {
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        })
                        .then(() => {
                        }).catch(error => {
                            console.log(error.message);
                        });
                    setAddresses([...addresses, { lat, lng, addressName }]);
                } else
                    alert("Already exist same address.");
                resetForm();
            } catch (error) {
                formik.setFieldError('address', 'Invalid address');
            }
        },
    });

    const deletePositionHandler = (id, index) => {
        instance.delete(`/settings/positions/${id}`, { params: { index: index, userId: user } }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .then(() => {
                instance.get('/settings/positions', { params: { user: user } })
                    .then((res) => {
                        setAddresses([]);
                        var arr = [];
                        res.data.positions.map(position => {
                            const { _id, addressName, lat, lng } = position;
                            arr = [...arr, { lat, lng, addressName, _id }];
                        })
                        setAddresses(arr);
                    }).catch(error => {
                        console.log(error.message);
                    });
            }).catch(error => {
                console.log(error.message);
            });
    }

    return (
        <section className="bg-white dark:bg-navy-800 text-gray-900 dark:text-white">
            <div className="max-w-100 px-4 py-8 mx-auto lg:py-16">
                <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Add New Position</h2>

                <div className="w-full">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="flex items-center max-w-[500px]">
                            <input
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-navy-900 dark:border-navy-900 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 mr-4"
                                type="text"
                                name="address"
                                id="address"
                                value={formik.values.address}
                                placeholder={formik.values.address}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} />
                            <button type="submit" className="text-white bg-gradient-to-r transition from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2">Save</button>
                        </div>
                        {formik.touched.address && formik.errors.address ? (
                            <div className="text-red-500 text-xs mt-1 ml-1.5 font-medium">{formik.errors.address}</div>
                        ) : null}
                    </form>
                </div>
                <div className="w-full mt-4">
                    <div style={{ height: '500px', width: '100%' }}>
                        <GoogleMapReact
                            bootstrapURLKeys={{ key: GOOGLE_MAPS_API_KEY }}
                            defaultCenter={{ lat: -33.8425806, lng: 150.9682045 }}
                            defaultZoom={10}
                        >
                            {
                                addresses.map((item, index) => {
                                    return <AnyReactComponent lat={item.lat} lng={item.lng} text="My Marker" key={"marker" + index} />
                                })
                            }
                        </GoogleMapReact>
                    </div>
                </div>

                <div className="overflow-x-scroll custom-scroller px-0 py-6">
                    <table className="mt-4 w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                {headers.map((head) => (
                                    <th
                                        key={head.key}
                                        className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 dark:border-navy-700 p-4 transition-colors hover:bg-blue-gray-50"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70 hover:opacity-90 transition-opacity"
                                        >
                                            {head.text}{" "}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                addresses.length ? addresses.map((address, index) => {
                                    const isLast = index === addresses.length - 1;
                                    const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50 dark:border-navy-700";

                                    return (
                                        <tr key={"address" + index}>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {address.addressName}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {address.lat}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {address.lng}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <div className="flex items-center">
                                                    <button className="text-red-600 hover:text-red-900 ml-4" onClick={() => deletePositionHandler(address._id, index)}><SlTrash /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }) :
                                    <tr>
                                        <td>
                                            <Typography variant="small" color="blue-gray" className="font-normal py-10 px-4">
                                                No Positions to show...
                                            </Typography>
                                        </td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default Map;