import { useState } from 'react';
import type { ClientFilter } from '../models/filtering/ClientFilter';
import type { ClientData } from '../models/ClientData';
import { FilterClients } from '../services/Api';
import { TextBox } from './TextBox';
import { Dropdown } from './Dropdown'; // Assuming Dropdown exists
import { FilteringResultRow } from './FilteringResultRow';

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
            auildingNumber: '',
            apartmentNumber: ''
        },
        phoneFilter: {
            numberWithoutPrefix: ''
        }
    });

    const [results, setResults] = useState<ClientData[]>([]);

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

    // Identification Numbers Logic
    const handleAddIdNumber = () => {
        setFilter(prev => ({
            ...prev,
            identificationNumbers: [...prev.identificationNumbers, { identificationNumberType: 'Pesel', identificationNumber: '' }]
        }));
    };

    const handleRemoveIdNumber = (index: number) => {
        setFilter(prev => ({
            ...prev,
            identificationNumbers: prev.identificationNumbers.filter((_, i) => i !== index)
        }));
    };

    const handleIdNumberChange = (index: number, field: 'identificationNumberType' | 'identificationNumber', value: string) => {
        setFilter(prev => {
            const newIds = [...prev.identificationNumbers];
            newIds[index] = { ...newIds[index], [field]: value };
            return { ...prev, identificationNumbers: newIds };
        });
    };

    const handleSearch = async () => {
        try {
            const data = await FilterClients(filter);
            if (data) {
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

                <div className="filtering-top-row">
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
                </div>

                <div className="filtering-form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4>Numery identyfikacyjne</h4>
                        <button type="button" onClick={handleAddIdNumber} className="small-btn">Dodaj</button>
                    </div>
                    {filter.identificationNumbers.map((id, index) => (
                        <div key={index} className="filtering-id-row">
                            <Dropdown
                                propertyName="identificationNumberType"
                                displayName="Typ"
                                value={id.identificationNumberType}
                                handleChange={(e) => handleIdNumberChange(index, 'identificationNumberType', e.target.value)}
                                options={['Pesel', 'Nip', 'Regon', 'IdCard', 'Passport']}
                            />
                            <TextBox
                                propertyName="identificationNumber"
                                displayName="Numer"
                                value={id.identificationNumber}
                                handleChange={(e) => handleIdNumberChange(index, 'identificationNumber', e.target.value)}
                            />
                            <button type="button" onClick={() => handleRemoveIdNumber(index)} className="remove-usage-button">Usuń</button>
                        </div>
                    ))}
                    {filter.identificationNumbers.length === 0 && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Brak filtrów numerów</p>}
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
                        <FilteringResultRow key={client.id} client={client} />
                    ))}
                </div>
            </div>
        </div>
    );
};
