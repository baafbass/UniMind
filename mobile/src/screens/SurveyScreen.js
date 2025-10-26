import React, { useState } from "react";
import { View, Button, TextInput, Text } from "react-native";
import { sendSurveyAndPredict } from "../services/api";

export default function SurveyScreen({ navigation }) {
  
  const [sleep, setSleep] = useState("");
  const [study, setStudy] = useState("");
  const [gpa, setGpa] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    
    const features = {
      sleep_hours: Number(sleep),
      study_hours: Number(study),
      gpa: Number(gpa)
    };
    
    try {
      const res = await sendSurveyAndPredict(features);
      setResult(res);
      navigation.navigate("Result", { prediction: res });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View>
      <TextInput placeholder="Sleep hours" value={sleep} onChangeText={setSleep} keyboardType="numeric" />
      <TextInput placeholder="Study hours" value={study} onChangeText={setStudy} keyboardType="numeric" />
      <TextInput placeholder="GPA" value={gpa} onChangeText={setGpa} keyboardType="numeric" />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}
