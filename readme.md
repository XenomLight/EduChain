# EduTech 

## Setup & Deploy 
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

## Testing Endpoint Backend

### Register (dengan principal)
```bash
### panggilan jika principal diketahui (biasanya dari frontend)

dfx canister call backend RegisterWithPrincipal '(principal "aaaaa-aa", "user1", "user1@email.com", "password1", "password1")'

```

 ###Login (dengan principal)
```bash
dfx canister call backend Register '("nazriel", "nazriel@gmail.com", "passnaz1", "passnaz1")'
dfx canister call backend Login '("nazriel@gmail.com", "passnaz1")'
```

### kursus 
```bash
 dfx canister call backend getCourseById '(1)'
 
  dfx canister call backend getCourses
 ```
## Dokumentasi Endpoint
### RegisterWithPrincipal
- **Nama:** RegisterWithPrincipal
- **Parameter:**
  - principal: Principal (dari NFID/Internet Identity)
  - email: Text
  - password: Text
  - konfirmasipassword: Text
- **Return:** Text (pesan sukses/gagal)

### LoginWithPrincipal
- **Nama:** LoginWithPrincipal
- **Parameter:**
  - principal: Principal (dari NFID/Internet Identity)
  - email: Text
  - password: Text
- **Return:** Text (pesan sukses/gagal)

---

