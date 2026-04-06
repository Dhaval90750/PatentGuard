import React from 'react';
import { Box, Typography } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, bgcolor: '#fee2e2', color: '#ef4444', minHeight: '100vh' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>Component Render Crash 💥</Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>{this.state.error?.toString()}</Typography>
          <pre style={{ mt: 2, overflow: 'auto' }}>{this.state.errorInfo?.componentStack}</pre>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
