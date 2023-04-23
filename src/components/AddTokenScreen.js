import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useLocalState } from '../utils';
import { GitApis } from '../github';
import Spinner from './Spinner';

const theme = createTheme();

export default function AddTokenScreen({ setUser, user }) {
  const [token, setToken] = useLocalState('githubToken');
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    if (token) {
      GitApis.validateToken(token)
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          setToken('');
          setError(true);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setToken(data.get('token'));
  };

  if (!!token && !user) {
    return <Spinner open={true} close={() => {}} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Add Github Personal Access Token
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="token"
              label="Token"
              name="token"
              autoComplete="token"
              type="password"
              autoFocus
              helperText={error ? 'Invalid Or Expired Token' : ''}
              error={error}
            />
            <Grid container>
              <Grid item xs>
                <Link
                  target="_blank"
                  href="https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/How-to-create-a-GitHub-Personal-Access-Token-example"
                  variant="body2"
                >
                  Generate Github Personal Access Token
                </Link>
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Add Token
            </Button>
          </Box>
        </Box>
        {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
      </Container>
    </ThemeProvider>
  );
}
