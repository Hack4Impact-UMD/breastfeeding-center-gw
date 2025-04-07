import React from 'react';
import ProfileIcon from '../components/ProfilePage/ProfileIcon.tsx';
import ContactInfoBox from '../components/ProfilePage/ContactInfoBox';


import { FaEdit } from 'react-icons/fa';

const ProfilePage = () => {
    return (
        <div className="min-h-screen bg-[#f2f2f2] flex justify-center px-10 py-16 text-[#222]">
            <div className="flex gap-12">
                {/* Profile Icon */}
                <div className="pt-2">
                    <ProfileIcon initials="KL" />
                </div>

                {/* Right Content Area */}
                <div className="flex flex-col gap-8 w-[600px]"> {/* <-- Set consistent width */}
                    <div>
                        <h2 className="font-semibold">Kim Luu</h2>
                        <h4 className="font-bold mt-1 mb-4">Personal Information</h4>
                        <div className="w-full h-[2px] bg-black mt-1" /> {/* Full underline */}
                    </div>

                    {/* CONTACT INFO */}
                    <div className="bg-white border border-gray-300 p-6 rounded-md shadow-sm">
                        <h5 className="font-bold mb-4">E-MAIL AND PHONE NUMBER</h5>
                        <p className="text-xs text-gray-600 mb-4">
                            Enter the email and phone number(s) that you would most prefer to be contacted at
                            for all Breast Feeding Center of Greater Washington-related communications
                        </p>

                        <div className="flex justify-between items-center mb-2">
                            <p className="font-bold text-sm w-24">Email</p>
                            <p className="text-sm text-gray-800 flex-1">kiml2726@gmail.com</p>
                            <FaEdit className="cursor-pointer text-gray-500" />
                        </div>

                        <div className="flex justify-between items-center">
                            <p className="font-bold text-sm w-24">Phone</p>
                            <p className="text-sm text-gray-800 flex-1">585-105-6915</p>
                            <FaEdit className="cursor-pointer text-gray-500" />
                        </div>
                    </div>

                    {/* PASSWORD */}
                    <div className="bg-white border border-gray-300 p-6 rounded-md shadow-sm">
                        <h5 className="font-bold text-sm mb-4">PASSWORD</h5>
                        <p className="text-xs text-gray-600 mb-4">
                            Heads up! You will be asked to log in to dashboard again before and after making any
                            changes to your email address or password to ensure a secure and complete update.
                        </p>

                        <div className="flex justify-between items-center">
                            <p className="font-bold text-sm w-40">Current Password</p>
                            <p className="text-sm text-gray-800 flex-1">**********</p>
                            <FaEdit className="cursor-pointer text-gray-500" />
                        </div>
                    </div>



                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
