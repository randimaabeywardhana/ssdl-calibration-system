import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  FormControlLabel,
  Checkbox,
  IconButton,
  InputAdornment,
  Link,
  CircularProgress,
  Fade,
  Divider,
  Stack,
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock, 
  ArrowForward 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (userInput === 'admin@ssdl.lk' && password === 'admin123')
        navigate('/admin');
      else if (userInput === 'staff@ssdl.lk' && password === 'staff123')
        navigate('/staff');
      else if (userInput === 'client@ssdl.lk' && password === 'client123')
        navigate('/client');
      else setError('Invalid email or password. Please try again.');
      
      setLoading(false);
    }, 1500);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #0a0f1c 0%, #1a2338 100%)',
    }}>
      {/* LEFT SIDE - Enhanced Visual */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e2937 50%, #334155 100%)',
          overflow: 'hidden',
          p: 8,
        }}
      >
        {/* Animated Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: 420,
            height: 420,
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'pulse 15s infinite ease-in-out',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            right: '5%',
            width: 320,
            height: 320,
            background: 'radial-gradient(circle, rgba(147, 197, 253, 0.12) 0%, transparent 65%)',
            filter: 'blur(70px)',
            animation: 'pulse 18s infinite ease-in-out reverse',
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 460 }}>
          <img
            src="/src/assets/ssdl-logo.png"
            alt="SSDL Logo"
            style={{ 
              height: 118, 
              marginBottom: 32,
              filter: 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.4))' 
            }}
          />

          <Typography
            variant="h3"
            fontWeight={700}
            sx={{
              color: '#f8fafc',
              mb: 2.5,
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
            }}
          >
            SSDL Calibration<br />Management System
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: '#94a3b8',
              lineHeight: 1.6,
              fontWeight: 400,
              maxWidth: 380,
              mx: 'auto',
            }}
          >
            Sri Lanka Atomic Energy Board<br /><br />
            
          </Typography>
        </Box>

        {/* Trust Indicators */}
        <Stack 
          direction="row" 
          spacing={4} 
          sx={{ mt: 8, opacity: 0.75 }}
        >
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            ISO 17025 Accredited
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            IAEA Compliant
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Secure Platform
          </Typography>
        </Stack>
      </Box>

      {/* RIGHT SIDE - Premium Login Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 4 },
          background: '#0a0f1c',
        }}
      >
        <Container maxWidth="sm">
          <Fade in timeout={900}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, sm: 7 },
                borderRadius: 5,
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(148, 163, 184, 0.15)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Subtle top glow */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                  opacity: 0.6,
                }}
              />

              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ color: '#f1f5f9', mb: 1.5, letterSpacing: '-0.02em' }}
                >
                  Welcome Back
                </Typography>
                <Typography variant="body1" sx={{ color: '#94a3b8' }}>
                  Access your secure calibration dashboard
                </Typography>
              </Box>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ mb: 4, borderRadius: 3 }}
                  variant="filled"
                >
                  {error}
                </Alert>
              )}

              <form onSubmit={handleLogin}>
                <Stack spacing={3.5}>
                  {/* Email Field */}
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#e2e8f0',
                        mb: 1.2,
                      }}
                    >
                      Email Address
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="admin@ssdl.lk"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: '#64748b' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          backgroundColor: 'rgba(30, 41, 59, 0.8)',
                          '& fieldset': { borderColor: '#475569' },
                          '&:hover fieldset': { borderColor: '#64748b' },
                          '&.Mui-focused fieldset': { 
                            borderColor: '#3b82f6',
                            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.15)'
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: '#f1f5f9',
                          py: 2.1,
                        },
                      }}
                    />
                  </Box>

                  {/* Password Field */}
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#e2e8f0',
                        mb: 1.2,
                      }}
                    >
                      Password
                    </Typography>
                    <TextField
                      fullWidth
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: '#64748b' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{ color: '#94a3b8' }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          backgroundColor: 'rgba(30, 41, 59, 0.8)',
                          '& fieldset': { borderColor: '#475569' },
                          '&:hover fieldset': { borderColor: '#64748b' },
                          '&.Mui-focused fieldset': { 
                            borderColor: '#3b82f6',
                            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.15)'
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: '#f1f5f9',
                          py: 2.1,
                        },
                      }}
                    />
                  </Box>

                  {/* Options Row */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          sx={{
                            color: '#64748b',
                            '&.Mui-checked': { color: '#60a5fa' },
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                          Remember Me
                        </Typography>
                      }
                    />

                    <Link
                      href="#"
                      underline="hover"
                      sx={{ 
                        color: '#60a5fa', 
                        fontWeight: 500, 
                        fontSize: '0.9rem' 
                      }}
                    >
                      Forgot Password?
                    </Link>
                  </Box>

                  {/* Sign In Button */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    endIcon={!loading && <ArrowForward />}
                    sx={{
                      py: 2.1,
                      borderRadius: 3,
                      fontSize: '1.08rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      background: 'linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #1e40af 0%, #1e3a8a 100%)',
                        transform: 'translateY(-1px)',
                      },
                      boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.45)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CircularProgress size={24} thickness={5} sx={{ color: 'white' }} />
                        Authenticating...
                      </Box>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </Stack>
              </form>

              <Divider sx={{ my: 5, borderColor: 'rgba(148, 163, 184, 0.1)' }} />

              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: '0.875rem', color: '#64748b' }}>
                  Need access?{' '}
                  <Link
                    href="tel:+94718484343"
                    sx={{ 
                      color: '#60a5fa', 
                      fontWeight: 600,
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Contact Administrator
                  </Link>
                </Typography>
              </Box>
            </Paper>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
};

export default LoginPage;