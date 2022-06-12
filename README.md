<br />
<div align="center">
  <h2 align="center">Angkotin Backend</h2>

  <p align="center">
    <a href="https://nodejs.org/en/">Node Js</a>
    ·
    <a href="https://www.typescriptlang.org/">Typescript</a>
    ·
    <a href="https://firebase.google.com/">Firebase</a>
    ·
    <a href="https://expressjs.com/">Express</a>
  </p>
</div>

## Usage
API URL (Deployed on Google App Engine)
```url
https://angkotin-352405.et.r.appspot.com
```

Authentication (Login)
- Method : POST
- Endpoint : ```/auth```
- Body :
  ```json
  {
    "phoneNumber": "user phone number",
    "password": "user password"
  }
  ```
- Response :
  ```json
  {
    "success": true,
    "data": {
      "token": "user token",
      "id": "user id",
      "endPoint": "user endpoint"
    }
  }
  ```

Register
- Method : POST
- Endpoint (passanger)  : ```/register/passengers```
- Endpoint (driver) : ```/register/drivers``` (Driver must register angkotNumber and angkotLabel)
- Endpoint (admin) : ```/register/admins```
- Body : 
  ```json
  {
    "name": "user name",
    "nik": "user nik",
    "phoneNumber": "user phone number",
    "password": "user password"
  }
  ```
- Response :
    ```json
    {
      "success": true,
      "data": {
        "user data"
      }
    }
    ```

## Documentation
1. Design the infrastructure
2. Create firestore collection and document model
3. Build user API
4. Build authentication and authorization using JWT
5. Enable Google Map, Direction, and Place API
6. Deploy backend to Google App Engine
7. Build admin dashboard