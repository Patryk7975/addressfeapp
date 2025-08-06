import type { ClientData } from "../models/ClientData";
import { CreateClient } from "../services/Api";


interface AddClientButtonProps {
  addClientToState: (newClient: ClientData) => void;
}

export const AddClientButton = ({ addClientToState }: AddClientButtonProps) => {

    const handleAddClient = async () => {
        const newClient = await CreateClient();
        console.log(newClient);

        if (newClient)
            addClientToState(newClient)
    }

    return (
    <>
        <button onClick={handleAddClient}>
        Add Client
        </button>
    </>
    );
};