type WithdrawalReason = {
  key: string;
  label: string;
}

export const ContactWithdrawalReasons: WithdrawalReason[] = [
  {key: "NoConsentForActions", label: "Brak zgody na działania"},
  {key: "TemporaryUnavailability", label: "Tymczasowa niedostępność"},
  {key: "HandledByAnAuthorizedPerson", label: "Zgoda została udzielona przez osobę upoważnioną"},
  {key: "SecurityRisk", label: "Ryzyko bezpieczeństwa"},
];

export const MarketingWithdrawalReasons: WithdrawalReason[] = [
  {key: "TooManyMessages", label: "Otrzymywałem zbyt wiele wiadomości"},
  {key: "ContentNotRelevant", label: "Treść wiadomości nie była dopasowana do moich zainteresowań"},
  {key: "NeverSubscribed", label: "Nigdy nie zapisywałem się do tej listy"},
  {key: "NotInterestedInTopic", label: "Nie interesuje mnie ta tematyka"},
  {key: "NoMoreMessages", label: "Nie chcę otrzymywać więcej wiadomości"},
  {key: "DontWantToProvideReason", label: "Nie chcę podawać powodu"},
];