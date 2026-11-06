import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ImportClient, type ClientImportAddress, type ClientImportRequest } from '../services/Api';
import { AddressType } from '../enums/AddressType';
import { AddressUsageType } from '../enums/AddressUsageType';
import { StreetPrefix } from '../enums/StreetPrefix';
import { VerificationStatus } from '../enums/VerificationStatus';

const initialForm: ClientImportRequest = {
    addresses: [{
        streetPrefix: 'ul',
        streetName: 'Rynek',
        buildingNumber: '5',
        city: 'Kraków',
        postalCode: '40-111',
        country: 'Poland',
        type: 'physical',
        notes: 'Some impoty',
        usage: { type: 'correspondence', status: 'notVerified' },
    }],
    type: 'individual',
    fullName: 'John Bravo',
    birthCountry: 'Poland',
    isPep: true,
    placeOfBirth: 'Warszawa',
    gender: 'male',
    changeSource: 'seller',
    changeBasis: 'import',
    verificationStatus: 'notVerified',
    sellerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    investorId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
};

interface TextFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}

const TextField = ({ label, name, value, onChange, required = true }: TextFieldProps) => (
    <label className="import-field" htmlFor={name}>
        <span>{label}</span>
        <input id={name} name={name} type="text" value={value} onChange={onChange} required={required} />
    </label>
);

interface SelectFieldProps {
    label: string;
    name: string;
    value: string;
    options: { label: string; value: string }[];
    onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const SelectField = ({ label, name, value, options, onChange }: SelectFieldProps) => (
    <label className="import-field" htmlFor={name}>
        <span>{label}</span>
        <select id={name} name={name} value={value} onChange={onChange} required>
            {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
    </label>
);

type ApiRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is ApiRecord =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

const asRecord = (value: unknown): ApiRecord => isRecord(value) ? value : {};

const getText = (record: ApiRecord, key: string): string | null => {
    const value = record[key];
    if (typeof value === 'string') return value.trim() ? value : null;
    if (typeof value === 'number') return String(value);
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return null;
};

const humanize = (value: string | null): string | null => value
    ?.replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, character => character.toUpperCase()) ?? null;

const enumOptions = (values: object) => Object.keys(values)
    .filter(key => Number.isNaN(Number(key)))
    .map(key => ({ label: key, value: key.charAt(0).toLowerCase() + key.slice(1) }));

const streetPrefixOptions = enumOptions(StreetPrefix);
const clientTypeOptions = [
    { label: 'Individual', value: 'individual' },
    { label: 'Company', value: 'Company' },
];
const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
];
const addressTypeOptions = enumOptions(AddressType);
const usageTypeOptions = enumOptions(AddressUsageType);
const verificationStatusOptions = enumOptions(VerificationStatus);

const responseRows = (fields: [string, string | null][]) =>
    fields.flatMap(([label, value]) => value === null ? [] : [{ label, value }]);

const ImportResponseSummary = ({ response }: { response: unknown }) => {
    const root = asRecord(response);
    const client = asRecord(root.client);
    const legalEntity = asRecord(client.legalEntity);
    const demographic = asRecord(root.clientDemography);
    const gender = asRecord(demographic.clientGender);
    const otherInformation = asRecord(root.clientOtherInformation);
    const pep = asRecord(otherInformation.pep);
    const clientRows = responseRows([
        ['Client ID', getText(client, 'id')],
        ['Name', getText(legalEntity, 'fullName')],
        ['First name', getText(legalEntity, 'firstName')],
        ['Second name', getText(legalEntity, 'secondName')],
        ['Last name', getText(legalEntity, 'lastName')],
        ['Client type', humanize(getText(legalEntity, '_type'))],
        ['Birth country', humanize(getText(legalEntity, 'birthCountry'))],
        ['Place of birth', getText(legalEntity, 'placeOfBirth')],
        ['Gender', humanize(getText(gender, 'gender'))],
        ['Politically exposed person', getText(pep, 'isPep')],
    ]);
    const addresses = Array.isArray(client.addresses) ? client.addresses.filter(isRecord) : [];
    const validationNotes = Array.isArray(root.brokenRules)
        ? root.brokenRules.filter(isRecord).flatMap(rule => {
            const message = getText(rule, 'message');
            return message === null ? [] : [message];
        })
        : [];

    return (
        <div className="client-import-summary">
            {clientRows.length > 0 && (
                <dl className="client-import-summary-grid">
                    {clientRows.map(row => (
                        <div className="client-import-summary-field" key={row.label}>
                            <dt>{row.label}</dt>
                            <dd>{row.value}</dd>
                        </div>
                    ))}
                </dl>
            )}

            {addresses.length > 0 && (
                <section className="client-import-summary-section">
                    <h3>Addresses</h3>
                    {addresses.map((address, index) => {
                        const usages = Array.isArray(address.usages) ? address.usages.filter(isRecord) : [];
                        const usageText = usages
                            .map(usage => [humanize(getText(usage, 'type')), humanize(getText(usage, 'status'))]
                                .filter((value): value is string => value !== null)
                                .join(' · '))
                            .filter(value => value.length > 0)
                            .join(', ');
                        const divisionRows = [
                            { key: 'firstLevelOfDivision', label: 'First-level division' },
                            { key: 'secondLevelOfDivision', label: 'Second-level division' },
                            { key: 'thirdLevelOfDivision', label: 'Third-level division' },
                        ].flatMap(({ key, label }) => {
                            const division = asRecord(address[key]);
                            const value = getText(division, 'value');
                            return value === null ? [] : [{ label: humanize(getText(division, 'meaning')) ?? label, value }];
                        });
                        const rows = responseRows([
                            ['Address type', humanize(getText(address, 'type'))],
                            ['Usage', usageText || null],
                            ['Notes', getText(address, 'notes')],
                        ]).concat(divisionRows);
                        const street = [
                            getText(address, 'streetPrefix'),
                            getText(address, 'streetName'),
                            getText(address, 'buildingNumber'),
                        ].filter((value): value is string => value !== null).join(' ');
                        const cityLine = [
                            getText(address, 'postalCode'),
                            getText(address, 'city'),
                        ].filter((value): value is string => value !== null).join(' ');
                        const country = humanize(getText(address, 'country'));
                        const locality = [cityLine, country].filter((value): value is string => value !== null && value.length > 0).join(', ');

                        return (
                            <article className="client-import-address" key={getText(address, 'id') ?? index}>
                                {(street || locality) && (
                                    <p className="client-import-address-location">
                                        {street && <span>{street}</span>}
                                        {locality && <span>{locality}</span>}
                                    </p>
                                )}
                                {rows.length > 0 && (
                                    <dl className="client-import-detail-list">
                                        {rows.map(row => (
                                            <div key={row.label}>
                                                <dt>{row.label}</dt>
                                                <dd>{row.value}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                )}
                            </article>
                        );
                    })}
                </section>
            )}

            {validationNotes.length > 0 && (
                <section className="client-import-validation-notes">
                    <h3>Validation notes</h3>
                    <ul>
                        {validationNotes.map((note, index) => <li key={`${note}-${index}`}>{note}</li>)}
                    </ul>
                </section>
            )}

            {clientRows.length === 0 && addresses.length === 0 && validationNotes.length === 0 && (
                <p>No client details or validation notes were returned.</p>
            )}
        </div>
    );
};

export const ClientImportForm = () => {
    const [form, setForm] = useState<ClientImportRequest>(initialForm);
    const [token, setToken] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [importResponse, setImportResponse] = useState<unknown>(null);
    const [hasImportResponse, setHasImportResponse] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const updateField = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setForm(current => ({ ...current, [name]: value }));
    };

    const updateSelectField = (event: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;
        if (name === 'clientType') {
            setForm(current => ({ ...current, type: value }));
        } else if (name === 'gender') {
            setForm(current => ({ ...current, gender: value }));
        } else if (name === 'streetPrefix') {
            updateAddress('streetPrefix', value);
        } else if (name === 'addressType') {
            updateAddress('type', value);
        } else if (name === 'usageType') {
            updateUsage('type', value);
        } else if (name === 'usageStatus') {
            updateUsage('status', value);
        } else if (name === 'verificationStatus') {
            setForm(current => ({ ...current, verificationStatus: value }));
        }
    };

    const updateAddress = (field: keyof Omit<ClientImportAddress, 'usage'>, value: string) => {
        setForm(current => ({
            ...current,
            addresses: current.addresses.map((address, index) => index === 0 ? { ...address, [field]: value } : address),
        }));
    };

    const updateUsage = (field: keyof ClientImportAddress['usage'], value: string) => {
        setForm(current => ({
            ...current,
            addresses: current.addresses.map((address, index) => index === 0
                ? { ...address, usage: { ...address.usage, [field]: value } }
                : address),
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setFeedback(null);
        setHasImportResponse(false);
        try {
            const response = await ImportClient(form, token);
            setImportResponse(response);
            setHasImportResponse(true);
            setFeedback({ type: 'success', message: 'Client import completed.' });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'The import request failed.';
            setFeedback({ type: 'error', message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const address = form.addresses[0];

    return (
        <section className="client-import-page">
            <header className="client-import-header">
                <div>
                    <p className="client-import-kicker">CLIENT RECORDS / API</p>
                    <h1>Import a client</h1>
                </div>
                <span className="client-import-method">POST&nbsp; /api/import</span>
            </header>

            <form className="client-import-form" onSubmit={handleSubmit}>
                <fieldset className="client-import-section">
                    <legend>Identity</legend>
                    <div className="client-import-grid">
                        <TextField label="Full name" name="fullName" value={form.fullName} onChange={updateField} />
                        <SelectField label="Client type" name="clientType" value={form.type} options={clientTypeOptions} onChange={updateSelectField} />
                        <TextField label="Birth country" name="birthCountry" value={form.birthCountry} onChange={updateField} />
                        <TextField label="Place of birth" name="placeOfBirth" value={form.placeOfBirth} onChange={updateField} />
                        <SelectField label="Gender" name="gender" value={form.gender} options={genderOptions} onChange={updateSelectField} />
                        <label className="import-pep-toggle">
                            <input
                                type="checkbox"
                                checked={form.isPep}
                                onChange={event => setForm(current => ({ ...current, isPep: event.target.checked }))}
                            />
                            <span>Politically exposed person (PEP)</span>
                        </label>
                    </div>
                </fieldset>

                <fieldset className="client-import-section">
                    <legend>Address</legend>
                    <div className="client-import-grid">
                        <SelectField label="Street prefix" name="streetPrefix" value={address.streetPrefix} options={streetPrefixOptions} onChange={updateSelectField} />
                        <label className="import-field">
                            <span>Street name</span>
                            <input value={address.streetName} onChange={event => updateAddress('streetName', event.target.value)} required />
                        </label>
                        <label className="import-field">
                            <span>Building number</span>
                            <input value={address.buildingNumber} onChange={event => updateAddress('buildingNumber', event.target.value)} required />
                        </label>
                        <label className="import-field">
                            <span>City</span>
                            <input value={address.city} onChange={event => updateAddress('city', event.target.value)} required />
                        </label>
                        <label className="import-field">
                            <span>Postal code</span>
                            <input value={address.postalCode} onChange={event => updateAddress('postalCode', event.target.value)} required />
                        </label>
                        <label className="import-field">
                            <span>Country</span>
                            <input value={address.country} onChange={event => updateAddress('country', event.target.value)} required />
                        </label>
                        <SelectField label="Address type" name="addressType" value={address.type} options={addressTypeOptions} onChange={updateSelectField} />
                        <SelectField label="Usage type" name="usageType" value={address.usage.type} options={usageTypeOptions} onChange={updateSelectField} />
                        <SelectField label="Usage status" name="usageStatus" value={address.usage.status} options={verificationStatusOptions} onChange={updateSelectField} />
                        <label className="import-field import-field-wide">
                            <span>Notes</span>
                            <input value={address.notes} onChange={event => updateAddress('notes', event.target.value)} />
                        </label>
                    </div>
                </fieldset>

                <fieldset className="client-import-section">
                    <legend>Import metadata</legend>
                    <div className="client-import-grid">
                        <TextField label="Change source" name="changeSource" value={form.changeSource} onChange={updateField} />
                        <TextField label="Change basis" name="changeBasis" value={form.changeBasis} onChange={updateField} />
                        <SelectField label="Verification status" name="verificationStatus" value={form.verificationStatus} options={verificationStatusOptions} onChange={updateSelectField} />
                        <TextField label="Seller ID" name="sellerId" value={form.sellerId} onChange={updateField} />
                        <TextField label="Investor ID" name="investorId" value={form.investorId} onChange={updateField} />
                        <label className="import-field import-field-wide" htmlFor="importToken">
                            <span>Bearer token</span>
                            <input
                                id="importToken"
                                type="password"
                                value={token}
                                onChange={event => setToken(event.target.value)}
                                autoComplete="new-password"
                                autoCapitalize="off"
                                spellCheck={false}
                                required
                            />
                        </label>
                    </div>
                </fieldset>

                <footer className="client-import-actions">
                    {feedback && <p className={`client-import-feedback ${feedback.type}`} role="status">{feedback.message}</p>}
                    <button className="client-import-submit" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Sending...' : 'Send import'}
                    </button>
                </footer>
            </form>
            {hasImportResponse && (
                <section className="client-import-response" aria-label="Import API response">
                    <h2>Imported client</h2>
                    <ImportResponseSummary response={importResponse} />
                </section>
            )}
        </section>
    );
};