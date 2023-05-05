import React, { useState } from "react";

import { BsArrowRightShort, BsArrowLeftShort, BsUiChecksGrid, BsTruck, BsPeople } from "react-icons/bs";

import Sidebar from "./sidebar";

const Layout = (props) => {
	const [sidebarOpen, setSidebarOpen] = useState(true);

	function toggleSidebarHandler(e) {
		e.preventDefault();
		setSidebarOpen(!sidebarOpen);
	}

	return (
		<>
			<div className="flex h-full w-full">
				<aside id="logo-sidebar" className={`sm:none duration-175 linear relative !z-50 flex min-h-full flex-col bg-white shadow-2xl shadow-white/5 transition-all dark:!bg-navy-900 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 overflow-visible simple-scroller ${sidebarOpen ? "!min-w-[20rem]" : "!min-w-[6rem]"}`} aria-label="Sidebar">
					<Sidebar sidebarOpen={sidebarOpen} />

					<div className="absolute flex items-center justify-center text-white w-[30px] h-[30px] top-[50px] right-0 rounded-full bg-blue-900 dark:bg-gray-900 dark:opacity-90 hover:cursor-pointer translate-x-1/2 !z-50 md:!z-50 lg:!z-50 xl:!z-10" onClick={toggleSidebarHandler}>
						{
							sidebarOpen ?
								<BsArrowLeftShort size={20} />
								: <BsArrowRightShort size={20} />
						}
					</div>
				</aside>

				<div className="h-full w-full bg-lightPrimary dark:!bg-navy-900 min-h-screen">
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
