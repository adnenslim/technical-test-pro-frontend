import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@material-ui/core';
import { UseFormReturn } from 'react-hook-form';
import clsx from 'clsx';
import {
  getAvailabilities,
  availabilitiesSelectors,
} from 'store/availabilities';
import { PENDING, ERROR, SUCCESS } from 'store/stateMachine';

import { formatDate, formatTime } from 'utils/date';

const formatDataToDays = (availabilities) => {
  return availabilities.reduce((acc, curr) => {
    const day = formatDate(curr.startDate);

    if (acc.hasOwnProperty(day)) {
      acc[day] = [...acc[day], curr];
    } else return { ...acc, [day]: [curr] };
    return acc;
  }, {});
};

const useAvailabilities = (practitionerId = undefined) => {
  const dispatch = useDispatch();
  const { availabilities, loading } = useSelector((state) => ({
    availabilities: availabilitiesSelectors.selectAll(state.availabilities),
    loading: state.availabilities.loading,
  }));

  useEffect(() => {
    if (practitionerId) {
      dispatch(getAvailabilities(practitionerId));
    }
  }, [practitionerId]);
  return { availabilities, loading };
};

type Props = {
  practitionerId: number;
  formState: UseFormReturn['formState'];
  register: UseFormReturn['register'];
  clearErrors: UseFormReturn['clearErrors'];
  setValue: UseFormReturn['setValue'];
  watch: UseFormReturn['watch'];
};

const Availabilities = ({
  practitionerId,
  formState,
  register,
  clearErrors,
  setValue,
  watch,
}: Props) => {
  const { availabilities, loading } = useAvailabilities(practitionerId);
  const dispatch = useDispatch();

  const availabilitiesHeader = (date) => {
    const availabilitiesToString = new Date(date).toDateString();

    const headerDay = availabilitiesToString.split(' ').slice(0, 1).join(' ');
    const headerMonth = availabilitiesToString
      .split(' ')
      .slice(1, 3)
      .reverse()
      .join(' ');
    return (
      <div>
        <p>{headerDay}</p>
        <p>{headerMonth}</p>
      </div>
    );
  };

  useEffect(() => {
    if (practitionerId) {
      dispatch(getAvailabilities(practitionerId));
    }
  }, [practitionerId]);

  const selectAvaibility = (time) => {
    clearErrors('startDate');
    setValue('startDate', time.startDate);
    setValue('endDate', time.endDate);
    setValue('id', time.id);
  };

  const renderAv = () => {
    if (loading === SUCCESS && practitionerId) {
      return (
        <>
          <div
            className={clsx(
              'availability',
              formState.errors.startDate && 'availability-error',
            )}
            {...register('startDate', { required: true })}
          >
            <span
              className={clsx(
                'title',
                formState.errors.startDate && 'title-error',
              )}
            >
              Availabilities <span className="title-required">*</span>
            </span>
            {Object.entries(formatDataToDays(availabilities)).map(
              (item, index) => {
                return (
                  <ul key={`${index}-${item}`}>
                    <li>{availabilitiesHeader(item[0])}</li>
                    <div className="sep"></div>
                    {item[1].map((time, index) => {
                      return (
                        <li key={`${index}-${time}`}>
                          <Button
                            className={clsx(
                              'btn-availability',
                              time.id === watch('id') &&
                                time.practitionerId ===
                                  watch('practitionerId') &&
                                'btn-availability-selected',
                            )}
                            onClick={() => selectAvaibility(time)}
                          >
                            {formatTime(time.startDate)}
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                );
              },
            )}
          </div>
          {formState.errors.startDate && (
            <span className="error-msg">Please select Availability</span>
          )}
        </>
      );
    }

    if (loading === PENDING) {
      return <div>Loading...</div>;
    }

    if (loading === ERROR) {
      return <div>Error</div>;
    }
  };

  return <>{renderAv()}</>;
};

export default React.memo(Availabilities);
