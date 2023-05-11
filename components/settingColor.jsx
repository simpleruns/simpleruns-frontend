import React, { useEffect, useState } from "react";

import { RiMoonFill, RiSunFill } from "react-icons/ri";

export default function SettingColor(props) {
    const { ...rest } = props;
    const [darkmode, setDarkmode] = useState(false);

    function changeThemeHandler() {
        setDarkmode(!darkmode);
    }

    useEffect(() => {
        document.body.classList.toggle('dark');
    }, [darkmode]);

    return (
        <button
            className="border-px fixed top-[30px] right-[35px] !z-[99] flex h-[40px] w-[40px] items-center justify-center rounded-full border-[#6a53ff] bg-gradient-to-br from-brandLinear to-blueSecondary p-0"
            onClick={changeThemeHandler}
        >
            <div className="cursor-pointer text-gray-600">
                {darkmode ? (
                    <RiSunFill className="h-4 w-4 text-white" />
                ) : (
                    <RiMoonFill className="h-4 w-4 text-white" />
                )}
            </div>
        </button>
    );
}
