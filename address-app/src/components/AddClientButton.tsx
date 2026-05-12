import { useState } from "react";
import type { ClientData } from "../models/ClientData";
import { CreateClient } from "../services/Api";

interface AddClientButtonProps {
  addClientToState: (newClient: ClientData) => void;
}

export const AddClientButton = ({ addClientToState }: AddClientButtonProps) => {
  const [showForm, setShowForm] = useState(false);
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');

  const handleSave = async () => {
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    if (!trimmedFirstName || !trimmedLastName) {
      return;
    }

    const newClient = await CreateClient(trimmedFirstName, trimmedLastName);
    console.log(newClient);

    if (newClient) {
      addClientToState(newClient);
      setFirstName('John');
      setLastName('Doe');
      setShowForm(false);
    }
  };

  const handleCancel = () => {
    setFirstName('John');
    setLastName('Doe');
    setShowForm(false);
  };

  return (
    <>
      {showForm ? (
        <div className="add-client-form">
          <div className="add-client-row">
            <div className="textbox add-client-field">
              <label>
                Name
                <input
                  type="text"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                />
              </label>
            </div>
            <div className="textbox add-client-field">
              <label>
                Surname
                <input
                  type="text"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                />
              </label>
            </div>
          </div>
          <div className="add-client-actions">
            <button type="button" onClick={handleSave}>
              Save
            </button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setShowForm(true)}>
          Add Client
        </button>
      )}
    </>
  );
};