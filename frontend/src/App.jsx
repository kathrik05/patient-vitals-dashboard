import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import PatientAccordion from './components/PatientAccordion';
import SearchBar from './components/SearchBar';
import AddPatientModal from './components/AddPatientModal';
import PatientHistoryModal from './components/PatientHistoryModal';
import AddVitalsModal from './components/AddVitalsModal';
import './index.css';

function App() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [error, setError] = useState(null);

  // Modal States
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isAddVitalsModalOpen, setIsAddVitalsModalOpen] = useState(false);

  // Selection State
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Initial Fetch - Runs ONCE on mount
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoadingPatients(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/patients');
      if (!response.ok) throw new Error('Failed to fetch patients');
      const data = await response.json();
      setPatients(data);
      setFilteredPatients(data);
    } catch (err) {
      setError("Failed to load data. Is the backend running?");
      console.error(err);
    } finally {
      setLoadingPatients(false);
    }
  };

  const handleSearch = (query) => {
    if (!query) {
      setFilteredPatients(patients);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = patients.filter(p => p.name.toLowerCase().includes(lowerQuery));
    setFilteredPatients(filtered);
  };

  const handlePatientAdded = (newPatient) => {
    // Add to top of list
    const updatedList = [newPatient, ...patients];
    setPatients(updatedList);
    setFilteredPatients(updatedList);
  };

  const handleUpdateVitalsClick = (patient) => {
    setSelectedPatient(patient);
    setIsAddVitalsModalOpen(true);
  };

  const handleVitalsAdded = (newVital) => {
    // Update local state to reflect new vital immediately
    // We map through the existing list and update the target patient's 'latestVital' property
    const updateList = (list) => list.map(p =>
      p._id === selectedPatient._id ? { ...p, latestVital: newVital } : p
    );

    const updatedPatients = updateList(patients);
    setPatients(updatedPatients);
    setFilteredPatients(updatedPatients); // Ensure filtered list updates too
    setIsAddVitalsModalOpen(false);
  };

  const handleViewHistory = async (patientId) => {
    // 1. Find the patient object to pass to the modal
    const patient = patients.find(p => p._id === patientId);
    if (!patient) return;

    setSelectedPatient(patient);
    setHistory([]); // Clear previous history
    setLoadingHistory(true);
    setIsHistoryModalOpen(true);

    try {
      const response = await fetch(`http://localhost:5000/api/vitals/history/${patientId}`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      } else {
        console.error("Failed to fetch history status:", response.status);
      }
    } catch (err) {
      console.error("Failed history fetch:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <Layout>
      <header>
        <div className="header-content">
          <h1>Patients</h1>
          <div className="header-actions">
            <SearchBar onSearch={handleSearch} />
            <button className="add-patient-btn" onClick={() => setIsAddPatientModalOpen(true)}>
              + Add New
            </button>
          </div>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <div className="patient-list">
        {loadingPatients ? (
          <div className="loading-spinner">Loading patients...</div>
        ) : filteredPatients.length > 0 ? (
          filteredPatients.map(patient => (
            <PatientAccordion
              key={patient._id}
              patient={patient}
              onUpdateVitals={handleUpdateVitalsClick}
              onViewHistory={() => handleViewHistory(patient._id)}
            />
          ))
        ) : (
          <div className="no-results">No patients found.</div>
        )}
      </div>

      {/* Modals */}
      <AddPatientModal
        isOpen={isAddPatientModalOpen}
        onClose={() => setIsAddPatientModalOpen(false)}
        onPatientAdded={handlePatientAdded}
      />

      <AddVitalsModal
        isOpen={isAddVitalsModalOpen}
        onClose={() => setIsAddVitalsModalOpen(false)}
        patientId={selectedPatient?._id}
        onVitalsAdded={handleVitalsAdded}
      />

      <PatientHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        patient={selectedPatient}
        history={history}
        loading={loadingHistory}
      />
    </Layout>
  );
}

export default App;
