# EduTech 

Setup & Deploy 
1. Install DFX:
  https://internetcomputer.org/docs/current/developer-docs/setup/install/
2. Jalankan local network:
   ```bash
   dfx start --background
   ```
3. Deploy backend:
   ```bash
   dfx deploy backend
   ```

Testing Endpoint Backend
Register
```bash
dfx canister call backend Register '("username1", "email1@email.com", "password1", "password1")'
```
Login
```bash
dfx canister call backend Login '("email1@email.com", "password1")'
```

Dokumentasi Endpoint
Register
- Nama: Register
- Parameter:username: , email: , password: , konfirmasipassword: 


Login
- Nama: Login
- Parameter: email: Text, password: Text`


