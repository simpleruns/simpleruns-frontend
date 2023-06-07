import "styles/globals.css";

import { useEffect, useState } from "react";
import { ThemeProvider } from "@material-tailwind/react";
import { CookiesProvider } from 'react-cookie';

import Layout from "components/layout";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import Cookies from 'js-cookie';

import { authorizationAtom } from "helpers/authorize";

import SettingColor from "components/settingColor";
import PageOverlay from 'components/layout/overlay';

function MyApp({ Component, pageProps }) {
	const [authorized, setAuthorized] = useAtom(authorizationAtom);
	const [layout, setLayout] = useState(true);
	const router = useRouter();

	useEffect(() => {
		if (!authorized && !router.pathname.includes('auth')) {
			router.push('/auth/login');
		}
	}, [authorized]);

	useEffect(() => {
		const token = Cookies.get('token');
		if (!token) setAuthorized(false); else setAuthorized(true);
		if (!token && !router.pathname.includes('auth')) {
			router.push('/auth/login');
		}

		setLayout(router.pathname.includes('auth'));
	}, [router]);

	return (
		<CookiesProvider>
			<ThemeProvider>
				<PageOverlay />
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
