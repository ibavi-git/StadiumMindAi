import { useState } from 'react';
import { askAI, translateText, getEmergencyResponse } from '../services/api';

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastResponse, setLastResponse] = useState(null);

  const ask = async (question, language, volunteerId, zoneContext) => {
    setLoading(true);
    setError(null);
    try {
      const response = await askAI({ question, language, volunteer_id: volunteerId, zone_context: zoneContext });
      setLastResponse(response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to get AI response');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const translate = async (text, targetLanguage, contextType) => {
    setLoading(true);
    setError(null);
    try {
      const response = await translateText({ text, target_language: targetLanguage, context_type: contextType });
      setLastResponse(response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to translate');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const emergency = async (emergencyType, zoneId, description, severity) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getEmergencyResponse({ emergency_type: emergencyType, zone_id: zoneId, description, severity });
      setLastResponse(response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to get emergency response');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, ask, translate, emergency, lastResponse };
}
