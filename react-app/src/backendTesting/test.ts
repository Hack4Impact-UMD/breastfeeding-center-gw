// test functions
// import AcuityScheduling from 'acuityscheduling';

export function getAppointments() {
  var Acuity = require('acuityscheduling');
  const userId = process.env.ACUITY_USER_ID;
  const apiKey = process.env.ACUITY_API_KEY;

  var acuity = Acuity.basic({
    userId: userId,
    apiKey: apiKey
  });

  acuity.request('/appointments?max=100', (err: any, _: any, appointments: any) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(appointments);
  });
}

