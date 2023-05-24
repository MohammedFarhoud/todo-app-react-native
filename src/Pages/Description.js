import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Card from '../components/Card'
import { styles } from "../styles";

const Description = ({ route, navigation }) => {
    const { title, description } = route.params;

  return (
    <View>
        <Card style={styles.card}>
            <Text style={styles.todoTitle}>{title}</Text>
            <Text>Description: {description}</Text>
            <TouchableOpacity onPress={() => {navigation.goBack()}} style={styles.descBtn}>
                <Text style={styles.text}>Go Home</Text>
            </TouchableOpacity>
        </Card>
    </View>
  );
};

export default Description;