import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import List from '@material-ui/core/List';
import { Card, CardContent, CardHeader, Typography } from '@material-ui/core';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';

import { deleteAppointments, getAppointments } from 'store/appointments';

import SnackBar from 'components/snackBar';
import useDebounce from 'hooks/useDebounce';
import { formatDateRange } from 'utils/date';

const getTimeSlotDatacy = (id: string) => `timeslot-${id}`;

const useSnackbarDelete = () => {
  const [open, setOpen] = useState(false);
  const { snackbarDelete } = useSelector((state) => ({
    snackbarDelete: state.appointments.snackbarDelete,
  }));
  useEffect(() => {
    snackbarDelete === 'SUCCESS' && setOpen(true);
  }, [snackbarDelete]);

  return { open, setOpen };
};

const AppointmentList = (props) => {
  const { items } = props;
  const { open, setOpen } = useSnackbarDelete();
  const dispatch = useDispatch();
  const [listItems, setListItems] = useState([]);
  const [searchvalue, setSearchvalue] = useState('');
  const search = (event) => setSearchvalue(event.target.value);

  const debouncedTitle = useDebounce(searchvalue, 1000);

  useEffect(() => {
    if (debouncedTitle.length !== 0) {
      const listFiltred = listItems.filter((item) =>
        item.practitioner.firstName
          .toLowerCase()
          .startsWith(debouncedTitle.toLowerCase()),
      );
      setListItems(listFiltred);
    } else {
      setListItems(items);
    }
  }, [debouncedTitle, items, setListItems]);

  return (
    <div>
      <TextField
        className="center"
        placeholder="Search practitioner"
        id="text"
        type="text"
        value={searchvalue}
        onChange={search}
      />
      <List className="timeSlots" datacy="timeslot-list">
        {listItems.length === 0 ? (
          <span>Appointment List empty </span>
        ) : (
          listItems.map((item) => (
            <Card
              key={item.id}
              datacy={getTimeSlotDatacy(item.id)}
              className="timeSlot__item btn"
            >
              <CardHeader
                avatar={<CalendarTodayIcon />}
                title={
                  <Typography datacy={`${getTimeSlotDatacy(item.id)}-range`}>
                    {formatDateRange({
                      from: new Date(item.startDate),
                      to: new Date(item.endDate),
                    })}
                  </Typography>
                }
              />
              <CardContent>
                <span>{`Practitioner: ${item.practitioner.firstName} ${item.practitioner.lastName}`}</span>
                <p>{`Patient: ${item.patient.firstName} ${item.patient.lastName}`}</p>
                <Button
                  className="delete"
                  onClick={() => {
                    dispatch(deleteAppointments(item.id));
                    dispatch(getAppointments());
                  }}
                >
                  delete
                </Button>
              </CardContent>
            </Card>
          ))
        )}
        <SnackBar
          open={open}
          setOpen={setOpen}
          severity="error"
          msg="Appointment successfully deleted !"
        />
      </List>
    </div>
  );
};

export default AppointmentList;
