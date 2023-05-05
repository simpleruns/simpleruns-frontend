import "../styles/globals.css";

import Layout from "components/layout";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";

import { authorizationAtom } from "helpers/authorize";

import SettingColor from "../components/settingColor";

function MyApp({ Component, pageProps }) {
	const [authorized, _] = useAtom(authorizationAtom);
	const [layout, setLayout] = useState(true);
	const router = useRouter();

	useEffect(() => {
		if (!authorized && !router.pathname.includes('auth')) {
			router.push('/auth/login');
		}
	}, []);

	useEffect(() => {
		setLayout(router.pathname.includes('auth'));
	}, [router]);

	return (
		<>
			{
				layout ? <Component {...pageProps} /> :
					<Layout>
						<Component {...pageProps} />
					</Layout>
			}
			<SettingColor />
		</>
	);
}

export default MyApp;
