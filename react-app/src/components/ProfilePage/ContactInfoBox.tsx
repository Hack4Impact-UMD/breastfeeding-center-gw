import React from 'react';

const ContactInfoBox = ({ email = "kiml2726@gmail.com" , phone = 5851056916 }) => {

    function formatNumber(phone) {
        const str = phone.toString();
        return `${str.slice(0, 3)}-${str.slice(3, 6)}-${str.slice(6)}`;
    } 

    return (
        <div> 
            <h1>E-MAIL AND PHONE NUMBER</h1> 
            <p>Enter the email and phone number(s) that you would most prefer to be contacted at for all Breast Feeding Center of Greater Washington-related communications</p>
            <p className='font-bold'>Email</p>
            <p className='font-bold'>Phone</p>

        </div>
    );
};

export default ContactInfoBox;