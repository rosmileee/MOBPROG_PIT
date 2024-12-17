import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Keyboard } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'expo-router';
import supabase from "@/components/supabaseClient.js";

export default function Index() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [focusedField, setFocusedField] = useState(''); 
  // Refs for TextInput components
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // Form validation schema
  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const handleRegistration = async (values) => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Step 1: Sign up the user
      const { user, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setErrorMessage(error.message); 
        console.error('Error during registration:', error.message);
        return;
      }

      // Step 2: Insert user details into the database
      const { data, error: insertError } = await supabase
        .from('users') //TABLE NAMES
        .insert([{ username: values.username, email: values.email }]);

      if (insertError) {
        setErrorMessage(insertError.message); 
        console.error('Error inserting user data:', insertError.message);
      } else {
        setSuccessMessage('Registration successful!'); 
        console.log('User registered successfully:', data);
        
      }
    } catch (error) {
      setErrorMessage('Unexpected error: ' + error.message); 
      console.error('Unexpected error:', error.message);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Formik
      initialValues={{ username: '', email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleRegistration}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Register</Text>

          {/* Username Input */}
          <TextInput
            style={[styles.input, focusedField === 'username' && styles.inputFocused]} 
            placeholder="Username"
            value={values.username}
            onChangeText={handleChange('username')}
            onBlur={handleBlur('username')}
            onFocus={() => setFocusedField('username')} 
            onSubmitEditing={() => emailRef.current.focus()} 
          />
          {errors.username && touched.username && <Text style={styles.errorText}>{errors.username}</Text>}

          {/* Email Input */}
          <TextInput
            ref={emailRef}
            style={[styles.input, focusedField === 'email' && styles.inputFocused]} 
            placeholder="Email"
            value={values.email}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            onFocus={() => setFocusedField('email')} 
            onSubmitEditing={() => passwordRef.current.focus()} 
          />
          {errors.email && touched.email && <Text style={styles.errorText}>{errors.email}</Text>}

          {/* Password Input */}
          <View style={styles.passwordContainer}>
            <TextInput
              ref={passwordRef}
              style={[styles.input, focusedField === 'password' && styles.inputFocused]} 
              placeholder="Password"
              secureTextEntry={!passwordVisible} 
              value={values.password} 
              onChangeText={handleChange('password')} 
              onBlur={handleBlur('password')} 
              onFocus={() => setFocusedField('password')} 
              onSubmitEditing={handleSubmit} 
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <FontAwesome style={styles.eyeButton} name={passwordVisible ? "eye-slash" : "eye"} size={20} color="gray" />
            </TouchableOpacity>
          </View>
          {errors.password && touched.password && <Text style={styles.errorText}>{errors.password}</Text>}

          {/* Error and Success Messages */}
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

          {/* Loading Indicator */}
          {loading && <ActivityIndicator size="large" color="#635BFF" />}

          {/* Submit Button */}
          <TouchableOpacity onPress={handleSubmit} style={styles.signInButton} disabled={loading}>
            <Text style={styles.signInButtonText}>{loading ? 'Registering...' : 'REGISTER'}</Text>
          </TouchableOpacity>

          {/* Create Account */}
          <View style={styles.accountOptions}>
            <Text>Already have an account? </Text>
            <TouchableOpacity>
              <Link style={styles.createAccount} href={"/(tabs)"}>Login</Link>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 50,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 5,
    width: '100%',
  },
  inputFocused: {
    borderColor: '#635BFF', 
    borderWidth: 1.5, 
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 5,
  },
  signInButton: {
    backgroundColor: '#635BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  signInButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  accountOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  createAccount: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
});
