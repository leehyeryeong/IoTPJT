import requests
from sense_hat import SenseHat
import time
from datetime import datetime

DATABASE_URL = "https://commonpjt-fd9ed-default-rtdb.asia-southeast1.firebasedatabase.app/"
USER_NAME = "이혜령"

sense = SenseHat()

def update_sensehat_for_user(name, sensehat_data):
    url = DATABASE_URL + f"{name}/sensehat.json"
    response = requests.put(url, json=sensehat_data)
    if response.status_code == 200:
        print(f"{name} 센서 데이터 업데이트 성공")
    else:
        print(f"{name} 센서 데이터 업데이트 실패:", response.status_code, response.text)

def main():
    while True:
        print(f"{USER_NAME} 센서 데이터 측정 중...")

        accel = sense.get_accelerometer_raw()
        gyro = sense.get_gyroscope_raw()

        sensehat_data = {
            'accel': {
                'x': round(accel['x'], 4),
                'y': round(accel['y'], 4),
                'z': round(accel['z'], 4),
            },
            'gyro': {
                'x': round(gyro['x'], 4),
                'y': round(gyro['y'], 4),
                'z': round(gyro['z'], 4),
            },
            'humidity': round(sense.get_humidity(), 1),
            'pressure': round(sense.get_pressure(), 1),
            'temperature': round(sense.get_temperature(), 1),
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }

        update_sensehat_for_user(USER_NAME, sensehat_data)

        time.sleep(5)  # 5초마다 반복

if __name__ == "__main__":
    main()
