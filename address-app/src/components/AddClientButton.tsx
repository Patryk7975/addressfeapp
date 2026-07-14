import { useState } from "react";
import type { ClientData } from "../models/ClientData";
import { CreateClient } from "../services/Api";
import { Button } from "./controls/Button";

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
            <Button color="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setShowForm(true)}>
          Add Client
        </Button>
      )}
    </>
  );
};