import axios from "axios";
import { auth } from "./firebase";

const API_BASE = "https://<YOUR_BACKEND_URL>"; // ngrok veya deployed url

// helper: Firebase idToken al
async function getIdToken() {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken(/* forceRefresh */ true);
}

export async function sendSurveyAndPredict(features) {
  const token = await getIdToken();
  const res = await axios.post(API_BASE + "/api/predict", features, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return res.data;
}
