export interface RSVP {
  id: string;
  name: string;
  phone: string;
  attending: boolean;
  guestsCount: number;
  foodPreference: 'veg' | 'non-veg';
  wishes: string;
  createdAt: string;
}

export interface TimelineEvent {
  title: string;
  titleBn: string;
  date: string;
  dateBn: string;
  description: string;
  descriptionBn: string;
  image: string;
}

export interface WeddingEvent {
  id: string;
  title: string;
  titleBn: string;
  date: string;
  dateBn: string;
  time: string;
  timeBn: string;
  venue: string;
  venueBn: string;
  icon: string;
  mapLink?: string;
  image?: string;
}
