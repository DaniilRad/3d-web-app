import { useEffect } from 'react';
import mqtt from 'mqtt';

const MQTTClient = () => {
  useEffect(() => {
    const client = mqtt.connect('mqtt://localhost:1883'); // Replace with actual MQTT broker URL

    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      client.subscribe('openlab/models');
    });

    client.on('message', (topic, message) => {
      console.log(`Message received on ${topic}: ${message.toString()}`);
    });

    // Cleanup function
    return () => {
      console.log('Disconnecting from MQTT broker');
      client.end(); // Properly end the MQTT connection
    };
  }, []);

  return <div>MQTT Client Active</div>;
};

export default MQTTClient;
