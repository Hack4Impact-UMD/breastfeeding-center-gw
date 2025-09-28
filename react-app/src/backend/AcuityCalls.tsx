import { axiosClient } from "@/lib/utils";

interface RawClassInfo {
  date: Date;
  instructor: string | null;
  title: string | null;
}

//@ts-expect-erroring
interface ClientRawAppointments {
  [id: number]: {
    firstName: string;
    lastName: string;
    email: string;
    appointments: RawClassInfo[];
  };
}

/*
Write functions to retrieve the following information 

- Baby due date, birth date, birth location
- Which classes and on what dates are classes taken for each individual
    - Note not all appointments are classes
*/

/*
 * Get all appointments
 */

export async function getAppointments() {
  const axios = await axiosClient();
  const res = await axios.get("/acuity/appointments");
  console.log("Appointments retrieved successfully.");
  console.log(res.data);
  return res.data;
}

export async function getBabyInfo() {
  const axios = await axiosClient();
  const res = await axios.get("/acuity/babyinfo");
  const babyInfo = res.data;

  const babyDueDate = /(?:Baby \(or babies\)|Baby's) Due Date:\s*(.+)/;
  const babyBirthDate =
    /Baby \(or babies\) Date of Birth \(write n\/a if still pregnant\):\s*(.+)/;
  const babyBirthOrDueDate = /Baby's DOB \(or Due Date\):\s*(.+)/; // For the question: Baby's DOB (or Due Date):
  const babyBirthLocation = /Where will you \(or did you\) birth\?:\s*(.+)/; // This is consistent across formats
  /*
Different formats:
>        'Baby (or babies) Due Date: 8/27/2025\n' +
>        '\n' +
>        'Baby (or babies) Date of Birth (write n/a if still pregnant): n/a\n' +
>        '\n' +
>        'Where will you (or did you) birth?: GW Hospital \n' +

>        "Baby's DOB (or Due Date): September 12, 2025\n" +
>        '\n' +
>        'Where will you (or did you) birth?: MedStar Washington Hospital Midwives\n' +

>        'Where will you (or did you) birth?: Hospital\n' +
>        '\n' +
>        "Baby's Due Date: August 29, 2025\n" +
*/
  const userMap: {
    [id: number]: {
      firstName: string;
      lastName: string;
      email: string;
      babyDueDate: Date | null;
      babyBirthDate: Date | null;
      birthLocation: string | null;
    };
  } = {};

  console.log("Baby Info retrieved successfully.");
  //@ts-expect-erroring
  babyInfo.forEach((user) => {
    console.log(user);
    userMap[user.id] = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      babyDueDate: null,
      babyBirthDate: null,
      birthLocation: null,
    };
    // Finding baby due / birth date
    const matchDate = user.formsText.match(babyDueDate);
    if (matchDate) {
      // Assume that the entered date is convertable to date object
      const dateStr = matchDate[1].trim();
      const dateObj = new Date(dateStr);

      // Check if date object is valid
      if (!isNaN(dateObj.getTime())) {
        userMap[user.id].babyDueDate = dateObj;
      }
    } else {
      // Try another possible question format
      const matchDueOrBirth = user.formsText.match(babyBirthOrDueDate);
      if (matchDueOrBirth) {
        // Assume that the entered date is convertable to date object
        const dateDueOrBirth = matchDueOrBirth[1].trim();
        const dateObjDueOrBirth = new Date(dateDueOrBirth);

        // Check if date object is valid
        if (!isNaN(dateObjDueOrBirth.getTime())) {
          // Seeing if this date is due or birth date (future or past)
          const today = new Date();

          if (dateObjDueOrBirth > today) {
            // If the date is in the future then it is the baby due date
            userMap[user.id].babyDueDate = dateObjDueOrBirth;
          } else {
            // Else the date is birth date since it is in the past
            userMap[user.id].babyBirthDate = dateObjDueOrBirth;
          }
        }
      }
    }

    // Finding possible date of birth
    const matchBirthDate = user.formsText.match(babyBirthDate);
    if (matchBirthDate) {
      const dateBirth = matchBirthDate[1].trim();
      const dateObjBirth = new Date(dateBirth);

      // Checking if this is a valid date because possible answers include n/a
      if (!isNaN(dateObjBirth.getTime())) {
        userMap[user.id].babyBirthDate = dateObjBirth;
      }
    }

    // Finding baby birth location
    const matchLocation = user.formsText.match(babyBirthLocation);
    if (matchLocation) {
      userMap[user.id].birthLocation = matchLocation[1].trim();
    }
  });
  console.log(userMap);
  return babyInfo;
}

//@ts-expect-erroring
const CLASS_NAME_TO_CATEGORY: Record<string, string> = {
  // Childbirth
  "Childbirth Express (2-Day and 1-WKND)": "Childbirth",
  "Natural Childbirth": "Childbirth",
  "Doula Meet + Greet": "Childbirth",
  "Comfort, Communication & Positions": "Childbirth",
  "Evening Lamaze Series": "Childbirth",
  "Prep for Postpartum Recovery": "Childbirth",

  // Postpartum
  "Optimizing Sleep, Prenatal-5m": "Postpartum",
  "Perinatal Rights at Work": "Postpartum",
  "Pumping Strategies + RTW": "Postpartum",
  "Starting Solids - Feeding 101": "Postpartum",
  "Feeding 102 - Overcoming Challenges in Feeding": "Postpartum",
  "Postpartum Nutrition": "Postpartum",
  "Rose PT Postpartum Pelvic Health": "Postpartum",
  "Bottles & Other Feeding Tools": "Postpartum",

  // Prenatal
  "Breastfeeding + Pumping Basics": "Prenatal",
  "Baby Care": "Prenatal",
  "Babywearing 101": "Prenatal",
  "Financial Planning for Baby": "Prenatal",
  "Rose PT Prenatal Pelvic Health": "Prenatal",
  // (If you want “Bottles & Other Feeding Tools” here too,
  // add it again or remove above.)

  // Infant Massage
  "Infant Massage": "Infant Massage",

  // Parent Groups
  "Navigating Perinatal Stress": "Parent Groups",
  "Feeding + Postpartum with 0-4m Olds": "Parent Groups",
  "Feeding + Postpartum with 4-12m Olds": "Parent Groups",
  "Feeding + Postpartum with Toddlers": "Parent Groups",
};

/** class appointment */
interface ClassEntry {
  date: Date;
  instructor: string | null;
  title: string | null;
  classType: string | null;
  didAttend: boolean;
}

/** One record per client, now classes not appointments */
interface ClientAppointments {
  firstName: string;
  lastName: string;
  email: string;
  classes: ClassEntry[];
}

export async function getClientAppointments(): Promise<
  Record<number, ClientAppointments>
> {
  const axios = await axiosClient();
  const res = await axios.get("/acuity/clientappointments");

  const clientMap: Record<number, ClientAppointments> = {};
  const CLASS_CATS = new Set([
    "Childbirth Classes",
    "Postpartum Classes",
    "Prenatal Classes",
    "Infant Massage",
    "Parent Groups",
  ]);

  res.data.forEach((appt: any) => {
    const {
      id,
      firstName,
      lastName,
      email,
      calendar,
      type,
      category,
      datetime,
      canceled,
    } = appt;

    // only initialize the classes array
    if (!clientMap[id]) {
      clientMap[id] = {
        firstName,
        lastName,
        email,
        classes: [],
      };
    }

    // if it's a class, push it; otherwise ignore
    if (category && CLASS_CATS.has(category)) {
      clientMap[id].classes.push({
        date: new Date(datetime),
        instructor: calendar || null,
        title: type || null,
        classType: category,
        didAttend: !canceled,
      });
    }
  });

  console.log(
    "Clients with only classes (and the date, instructor, class name, and class type):",
    clientMap
  );
  return clientMap;
}
