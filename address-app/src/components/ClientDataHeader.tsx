import styled from "styled-components";
import type { ClientData } from "../models/ClientData"


const ClientBasicDataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ClientBasicDataHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border);
  padding-bottom: var(--space-md);
  margin-bottom: var(--space-sm);

  & h3 {
    margin: 0;
    font-size: 1.1rem;
    color: var(--text-main);
 } 
`;

export const ClientDataHeader = ({ client }: { client: ClientData }) => {
    return (
        <ClientBasicDataWrapper>
            <ClientBasicDataHeader>
                <h3 style={{ margin: 0 }}>{client.name}</h3>
            </ClientBasicDataHeader>
            <p style={{ margin: "4px 0 0" }}>ID: {client.id}</p>
        </ClientBasicDataWrapper>)
}





