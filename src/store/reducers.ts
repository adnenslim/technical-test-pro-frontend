import timeslots from './timeslots';
import appointments from './appointments';
import patients from './patients';
import practitioners from './practitioners';
import availabilities from './availabilities';

export default {
  timeslots: timeslots.reducer,
  appointments: appointments.reducer,
  patients: patients.reducer,
  practitioners: practitioners.reducer,
  availabilities: availabilities.reducer,
};
