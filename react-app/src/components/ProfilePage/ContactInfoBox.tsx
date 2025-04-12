import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { IoIosClose } from 'react-icons/io';
import Modal from '../Modal';

const ContactInfoBox = ({ email = "kiml2726@gmail.com", phone = "585-105-6915" }) => {
  const [openNewModal, setOpenNewModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [confirmNewEmail, setConfirmNewEmail] = useState('');
  const [showEmailMatchError, setShowEmailMatchError] = useState(false);
  const [showEmailInvalidError, setShowEmailInvalidError] = useState(false);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const handleNewEmailSubmit = () => {
    const isMatch = newEmail === confirmNewEmail;
    const isEmailValid = validateEmail(newEmail);
    
    setShowEmailMatchError(!isMatch);
    setShowEmailInvalidError(!isEmailValid);

    if (isMatch && isEmailValid) {
      console.log('Updated email to:', newEmail);
      setNewEmail('');
      setConfirmNewEmail('');
      setOpenNewModal(false);
    }
  };

  const ModalHeader = ({ onClose }: { onClose: () => void }) => (
    <>
      <div className="flex justify-between items-center m-2">
        <p className="text-lg">Change Email</p>
        <IoIosClose className="text-2xl cursor-pointer hover:text-gray-500" onClick={onClose} />
      </div>
      <div className="w-full h-[1.5px] bg-black my-2" />
    </>
  );

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
        <FaEdit className="cursor-pointer text-gray-500" onClick={() => setOpenNewModal(true)} />
      </div>

      <div className="flex justify-between items-center">
        <p className="font-bold text-sm w-24">Phone</p>
        <p className="text-sm text-gray-800 flex-1">{phone}</p>
        <FaEdit className="cursor-pointer text-gray-500" />
      </div>

      <Modal open={openNewModal} onClose={() => setOpenNewModal(false)} height={300} width={600}>
        <div className="flex flex-col h-full justify-between">
          <div>
            <ModalHeader onClose={() => setOpenNewModal(false)} />
            <div className="grid grid-cols-[170px_1fr] gap-4 m-4">
              <label className="text-sm font-medium content-center">Enter New Email:</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => {
                  setNewEmail(e.target.value);
                  setShowEmailMatchError(e.target.value !== confirmNewEmail);
                  setShowEmailInvalidError(e.target.value? !validateEmail(e.target.value) : false);
                }}
                className="flex-1 border-[1.5px] border-black px-3 py-2"
                placeholder="New email"
              />
            </div>
            {newEmail && showEmailInvalidError && (
              <p className="text-red-600 text-sm ml-4 mb-2">Please enter a valid email address.</p>
            )}
            <div className="grid grid-cols-[170px_1fr] gap-4 m-4">
              <label className="text-sm font-medium content-center">Confirm New Email:</label>
              <input
                type="email"
                value={confirmNewEmail}
                onChange={(e) => {
                  setConfirmNewEmail(e.target.value);
                  setShowEmailMatchError(newEmail !== e.target.value);
                }}
                className="flex-1 border-[1.5px] border-black px-3 py-2"
                placeholder="Confirm email"
              />
              <div className="h-[20px]"></div>
              {confirmNewEmail && (
                newEmail === confirmNewEmail ? (
                  <p className="text-green-600 text-sm">Email matches.</p>
                ) : (
                  <p className="text-red-600 text-sm">Emails do not match.</p>
                )
              )}
            </div>
          </div>

          <div className="flex justify-end p-4">
            <button
              className={`px-4 py-2 border-black rounded ${
                !newEmail || !confirmNewEmail || newEmail !== confirmNewEmail || showEmailInvalidError
                  ? 'bg-bcgw-gray-light text-black cursor-not-allowed'
                  : 'bg-bcgw-yellow-dark text-black hover:bg-bcgw-yellow-light'
              }`}
              onClick={handleNewEmailSubmit}
              disabled={!newEmail || !confirmNewEmail || newEmail !== confirmNewEmail || showEmailInvalidError}
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ContactInfoBox;