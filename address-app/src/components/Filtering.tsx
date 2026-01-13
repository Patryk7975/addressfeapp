import { useState } from 'react';
import type { ClientFilter } from '../models/filtering/ClientFilter';
import type { ClientData } from '../models/ClientData';
import { FilterClients } from '../services/Api';
import { TextBox } from './TextBox';
import { Client } from './Client';

export const Filtering = () => {
    const [filter, setFilter] = useState<ClientFilter>({
        fullName: '',
        firstName: '',
        lastName: '',
        identificationNumbers: [],
        emailAddress: '',
        addressFilter: {
            postalCode: '',
            streetName: '',
            city: '',
            auildingNumber: '', // Typo in model, handling it as is
            apartmentNumber: ''
        },
        phoneFilter: {
            numberWithoutPrefix: ''
        }
    });

    const [results, setResults] = useState<ClientData[]>([]);

    // Generic handler might be tricky with nested objects, doing specific ones
    const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilter(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilter(prev => ({
            ...prev,
            addressFilter: {
                ...prev.addressFilter,
                [name]: value
            }
        }));
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilter(prev => ({
            ...prev,
            phoneFilter: {
                ...prev.phoneFilter,
                [name]: value
            }
        }));
    };

    const handleSearch = async () => {
        try {
            // Logic to filter empty strings if needed, or backend handles it.
            // Assuming FilterClients returns ClientData[] (normalized)
            const data = await FilterClients(filter);
            if (data) {
                // The Api.ts update returns normalized data, likely array of ClientData or something close.
                // We treated it as any in the map logic, so we need to cast or hope it matches ClientData.
                // Let's assume it matches ClientData structure since we used normalizeClientResponse.
                setResults(data as unknown as ClientData[]);
            }
        } catch (error) {
            console.error("Filter error", error);
            alert("Błąd podczas szukania");
        }
    };

    return (
        <div className="filtering-container">
            <div className="filtering-form-section">
                <h3>Filtrowanie Klientów</h3>
                <div className="filtering-form-group">
                    <h4>Dane podstawowe</h4>
                    <TextBox propertyName="fullName" displayName="Pełna nazwa" value={filter.fullName} handleChange={handleBasicChange} />
                    <TextBox propertyName="firstName" displayName="Imię" value={filter.firstName} handleChange={handleBasicChange} />
                    <TextBox propertyName="lastName" displayName="Nazwisko" value={filter.lastName} handleChange={handleBasicChange} />
                    <TextBox propertyName="emailAddress" displayName="Email" value={filter.emailAddress} handleChange={handleBasicChange} />
                </div>

                <div className="filtering-form-group">
                    <h4>Adres</h4>
                    <TextBox propertyName="streetName" displayName="Ulica" value={filter.addressFilter.streetName} handleChange={handleAddressChange} />
                    <TextBox propertyName="auildingNumber" displayName="Nr budynku" value={filter.addressFilter.auildingNumber} handleChange={handleAddressChange} />
                    <TextBox propertyName="apartmentNumber" displayName="Nr lokalu" value={filter.addressFilter.apartmentNumber} handleChange={handleAddressChange} />
                    <TextBox propertyName="postalCode" displayName="Kod pocztowy" value={filter.addressFilter.postalCode} handleChange={handleAddressChange} />
                    <TextBox propertyName="city" displayName="Miasto" value={filter.addressFilter.city} handleChange={handleAddressChange} />
                </div>

                <div className="filtering-form-group">
                    <h4>Telefon</h4>
                    <TextBox propertyName="numberWithoutPrefix" displayName="Numer telefonu" value={filter.phoneFilter.numberWithoutPrefix} handleChange={handlePhoneChange} />
                </div>

                <div className="filtering-actions">
                    <button onClick={handleSearch} className="search-button">Szukaj</button>
                </div>
            </div>

            <div className="filtering-results-section">
                <h3>Wyniki ({results.length})</h3>
                <div className="filtering-results-list">
                    {results.map(client => (
                        <Client key={client.id} client={client} />
                    ))}
                </div>
            </div>
        </div>
    );
};
