import { useState } from 'react'
import './App.css'
import { Filtering } from './components/Filtering';
import { Consents } from './components/consents/Consents';
import { Patrimoniale } from './components/patrimoniale/Patrimoniale';
import { ContactData } from './components/contact-data/ContactData';

function App() {
  const [activeTab, setActiveTab] = useState<'contactData' | 'filtering' | 'consents' | 'patrimoniale'>('contactData');

  return (
    <>
      <div className={`main-container ${activeTab === 'filtering' ? 'single-column' : ''}`}>
        <div className="client-container">
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

          {activeTab === 'contactData' ? (
            <>
              <ContactData/>
            </>
          ) : activeTab === 'filtering' ? (
            <Filtering />
          ) : activeTab === 'consents' ? (
            <Consents />
          ) : (
            <Patrimoniale/>
          )     
        }
        </div>
      </div>
    </>
  )
}

export default App
