import requests
import time
import random
import inquirer

class SensorDataSender:
    def __init__(self, base_url="http://192.168.1.248"):
        self.base_url = base_url
        self.endpoint = "/labhi"
        self.method = "POST"
        self.default_params = {
            'suhu': 26.7,
            'kelembaban': 80
        }
        self.custom_params = {}
        self.session = requests.Session()
        
    def send_request(self, params=None):
        url = f"{self.base_url}{self.endpoint}"
        data = params or self.default_params
        
        try:
            if self.method.upper() == "GET":
                response = self.session.get(url, params=data)
            elif self.method.upper() == "POST":
                response = self.session.post(url, data=data)
            elif self.method.upper() == "PUT":
                response = self.session.put(url, data=data)
            elif self.method.upper() == "DELETE":
                response = self.session.delete(url, params=data)
            elif self.method.upper() == "PATCH":
                response = self.session.patch(url, data=data)
            else:
                raise ValueError(f"Unsupported HTTP method: {self.method}")
                
            return {
                'success': True,
                'status_code': response.status_code,
                'response_text': response.text,
                'method': self.method,
                'url': url,
                'data_sent': data
            }
        except requests.exceptions.RequestException as e:
            return {
                'success': False,
                'error': str(e),
                'method': self.method,
                'url': url,
                'data_sent': data
            }
        except ValueError as e:
            return {
                'success': False,
                'error': str(e),
                'method': self.method,
                'url': url,
                'data_sent': data
            }
        
    def send_data(self, suhu, kelembaban):
        params = {'suhu': suhu, 'kelembaban': kelembaban}
        return self.send_request(params)
    
    def send_sample_data(self):
        return self.send_request(self.default_params)
    
    def send_random_data(self):
        params = {
            'suhu': round(random.uniform(18.0, 27.0), 1),
            'kelembaban': random.randint(40, 90)
        }
        return self.send_request(params)
    
    def send_custom_params(self):
        return self.send_request(self.custom_params)

def get_user_input():
    questions = [
        inquirer.Text('suhu', 
                     message="Masukkan suhu (°C)", 
                     validate=lambda _, x: x.replace('.', '').replace('-', '').isdigit()),
        inquirer.Text('kelembaban', 
                     message="Masukkan kelembaban (%RH)", 
                     validate=lambda _, x: x.isdigit() and 0 <= int(x) <= 100)
    ]
    answers = inquirer.prompt(questions)
    return float(answers['suhu']), int(answers['kelembaban'])

def get_http_method():
    question = [
        inquirer.List('method',
                     message="Pilih HTTP Method",
                     choices=['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
                     default='POST')
    ]
    answer = inquirer.prompt(question)
    return answer['method']

def get_custom_parameters():
    print("\n=== Setup Custom Parameters ===")
    params = {}
    
    while True:
        key_question = inquirer.Text('key', 
                                   message="Masukkan nama parameter (kosong untuk selesai)")
        key_answer = inquirer.prompt([key_question])
        key = key_answer['key'].strip()
        
        if not key:
            break
            
        value_question = inquirer.Text('value', 
                                     message=f"Masukkan nilai untuk '{key}'")
        value_answer = inquirer.prompt([value_question])
        value = value_answer['value']
        
        if value.replace('.', '').replace('-', '').isdigit():
            params[key] = float(value) if '.' in value else int(value)
        else:
            params[key] = value
    
    return params

def get_default_parameters():
    questions = [
        inquirer.Text('suhu', 
                     message="Masukkan default suhu (°C)", 
                     default="26.7",
                     validate=lambda _, x: x.replace('.', '').replace('-', '').isdigit()),
        inquirer.Text('kelembaban', 
                     message="Masukkan default kelembaban (%RH)", 
                     default="80",
                     validate=lambda _, x: x.isdigit() and 0 <= int(x) <= 100)
    ]
    answers = inquirer.prompt(questions)
    return {
        'suhu': float(answers['suhu']),
        'kelembaban': int(answers['kelembaban'])
    }
    questions = [
        inquirer.Text('suhu', 
                     message="Masukkan suhu (°C)", 
                     validate=lambda _, x: x.replace('.', '').replace('-', '').isdigit()),
        inquirer.Text('kelembaban', 
                     message="Masukkan kelembaban (%RH)", 
                     validate=lambda _, x: x.isdigit() and 0 <= int(x) <= 100)
    ]
    answers = inquirer.prompt(questions)
    return float(answers['suhu']), int(answers['kelembaban'])

def get_server_config():
    questions = [
        inquirer.Text('ip_address', 
                     message="Masukkan IP Address server", 
                     default="192.168.1.248"),
        inquirer.Text('endpoint', 
                     message="Masukkan endpoint", 
                     default="/labhi")
    ]
    answers = inquirer.prompt(questions)
    return f"http://{answers['ip_address']}", answers['endpoint']

def main():
    print("=== Sensor Data Sender ===\n")
    
    base_url, endpoint = get_server_config()
    sender = SensorDataSender(base_url=base_url)
    sender.endpoint = endpoint
    
    print(f"\nTerhubung ke: {base_url}{endpoint}")
    print(f"Method: {sender.method}")
    print(f"Default Parameters: {sender.default_params}\n")
    
    while True:
        questions = [
            inquirer.List('action',
                         message="Pilih aksi yang ingin dilakukan",
                         choices=[
                             ('Kirim data dengan input manual', 'manual'),
                             ('Kirim data default', 'default'),
                             ('Kirim data random', 'random'),
                             ('Kirim data custom parameters', 'custom'),
                             ('Monitoring berkelanjutan', 'continuous'),
                             ('--- Pengaturan ---', None),
                             ('Ganti HTTP Method', 'method'),
                             ('Ganti Default Parameters', 'default_params'),
                             ('Setup Custom Parameters', 'custom_params'),
                             ('Ganti konfigurasi server', 'config'),
                             ('--- Lainnya ---', None),
                             ('Keluar', 'exit')
                         ])
        ]
        
        answer = inquirer.prompt(questions)
        action = answer['action']
        
        if action is None:
            continue
            
        if action == 'manual':
            print("\n=== Input Data Manual ===")
            suhu, kelembaban = get_user_input()
            result = sender.send_data(suhu, kelembaban)
            print(f"Result: {result}")
            
        elif action == 'default':
            print("\n=== Kirim Data Default ===")
            result = sender.send_sample_data()
            print(f"Result: {result}")
            
        elif action == 'random':
            print("\n=== Kirim Data Random ===")
            result = sender.send_random_data()
            print(f"Result: {result}")
            
        elif action == 'custom':
            if not sender.custom_params:
                print("\n⚠️  Custom parameters belum diset. Gunakan menu 'Setup Custom Parameters' terlebih dahulu.")
            else:
                print(f"\n=== Kirim Data Custom Parameters ===")
                print(f"Parameters: {sender.custom_params}")
                result = sender.send_custom_params()
                print(f"Result: {result}")
            
        elif action == 'continuous':
            print("\n=== Setup Monitoring Berkelanjutan ===")
            
            mode_question = [
                inquirer.List('mode',
                             message="Pilih mode data untuk monitoring",
                             choices=[
                                 ('Default parameters', 'default'),
                                 ('Random data', 'random'),
                                 ('Custom parameters', 'custom')
                             ])
            ]
            mode_answer = inquirer.prompt(mode_question)
            mode = mode_answer['mode']
            
            if mode == 'custom' and not sender.custom_params:
                print("⚠️  Custom parameters belum diset. Menggunakan default parameters.")
                mode = 'default'
            
            interval_q = inquirer.Text('interval', 
                                     message="Interval pengiriman (detik)", 
                                     default="5",
                                     validate=lambda _, x: x.isdigit())
            duration_q = inquirer.Text('duration', 
                                     message="Durasi monitoring (detik)", 
                                     default="60",
                                     validate=lambda _, x: x.isdigit())
            
            monitoring_config = inquirer.prompt([interval_q, duration_q])
            interval = int(monitoring_config['interval'])
            duration = int(monitoring_config['duration'])
            
            print(f"\nMemulai monitoring selama {duration} detik dengan interval {interval} detik...")
            print(f"Mode: {mode}")
            
            end_time = time.time() + duration
            results = []
            
            while time.time() < end_time:
                if mode == 'random':
                    result = sender.send_random_data()
                elif mode == 'custom':
                    result = sender.send_custom_params()
                else:
                    result = sender.send_sample_data()
                
                results.append(result)
                
                if result['success']:
                    print(f"✓ Data sent: {result['data_sent']} - Status: {result['status_code']}")
                else:
                    print(f"✗ Failed to send: {result['data_sent']} - Error: {result['error']}")
                
                time.sleep(interval)
            
        elif action == 'method':
            print(f"\n=== Ganti HTTP Method (saat ini: {sender.method}) ===")
            new_method = get_http_method()
            sender.method = new_method
            print(f"HTTP Method berhasil diubah ke: {new_method}")
            
        elif action == 'default_params':
            print(f"\n=== Ganti Default Parameters ===")
            print(f"Default saat ini: {sender.default_params}")
            new_defaults = get_default_parameters()
            sender.default_params = new_defaults
            print(f"Default parameters berhasil diubah ke: {new_defaults}")
            
        elif action == 'custom_params':
            print(f"\n=== Setup Custom Parameters ===")
            if sender.custom_params:
                print(f"Custom parameters saat ini: {sender.custom_params}")
            new_custom = get_custom_parameters()
            if new_custom:
                sender.custom_params = new_custom
                print(f"Custom parameters berhasil diset: {new_custom}")
            else:
                print("Tidak ada custom parameters yang diset.")
                
        elif action == 'config':
            print("\n=== Ganti Konfigurasi Server ===")
            base_url, endpoint = get_server_config()
            sender.base_url = base_url
            sender.endpoint = endpoint
            print(f"Konfigurasi berhasil diubah ke: {base_url}{endpoint}")
            
        elif action == 'exit':
            print("Terima kasih!")
            break
        
        print("\n" + "="*50)

if __name__ == "__main__":
    main()