import { useState } from 'react'
import './App.css'
import { Filtering } from './components/Filtering';
import { Consents } from './components/consents/Consents';
import { Patrimoniale } from './components/patrimoniale/Patrimoniale';
import { ContactData } from './components/contact-data/ContactData';
import styled from 'styled-components';

const MainContainer = styled.div`
  margin: 0 auto;
  padding: var(--space-xl);
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
`;

const TabContentContainer = styled.div`
  margin-left: 10px
`;

function App() {
  const [activeTab, setActiveTab] = useState<'contactData' | 'filtering' | 'consents' | 'patrimoniale'>('contactData');

  return (
    <>
      <MainContainer>
        <MenuContainer>
          <div className="main-nav-tabs">
            <button
              className={`nav-tab-button ${activeTab === 'contactData' ? 'active' : ''}`}
              onClick={() => setActiveTab('contactData')}
            >
              Contact data
            </button>
            <button
              className={`nav-tab-button ${activeTab === 'filtering' ? 'active' : ''}`}
              onClick={() => setActiveTab('filtering')}
            >
              Filtering
            </button>
            <button
              className={`nav-tab-button ${activeTab === 'consents' ? 'active' : ''}`}
              onClick={() => setActiveTab('consents')}
            >
              Consents
            </button>
            <button
              className={`nav-tab-button ${activeTab === 'patrimoniale' ? 'active' : ''}`}
              onClick={() => setActiveTab('patrimoniale')}
            >
              Patrimoniale
            </button>
          </div>
        </MenuContainer>
        <TabContentContainer>
          {activeTab === 'contactData' ? (
            <ContactData />
          ) : activeTab === 'filtering' ? (
            <Filtering />
          ) : activeTab === 'consents' ? (
            <Consents />
          ) : (
            <Patrimoniale />
          )
          }
        </TabContentContainer>
      </MainContainer>
    </>
  )
}

export default App
