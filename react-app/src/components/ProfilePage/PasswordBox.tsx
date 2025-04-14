import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { IoIosClose } from 'react-icons/io';
import Modal from '../Modal';

const PasswordBox = () => {
  const [openCurrentModal, setOpenCurrentModal] = useState(false);
  const [openNewModal, setOpenNewModal] = useState(false);

  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [currentPassword, setCurrentPassword] = useState('abc');
  const [showIncorrectPassword, setShowIncorrectPassword] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPasswordRequirementsError, setShowPasswordRequirementsError] = useState(false);
  const [showMatchError, setShowMatchError] = useState(false);

  const validatePassword = (password: string) => {
    const lengthCheck = password.length >= 13;
    const lowercaseCheck = /[a-z]/.test(password);
    const uppercaseCheck = /[A-Z]/.test(password);
    const digitCheck = /\d/.test(password);
    const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return lengthCheck && lowercaseCheck && uppercaseCheck && digitCheck && specialCharCheck;
  };

  const handleNextFromCurrent = () => {
    if (currentPasswordInput === currentPassword) {
      setShowIncorrectPassword(false);
      setOpenCurrentModal(false);
      setOpenNewModal(true);
    } else {
      setShowIncorrectPassword(true);
      setCurrentPasswordInput('');
    }
  };

  const handleNewPasswordSubmit = () => {
    const isValid = validatePassword(newPassword);
    const isMatch = newPassword === confirmNewPassword;

    setShowPasswordRequirementsError(!isValid);
    setShowMatchError(!isMatch);

    if (isValid && isMatch) {
      setCurrentPassword(newPassword);
      setCurrentPasswordInput('');
      setOpenNewModal(false);
    }
  };

  const ModalHeader = ({ onClose }: { onClose: () => void }) => (
    <>
      <div className="flex justify-between items-center m-2">
        <p className="text-lg">Change Password</p>
        <IoIosClose
          className="text-2xl cursor-pointer hover:text-gray-500"
          onClick={onClose}
        />
      </div>
      <div className="w-full h-[1.5px] bg-black my-2"/>
    </>
  );

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
        <FaEdit 
          className="cursor-pointer text-gray-500" 
          onClick={() => setOpenCurrentModal(true)}
        />
      </div>

      <Modal open={openCurrentModal} onClose={() => {
        setOpenCurrentModal(false);
        setCurrentPasswordInput('');
        setShowIncorrectPassword(false);
      }} height={220} width={600}>
        <div className="flex flex-col h-full">
          <div>
            <ModalHeader onClose={() => {
              setOpenCurrentModal(false);
              setCurrentPasswordInput('');
              setShowIncorrectPassword(false);
              }} />
            <div className="grid grid-cols-[190px_1fr] m-8 mb-2">
              <label className="text-sm font-medium text-nowrap content-center">Enter Current Password:</label>
              <input
                type="password"
                value={currentPasswordInput}
                onChange={(e) => setCurrentPasswordInput(e.target.value)}
                className="flex-1 border-[1.5px] border-black px-3 py-2"
                placeholder="Current password"
              />
              <div className="h-[20px]"></div>
              {showIncorrectPassword && (
                <p className="text-red-600 text-sm">Password is incorrect</p>
              )}
            </div>
          </div>
          <div className="flex justify-end m-8 mt-0">
            <button
              className={`px-4 py-2 rounded border-black ${
                !currentPasswordInput
                  ? 'bg-bcgw-gray-light text-black cursor-not-allowed'
                  : 'bg-bcgw-yellow-dark text-black hover:bg-bcgw-yellow-light'
              }`}
              onClick={handleNextFromCurrent}
            >
              Next
            </button>
          </div>
        </div>
      </Modal>

      {/* New Password Modal */}
      <Modal open={openNewModal} onClose={() => {
          setOpenNewModal(false);
          setNewPassword('');
          setConfirmNewPassword('');
          setCurrentPasswordInput('');
          setShowPasswordRequirementsError(false);
          setShowMatchError(false);
        }} height={450} width={600}>
        <div className="flex flex-col h-full">
          <div>
            <ModalHeader onClose={() => {
              setOpenNewModal(false);
              setNewPassword('');
              setConfirmNewPassword('');
              setCurrentPasswordInput('');
              setShowPasswordRequirementsError(false);
              setShowMatchError(false);
            }} />
            {/* New Password */}
            <div className="grid grid-cols-[170px_1fr] m-8 mb-2">
              <label className="text-sm font-medium text-nowrap content-center">Enter New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setShowPasswordRequirementsError(
                    e.target.value !== '' && !validatePassword(e.target.value)
                  );
                }}
                className="flex-1 border-[1.5px] border-black px-3 py-2"
                placeholder="New password"
              />
              <div></div>
              {/* Requirements Box */}
              <div className="border border-black p-3 text-sm">
                <ul className="list-disc ml-4 space-y-1">
                  <li>Must include at least 13 characters</li>
                  <li>Must include at least 1 lowercase letter</li>
                  <li>Must include at least 1 uppercase letter</li>
                  <li>Must include at least 1 digit</li>
                  <li>Must include at least 1 special character</li>
                </ul>
              </div>
              <div className="h-[20px]"></div>
              {showPasswordRequirementsError && (
                <p className="text-red-600 text-sm">Password does not meet requirements</p>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="grid grid-cols-[170px_1fr] mx-8">
              <label className="block text-sm font-medium content-center">Confirm New Password:</label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => {
                  setConfirmNewPassword(e.target.value);
                  setShowMatchError(newPassword !== e.target.value);
                }}
                className="w-full border-[1.5px] border-black px-3 py-2"
                placeholder="Confirm password"
              />
              <div className="h-[20px]"></div>
              {confirmNewPassword && (
                newPassword === confirmNewPassword ? (
                  <p className="text-green-600 text-sm">Password matches</p>
                ) : (
                  <p className="text-red-600 text-sm">Password does not match</p>
                )
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end m-8 mt-4">
            <button
              className={`px-4 py-2 border-black rounded ${
                !newPassword ||
                !confirmNewPassword ||
                newPassword !== confirmNewPassword ||
                !validatePassword(newPassword)
                  ? 'bg-bcgw-gray-light text-black cursor-not-allowed'
                  : 'bg-bcgw-yellow-dark text-black hover:bg-bcgw-yellow-light'
              }`}
              onClick={handleNewPasswordSubmit}
              disabled={
                !newPassword ||
                !confirmNewPassword ||
                newPassword !== confirmNewPassword ||
                !validatePassword(newPassword)
              }
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PasswordBox;
