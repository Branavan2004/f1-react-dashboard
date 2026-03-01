export interface Race {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: {
    circuitId: string;
    url: string;
    circuitName: string;
    Location: {
      lat: string;
      long: string;
      locality: string;
      country: string;
    };
  };
  date: string;
  time?: string;
}

export interface Driver {
  driverId: string;
  permanentNumber?: string;
  code: string;
  url: string;
  givenName: string;
  familyName: string;
  dateOfBirth: string;
  nationality: string;
}

export interface Constructor {
  constructorId: string;
  url: string;
  name: string;
  nationality: string;
}

export interface RaceResult {
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: Driver;
  Constructor: Constructor;
  grid: string;
  laps: string;
  status: string;
  Time?: { millis: string; time: string };
  FastestLap?: {
    rank: string;
    lap: string;
    Time: { time: string };
    AverageSpeed: { units: string; speed: string };
  };
}

export interface LapTiming {
  driverId: string;
  position: string;
  time: string;
}

export interface Lap {
  number: string;
  Timings: LapTiming[];
}

export interface RaceCalendarResponse {
  MRData: {
    RaceTable: {
      season: string;
      Races: Race[];
    };
  };
}

export interface RaceResultsResponse {
  MRData: {
    RaceTable: {
      Races: Array<Race & { Results: RaceResult[] }>;
    };
  };
}

export interface LapsResponse {
  MRData: {
    RaceTable: {
      Races: Array<Race & { Laps: Lap[] }>;
    };
    total: string;
  };
}
