import React from 'react';
import { FaEdit } from 'react-icons/fa';

const PasswordBox = () => {
  return (
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
  );
};

export default PasswordBox;
