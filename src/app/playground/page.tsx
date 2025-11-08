"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import dayjs from "@/lib/dayjs";
import {
  Calculator,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import type { FormEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

type BusinessDaysData = {
  businessDays: number;
};

type EndDateData = {
  endDate: string;
};

type Holiday = {
  date: string;
  name: string;
  type: "national" | "state" | "municipal";
};

type HolidayCheckData = {
  date: string;
  isHoliday: boolean;
};

type ApiResponse<T> = {
  data: T;
  message?: string;
};

type ApiErrorPayload = {
  message?: string;
  error?: string;
};

async function fetchApi<T>(endpoint: string): Promise<ApiResponse<T>> {
  const response = await fetch(endpoint, { cache: "no-store" });
  let payload: ApiResponse<T> & ApiErrorPayload;

  try {
    payload = (await response.json()) as ApiResponse<T> & ApiErrorPayload;
  } catch {
    throw new Error("Resposta inválida da API");
  }

  if (!response.ok) {
    throw new Error(
      payload.error ??
        payload.message ??
        "Não foi possível concluir a requisição."
    );
  }

  if (!("data" in payload)) {
    throw new Error("Resposta inesperada da API");
  }

  return payload;
}

export default function Playground() {
  const today = useMemo(() => dayjs().format("YYYY-MM-DD"), []);
  const nextWeek = useMemo(
    () => dayjs().add(7, "day").format("YYYY-MM-DD"),
    []
  );
  const defaultYear = useMemo(() => dayjs().format("YYYY"), []);

  const [businessStartDate, setBusinessStartDate] = useState(today);
  const [businessEndDate, setBusinessEndDate] = useState(nextWeek);
  const [includeSaturdaysBetween, setIncludeSaturdaysBetween] = useState(false);
  const [businessDaysResult, setBusinessDaysResult] = useState<number | null>(
    null
  );
  const [businessDaysError, setBusinessDaysError] = useState<string | null>(
    null
  );
  const [businessDaysIsLoading, setBusinessDaysIsLoading] = useState(false);

  const [endDateStart, setEndDateStart] = useState(today);
  const [workingDaysCount, setWorkingDaysCount] = useState("5");
  const [includeSaturdaysEndDate, setIncludeSaturdaysEndDate] = useState(false);
  const [calculatedEndDate, setCalculatedEndDate] = useState<string | null>(
    null
  );
  const [endDateError, setEndDateError] = useState<string | null>(null);
  const [endDateIsLoading, setEndDateIsLoading] = useState(false);

  const [holidaysYear, setHolidaysYear] = useState(defaultYear);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [holidaysMessage, setHolidaysMessage] = useState<string | null>(null);
  const [holidaysError, setHolidaysError] = useState<string | null>(null);
  const [holidaysIsLoading, setHolidaysIsLoading] = useState(false);

  const [holidayDateToCheck, setHolidayDateToCheck] = useState(today);
  const [holidayCheckResult, setHolidayCheckResult] =
    useState<HolidayCheckData | null>(null);
  const [holidayCheckError, setHolidayCheckError] = useState<string | null>(
    null
  );
  const [holidayCheckIsLoading, setHolidayCheckIsLoading] = useState(false);

  const holidayTypeLabel: Record<Holiday["type"], string> = {
    national: "Nacional",
    state: "Estadual",
    municipal: "Municipal",
  };

  const handleBusinessDaysSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setBusinessDaysError(null);

    if (dayjs(businessEndDate).isBefore(dayjs(businessStartDate))) {
      setBusinessDaysResult(null);
      setBusinessDaysError(
        "A data final não pode ser anterior à data inicial."
      );
      return;
    }

    const params = new URLSearchParams({
      startDate: businessStartDate,
      endDate: businessEndDate,
      includeSaturdays: includeSaturdaysBetween ? "true" : "false",
    });

    setBusinessDaysIsLoading(true);
    setBusinessDaysResult(null);

    try {
      const payload = await fetchApi<BusinessDaysData>(
        `/api/v1/calendar/business-days?${params.toString()}`
      );
      setBusinessDaysResult(payload.data.businessDays);
    } catch (error) {
      setBusinessDaysError(
        error instanceof Error
          ? error.message
          : "Não foi possível calcular os dias úteis."
      );
    } finally {
      setBusinessDaysIsLoading(false);
    }
  };

  const handleEndDateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEndDateError(null);

    if (!workingDaysCount || Number(workingDaysCount) < 1) {
      setEndDateError("Informe a quantidade de dias úteis (mínimo 1).");
      setCalculatedEndDate(null);
      return;
    }

    const params = new URLSearchParams({
      startDate: endDateStart,
      workingDays: workingDaysCount,
      includeSaturdays: includeSaturdaysEndDate ? "true" : "false",
    });

    setEndDateIsLoading(true);
    setCalculatedEndDate(null);

    try {
      const payload = await fetchApi<EndDateData>(
        `/api/v1/calendar/business-days/end-date?${params.toString()}`
      );
      setCalculatedEndDate(payload.data.endDate);
    } catch (error) {
      setEndDateError(
        error instanceof Error
          ? error.message
          : "Não foi possível calcular a data final."
      );
    } finally {
      setEndDateIsLoading(false);
    }
  };

  const fetchHolidays = useCallback(async (year: string) => {
    const params = new URLSearchParams({
      year,
    });

    setHolidaysIsLoading(true);
    setHolidaysError(null);

    try {
      const payload = await fetchApi<Holiday[]>(
        `/api/v1/calendar/holidays?${params.toString()}`
      );
      setHolidays(payload.data);
      setHolidaysMessage(payload.message ?? null);
    } catch (error) {
      setHolidays([]);
      setHolidaysMessage(null);
      setHolidaysError(
        error instanceof Error
          ? error.message
          : "Não foi possível listar os feriados."
      );
    } finally {
      setHolidaysIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchHolidays(defaultYear);
  }, [defaultYear, fetchHolidays]);

  const handleHolidaysSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await fetchHolidays(holidaysYear);
  };

  const handleHolidayCheck = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHolidayCheckError(null);

    const params = new URLSearchParams({
      date: holidayDateToCheck,
    });

    setHolidayCheckIsLoading(true);
    setHolidayCheckResult(null);

    try {
      const payload = await fetchApi<HolidayCheckData>(
        `/api/v1/calendar/holidays/is-holiday?${params.toString()}`
      );
      setHolidayCheckResult(payload.data);
    } catch (error) {
      setHolidayCheckError(
        error instanceof Error
          ? error.message
          : "Não foi possível verificar a data informada."
      );
    } finally {
      setHolidayCheckIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <header className="space-y-4 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            Playground da API
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Teste as rotas disponíveis em tempo real
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
            Utilize os exemplos abaixo para experimentar as rotas da ApiAju.
            Encontre exemplos de aplicações, casos de uso e use sempre que
            precisar.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="border border-primary/10 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Calculator className="h-5 w-5 text-primary" />
                Calculadora de dias úteis
              </CardTitle>
              <CardDescription>
                Informe um intervalo para descobrir quantos dias úteis existem
                entre as datas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleBusinessDaysSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="business-start-date"
                      className="text-sm font-medium text-foreground"
                    >
                      Data inicial
                    </label>
                    <Input
                      id="business-start-date"
                      type="date"
                      value={businessStartDate}
                      onChange={(event) =>
                        setBusinessStartDate(event.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="business-end-date"
                      className="text-sm font-medium text-foreground"
                    >
                      Data final
                    </label>
                    <Input
                      id="business-end-date"
                      type="date"
                      value={businessEndDate}
                      onChange={(event) =>
                        setBusinessEndDate(event.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border border-input"
                    checked={includeSaturdaysBetween}
                    onChange={(event) =>
                      setIncludeSaturdaysBetween(event.target.checked)
                    }
                  />
                  Incluir sábados como dias úteis
                </label>

                <Button
                  type="submit"
                  disabled={businessDaysIsLoading}
                  className="w-full sm:w-auto"
                >
                  {businessDaysIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Calculando...
                    </>
                  ) : (
                    "Calcular"
                  )}
                </Button>
              </form>

              {businessDaysError ? (
                <p className="text-sm text-red-600">{businessDaysError}</p>
              ) : null}

              {businessDaysResult !== null && !businessDaysError ? (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
                  Foram encontrados{" "}
                  <span className="font-semibold text-primary">
                    {businessDaysResult}
                  </span>{" "}
                  dias úteis entre as datas informadas.
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="border border-primary/10 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <CalendarRange className="h-5 w-5 text-primary" />
                Data final por dias úteis
              </CardTitle>
              <CardDescription>
                Descubra qual será a data final após percorrer uma quantidade de
                dias úteis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleEndDateSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="end-date-start"
                    className="text-sm font-medium text-foreground"
                  >
                    Data inicial
                  </label>
                  <Input
                    id="end-date-start"
                    type="date"
                    value={endDateStart}
                    onChange={(event) => setEndDateStart(event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="working-days"
                    className="text-sm font-medium text-foreground"
                  >
                    Quantidade de dias úteis
                  </label>
                  <Input
                    id="working-days"
                    type="number"
                    min={1}
                    value={workingDaysCount}
                    onChange={(event) =>
                      setWorkingDaysCount(event.target.value)
                    }
                    required
                  />
                </div>

                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border border-input"
                    checked={includeSaturdaysEndDate}
                    onChange={(event) =>
                      setIncludeSaturdaysEndDate(event.target.checked)
                    }
                  />
                  Incluir sábados como dias úteis
                </label>

                <Button
                  type="submit"
                  disabled={endDateIsLoading}
                  className="w-full sm:w-auto"
                >
                  {endDateIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Calculando...
                    </>
                  ) : (
                    "Calcular"
                  )}
                </Button>
              </form>

              {endDateError ? (
                <p className="text-sm text-red-600">{endDateError}</p>
              ) : null}

              {calculatedEndDate && !endDateError ? (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
                  A data final será{" "}
                  <span className="font-semibold text-primary">
                    {dayjs(calculatedEndDate).format("DD/MM/YYYY")}
                  </span>
                  .
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="border border-primary/10 shadow-sm md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <CalendarDays className="h-5 w-5 text-primary" />
                Feriados por ano
              </CardTitle>
              <CardDescription>
                Consulte todos os feriados municipais, estaduais e nacionais
                considerados pela API em um determinado ano.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form
                onSubmit={handleHolidaysSubmit}
                className="flex flex-col gap-4 sm:flex-row sm:items-end"
              >
                <div className="w-full sm:max-w-[200px]">
                  <label
                    htmlFor="holidays-year"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Ano
                  </label>
                  <Input
                    id="holidays-year"
                    type="number"
                    min={1900}
                    max={2199}
                    value={holidaysYear}
                    onChange={(event) => setHolidaysYear(event.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={holidaysIsLoading}
                  className="w-full sm:w-auto"
                >
                  {holidaysIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Consultando...
                    </>
                  ) : (
                    "Listar feriados"
                  )}
                </Button>
              </form>

              {holidaysError ? (
                <p className="text-sm text-red-600">{holidaysError}</p>
              ) : null}

              {!holidaysError && holidaysMessage ? (
                <p className="text-sm text-muted-foreground">
                  {holidaysMessage}
                </p>
              ) : null}

              {!holidaysIsLoading && holidays.length === 0 && !holidaysError ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum feriado encontrado para o ano informado.
                </p>
              ) : null}

              <div className="grid gap-3 md:grid-cols-2">
                {holidays.map((holiday) => (
                  <div
                    key={`${holiday.date}-${holiday.name}`}
                    className="rounded-lg border border-border bg-muted/20 p-4"
                  >
                    <p className="text-sm font-medium text-foreground">
                      {holiday.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {dayjs(holiday.date).format("DD/MM/YYYY")} ·{" "}
                      {holidayTypeLabel[holiday.type]}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-primary/10 shadow-sm md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Verificar se uma data é feriado
              </CardTitle>
              <CardDescription>
                Informe uma data para saber se ela é considerada feriado em
                Aracaju.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form
                onSubmit={handleHolidayCheck}
                className="flex flex-col gap-4 sm:flex-row sm:items-end"
              >
                <div className="w-full sm:max-w-[240px]">
                  <label
                    htmlFor="holiday-check-date"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Data
                  </label>
                  <Input
                    id="holiday-check-date"
                    type="date"
                    value={holidayDateToCheck}
                    onChange={(event) =>
                      setHolidayDateToCheck(event.target.value)
                    }
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={holidayCheckIsLoading}
                  className="w-full sm:w-auto"
                >
                  {holidayCheckIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Consultando...
                    </>
                  ) : (
                    "Verificar data"
                  )}
                </Button>
              </form>

              {holidayCheckError ? (
                <p className="text-sm text-red-600">{holidayCheckError}</p>
              ) : null}

              {holidayCheckResult && !holidayCheckError ? (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
                  A data{" "}
                  <span className="font-semibold text-primary">
                    {dayjs(holidayCheckResult.date).format("DD/MM/YYYY")}
                  </span>{" "}
                  {holidayCheckResult.isHoliday
                    ? "é um feriado considerado pela API."
                    : "não é um feriado identificado pela API."}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
