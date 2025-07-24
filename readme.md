# EduTech 

## Setup & Deploy 
1. Install DFX:
   https://internetcomputer.org/docs/current/developer-docs/setup/install/
2. Jalankan local network:
   ```bash
   dfx start --clean --background
   ```
3. Deploy backend:
   ```bash
   dfx deploy backend
   ```
## Setup for docker env
1. Install dfx
   https://internetcomputer.org/docs/current/developer-docs/setup/install/

2. Install dependencies:
   ```bash
   cd src/frontend && npm install
   ```
3. Run local network:
   ```bash
   dfx start --host 0.0.0.0:4943 --clean --background
   ```
4. Deploy both FE & BE:
   ```
   cd <root path> && dfx deploy
   ```
## Testing Endpoint Backend

### Register (dengan principal)
```bash
### panggilan jika principal diketahui (biasanya dari frontend)

dfx canister call backend RegisterWithPrincipal '(principal "aaaaa-aa", "user1", "user1@email.com", "password1", "password1")'

```

 ###Login (dengan principal)
```bash
dfx canister call backend registerWithEmail '("Nazriel", "Akbar", "nazriel", "nazriel@gmail.com", "passnaz1", "passnaz1")'
dfx canister call backend Login '("nazriel@gmail.com", "passnaz1")'
```

### kursus 
```bash
 dfx canister call backend getCourseById '(1)'
 dfx canister call backend addCourse 
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

