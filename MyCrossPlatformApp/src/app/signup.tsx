import React, { useRef, useState } from 'react';
import { supabase } from './supabaseClient';
import { useRouter } from 'expo-router';
import { useAuth } from '../app/authStore';
import {
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
  SafeAreaView,
  Alert,
  Keyboard,
} from 'react-native';

export default function SignUpScreen(): React.JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirmError, setConfirmError] = useState<string>('');
  const [cooldownUntil, setCooldownUntil] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const requestLockRef = useRef(false);
  const router = useRouter();
  const authUser = useAuth();

  const getDisplayNameFromEmail = (value: string): string => {
    const localPart = value.split('@')[0] ?? value;
    const firstPart = localPart.split(/[._-]/)[0] ?? localPart;
    return firstPart.charAt(0).toUpperCase() + firstPart.slice(1);
  };

  const handlePasswordChange = (text: string): void => {
    setPassword(text);
    if (confirmPassword && text !== confirmPassword) {
      setConfirmError('Passwords do not match');
    } else {
      setConfirmError('');
    }
  };

  const handleConfirmPasswordChange = (text: string): void => {
    setConfirmPassword(text);
    if (password && text !== password) {
      setConfirmError('Passwords do not match');
    } else {
      setConfirmError('');
    }
  };

  const handleSignUp = async (): Promise<void> => {
    Keyboard.dismiss();

    if (requestLockRef.current || isLoading) {
      return;
    }

    if (Date.now() < cooldownUntil) {
      setStatusMessage('Too many sign-up attempts. Please wait a minute and try again.');
      return;
    }

    if (!email.trim() || !password || !confirmPassword) {
      setStatusMessage('Please fill in all fields.');
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setConfirmError('Passwords do not match');
      setStatusMessage('Passwords do not match.');
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setStatusMessage('Password must be at least 6 characters.');
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setStatusMessage('Creating account...');
    setIsLoading(true);
    requestLockRef.current = true;

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        const isRateLimit = error.status === 429 || error.message?.toLowerCase().includes('rate') || error.message?.toLowerCase().includes('too many');
        const message = isRateLimit
          ? 'Too many sign-up attempts. Please wait a minute and try again.'
          : error.message || 'Unable to create your account right now.';

        if (isRateLimit) {
          setCooldownUntil(Date.now() + 60000);
        }
        setStatusMessage(message);
        Alert.alert('Sign up failed', message);
        return;
      }

      if (data.session) {
        setStatusMessage('Signed up successfully.');
        router.replace('/');
      } else {
        router.replace({
          pathname: '/',
          params: {
            pendingEmail: email.trim().toLowerCase(),
            pendingName: getDisplayNameFromEmail(email.trim().toLowerCase()),
          },
        });
        Alert.alert('Check your email', 'Please confirm your email address to complete sign-up.');
      }
    } catch (err) {
      setStatusMessage('Something went wrong while creating your account.');
      Alert.alert('Sign up failed', 'Something went wrong while creating your account.');
    } finally {
      setIsLoading(false);
      requestLockRef.current = false;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Create an Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={(text: string) => setEmail(text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={handlePasswordChange}
          secureTextEntry
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#888"
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
          secureTextEntry
          autoCapitalize="none"
        />
        {confirmError ? <Text style={styles.errorText}>{confirmError}</Text> : null}
        {statusMessage ? <Text style={styles.statusText}>{statusMessage}</Text> : null}
        <Pressable style={styles.button} onPress={handleSignUp} disabled={isLoading || Date.now() < cooldownUntil}>
          <Text style={styles.buttonText}>{isLoading ? 'Creating account...' : Date.now() < cooldownUntil ? 'Please wait...' : 'Sign Up'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#d57e57',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: '#b42318',
    fontSize: 14,
    marginBottom: 12,
  },
  statusText: {
    color: '#b45309',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
});
