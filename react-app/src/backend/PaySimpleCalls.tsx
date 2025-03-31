import axios from "axios";

const API_BASE_URL = "https://krapi.paysimple.com/krypton/";
const API_KEY = "";


const options = {
    method: 'GET',
    headers: {accept: 'application/json', 'Content-Type': 'application/json'}
  };

  fetch('https://api.paysimple.com/v4/payment?sortby=id&direction=desc&page=1&pagesize=200&lite=false', options)
    .then(res => res.json())
    .then(res => console.log(res))
    // res is list of json for each payment, have to iterate, find order id, use get order to find item, save in firebase
    // persist data? store in firebase?
    .catch(err => console.error(err));

//for new updates could do call once a day? or use webhooks

