import React, { useRef, useState, useEffect } from "react";
import classNames from "classnames";
import Link from "next/link";
import Image from 'next/image';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
// define a NavItem prop
import { BsGrid, BsUiChecksGrid, BsTruck, BsPeople } from "react-icons/bs";
import { SlBriefcase, SlLogout, SlArrowDown, SlArrowUp } from "react-icons/sl";

// add NavItem prop to component prop

const Sidebar = () => {
	const [openStateOne, setOpenStateOne] = useState(false);
	const [openStateTwo, setOpenStateTwo] = useState(false);
	const [openStateThree, setOpenStateThree] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(true);

	const router = useRouter();

	function logoutHandler(e) {
		e.preventDefault();
		Cookies.remove('x-access-token');
		router.push('/auth/login');
	}
	return (
		<aside id="logo-sidebar" className={`sm:none duration-175 linear fixed !z-50 flex min-h-full w-64 flex-col bg-white shadow-2xl shadow-white/5 transition-all dark:!bg-navy-900 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 overflow-y-scroll h-screen simple-scroller ${sidebarOpen ? "translate-x-0" : "-translate-x-96"}`} aria-label="Sidebar">
			<div className="relative h-full px-3 py-4">
				<Link href="#"
					className="flex items-center pl-2.5 py-1.5 mb-2.5 rounded-3xl bg-white">
					<Image
						src="/assets/img/logo.png"
						width={1366}
						height={768}
						style={{ width: 'auto' }}
						className="h-[40px] mr-2" alt="Simpleruns Logo"
					/>
					<span className="self-center text-lg font-semibold whitespace-nowrap text-blue-800">Simpleruns</span>
				</Link>
				<ul className="space-y-2 mt-10">
					<li>
						<Link href="/" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700">
							<BsUiChecksGrid size={24} />
							<span className="ml-3">Dashboard</span>
						</Link>
					</li>

					<li>
						<button type="button" className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-blue-500 hover:text-white dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown" data-collapse-toggle="dropdown" onClick={() => setOpenStateOne((prev) => !prev)}>
							<BsPeople size={26} />
							<span className="flex-1 ml-3 text-left whitespace-nowrap" >Drivers</span>
							{openStateOne ? <SlArrowUp size={10} /> :
								<SlArrowDown size={10} />}
						</button>
						<ul id="dropdown" className={classNames({
							"  hidden": !openStateOne,
							"py-2 space-y-2 transition-all duration-300": true,
						})}>
							<li>
								<Link href="/invoices" className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-blue-500 hover:text-white dark:text-white dark:hover:bg-gray-700">Invoices</Link>
							</li>
							<li>
								<Link href="/customers" className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-blue-500 hover:text-white dark:text-white dark:hover:bg-gray-700">Customers</Link>
							</li>
							<li>
								<Link href="/products" className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-blue-500 hover:text-white dark:text-white dark:hover:bg-gray-700">Products & Services</Link>
							</li>
						</ul>
					</li>

					<li>
						<button type="button" className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-blue-500 hover:text-white dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown" data-collapse-toggle="dropdown" onClick={() => setOpenStateTwo((prev) => !prev)}>
							<SlBriefcase size={26} />
							<span className="flex-1 ml-3 text-left whitespace-nowrap" >Customers</span>
							{
								openStateTwo ? <SlArrowUp size={10} /> :
									<SlArrowDown size={10} />}
						</button>
						<ul id="dropdown" className={classNames({
							"hidden": !openStateTwo,
							"py-2 space-y-2": true,
						})}>
							<li>
								<Link href="/bills" className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-blue-500 hover:text-white dark:text-white dark:hover:bg-gray-700">Bills</Link>
							</li>
							<li>
								<Link href="/vendors" className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-blue-500 hover:text-white dark:text-white dark:hover:bg-gray-700">Vendors</Link>
							</li>
							<li>
								<Link href="/products" className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-blue-500 hover:text-white dark:text-white dark:hover:bg-gray-700">products & Services</Link>
							</li>
						</ul>
					</li>

					<li>
						<button type="button" className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-blue-500 hover:text-white dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown" data-collapse-toggle="dropdown" onClick={() => setOpenStateThree((prev) => !prev)}>
							<BsTruck size={26} />
							<span className="flex-1 ml-3 text-left whitespace-nowrap" >Trucks</span>
							{openStateThree ? <SlArrowUp size={10} /> :
								<SlArrowDown size={10} />}
						</button>
						<ul id="dropdown" className={classNames({
							"hidden": !openStateThree,
							"py-2 space-y-2": true,
						})}>
							<li>
								<Link href="/transactions" className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-blue-500 hover:text-white dark:text-white dark:hover:bg-gray-700">Transactions</Link>
							</li>
							<li>
								<Link href="/reconcillation" className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-blue-500 hover:text-white dark:text-white dark:hover:bg-gray-700">Reconcillation</Link>
							</li>
							<li>
								<Link href="/drivers" className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-blue-500 hover:text-white dark:text-white dark:hover:bg-gray-700">Chart of Drivers</Link>
							</li>
						</ul>
					</li>

					<li>
						<Link onClick={logoutHandler} href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:text-white dark:text-white hover:bg-blue-500 dark:hover:bg-gray-700">
							<SlLogout size={26} />

							<span className="flex-1 ml-3 whitespace-nowrap">Sign Out</span>
						</Link>
					</li>
				</ul>
			</div>
		</aside >
	);
};
export default Sidebar;
