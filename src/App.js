import React, { useState } from 'react';
import { AddTokenScreen, GenerateReportScreen } from './components';

const App = () => {
  const [user, setUser] = useState(null);
  return !!user ? <GenerateReportScreen user={user} /> : <AddTokenScreen setUser={setUser} />;
};

export default App;
