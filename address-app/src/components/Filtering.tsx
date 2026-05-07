import { useState } from 'react';
import type { ClientFilter, ClientFilterResponseItem } from '../models/filtering/ClientFilter';
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
            id: '',
            postalCode: '',
            streetName: '',
            city: '',
            buildingNumber: '',
            apartmentNumber: ''
        },
        phoneFilter: {
            id:'',
            numberWithoutPrefix: ''
        }
    });

    const [results, setResults] = useState<ClientFilterResponseItem[]>([]);

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
                setResults(data);
            }
        } catch (error) {
            console.error("Filter error", error);
            alert("Error during search");
        }
    };

    return (
        <div className="filtering-container">
            <div className="filtering-form-section">
                <h3>Client filtering</h3>

                <div className="filtering-top-row">
                    <div className="filtering-form-group">
                        <h4>Basic information</h4>
                        <TextBox propertyName="fullName" displayName="Full name" value={filter.fullName} handleChange={handleBasicChange} />
                        <TextBox propertyName="firstName" displayName="First name" value={filter.firstName} handleChange={handleBasicChange} />
                        <TextBox propertyName="lastName" displayName="Last name" value={filter.lastName} handleChange={handleBasicChange} />
                        <TextBox propertyName="emailAddress" displayName="Email" value={filter.emailAddress} handleChange={handleBasicChange} />
                    </div>

                    <div className="filtering-form-group">
                        <h4>Address</h4>
                        <TextBox propertyName="streetName" displayName="Street" value={filter.addressFilter.streetName} handleChange={handleAddressChange} />
                        <TextBox propertyName="auildingNumber" displayName="Building number" value={filter.addressFilter.buildingNumber} handleChange={handleAddressChange} />
                        <TextBox propertyName="apartmentNumber" displayName="Apartment number" value={filter.addressFilter.apartmentNumber} handleChange={handleAddressChange} />
                        <TextBox propertyName="postalCode" displayName="Postal code" value={filter.addressFilter.postalCode} handleChange={handleAddressChange} />
                        <TextBox propertyName="city" displayName="City" value={filter.addressFilter.city} handleChange={handleAddressChange} />
                    </div>
                </div>

                <div className="filtering-form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4>Identification numbers</h4>
                        <button type="button" onClick={handleAddIdNumber} className="small-btn">Add</button>
                    </div>
                    {filter.identificationNumbers.map((id, index) => (
                        <div key={index} className="filtering-id-row">
                            <Dropdown
                                propertyName="identificationNumberType"
                                displayName="Type"
                                value={id.identificationNumberType}
                                handleChange={(e) => handleIdNumberChange(index, 'identificationNumberType', e.target.value)}
                                options={['Pesel', 'Nip', 'Regon', 'IdCard', 'Passport']}
                            />
                            <TextBox
                                propertyName="identificationNumber"
                                displayName="Number"
                                value={id.identificationNumber}
                                handleChange={(e) => handleIdNumberChange(index, 'identificationNumber', e.target.value)}
                            />
                            <button type="button" onClick={() => handleRemoveIdNumber(index)} className="remove-usage-button">Delete</button>
                        </div>
                    ))}
                    {filter.identificationNumbers.length === 0 && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>No number filters</p>}
                </div>

                <div className="filtering-form-group">
                    <h4>Phone</h4>
                    <TextBox propertyName="numberWithoutPrefix" displayName="Phone number" value={filter.phoneFilter.numberWithoutPrefix} handleChange={handlePhoneChange} />
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
