import { useEffect, useState } from "react";
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
import { useRouter } from "next/router";

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
    { text: 'Name', key: 'firstname' },
    // { text: 'Documents', key: 'documents' },
    { text: 'Email', key: 'email' },
    { text: 'Phone', key: 'phone' },
    { text: 'Rate Type', key: 'rateType' },
    { text: 'Load Rate', key: 'loadRate' },
    { text: 'Fuel Rate', key: 'fuelRate' },
    { text: 'Local Rate', key: 'localRate' },
    { text: 'Country Rate', key: 'countryRate' },
    { text: 'Address', key: 'address' },
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
    const [totalPage, setTotalPage] = useState(1);
    const router = useRouter();
    const countPerPage = 10;

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
                instance.get('/admin/customers')
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
        instance.get(`/admin/customers${url}`, { params: { user: user } })
            .then((res) => {
                setCustomerData(res.data.customers);
                setTotalPage(Math.floor((res.data.totalCount - 1) / countPerPage) + 1);
            }).catch(error => {
                console.log(error.message);
            });
    }, [approve, router]);

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
                                <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add member
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
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {row.firstname + ' ' + row.lastname}
                                            </Typography>
                                        </td>
                                        {/* <td className={classes}>
                                            <SlDocs />
                                        </td> */}
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
                                                <Link href={`/customers/single/${row._id}`} className="text-indigo-600 hover:text-indigo-900"><SlEye /></Link>
                                                <Link href={`/customers/edit/${row._id}`} className="text-green-600 hover:text-green-900 ml-4"><BsPen /></Link>
                                                <button className="text-red-600 hover:text-red-900 ml-4" onClick={() => deleteDriverHandler(row._id)}><SlTrash /></button>
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
    );
}