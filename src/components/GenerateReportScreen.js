import { Box, Button, Container, TextField } from '@mui/material';
import React, { useMemo } from 'react';
import { useLocalState } from '../utils';
import SearchDropDown from './SearchDropDown';
import Github from '../github/Github';

const durations = Array.from({ length: 12 }, (v, i) => {
  const date = new Date(new Date().setDate(new Date().getDate() - i)).toISOString().split('T')[0];
  const label = i === 0 ? 'Today' : i === 1 ? 'Yesterday' : date;
  return {
    label,
    date,
  };
});

const GenerateReportScreen = ({ user }) => {
  const [token] = useLocalState('githubToken');
  const git = useMemo(() => {
    return new Github({ token });
  }, [token]);

  const [organizations, setOrganizations] = React.useState([]);
  const [selectedOrg, setSelectedOrg] = useLocalState('selectedOrg');
  const [repos, setRepos] = React.useState([]);
  const [selectedRepo, setSelectedRepo] = useLocalState('selectedRepo');
  const [selectedDuration, setSelectedDuration] = useLocalState('selectedDuration', durations[0]);
  const [report, setReport] = React.useState('');

  React.useEffect(() => {
    if (git) {
      git.getOrgs().then((response) => {
        const withLabel = response.data.map((org) => ({ label: org.login }));
        setOrganizations(withLabel);
        setSelectedOrg(withLabel[0]);
      });
    }
  }, [git, setSelectedOrg]);

  React.useEffect(() => {
    if (selectedOrg) {
      git.getRepos({ organization: selectedOrg.label }).then((response) => {
        const withLabel = response.data.map((repo) => ({ label: repo.name }));
        setRepos(withLabel);
        setSelectedRepo(withLabel[0]);
      });
    }
  }, [selectedOrg, git, setSelectedRepo]);

  const generateReport = () => {
    const since = new Date(selectedDuration.date).toISOString();
    git
      .generateDailyReport({
        organization: selectedOrg.label,
        repo: selectedRepo.label,
        author: user.login,
        since,
        until: new Date(new Date(since).setDate(new Date(since).getDate() + 1)).toISOString(),
      })
      .then(setReport);
  };

  return (
    <Container
      style={{
        display: 'flex',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
      }}
    >
      <Box>
        <h1>Hello {user?.login}</h1>
      </Box>
      <Box display="flex" flexDirection="row">
        <SearchDropDown
          label="Organisations"
          value={selectedOrg}
          onChange={(event, newValue) => {
            setSelectedOrg(newValue);
          }}
          options={organizations}
        />
        <SearchDropDown
          label="Reposetries"
          value={selectedRepo}
          onChange={(event, newValue) => {
            setSelectedRepo(newValue);
          }}
          options={repos}
        />
        <SearchDropDown
          label="Duration"
          value={selectedDuration}
          onChange={(event, newValue) => {
            setSelectedDuration(newValue);
          }}
          options={durations}
        />
      </Box>
      <Button variant="contained" onClick={generateReport} style={{ marginTop: 20 }}>
        Generate Report
      </Button>
      <TextField
        id="outlined-multiline-static"
        label="Report"
        value={report}
        multiline
        rows={4}
        style={{ marginTop: 100, width: 300 }}
      />
    </Container>
  );
};

export default GenerateReportScreen;
