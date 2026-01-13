import type { ClientFilterResponseItem } from "../models/filtering/ClientFilter";

export const FilteringResultRow = ({ client }: { client: ClientFilterResponseItem }) => {
    return (
        <div className="client-card filtering-result-card">
            <div className="client-basic-data-header">
                <h3>{client.fullName}</h3>
                {/* No buttons here */}
            </div>

            <div className="filtering-result-details">
                <div className="filtering-result-section">
                    <h4>Adresy:</h4>
                    {client.addresses.length > 0 ? (
                        <ul>
                            {client.addresses.map(addr => (
                                <li key={addr.id}>
                                    {addr.streetName} {addr.buildingNumber}/{addr.apartmentNumber}, {addr.postalCode} {addr.city}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-data">Brak adresów</p>
                    )}
                </div>

                <div className="filtering-result-section">
                    <h4>Telefony:</h4>
                    {client.phones.length > 0 ? (
                        <ul>
                            {client.phones.map(phone => (
                                <li key={phone.id}>
                                    {phone.numberWithoutPrefix}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-data">Brak telefonów</p>
                    )}
                </div>

                <div className="filtering-result-section">
                    <h4>Emaile:</h4>
                    {client.emails.length > 0 ? (
                        <ul>
                            {client.emails.map(email => (
                                <li key={email.id}>{email.email}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-data">Brak emaili</p>
                    )}
                </div>
            </div>
        </div>
    );
};
