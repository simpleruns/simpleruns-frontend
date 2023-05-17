import { useState, useEffect } from 'react';
import { useAtom } from "jotai";
import { Typography } from "@material-tailwind/react";

import { instance } from 'helpers/axios';
import { idAtom } from "helpers/authorize";

function Tolls() {
    const [user, __] = useAtom(idAtom);
    const [addresses, setAddresses] = useState([]);
    const [tableData, setTableData] = useState(() =>
        Array.from({ length: 1 }, () =>
            Array.from({ length: 1 }, () =>
                Array.from({ length: 2 }, () => 0)
            )
        )
    );

    function saveTableData() {
        instance.post('/settings/tolls/update', { data: tableData, user: user }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {
            console.log(response.data);
        });
    }

    function setTableDataHandler(rowIndex, colIndex, value, flag) {
        var tmpData = tableData;
        tmpData[rowIndex][colIndex][flag] = value;
        setTableData(tmpData);
    }

    useEffect(() => {
        user && instance.get('/settings/positions', { params: { user: user } })
            .then((res) => {
                var arr = [];
                res.data.positions.map(position => {
                    const { addressName } = position;
                    arr = [...arr, addressName];
                })
                setAddresses(arr);
                instance.get('/settings/tolls', { user: user }).then((response) => {
                    setTableData(response.data)
                });
            }).catch(error => {
                console.log(error.message);
            });
    }, []);

    return (
        <>
            <div className="overflow-x-scroll custom-scroller p-6 bg-white dark:bg-navy-800 text-gray-900 dark:text-white">
                <table className="mt-4 w-full min-w-max table-auto text-center">
                    <thead>
                        <tr>
                            <th className="cursor-pointer border border-blue-gray-100 bg-blue-gray-50/50 dark:border-navy-700 p-4 transition-colors hover:bg-blue-gray-50 text-center w-[10rem]"></th>
                            {addresses.map((address) => (
                                <th key={address} className="cursor-pointer border border-blue-gray-100 bg-blue-gray-50/50 dark:border-navy-700 p-4 transition-colors hover:bg-blue-gray-50 text-center w-[10rem]">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="flex items-center justify-center gap-2 font-normal opacity-70 hover:opacity-90 transition-opacity"
                                    >{address}</Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {addresses.map((address, index1) => (
                            <tr key={address + 'row' + index1}>
                                <td className="cursor-pointer border border-blue-gray-100 bg-blue-gray-50/50 dark:border-navy-700 p-4 transition-colors hover:bg-blue-gray-50">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="flex items-center justify-center gap-2 font-normal opacity-70 hover:opacity-90 transition-opacity"
                                    >{address}</Typography>
                                </td>
                                {addresses.map((address2, index2) => (
                                    <td
                                        key={address2 + 'col' + index2}
                                        contentEditable={true}
                                        className="cursor-pointer border border-blue-gray-100 bg-blue-gray-50/50 dark:border-navy-700 transition-colors hover:bg-blue-gray-50"
                                    >
                                        <div className='flex flex-col'>
                                            <div className='flex items-center border-b border-blue-gray-50 dark:border-navy-700'>
                                                <label className='block text-sm font-medium text-gray-900 dark:text-white w-16'>Class A: </label>
                                                <input
                                                    type="number"
                                                    className="h-12 bg-white dark:bg-navy-800 text-center max-w-[6rem]"
                                                    // value={tableData[index1][index2][0]}
                                                    onChange={(event) => setTableDataHandler(index1, index2, parseFloat(event.target.value), 0)}
                                                />
                                            </div>
                                            <div className='flex items-center dark:border-navy-700'>
                                                <label className='block text-sm font-medium text-gray-900 dark:text-white w-16'>Class B: </label>
                                                <input
                                                    type="number"
                                                    className="h-12 bg-white dark:bg-navy-800 text-center max-w-[6rem]"
                                                    // value={tableData[index1][index2][1]}
                                                    onChange={(event) => setTableDataHandler(index1, index2, parseFloat(event.target.value), 1)}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={saveTableData} className="text-white bg-gradient-to-r transition from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4">Save</button>
            </div>
        </>
    );
}

export default Tolls;