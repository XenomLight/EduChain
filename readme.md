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
> **Catatan:** Untuk endpoint yang menerima principal (NFID/Internet Identity), testing penuh dilakukan dari frontend/browser. Contoh berikut hanya untuk referensi.

### Register (dengan principal)
```bash
# Contoh panggilan jika principal diketahui (biasanya dari frontend)
dfx canister call backend RegisterWithPrincipal '(principal "<PRINCIPAL>", "email1@email.com", "password1", "password1")'
```

### Login (dengan principal)
```bash
dfx canister call backend LoginWithPrincipal '(principal "<PRINCIPAL>", "email1@email.com", "password1")'
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

> Untuk testing login/register dengan NFID, lakukan dari frontend (browser) agar principal user bisa didapatkan secara otomatis.


