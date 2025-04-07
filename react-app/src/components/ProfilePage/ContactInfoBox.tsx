import React from 'react';
import { FaEdit } from 'react-icons/fa';

const ContactInfoBox = ({ email = "kiml2726@gmail.com", phone = "585-105-6915" }) => {
  return (
    <div className="bg-white border border-gray-300 p-6 rounded-md shadow-sm">
      <h5 className="font-bold mb-4">E-MAIL AND PHONE NUMBER</h5>
      <p className="text-xs text-gray-600 mb-4">
        Enter the email and phone number(s) that you would most prefer to be contacted at
        for all Breast Feeding Center of Greater Washington-related communications
      </p>

      <div className="flex justify-between items-center mb-2">
        <p className="font-bold text-sm w-24">Email</p>
        <p className="text-sm text-gray-800 flex-1">{email}</p>
        <FaEdit className="cursor-pointer text-gray-500" />
      </div>

      <div className="flex justify-between items-center">
        <p className="font-bold text-sm w-24">Phone</p>
        <p className="text-sm text-gray-800 flex-1">{phone}</p>
        <FaEdit className="cursor-pointer text-gray-500" />
      </div>
    </div>
  );
};

export default ContactInfoBox;
