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
    Avatar
} from "@material-tailwind/react";
import { useRouter } from "next/router";

import { instance } from 'helpers/axios';

const headers = [
    { text: 'Image', key: 'image' },
    { text: 'Name', key: 'firstname' },
    // { text: 'Documents', key: 'documents' },
    { text: 'Duration', key: 'duration' },
    { text: 'Actions', key: 'actions' }
];

export default function Invoices() {
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [invoicesData, setInvoicesData] = useState([]);
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

    const prevHandler = () => {
        setPage(page - 1);
    }

    const nextHandler = () => {
        setPage(parseInt(page) + 1);
    }

    useEffect(() => {
        var url = `?page=${page}`;
        instance.get(`/admin/invoices${url}`, { params: { user: user } })
            .then((res) => {
                setInvoicesData(res.data.invoices);
                setTotalPage(Math.floor((res.data.totalCount - 1) / countPerPage) + 1);
            }).catch(error => {
                console.log(error.message);
            });
    }, [router]);

    useEffect(() => {
        // console.log(invoicesData, sortKey, sortOrder)
        setSortedData(invoicesData);
        if (sortKey) {
            setSortedData(invoicesData.sort((a, b) => {
                const aValue = a[sortKey];
                const bValue = b[sortKey];

                if (sortOrder === 'asc') {
                    return aValue < bValue ? -1 : 1;
                } else {
                    return aValue > bValue ? -1 : 1;
                }
            }))
        }
    }, [invoicesData, sortKey, sortOrder]);

    return (
        <Card className="h-full w-full bg-white dark:bg-navy-800 text-gray-900 dark:text-white">
            <CardHeader floated={false} shadow={false} className="rounded-none bg-white dark:bg-navy-800">
                <div className="my-8 flex items-center justify-between gap-8">
                    <div>
                        <Typography variant="h5" className="text-gray-900 dark:text-white text-3xl">
                            Invoices list
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal text-gray-900 dark:text-white">
                            See information about all invoices
                        </Typography>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                        <Button className="flex items-center gap-3" color="blue" size="sm">
                            <Link href="/customers/create" className="flex items-center">
                                <UserPlusIcon strokeWidth={2} className="h-4 w-4" />Select Customer
                            </Link>
                        </Button>
                    </div>
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
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {row.duration}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <div className="flex items-center">
                                                <Link href={`/invoices/single/${row._id}`} className="text-indigo-600 hover:text-indigo-900"><SlEye /></Link>
                                                <Link href={`/invoices/edit/${row._id}`} className="text-green-600 hover:text-green-900 ml-4"><BsPen /></Link>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }) :
                                <tr>
                                    <td>
                                        <Typography variant="small" color="blue-gray" className="font-normal py-10 px-4">
                                            No Invoices to show...
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
                        <Link href={`/invoices?page=${page - 1}`} className="w-full h-full py-2 px-4 flex">
                            Previous
                        </Link>
                    </Button>
                    <Button variant="outlined" color="blue-gray" size="sm" className="p-0" disabled={totalPage <= page ? 'disabled' : ''} onClick={nextHandler}>
                        <Link href={`/invoices?page=${parseInt(page) + 1}`} className="w-full h-full py-2 px-4 flex">
                            Next
                        </Link>
                    </Button>
                </div>
            </CardFooter>
        </Card >
    );
}