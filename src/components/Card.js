import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { styles } from '../styles';

const Card = ({ children }) => {
  return <SafeAreaView style={styles.card}>{children}</SafeAreaView>;
};

export default Card;