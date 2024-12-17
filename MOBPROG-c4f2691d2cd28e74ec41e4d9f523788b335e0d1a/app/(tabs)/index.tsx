import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link, useRouter } from 'expo-router'; 
import supabase from "@/components/supabaseClient.js";

const useLoadingState = () => {
  const [loading, setLoading] = useState(false);
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);
  return { loading, startLoading, stopLoading };
};

const useMessageState = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const clearMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };
  return { errorMessage, successMessage, setErrorMessage, setSuccessMessage, clearMessages };
};

export default function Index() {
  const router = useRouter(); 
  const { loading, startLoading, stopLoading } = useLoadingState();
  const { errorMessage, successMessage, setErrorMessage, setSuccessMessage, clearMessages } = useMessageState();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const handleLogin = async (values) => {
    startLoading();
    clearMessages();

    const { email, password } = values;
    const { user, session, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setSuccessMessage('Logged in successfully!');
      router.push('/(tabs)homepage'); 
    }

    stopLoading();
  };

  // const handleGoogleLogin = async () => {
  //   startLoading();
  //   clearMessages();

  //   const { user, session, error } = await supabase.auth.signInWithOAuth({
  //     provider: 'google',
  //   });

  //   if (error) {
  //     setErrorMessage(error.message);
  //   } else {
  //     setSuccessMessage('Logged in successfully with Google!');
  //     router.push('/(tabs)');
  //   }

  //   stopLoading();
  // };

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleLogin}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>

          <TextInput
            style={[styles.input, focusedField === 'email' && styles.inputFocused]} 
            placeholder="Email"
            value={values.email}
            onChangeText={handleChange('email')}
            onBlur={() => {
              handleBlur('email');
              setFocusedField(''); 
            }}
            onFocus={() => setFocusedField('email')} 
          />
          {errors.email && touched.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, focusedField === 'password' && styles.inputFocused]} 
              placeholder="Password"
              secureTextEntry={!passwordVisible}
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={() => {
                handleBlur('password');
                setFocusedField(''); 
              }}
              onFocus={() => setFocusedField('password')} 
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <FontAwesome style={styles.eyeButton} name={passwordVisible ? "eye-slash" : "eye"} size={20} color="gray" />
            </TouchableOpacity>
          </View>
          {errors.password && touched.password && <Text style={styles.errorText}>{errors.password}</Text>}

          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
          {successMessage && <Text style={styles.successText}>{successMessage}</Text>}

          {loading && <ActivityIndicator size="large" color="#635BFF" />}

          <TouchableOpacity onPress={handleSubmit} style={styles.signInButton} disabled={loading}>
            <Text style={styles.signInButtonText}>{loading ? 'Signing In...' : 'SIGN IN'}</Text>
          </TouchableOpacity>

          <View style={styles.accountOptions}>
            <Text>New on our platform? </Text>
            <TouchableOpacity>
              <Link style={styles.createAccount} href={"/(tabs)/register"}>Create an account</Link>
            </TouchableOpacity>
          </View>

          <Text style={styles.orText}>or</Text>

          <View style={styles.socialIcons}>
            <AntDesign name="twitter" size={30} color="blue" />
            <AntDesign name="facebook-square" size={30} color="blue" />
            {/* <TouchableOpacity onPress={handleGoogleLogin}> */}
              <AntDesign name="google" size={30} color="red" />
            {/* </TouchableOpacity> */}
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
  orText: {
    textAlign: 'center',
    marginBottom: 20,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 50,
  },
  eyeButton: {
    marginEnd: 0,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  successText: {
    color: 'green',
    fontSize: 12,
    marginBottom: 10,
  },
});
