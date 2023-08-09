import { useEffect, useState } from "react";
import { Icon, MenuBarExtra, getPreferenceValues } from "@raycast/api";

interface Preferences {
  start_month: string;
}

const getData = (fiscalYearStartCalendarMonth: number) => {
  const currentDate = new Date(); //=
      const currentCalendarMonth = currentDate.getMonth() + 1;
      const currentCalendarYear = currentDate.getFullYear();
      const start = (fiscalYearStartCalendarMonth <= currentCalendarMonth) ? fiscalYearStartCalendarMonth : (12 -1 - fiscalYearStartCalendarMonth);
      let nextQuarterStartCalendarMonth = 1;

      for (let x = start; x <= currentCalendarMonth + 3;  x += 3 ) {
        nextQuarterStartCalendarMonth = x;
      }

      const nextQuarterStartCalendarYear = (nextQuarterStartCalendarMonth < currentCalendarMonth) ? currentCalendarYear + 1 : currentCalendarYear;
      const nextQuarterStartDate = new Date(nextQuarterStartCalendarYear, nextQuarterStartCalendarMonth - 1, 1);
      const currentQuarterEndDate = new Date(nextQuarterStartDate.setDate(nextQuarterStartDate.getDate() - 1));
      const daysLeftInCurrentQuarter = Math.round((currentQuarterEndDate.getTime() - currentDate.getTime()) / 1000 / 60 / 60 / 24);
      const currentQuarter = Math.ceil( 
        (fiscalYearStartCalendarMonth <= currentCalendarMonth) ?
        (currentCalendarMonth - start + 1) / 3 :
        (currentCalendarMonth + Math.abs(fiscalYearStartCalendarMonth - 12 - 1)) / 3
      );

    return {daysLeftInCurrentQuarter, currentQuarter}
}

const doIt = () => {
  const [state, setState] = useState<{ currentQuarter: string; daysLeftInCurrentQuarter: string; quarterNumber: number; isLoading: boolean; }>({
    currentQuarter: '',
    daysLeftInCurrentQuarter: '',
    quarterNumber: 0,
    isLoading: true,
  });
  useEffect(() => {
    (async () => {
      const preferences = getPreferenceValues<Preferences>();
      const {start_month} = preferences;
      const fiscalStartCalendarMonth = parseInt(start_month)
      
      const {daysLeftInCurrentQuarter, currentQuarter} = getData(fiscalStartCalendarMonth);

      setState({
        currentQuarter: `Q${currentQuarter.toString()}`,
        daysLeftInCurrentQuarter: daysLeftInCurrentQuarter.toString(),
        quarterNumber: currentQuarter,
        isLoading: false,
      });
    })();
  }, []);
  return state;
};

export default function Command() {
  const { currentQuarter, daysLeftInCurrentQuarter, quarterNumber, isLoading } = doIt();
  let icon = Icon.Calendar;
  
  switch (quarterNumber) {
    case 1:
      icon = Icon.CircleProgress25;
      break;
    case 2:
      icon = Icon.CircleProgress50;
      break;
    case 3:
      icon = Icon.CircleProgress75;
      break;
    case 4:
      icon = Icon.CircleProgress100;
      break;
  }

  return (
    <MenuBarExtra icon={icon} isLoading={isLoading}>
      <MenuBarExtra.Item title={`${currentQuarter} - ${daysLeftInCurrentQuarter} days left`}/>
    </MenuBarExtra>
  );
}
