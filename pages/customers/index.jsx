import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import Link from "next/link";

import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import { SlDocs, SlEye, SlTrash } from 'react-icons/sl';
import { BsPen } from 'react-icons/bs';

import { idAtom } from "helpers/authorize";

import {
    Card,
    CardHeader,
    Typography,
    Button,
    CardBody,
    CardFooter,
    Tabs,
    TabsHeader,
    Tab,
    Avatar
} from "@material-tailwind/react";

import { instance } from 'helpers/axios';

const TABS = [
    {
        label: "All Customers",
        value: "all",
    },
    {
        label: "Approved",
        value: "approved",
    },
    {
        label: "Pending",
        value: "pending",
    },
];

const headers = [
    { text: 'Image', key: 'image' },
    { text: 'Company Name', key: 'companyName' },
    // { text: 'Documents', key: 'documents' },
    { text: 'Company Email', key: 'email' },
    { text: 'Company Phone', key: 'phone' },
    { text: 'Company ABN', key: 'abn' },
    { text: 'Rate Type', key: 'rateType' },
    { text: 'Load Rate', key: 'loadRate' },
    { text: 'Fuel Rate', key: 'fuelRate' },
    { text: 'Local Rate', key: 'localRate' },
    { text: 'Country Rate', key: 'countryRate' },
    { text: 'Company Address', key: 'address' },
    { text: 'Status', key: 'approved' },
    { text: 'Actions', key: 'actions' }
];

export default function Customers() {
    const [approve, setApprove] = useState('all');
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [checkedItems, setCheckedItems] = useState({});
    const [customerData, setCustomerData] = useState([]);
    const [sortedData, setSortedData] = useState([]);
    const [page, setPage] = useState(1);
    const [delID, setDelID] = useState(null);
    const [totalPage, setTotalPage] = useState(1);
    const router = useRouter();
    const countPerPage = 10;
    const [showModal, setShowModal] = useState(false);
    const [showModal1, setShowModal1] = useState(false);
    const [showID, setShowID] = useState(null);

    const handleModalClick = (id) => {
        setShowModal(true);
        setDelID(id);
    };

    const handleConfirm = () => {
        setShowModal(false);
        deleteDriverHandler(delID);
        setDelID(null);
    };

    const handleCancel = () => {
        setShowModal(false);
        setDelID(null);
    };

    const handleModal1Click = (id) => {
        setShowModal1(true);
        setShowID(id);
    };

    const handleCancel1 = () => {
        setShowModal1(false);
        setShowID(null);
    };

    const [user, __] = useAtom(idAtom);

    const handleSort = (key) => {
        if (key === sortKey) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    const handleToggleClick = (index, itemId) => {
        instance.put(`/admin/customers/approve/${itemId}`)
            .then((res) => {
                setCheckedItems({
                    ...checkedItems,
                    [index]: !checkedItems[index],
                });
            }).catch(error => {
                console.log(error.message);
            });
    };

    const deleteDriverHandler = (itemId) => {
        instance.delete(`/admin/customers/${itemId}`)
            .then((res) => {
                var url = approve === 'all' ? `?page=${page}` : `?status=${approve}&&page=${page}`;
                instance.get(`/admin/customers${url}`, { params: { user: user } })
                    .then((res) => {
                        setCustomerData(res.data.customers);
                    }).catch(error => {
                        console.log(error.message);
                    });
            }).catch(error => {
                console.log(error.message);
            });
    }

    const setApproveHandler = (index) => {
        setApprove(index);
    }

    const prevHandler = () => {
        setPage(page - 1);
    }

    const nextHandler = () => {
        setPage(parseInt(page) + 1);
    }

    useEffect(() => {
        var url = approve === 'all' ? `?page=${page}` : `?status=${approve}&&page=${page}`;
        user && instance.get(`/admin/customers${url}`, { params: { user: user } })
            .then((res) => {
                setCustomerData(res.data.customers);
                setTotalPage(Math.floor((res.data.totalCount - 1) / countPerPage) + 1);
            }).catch(error => {
                console.log(error.message);
            });
    }, [approve, router, user]);

    useEffect(() => {
        // console.log(customerData, sortKey, sortOrder)
        setSortedData(customerData);
        if (sortKey) {
            setSortedData(customerData.sort((a, b) => {
                const aValue = a[sortKey];
                const bValue = b[sortKey];

                if (sortOrder === 'asc') {
                    return aValue < bValue ? -1 : 1;
                } else {
                    return aValue > bValue ? -1 : 1;
                }
            }))
        }

        var tempCheckData = sortedData;
        tempCheckData.map((item, index) => {
            tempCheckData = {
                ...tempCheckData,
                [index]: item.approved
            }
        })
        setCheckedItems(tempCheckData);
    }, [customerData, sortKey, sortOrder, sortedData]);

    return (
        <>
            <Card className="h-full w-full bg-white dark:bg-navy-800 text-gray-900 dark:text-white">
                <CardHeader floated={false} shadow={false} className="rounded-none bg-white dark:bg-navy-800">
                    <div className="my-8 flex items-center justify-between gap-8">
                        <div>
                            <Typography variant="h5" className="text-gray-900 dark:text-white text-3xl">
                                Customers list
                            </Typography>
                            <Typography color="gray" className="mt-1 font-normal text-gray-900 dark:text-white">
                                See information about all customers
                            </Typography>
                        </div>
                        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                            <Button className="flex items-center gap-3" color="blue" size="sm">
                                <Link href="/customers/create" className="flex items-center">
                                    <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Customer
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <Tabs value="all" className="w-full md:w-max">
                            <TabsHeader>
                                {TABS.map(({ label, value }) => (
                                    <Tab key={value} value={value} className="whitespace-nowrap" onClick={() => setApproveHandler(value)}>
                                        &nbsp;&nbsp;{label}&nbsp;&nbsp;
                                    </Tab>
                                ))}
                            </TabsHeader>
                        </Tabs>
                        {/* <div className="w-full md:w-72">
                            <Input label="Search" icon={<MagnifyingGlassIcon className="h-5 w-5" />} />
                        </div> */}
                    </div>
                </CardHeader>
                <CardBody className={`overflow-x-scroll custom-scroller mx-4 px-0`}>
                    <table className="mt-4 w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                {headers.map((head) => (
                                    <th
                                        key={head.key}
                                        className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 dark:border-navy-700 p-4 transition-colors hover:bg-blue-gray-50"
                                        onClick={() => handleSort(head.key)}
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70 hover:opacity-90 transition-opacity"
                                        >
                                            {head.text}{" "}
                                            <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                sortedData.length ? sortedData.map((row, index) => {
                                    const isLast = index === sortedData.length - 1;
                                    const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50 dark:border-navy-700";

                                    return (
                                        <tr key={row._id}>
                                            <td className={classes}>
                                                <div className="flex items-center gap-3">
                                                    <Avatar src={row.photo.url} alt="image" size="sm" />
                                                </div>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal cursor-pointer" onClick={() => handleModal1Click(index)}>
                                                    {row.companyName}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {row.email}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {row.phone}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {row.abn}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {row.rateType}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {row.loadRate}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {row.fuelRate}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {row.localRate}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {row.countryRate}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal">
                                                    {row.address}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" value="" className="sr-only peer" checked={checkedItems[index]} onChange={() => handleToggleClick(index, row._id)} />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 hidden">Toggle me</span>
                                                </label>
                                            </td>
                                            <td className={classes}>
                                                <div className="flex items-center">
                                                    <Link href={`/customers/single/${row._id}`} className="text-indigo-600 hover:text-indigo-900" title="View"><SlEye /></Link>
                                                    <Link href={`/customers/edit/${row._id}`} className="text-green-600 hover:text-green-900 ml-4" title="Edit"><BsPen /></Link>
                                                    <button className="text-red-600 hover:text-red-900 ml-4" onClick={() => handleModalClick(row._id)} title="Delete"><SlTrash /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }) :
                                    <tr>
                                        <td>
                                            <Typography variant="small" color="blue-gray" className="font-normal py-10 px-4">
                                                No Customers to show...
                                            </Typography>
                                        </td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </CardBody>
                <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 dark:border-navy-700 p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                        Page {page} of {totalPage}
                    </Typography>
                    <div className="flex gap-2">
                        <Button variant="outlined" color="blue-gray" size="sm" className="p-0" disabled={`${page == 1 ? 'disabled' : ''}`} onClick={prevHandler}>
                            <Link href={`/customers?page=${page - 1}`} className="w-full h-full py-2 px-4 flex">
                                Previous
                            </Link>
                        </Button>
                        <Button variant="outlined" color="blue-gray" size="sm" className="p-0" disabled={totalPage <= page ? 'disabled' : ''} onClick={nextHandler}>
                            <Link href={`/customers?page=${parseInt(page) + 1}`} className="w-full h-full py-2 px-4 flex">
                                Next
                            </Link>
                        </Button>
                    </div>
                </CardFooter>
            </Card >

            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 dark:bg-[#000000] opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            Are you sure you want to continue?
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                This action cannot be undone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={handleConfirm}
                                >
                                    Yes
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={handleCancel}
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showModal1 && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 dark:bg-[#000000] opacity-75"></div>
                        </div>

                        <div className="m-10">
                            <div key={sortedData[showID]._id} className="bg-white relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4 py-10">
                                <div className="p-2 flex items-center justify-center">
                                    <div
                                        className="cursor-pointer bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 relative"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70 hover:opacity-90 transition-opacity"
                                        >
                                            Image
                                        </Typography>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Avatar src={sortedData[showID].photo.url} alt="image" size="sm" />
                                    </div>
                                </div>
                                <div className="p-2 flex items-center justify-center">
                                    <div
                                        className="cursor-pointer bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 relative"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70 hover:opacity-90 transition-opacity"
                                        >
                                            Company Name
                                        </Typography>
                                    </div>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {sortedData[showID].companyName}
                                    </Typography>
                                </div>
                                <div className="p-2 flex items-center justify-center">
                                    <div
                                        className="cursor-pointer bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 relative"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70 hover:opacity-90 transition-opacity"
                                        >
                                            Email
                                        </Typography>
                                    </div>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {sortedData[showID].email}
                                    </Typography>
                                </div>
                                <div className="p-2 flex items-center justify-center">
                                    <div
                                        className="cursor-pointer bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 relative"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70 hover:opacity-90 transition-opacity"
                                        >
                                            Phone
                                        </Typography>
                                    </div>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {sortedData[showID].phone}
                                    </Typography>
                                </div>
                                <div className="p-2 flex items-center justify-center">
                                    <div
                                        className="cursor-pointer bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 relative"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70 hover:opacity-90 transition-opacity"
                                        >Company ABN
                                        </Typography>
                                    </div>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {sortedData[showID].abn}
                                    </Typography>
                                </div>
                                <div className="p-2 flex items-center justify-center">
                                    <div
                                        className="cursor-pointer bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 relative"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70 hover:opacity-90 transition-opacity"
                                        >
                                            Rate Type
                                        </Typography>
                                    </div>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {sortedData[showID].rateType}
                                    </Typography>
                                </div>
                                <div className="p-2 flex items-center justify-center">
                                    <div
                                        className="cursor-pointer bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 relative"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70 hover:opacity-90 transition-opacity"
                                        >
                                            Load Rate
                                        </Typography>
                                    </div>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {sortedData[showID].loadRate}
                                    </Typography>
                                </div>
                                <div className="p-2 flex items-center justify-center">
                                    <div
                                        className="cursor-pointer bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 relative"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70 hover:opacity-90 transition-opacity"
                                        >
                                            Fuel Levy
                                        </Typography>
                                    </div>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {sortedData[showID].fuelRate}
                                    </Typography>
                                </div>
                                <div className="p-2 flex items-center justify-center">
                                    <div
                                        className="cursor-pointer bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 relative"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70 hover:opacity-90 transition-opacity"
                                        >
                                            Local Rate
                                        </Typography>
                                    </div>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {sortedData[showID].localRate}
                                    </Typography>
                                </div>
                                <div className="p-2 flex items-center justify-center">
                                    <div
                                        className="cursor-pointer bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 relative"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70 hover:opacity-90 transition-opacity"
                                        >
                                            Country Rate
                                        </Typography>
                                    </div>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {sortedData[showID].countryRate}
                                    </Typography>
                                </div>
                                <div className="p-2 flex items-center justify-center">
                                    <div
                                        className="cursor-pointer bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 relative"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70 hover:opacity-90 transition-opacity"
                                        >
                                            Company Address
                                        </Typography>
                                    </div>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {sortedData[showID].address}
                                    </Typography>
                                </div>
                                <div className="p-2 flex items-center justify-center">
                                    <div
                                        className="cursor-pointer bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 relative"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70 hover:opacity-90 transition-opacity"
                                        >
                                            Status
                                        </Typography>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" value="" className="sr-only peer" checked={checkedItems[showID]} onChange={() => handleToggleClick(showID, sortedData[showID]._id)} />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 hidden">Toggle me</span>
                                    </label>
                                </div>
                            </div>

                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex relative">
                                <div className="p-2 flex items-center justify-center sm:justify-start w-full">
                                    <div className="flex items-center">
                                        <Link href={`/customers/single/${sortedData[showID]._id}`} className="text-indigo-600 hover:text-indigo-900" title="View"><SlEye /></Link>
                                        <Link href={`/customers/edit/${sortedData[showID]._id}`} className="text-green-600 hover:text-green-900 ml-4" title="Edit"><BsPen /></Link>
                                        <button className="text-red-600 hover:text-red-900 ml-4" onClick={() => {
                                            handleModalClick(sortedData[showID]._id);
                                            handleCancel1();
                                        }} title="Delete"><SlTrash /></button>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => handleCancel1()}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div >
            )
            }
        </>
    );
}