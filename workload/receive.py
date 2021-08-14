import requests

url = "http://167.179.117.96:8040/api/records"

payload = " {\"record_id\":\"new\",\"device\":\"006\",\"seq\":\"002\",\"ts\":\"testTS\",\"ddata\":\"matt data\",\"dsize\":\"23\",\"dhash\":\"testHash\"}"
headers = {
    'content-type': "application/json",
    'authorization': "eyJhbGciOiJIUzUxMiIsImlhdCI6MTU3NTQ5NzYyNCwiZXhwIjoxNTc1NTAxMjI0fQ.eyJwdWJsaWNfa2V5IjoiMDNlNzRhNzFhYjAyNTQ4NzdkMDFlZDMyMmQ3OWY5OThhNjY4OGRiNWU0NjM2N2JjYzk0MTExNDExNzBjZDJjMWY0In0.NzoGkb47J3UxbdNw2AqrzVX5XRsr3A9Sfq55v6UIKBg1B4OnsH1a1IBu7rjkYaX5wzk2DQxQZ0uBRuw1QcHf-g",
    'cache-control': "no-cache",
    'postman-token': "91bd5564-1279-6b89-4985-aa9e67af25dc"
    }

response = requests.request("GET", url, data=payload, headers=headers)

print(response.text)
