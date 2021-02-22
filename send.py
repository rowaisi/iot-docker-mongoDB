import requests
import time
import uuid
t1 = time.time()
url = "http://localhost:8040/api/records"


payload = " {\"record_id\":\"thelast2\",\"device\":\"006\",\"seq\":\"002\",\"ts\":\"testTS\",\"ddata\":\"matt data\",\"dsize\":\"23\",\"dhash\":\"testHash\"}"
headers = {
    'content-type': "application/json",
    'authorization': "eyJhbGciOiJIUzUxMiIsImlhdCI6MTU3NTU2OTY1NCwiZXhwIjoxNTc1NTczMjU0fQ.eyJwdWJsaWNfa2V5IjoiMDI4MWVhYzJjZDhhODNlNGZkOTY0NmU3MzgyNmQzODdlOGQxNTk5YWY2ODNkYmEzZWQxMjE2OWJhN2ViMDI5ZTZlIn0.mldHzyW3LxJQRJKUSDqEcoSCODWoTOXuhk27xPRW-7F6UfYO6y1tnJoEieNYHxSrWUGXX5G3B-kXokpST22IvQ",
    'cache-control': "no-cache",
    'postman-token': "020d861f-2c66-35f3-b647-f18f23fcfc28"
    }

response = requests.request("POST", url, data=payload, headers=headers)
t2 = time.time()
print(response.text)
print(t2-t1)

