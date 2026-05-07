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
                    <h4>Addresses:</h4>
                    {client.addresses.length > 0 ? (
                        <ul>
                            {client.addresses.map(addr => (
                                <li key={addr.id}>
                                    {addr.streetName} {addr.buildingNumber}/{addr.apartmentNumber}, {addr.postalCode} {addr.city}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-data">No addresses</p>
                    )}
                </div>

                <div className="filtering-result-section">
                    <h4>Phones:</h4>
                    {client.phones.length > 0 ? (
                        <ul>
                            {client.phones.map(phone => (
                                <li key={phone.id}>
                                    {phone.numberWithoutPrefix}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-data">No phones</p>
                    )}
                </div>

                <div className="filtering-result-section">
                    <h4>Emails:</h4>
                    {client.emails.length > 0 ? (
                        <ul>
                            {client.emails.map(email => (
                                <li key={email.id}>{email.email}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-data">No emails</p>
                    )}
                </div>
            </div>
        </div>
    );
};
