import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Button } from '@material-ui/core';

import { getPatients, patientsSelectors } from 'store/patients';
import { getPractitioners, practitionersSelectors } from 'store/practitioners';
import { postAppointments, getAppointments } from 'store/appointments';
import { getAvailabilities, deleteAvailabilities } from 'store/availabilities';

import Availabilities from 'components/availability/Availabilities';
import Select from 'components/Select';
import SnackBar from 'components/snackBar';

const usePatients = () => {
  const dispatch = useDispatch();
  const patients = useSelector((state) =>
    patientsSelectors.selectAll(state.patients),
  );
  useEffect(() => {
    dispatch(getPatients());
  }, []);
  return patients;
};

const usePractitioners = () => {
  const dispatch = useDispatch();
  const practitioners = useSelector((state) =>
    practitionersSelectors.selectAll(state.practitioners),
  );
  useEffect(() => {
    dispatch(getPractitioners());
  }, []);
  return practitioners;
};

const useSnackbar = () => {
  const [open, setOpen] = useState(false);
  const { snackbar } = useSelector((state) => ({
    snackbar: state.appointments.snackbar,
  }));
  useEffect(() => {
    snackbar === 'SUCCESS' && setOpen(true);
  }, [snackbar]);

  return { open, setOpen };
};

const AppointmentForm = () => {
  const {
    handleSubmit,
    watch,
    formState,
    control,
    setValue,
    reset,
    register,
    clearErrors,
  } = useForm();

  const dispatch = useDispatch();
  const patients = usePatients();
  const practitioners = usePractitioners();
  const { open, setOpen } = useSnackbar();
  const practitionerId = watch('practitionerId');

  useEffect(() => {
    setValue('startDate', '');
    clearErrors('startDate');
  }, [practitionerId]);

  const onSubmit = (data) => {
    dispatch(postAppointments(data));
    dispatch(getAppointments());
    dispatch(deleteAvailabilities(data.id));
    dispatch(getAvailabilities(practitionerId));
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Select
        name="patientId"
        control={control}
        formState={formState}
        label="Patient"
        required
        placeholder="Patient"
      >
        {patients.map((patient) => {
          return {
            key: patient.id,
            fullName: `${patient.firstName} ${patient.lastName}`,
            value: patient.id,
          };
        })}
      </Select>
      <Select
        name="practitionerId"
        control={control}
        formState={formState}
        label="Practitioner"
        required
        placeholder="Practitioner"
      >
        {practitioners.map((practitioner) => {
          return {
            key: practitioner.id,
            fullName: `${practitioner.firstName} ${practitioner.lastName}`,
            value: practitioner.id,
          };
        })}
      </Select>

      {practitionerId && (
        <Availabilities
          practitionerId={practitionerId}
          formState={formState}
          register={register}
          clearErrors={clearErrors}
          setValue={setValue}
          watch={watch}
        />
      )}
      <Button className="btn" type="submit">
        Add Appointment
      </Button>
      <SnackBar
        open={open}
        setOpen={setOpen}
        severity="success"
        msg="Appointment successfully added !"
      />
    </form>
  );
};

export default React.memo(AppointmentForm);
