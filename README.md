# Breastfeeding Center for Greater Washington


##  Table of Contents

1. [Project Info](#project-info) 
2. [Tech Stack](#tech-stack)
3. [Running Project Locally](#running-project-locally)
4. [Points of Contact](#points-of-contact)
___


# Project Info

Welcome to the Breastfeeding Center of Greater Washington/Hack4Impact-UMD repository! BCGW provides pregnancy and postpartum care to individuals and families in the greater Washington DC area.

This project aims to centralize data and analytics for the organization in order to streamline operations and aid in grant application processes.

# Tech Stack
**Frontend:**

- Framework: [React](https://react.dev/)
- Language: [Typescript](https://www.typescriptlang.org/docs/handbook/intro.html)
- Styling: [CSS Modules](https://github.com/css-modules/css-modules)
- Libraries: [MaterialUI](https://mui.com/material-ui/), [Axios](https://axios-http.com/docs/intro)
- Build Tool: [Vite](https://vitejs.dev/)

**Backend:**
Authentication, Database, and Hosting will be done using [Firebase](https://firebase.google.com/). When using Firebase, make sure to install the Firebase CLI by running the following:
   ```
   npm install -g firebase-tools
   firebase login
   ```
   
   If you have multiple firebase accounts, make sure to use the following commands to switch to your terpmail (or the email you have listed)
   ```
   firebase login:add example@terpmail.umd.edu
   firebase login:list
   firebase login:use example@terpmail.umd.edu
   ```

**APIs:**
- [Mailchimp](https://mailchimp.com/developer/marketing/docs/fundamentals/)
- [Acuity](https://developers.acuityscheduling.com/)
- [Paysimple](https://documentation.paysimple.com/docs/welcome)
- [Square](https://developer.squareup.com/reference/square) (potentially less important?)
- [Paypal](https://developer.paypal.com/api/rest/)
- JANE (Not really an API? apparently imported via spreadsheet)


```mermaid
%%{init: {'theme':'default'}}%%
    flowchart TD
        mc[(Mailchimp)] --> back
        ac[(Acuity)] --> back
        ps[(Paysimple)] --> back
        sq[(Square)] --> back
        pp[(Paypal)] --> back
        back[Firebase] --> front
        front[React/TS] --> build
        build[Vite] --> app
        app[BCGW Dashboard
        App]
```

# Running Project Locally

1. Clone the repo and ```cd``` into it
2. run ```npm install``` in the ```react-app``` directory
3. run ```npm run dev``` in the ```react-app``` directory
4. Navigate to http://localhost:5173 in your browser (typically pops up automatically)

# Points of Contact

For inquiries about the project, contact

| Name        | Email                  |
| ----------- | ---------------------- |
| Sophie Tsai | sophietsai31@gmail.com |
| Prakhar Gupta | pg12@terpmail.umd.edu|



