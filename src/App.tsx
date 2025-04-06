import React, { useState } from 'react';
import { Calendar, AlertTriangle, Check, Pill, Search, Trash2, Plus, Package2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Medication {
  id: string;
  name: string;
  expiryDate: string;
  batchNumber: string;
  quantity: number;
}

function App() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [newMedication, setNewMedication] = useState<Omit<Medication, 'id'>>({
    name: '',
    expiryDate: '',
    batchNumber: '',
    quantity: 0
  });
  const [searchTerm, setSearchTerm] = useState('');

  const addMedication = (e: React.FormEvent) => {
    e.preventDefault();
    const medication: Medication = {
      ...newMedication,
      id: Math.random().toString(36).substr(2, 9)
    };
    setMedications([...medications, medication]);
    setNewMedication({ name: '', expiryDate: '', batchNumber: '', quantity: 0 });
  };

  const deleteMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const isExpiringSoon = (date: string) => {
    const expiryDate = new Date(date);
    const today = new Date();
    const monthsDiff = (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);
    return monthsDiff <= 3;
  };

  const filteredMedications = medications.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          <motion.div 
            className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/30 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Pill className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 text-shadow">
            Medikamenten-Verfalldatumsprüfung
          </h1>
          <p className="text-xl text-gray-600">
            Automatisierte Überwachung von Verfallsdaten
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div 
              className="glass-card rounded-2xl shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="p-6 border-b border-gray-100/20">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <h2 className="text-2xl font-semibold text-gray-800">Medikamentenliste</h2>
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Medikament oder Chargennummer suchen..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input-field pl-12 w-full sm:w-80"
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <AnimatePresence>
                  {filteredMedications.map((med) => (
                    <motion.div
                      key={med.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`glass-card card-hover rounded-xl mb-4 ${
                        isExpiringSoon(med.expiryDate) 
                          ? 'bg-red-50/80 border-red-200/50' 
                          : 'bg-emerald-50/80 border-emerald-200/50'
                      }`}
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">{med.name}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span>Verfällt am: {new Date(med.expiryDate).toLocaleDateString('de-DE')}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Package2 className="w-4 h-4" />
                                <span>Charge: {med.batchNumber}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <span className="font-medium">Menge:</span> {med.quantity} Einheiten
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 ml-4">
                            {isExpiringSoon(med.expiryDate) ? (
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="bg-red-100/80 p-2.5 rounded-xl"
                              >
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                              </motion.div>
                            ) : (
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="bg-emerald-100/80 p-2.5 rounded-xl"
                              >
                                <Check className="w-6 h-6 text-emerald-500" />
                              </motion.div>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => deleteMedication(med.id)}
                              className="bg-red-100/80 p-2.5 rounded-xl hover:bg-red-200/80"
                            >
                              <Trash2 className="w-6 h-6 text-red-500" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {filteredMedications.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <p className="text-gray-500 text-lg">Keine Medikamente gefunden</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-8"
            >
              <div className="glass-card rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-100/20">
                  <h2 className="text-2xl font-semibold text-gray-800">Neues Medikament</h2>
                </div>
                <div className="p-6">
                  <form onSubmit={addMedication} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Medikamentenname</label>
                      <input
                        type="text"
                        value={newMedication.name}
                        onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                        className="input-field"
                        placeholder="z.B. Aspirin"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Verfallsdatum</label>
                      <input
                        type="date"
                        value={newMedication.expiryDate}
                        onChange={(e) => setNewMedication({...newMedication, expiryDate: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Chargennummer</label>
                      <input
                        type="text"
                        value={newMedication.batchNumber}
                        onChange={(e) => setNewMedication({...newMedication, batchNumber: e.target.value})}
                        className="input-field"
                        placeholder="z.B. BAT123456"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Menge</label>
                      <input
                        type="number"
                        value={newMedication.quantity}
                        onChange={(e) => setNewMedication({...newMedication, quantity: parseInt(e.target.value)})}
                        className="input-field"
                        placeholder="0"
                        required
                        min="0"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Medikament hinzufügen
                    </motion.button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default App;