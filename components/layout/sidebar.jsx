import React, { useState } from "react";
import classNames from "classnames";
import Link from "next/link";
import Image from 'next/image';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

import {
	Card,
	Typography,
	List,
	ListItem,
	ListItemPrefix,
	ListItemSuffix,
	Accordion,
	AccordionHeader,
	AccordionBody,
} from "@material-tailwind/react";

// define a NavItem prop
import { BsUiChecksGrid, BsTruck, BsPeople } from "react-icons/bs";
import { SlBriefcase, SlLogout, SlArrowDown, SlMap, SlSettings, SlArrowRight } from "react-icons/sl";

// add NavItem prop to component prop

const Sidebar = (props) => {
	const { sidebarOpen } = props;
	const [open, setOpen] = useState(0);

	const handleOpen = (value) => {
		setOpen(open === value ? 0 : value);
	};

	const router = useRouter();

	function logoutHandler(e) {
		e.preventDefault();
		Cookies.remove('x-access-token');
		router.push('/auth/login');
	}

	return (
		<Card className={`fixed h-full px-3 pt-10 pb-4 overflow-y-scroll bg-transparent simple-scroller bg-white rounded-none dark:!bg-navy-800 ${sidebarOpen ? "!min-w-[18rem]" : "!min-w-[6rem]"}`}>
			<Link href="/"
				className={`flex items-center py-1.5 mb-2.5 rounded-lg ${sidebarOpen ? "" : "flex-col"}`}>
				<Image
					src="/assets/img/logo.png"
					width={1366}
					height={768}
					style={{ width: 'auto' }}
					className="h-[40px]" alt="Simpleruns Logo"
				/>
				<Typography variant="h5" className={`self-center text-lg font-semibold whitespace-nowrap dark:text-white text-blue-800 transition ${sidebarOpen ? "" : "!text-xs"}`}>
					Simpleruns
				</Typography>
			</Link>
			<List className={`space-y-2 mt-10 mb-10 p-0 ${sidebarOpen ? "!min-w-[16.5rem]" : "!min-w-[4.5rem]"}`}>
				<ListItem className="flex items-center w-full text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-blue-500 hover:text-white dark:text-white dark:hover:bg-navy-700 !bg-opacity-100">
					<Link className="flex items-center mx-auto" href="/">
						<ListItemPrefix className={`${!sidebarOpen ? "mx-auto" : ""}`}>
							<BsUiChecksGrid
								size={24}
								className={`${!sidebarOpen ? "mx-auto my-3" : ""}`}
							/>
						</ListItemPrefix>
						<span className={`flex-1 text-left whitespace-nowrap ${!sidebarOpen ? 'hidden' : ''}`}>Dashboard</span>
					</Link>
				</ListItem>

				<Accordion
					open={open === 1}
					icon={
						<SlArrowDown
							fontSize={10}
							className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""} ${!sidebarOpen ? " hidden" : ""}`}
						/>
					}
				>
					<ListItem className="flex items-center w-full text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-blue-500 hover:text-white dark:text-white dark:hover:bg-navy-700 !bg-opacity-100">
						<AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 py-0 transition-all">
							<ListItemPrefix className={`${!sidebarOpen ? "mx-auto" : ""}`}>
								<BsPeople
									size={26}
									className={`${!sidebarOpen ? 'mx-auto my-3' : ''}`}
								/>
							</ListItemPrefix>
							<Typography color="blue-gray" className={classNames({
								" hidden": !sidebarOpen,
								"flex-1 text-left whitespace-nowrap": true,
							})}>
								Drivers
							</Typography>
							<ListItemSuffix className={`${!sidebarOpen ? "ml-0 -mr-4" : ""}`}><span className="hidden">icon</span></ListItemSuffix>
						</AccordionHeader>
					</ListItem>
					<AccordionBody className={classNames({
						" hidden": !sidebarOpen,
						"py-2 space-y-2 transition-all duration-300": true,
					})}>
						<List className="p-0">
							<Link className="flex items-center" href="/drivers">
								<ListItem className="flex items-center w-full text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-blue-500 hover:text-white dark:text-white dark:hover:bg-navy-700 !bg-opacity-100">
									<ListItemPrefix className={`${!sidebarOpen ? "mx-auto" : ""}`}>
										<SlArrowRight strokeWidth={3} className="h-3 w-5" />
									</ListItemPrefix>
									All Drivers
								</ListItem>
							</Link>
							<ListItem className="flex items-center w-full text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-blue-500 hover:text-white dark:text-white dark:hover:bg-navy-700 !bg-opacity-100">
								<ListItemPrefix className={`${!sidebarOpen ? "mx-auto" : ""}`}>
									<SlArrowRight strokeWidth={3} className="h-3 w-5" />
								</ListItemPrefix>
								Appproved Drivers
							</ListItem>
							<ListItem className="flex items-center w-full text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-blue-500 hover:text-white dark:text-white dark:hover:bg-navy-700 !bg-opacity-100">
								<ListItemPrefix className={`${!sidebarOpen ? "mx-auto" : ""}`}>
									<SlArrowRight strokeWidth={3} className="h-3 w-5" />
								</ListItemPrefix>
								Pending Drivers
							</ListItem>
						</List>
					</AccordionBody>
				</Accordion>

				<ListItem className="flex items-center w-full text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-blue-500 hover:text-white dark:text-white dark:hover:bg-navy-700 !bg-opacity-100">
					<ListItemPrefix className={`${!sidebarOpen ? "mx-auto" : ""}`}>
						<SlBriefcase
							size={26}
							className={`${!sidebarOpen ? "mx-auto my-3" : ""}`}
						/>
					</ListItemPrefix>
					<span className={`flex-1 text-left whitespace-nowrap ${!sidebarOpen ? 'hidden' : ''}`}>Customers</span>
				</ListItem>

				<ListItem className="flex items-center w-full text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-blue-500 hover:text-white dark:text-white dark:hover:bg-navy-700 !bg-opacity-100">
					<ListItemPrefix className={`${!sidebarOpen ? "mx-auto" : ""}`}>
						<BsTruck
							size={26}
							className={`${!sidebarOpen ? "mx-auto my-3" : ""}`}
						/>
					</ListItemPrefix>
					<span className={`flex-1 text-left whitespace-nowrap ${!sidebarOpen ? 'hidden' : ''}`}>Vehicles</span>
				</ListItem>

				<Accordion
					open={open === 2}
					icon={
						<SlArrowDown
							fontSize={10}
							className={`mx-auto h-4 w-4 transition-transform ${open === 2 ? "rotate-180" : ""} ${!sidebarOpen ? " hidden" : ""}`}
						/>
					}
				>
					<ListItem className="flex items-center w-full text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-blue-500 hover:text-white dark:text-white dark:hover:bg-navy-700 !bg-opacity-100">
						<AccordionHeader onClick={() => handleOpen(2)} className="border-b-0 py-0 transition-all">
							<ListItemPrefix className={`${!sidebarOpen ? "mx-auto" : ""}`}>
								<SlSettings
									size={26}
									className={`${!sidebarOpen ? 'mx-auto my-3' : ''}`}
								/>
							</ListItemPrefix>
							<Typography color="blue-gray" className={classNames({
								" hidden": !sidebarOpen,
								"flex-1 text-left whitespace-nowrap": true,
							})}>
								Settings
							</Typography>
							<ListItemSuffix className={`${!sidebarOpen ? "ml-0 -mr-4" : ""}`}><span className="hidden">icon</span></ListItemSuffix>
						</AccordionHeader>
					</ListItem>
					<AccordionBody className={classNames({
						" hidden": !sidebarOpen,
						"py-2 space-y-2 transition-all duration-300": true,
					})}>
						<List className="p-0">
							<ListItem className="flex items-center w-full text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-blue-500 hover:text-white dark:text-white dark:hover:bg-navy-700 !bg-opacity-100">
								<ListItemPrefix className={`${!sidebarOpen ? "mx-auto" : ""}`}>
									<SlArrowRight strokeWidth={3} className="h-3 w-5" />
								</ListItemPrefix>
								Positions
							</ListItem>
							<ListItem className="flex items-center w-full text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-blue-500 hover:text-white dark:text-white dark:hover:bg-navy-700 !bg-opacity-100">
								<ListItemPrefix className={`${!sidebarOpen ? "mx-auto" : ""}`}>
									<SlArrowRight strokeWidth={3} className="h-3 w-5" />
								</ListItemPrefix>
								Tolls Table
							</ListItem>
							<ListItem className="flex items-center w-full text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-blue-500 hover:text-white dark:text-white dark:hover:bg-navy-700 !bg-opacity-100">
								<ListItemPrefix className={`${!sidebarOpen ? "mx-auto" : ""}`}>
									<SlArrowRight strokeWidth={3} className="h-3 w-5" />
								</ListItemPrefix>
								System Settings
							</ListItem>
						</List>
					</AccordionBody>
				</Accordion>

				<ListItem className="flex items-center w-full text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-blue-500 hover:text-white dark:text-white dark:hover:bg-navy-700 !bg-opacity-100">
					<ListItemPrefix className={`${!sidebarOpen ? "mx-auto" : ""}`}>
						<SlMap
							size={26}
							className={`${!sidebarOpen ? "mx-auto my-3" : ""}`}
						/>
					</ListItemPrefix>
					<span className={`flex-1 text-left whitespace-nowrap ${!sidebarOpen ? 'hidden' : ''}`}>Map</span>
				</ListItem>

				<ListItem className="flex items-center w-full text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-blue-500 hover:text-white dark:text-white dark:hover:bg-navy-700 !bg-opacity-100" onClick={logoutHandler}>
					<ListItemPrefix className={`${!sidebarOpen ? "mx-auto" : ""}`}>
						<SlLogout
							size={26}
							className={`${!sidebarOpen ? "mx-auto my-3" : ""}`}
						/>
					</ListItemPrefix>
					<span className={`flex-1 text-left whitespace-nowrap ${!sidebarOpen ? 'hidden' : ''}`}>Sign Out</span>
				</ListItem>
			</List>
		</Card>
	);
};
export default Sidebar;