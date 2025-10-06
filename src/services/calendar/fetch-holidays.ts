// Based on algorithms from: https://github.com/BrasilAPI/BrasilAPI/blob/main/services/holidays/index.js

import { YearOutsideTheRange } from "@/errors/year-outside-the-range";

type Holiday = {
  date: string;
  name: string;
  type: "national" | "state" | "municipal";
};

function getPascalFullMoonDates(): [number, number][] {
  return [
    [3, 14],
    [3, 3],
    [2, 23],
    [3, 11],
    [2, 31],
    [3, 18],
    [3, 8],
    [2, 28],
    [3, 16],
    [3, 5],
    [2, 25],
    [3, 13],
    [3, 2],
    [2, 22],
    [3, 10],
    [2, 30],
    [3, 17],
    [3, 7],
    [2, 27],
  ];
}

function formatDate(date: Date): string {
  return date.toISOString().substring(0, 10);
}

function getEasterHolidays(year: number): Holiday[] {
  if (year < 1900 || year > 2199) {
    throw new YearOutsideTheRange();
  }

  const pascalFullMoonMonthDay = getPascalFullMoonDates();
  const [refMonth, refDay] = pascalFullMoonMonthDay[year % 19];
  const movingDate = new Date(year, refMonth, refDay);
  const holidays: Holiday[] = [];

  movingDate.setDate(movingDate.getDate() + 7 - movingDate.getDay());
  holidays.push({
    date: formatDate(movingDate),
    name: "Páscoa",
    type: "national",
  });

  movingDate.setDate(movingDate.getDate() - 2);
  holidays.push({
    date: formatDate(movingDate),
    name: "Sexta-feira Santa",
    type: "national",
  });

  movingDate.setDate(movingDate.getDate() - 45);
  holidays.push({
    date: formatDate(movingDate),
    name: "Carnaval",
    type: "national",
  });

  movingDate.setDate(movingDate.getDate() + 107);
  holidays.push({
    date: formatDate(movingDate),
    name: "Corpus Christi",
    type: "national",
  });

  return holidays;
}

function getNationalHolidays(year: number): Holiday[] {
  const fixedHolidays: [string, string][] = [
    ["01-01", "Confraternização mundial"],
    ["04-21", "Tiradentes"],
    ["05-01", "Dia do trabalho"],
    ["09-07", "Independência do Brasil"],
    ["10-12", "Nossa Senhora Aparecida"],
    ["11-02", "Finados"],
    ["11-15", "Proclamação da República"],
    ["12-25", "Natal"],
  ];

  if (year >= 2024) {
    fixedHolidays.splice(fixedHolidays.length - 1, 0, [
      "11-20",
      "Dia da consciência negra",
    ]);
  }

  return fixedHolidays.map(([date, name]) => ({
    date: `${year}-${date}`,
    name,
    type: "national",
  }));
}

function getStateHolidays(year: number): Holiday[] {
  const fixedHolidays: [string, string][] = [
    ["07-08", "Aniversário de Sergipe"],
  ];

  return fixedHolidays.map(([date, name]) => ({
    date: `${year}-${date}`,
    name,
    type: "state",
  }));
}

// Reference: https://www.normasbrasil.com.br/norma/lei-1358-1988-aracaju_171678.html
function getMunicipalHolidays(year: number): Holiday[] {
  const fixedHolidays: [string, string][] = [];

  if (year >= 1988) {
    fixedHolidays.push(["03-17", "Aniversário da cidade"]);
    fixedHolidays.push([
      "12-08",
      "Nossa Senhora da Conceição, Padroeira de Aracaju",
    ]);
  }

  if (year >= 2010) {
    fixedHolidays.splice(fixedHolidays.length - 1, 0, ["06-24", "São João"]);
  }

  return fixedHolidays.map(([date, name]) => ({
    date: `${year}-${date}`,
    name,
    type: "municipal",
  }));
}

function sortByDate(holidays: Holiday[]): Holiday[] {
  return holidays.sort((a, b) => {
    if (a.date > b.date) return 1;
    if (a.date < b.date) return -1;
    return 0;
  });
}

type GetHolidaysFromYearResponse =
  | {
      holidays: Holiday[];
      error: null;
    }
  | {
      holidays: null;
      error: Error;
    };

export function getHolidaysFromYear(year: number): GetHolidaysFromYearResponse {
  try {
    const easterHolidays = getEasterHolidays(year);
    const nationalHolidays = getNationalHolidays(year);
    const stateHolidays = getStateHolidays(year);
    const municipalHolidays = getMunicipalHolidays(year);

    const holidays = sortByDate([
      ...easterHolidays,
      ...nationalHolidays,
      ...stateHolidays,
      ...municipalHolidays,
    ]);

    return {
      holidays,
      error: null,
    } as const;
  } catch (err) {
    return {
      holidays: null,
      error: err instanceof Error ? err : new Error(String(err)),
    } as const;
  }
}
