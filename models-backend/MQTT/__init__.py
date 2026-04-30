from flask import Flask
from flask_mqtt import Mqtt
from Configurations import get_config, MQTT_TOPIC, MQTT_TOPIC2
import json
import random
import os
from models.MQTTModels import NPKMessage, EnvironmentalMessage
from threading import Lock
from datetime import datetime, timezone

mqtt = Mqtt()
MOCK_FILE = ".sensor_mock.json"

def get_mocked_npk():
    if not os.path.exists(MOCK_FILE):
        return {"nitrogen": 40, "phosphorus": 30, "potassium": 25, "moisture": 60}
    
    try:
        with open(MOCK_FILE, "r") as f:
            base = json.load(f)
        
        # Add fluctuation (-1 to +1 as requested "1 or 2 time to time")
        # I'll use -1, 0, 1 for subtlety
        base["nitrogen"] = max(0, min(100, base["nitrogen"] + random.randint(-1, 1)))
        base["phosphorus"] = max(0, min(100, base["phosphorus"] + random.randint(-1, 1)))
        base["potassium"] = max(0, min(100, base["potassium"] + random.randint(-1, 1)))
        base["moisture"] = max(0, min(100, base["moisture"] + random.randint(-1, 1)))

        with open(MOCK_FILE, "w") as f:
            json.dump(base, f, indent=2)
            
        return base
    except Exception:
        return {"nitrogen": 40, "phosphorus": 30, "potassium": 25, "moisture": 60}

# in-memory storage (latest message per topic)
_latest_by_topic = {
    MQTT_TOPIC: None,
    MQTT_TOPIC2: None,
}
_lock = Lock()

def get_latest(topic: str):
    with _lock:
        return _latest_by_topic.get(topic)

@mqtt.on_connect()
def handle_connect(client, userdata, flags, rc):
    mqtt.subscribe(MQTT_TOPIC)
    mqtt.subscribe(MQTT_TOPIC2)
    print("MQTT connected and subscribed to topics.")

@mqtt.on_message()
def handle_mqtt_message(client, userdata, message):
    topic = message.topic
    payload = message.payload.decode(errors="ignore")

    try:
        if topic == MQTT_TOPIC:
            data = NPKMessage.model_validate_json(payload)
            # If sensor sends all zeros, use mock values
            if data.nitrogen == 0 and data.phosphorus == 0 and data.potassium == 0 and data.moisture == 0:
                mocked = get_mocked_npk()
                data.nitrogen = mocked["nitrogen"]
                data.phosphorus = mocked["phosphorus"]
                data.potassium = mocked["potassium"]
                data.moisture = mocked["moisture"]
        elif topic == MQTT_TOPIC2:
            data = EnvironmentalMessage.model_validate_json(payload)
        else:
            return

        # store latest (include server receive time)
        item = {
            "topic": topic,
            "received_at": datetime.now(timezone.utc).isoformat(),
            "data": data.model_dump(exclude_none=True),
            "raw": payload,
        }

        with _lock:
            if topic in _latest_by_topic:
                _latest_by_topic[topic] = item

        print(f"Received [{topic}]: {data.model_dump(exclude_none=True)}")

    except Exception as e:
        print(f"Invalid message on topic {topic}: {e}. Raw: {payload}")

def create_mqtt_app(app: Flask) -> Mqtt:
    app.config.update(get_config())
    mqtt.init_app(app)
    return mqtt
