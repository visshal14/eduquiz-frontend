
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';
import App from './App';
import theme from './theme';
import { FeedbackProvider } from './Components/ui';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <StrictMode>

  <ThemeProvider theme={theme}>
    <CssBaseline />
    <FeedbackProvider>
      <App />
    </FeedbackProvider>
  </ThemeProvider>
  // </StrictMode>

);
