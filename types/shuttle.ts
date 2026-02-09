export interface ShuttleRoute {
    id: string;
    origin: string;
    destination: string;
    price: number;
    schedule: string[];
    duration: string;
    image: string;
    type: 'shared' | 'private';
    description?: string;
}
