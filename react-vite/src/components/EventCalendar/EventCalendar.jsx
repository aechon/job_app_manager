import { Calendar, Col, Row, Select } from 'antd';
import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserSchedule } from '../../redux/event'; 
import dayjs from 'dayjs';

function EventCalendar() {
  const dispatch = useDispatch();
  const schedule = useSelector((state) => state.event.schedule);

  // fetch user schedule
  useEffect(() => {
    dispatch(fetchUserSchedule());
  }, [dispatch]);
  
  // Add data to calendar cell
  const cellRender = (current, info) => {
    if (info.type === 'date') {
      const dayEvents = schedule
        .filter(event => current.isSame(dayjs(event.start), 'day'))
        .sort((a, b)  =>{
          if (dayjs(a.start).isBefore(dayjs(b.start))) return -1;
          else return 1;
        });

      return (
        <ul className="events">
          {dayEvents.map((event) => (
            <li key={event.id}>
              <NavLink to='/'>{event.start}</NavLink>
            </li>
          ))}
        </ul>
      );
    }
    return info.originNode;
  };

  return (
    <Calendar
      cellRender={cellRender}
      headerRender={({ value, onChange }) => {
        const start = 0;
        const end = 12;
        const monthOptions = [];
        let current = value.clone();
        const localeData = value.localeData();
        const months = [];
        for (let i = 0; i < 12; i++) {
          current = current.month(i);
          months.push(localeData.monthsShort(current));
        }
        for (let i = start; i < end; i++) {
          monthOptions.push(
            <Select.Option key={i} value={i} className="month-item">
              {months[i]}
            </Select.Option>,
          );
        }
        const year = value.year();
        const month = value.month();
        const options = [];
        for (let i = year - 10; i < year + 10; i += 1) {
          options.push(
            <Select.Option key={i} value={i} className="year-item">
              {i}
            </Select.Option>,
          );
        }
        return (
          <div
            style={{
              padding: 8,
            }}
          >
            <Row gutter={8} justify={'end'}>
              <Col>
                <Select
                  size="small"
                  popupMatchSelectWidth={false}
                  className="my-year-select"
                  value={year}
                  onChange={(newYear) => {
                    const now = value.clone().year(newYear);
                    onChange(now);
                  }}
                >
                  {options}
                </Select>
              </Col>
              <Col>
                <Select
                  size="small"
                  popupMatchSelectWidth={false}
                  value={month}
                  onChange={(newMonth) => {
                    const now = value.clone().month(newMonth);
                    onChange(now);
                  }}
                >
                  {monthOptions}
                </Select>
              </Col>
            </Row>
          </div>
        );
      }}
    />
  );
}

export default EventCalendar;
