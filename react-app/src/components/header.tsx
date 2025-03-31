import React from 'react';
import Logo from '../assets/bcgw-logo.png';

const Header = ({ firstName = "Volunteer", initials = "VT" }) => {
    return (
        <header className="flex justify-between items-center bg-[#021226] text-[#F2C355] px-4 py-2 shadow-md">
            <div className="flex items-center gap-2">
                <img src={Logo} className="h-10 w-9" />
                <span className="font-semibold">BCGW Data Portal</span>
            </div>

            <div className="flex items-center gap-2">
                <span className="font-medium">Welcome, {firstName}</span>
                <div className="rounded-full bg-[#F2C355] text-[#021226] h-8 w-8 flex items-center justify-center hover:bg-[#b08834]">
                    {initials}
                </div>
            </div>
        </header>
    );
};

export default Header;
