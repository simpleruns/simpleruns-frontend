import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { BsArrowRightShort, BsArrowLeftShort } from "react-icons/bs";

import Sidebar from "./sidebar";
import Breadcrumb from "./breadcrumb";

const Layout = (props) => {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const router = useRouter();

	function toggleSidebarHandler(e) {
		e.preventDefault();
		setSidebarOpen(!sidebarOpen);
	}

	function checkWindowSize() {
		window.innerWidth < 991 ? setSidebarOpen(false) : setSidebarOpen(true);
	}

	useEffect(() => {
		checkWindowSize();
		window.addEventListener('resize', checkWindowSize);
		return () => {
			window.removeEventListener('resize', checkWindowSize);
		}
	}, []);

	return (
		<>
			<div className="flex h-full w-full">
				<aside id="logo-sidebar" className={`sm:none duration-175 linear absolute !z-50 flex min-h-full flex-col bg-white shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 overflow-visible simple-scroller ${sidebarOpen ? "!min-w-[18rem]" : "!min-w-[6rem]"}`} aria-label="Sidebar">
					<Sidebar sidebarOpen={sidebarOpen} />

					<div className={`fixed ${sidebarOpen ? "!min-w-[18rem]" : "!min-w-[6rem]"}`}>
						<div className="absolute flex items-center justify-center text-white w-[30px] h-[30px] top-[50px] right-0 rounded-full bg-blue-500 dark:bg-gray-900 dark:opacity-90 hover:cursor-pointer translate-x-1/2 !z-50 md:!z-50 lg:!z-50 xl:!z-10" onClick={toggleSidebarHandler}>
							{
								sidebarOpen ?
									<BsArrowLeftShort size={20} />
									: <BsArrowRightShort size={20} />
							}
						</div>
					</div>
				</aside>

				<div className={`h-full w-full bg-lightPrimary dark:bg-navy-700 min-h-screen pb-6 ${sidebarOpen ? "pl-[6rem] lg:pl-[18rem]" : "pl-[6rem]"} ${router.pathname.includes('invoices/single') ? "!bg-lightPrimary" : ""}`}>
					<Breadcrumb />

					<main
						className={`mx-[20px] h-full flex-none transition-all`}
					>
						<div className="h-full">
							{props.children}
						</div>
					</main>
				</div>
			</div>
		</>
	);
};

export default Layout;
