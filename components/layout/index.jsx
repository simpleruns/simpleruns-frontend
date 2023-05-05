import React, { useState } from "react";

import Sidebar from "./sidebar";

const Layout = (props) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<>
			<div className="flex h-full w-full">
				<Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
				<div className="h-full w-full bg-lightPrimary dark:!bg-navy-800">
					<main
						className={`mx-[12px] h-full flex-none transition-all md:pr-2 xl:ml-[313px]`}
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
