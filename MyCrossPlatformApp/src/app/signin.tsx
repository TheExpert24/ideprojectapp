import React, { useRef, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Pressable, StyleSheet, Alert, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from './supabaseClient';

export default function SignInScreen(): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const requestLockRef = useRef(false);
  const router = useRouter();

  const handleSignIn = async (): Promise<void> => {
    Keyboard.dismiss();

    if (requestLockRef.current || isLoading) {
      return;
    }

    if (Date.now() < cooldownUntil) {
      setStatusMessage('Too many sign-in attempts. Please wait a minute and try again.');
      return;
    }

    if (!email.trim() || !password) {
      setStatusMessage('Please enter your email and password.');
      Alert.alert('Error', 'Please enter your email and password.');
      return;
    }

    setIsLoading(true);
    requestLockRef.current = true;
    setStatusMessage('Signing in...');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        const isRateLimit = error.status === 429 || (typeof error.message === 'string' && /rate|too many/i.test(error.message));
        if (isRateLimit) {
          setCooldownUntil(Date.now() + 60000);
        }
        setStatusMessage(error.message || 'Unable to sign in.');
        Alert.alert('Sign in failed', error.message || 'Unable to sign in.');
        return;
      }

      if (data.session) {
        setStatusMessage('Signed in successfully.');
        router.replace('/main');
      } else {
        setStatusMessage('No session returned. Please try again.');
      }
    } catch (err) {
      setStatusMessage('Something went wrong while signing in.');
      Alert.alert('Sign in failed', 'Something went wrong while signing in.');
    } finally {
      setIsLoading(false);
      requestLockRef.current = false;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Sign In</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        {statusMessage ? <Text style={styles.statusText}>{statusMessage}</Text> : null}

        <Pressable style={styles.button} onPress={handleSignIn} disabled={isLoading || Date.now() < cooldownUntil}>
          <Text style={styles.buttonText}>{isLoading ? 'Signing in...' : Date.now() < cooldownUntil ? 'Please wait...' : 'Sign In'}</Text>
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
  statusText: {
    color: '#b45309',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
});
