export enum Gender {
  Male = 'M',
  Female = 'F'
}

export type PersonalInfo = {
  gender: Gender;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
};

export type ContactDetails = {
  email: string;
  phone: string;
};

export enum CardStatus {
  NotRegistered = 'NOT_REGISTERED', // the user did not fill personal data form yet
  ContactDetails = 'CONTACT_DETAILS', // the user filled personal data form, but no contacts yet. todo: add to the server state
  PhoneVerification = 'PHONE_VERIFICATION_PENDING', // account is signed up, SMS sent to phone number provided
  KYCWaiting = 'KYC_WAITING', // user verified phone, but not passed KYC yet
  KYCPending = 'KYC_PENDING', // user has passed KYC, it is being verified (wait)
  CardOrder = 'CARD_ORDER_PENDING', // user has verified phone and passed KYC, we would order card
  Shipped = 'CARD_SHIPPED', // the card is ordered, to be shipped
  CardActive = 'CARD_ACTIVE', // the card is active (outer status)
  Active = 'ACTIVE' // the card is active (inner status)
}

export type EventHistoryItem = {
  timestamp: number;
  status: CardStatus;
};

export type CardInfo = {
  status: CardStatus;
  displayName: string;
  last4Digits: string;
  // starts from 1
  expMonth: number;
  // starts from 1
  expYear: number;
  temporaryBlocked: boolean;
  iban: string;
};

export type GetInfoResponseBase = {
  status: CardStatus.NotRegistered | CardStatus.ContactDetails | CardStatus.PhoneVerification;
};

export type GetInfoResponseWithHistory = {
  status: CardStatus.KYCPending | CardStatus.CardOrder | CardStatus.Shipped;
  statusHistory: Array<EventHistoryItem>;
};

export type GetInfoResponseWithKYCLink = {
  status: CardStatus.KYCWaiting;
  statusHistory: Array<EventHistoryItem>;
  KYCLink: string;
};

export type GetInfoResponseActive = {
  status: CardStatus.Active | CardStatus.CardActive;
  cardInfo: CardInfo;
};

export type GetInfoResponse =
  | GetInfoResponseBase
  | GetInfoResponseWithHistory
  | GetInfoResponseWithKYCLink
  | GetInfoResponseActive;
