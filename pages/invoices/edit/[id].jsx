import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";

import { instance } from 'helpers/axios';
import { idAtom } from "helpers/authorize";
import SingleInvoiceForm from "components/forms/editInvoice";

const SingleInvoiceEdit = () => {
    const [user, __] = useAtom(idAtom);
    const [data, setData] = useState(null);
    const router = useRouter();
    const { id, start, end } = router.query;

    useEffect(() => {
        (user && id && start && end) && instance.get(`/invoices/single/${id}?start=${start}&end=${end}&user=${user}`)
            .then((res) => {
                setData(res.data);
            }).catch(error => {
                console.log(error.message);
            });
    }, [router, id]);

    return (
        <>
            {
                data ? <SingleInvoiceForm data={data} /> : <div>Loading...</div>
            }
        </>
    );
}

export default SingleInvoiceEdit;