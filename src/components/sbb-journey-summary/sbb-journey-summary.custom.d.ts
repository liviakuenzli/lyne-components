import { PtRideLeg } from '../../global/interfaces/pearl-chain-properties';

export interface InterfaceSbbJourneySummaryAttributes {
  legs: PtRideLeg[];
  vias?: string[];
  origin: string;
  destination: string;
  arrivalWalk?: number;
  departure: string;
  arrival: string;
  departureWalk?: number;
  duration?: number;
}
