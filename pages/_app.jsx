import "styles/globals.css";

import { useEffect, useState } from "react";
import { ThemeProvider } from "@material-tailwind/react";
import { CookiesProvider } from 'react-cookie';

import Layout from "components/layout";
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
		<CookiesProvider>
			<ThemeProvider>
				{
					layout ? <Component {...pageProps} /> :
						<Layout>
							<Component {...pageProps} />
						</Layout>
				}
				<SettingColor />
			</ThemeProvider>
		</CookiesProvider>
	);
}

export default MyApp;
