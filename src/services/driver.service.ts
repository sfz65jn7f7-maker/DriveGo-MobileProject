import { delay } from '@/services/mocks/delay';
import { MOCK_DOCUMENTS } from '@/services/mocks/misc';
import { MOCK_EARNINGS, MOCK_PLACES, MOCK_REQUESTS } from '@/services/mocks/rides';
import type { DocumentType, DriverDocument, Earnings, RideRequest } from '@/types';

let requests: RideRequest[] = [...MOCK_REQUESTS];
let documents: DriverDocument[] = [...MOCK_DOCUMENTS];

/** Mock : une nouvelle demande arrive environ toutes les 40 s (à remplacer par un WebSocket / push). */
const NEW_REQUEST_EVERY_MS = 40_000;
const PASSENGERS = ['Salma B.', 'Mehdi L.', 'Imane R.', 'Anas K.', 'Khadija M.', 'Reda F.'];
let lastGenerated = Date.now();

function maybeGenerateRequest() {
  if (Date.now() - lastGenerated < NEW_REQUEST_EVERY_MS) return;
  lastGenerated = Date.now();
  const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];
  const pickup = pick(MOCK_PLACES);
  const destination = pick(MOCK_PLACES.filter((p) => p.id !== pickup.id));
  const distanceKm = Math.round((2 + Math.random() * 12) * 10) / 10;
  requests = [
    {
      id: `q_${Date.now()}`,
      passengerName: pick(PASSENGERS),
      pickup,
      destination,
      distanceKm,
      proposedPrice: Math.round((10 + distanceKm * 4) / 5) * 5,
    },
    ...requests,
  ];
}

export const driverService = {
  async getIncomingRequests(): Promise<RideRequest[]> {
    await delay(600);
    maybeGenerateRequest();
    return requests;
  },

  async getRequest(id: string): Promise<RideRequest | undefined> {
    await delay(200);
    return MOCK_REQUESTS.find((r) => r.id === id);
  },

  async acceptRequest(id: string): Promise<RideRequest> {
    await delay(400);
    const request = requests.find((r) => r.id === id);
    if (!request) throw new Error('Request not found');
    requests = requests.filter((r) => r.id !== id);
    return request;
  },

  /** Mock : la contre-offre est toujours acceptée par le passager. */
  async counterOffer(id: string, price: number): Promise<RideRequest> {
    await delay(800);
    const request = requests.find((r) => r.id === id);
    if (!request) throw new Error('Request not found');
    requests = requests.filter((r) => r.id !== id);
    return { ...request, proposedPrice: price };
  },

  async declineRequest(id: string): Promise<void> {
    await delay(200);
    requests = requests.filter((r) => r.id !== id);
  },

  /** Remet les demandes simulées (bouton « actualiser » quand la liste est vide). */
  async resetRequests(): Promise<void> {
    requests = [...MOCK_REQUESTS];
  },

  async getEarnings(): Promise<Earnings> {
    await delay();
    return MOCK_EARNINGS;
  },

  async getDocuments(): Promise<DriverDocument[]> {
    await delay(300);
    return documents;
  },

  async uploadDocument(type: DocumentType): Promise<void> {
    await delay(900);
    documents = documents.map((d) =>
      d.type === type ? { ...d, status: 'pending', updatedAt: new Date().toISOString() } : d,
    );
  },
};
