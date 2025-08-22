# EduChain

![EduChain Demo](https://i.imgflip.com/a3v5zy.gif)

**EduChain** is an integrated education platform built on the Internet Computer Protocol (ICP) blockchain, designed to revolutionize how people learn and verify achievements globally. The platform enables users to pay for courses using ICP tokens or digital payment methods like QRIS (for Indonesian users), PayPal, and more.

---

## Why EduChain?

Traditional education platforms operate under centralized systems where user accounts, payments, and certifications are managed by a single authority. While effective, this model has several drawbacks:

-   **Lack of transparency:** Users cannot independently verify the authenticity of credentials or learning achievements.
-   **Limited recognition:** Certifications are often not portable or easily verifiable across countries or organizations.
-   **User control:** Users have little control over their data, access, or credentials.

EduChain addresses these issues by leveraging a decentralized education ecosystem powered by ICP.

---

## Key Features

-   **Decentralized Credentials:** All certificates are issued and stored on-chain, making them tamper-proof and instantly verifiable from anywhere in the world.
-   **Multiple Payment Methods:** Pay for courses using ICP tokens, QRIS (Indonesia), PayPal, and other digital payment options.
-   **Inclusive Login Options:**
    -   **Web3:** Plug Wallet, Internet Identity for blockchain-native access.
    -   **Web2:** Email/password, Google login for traditional users.
-   **Curated Learning Modules:** Access industry-relevant content from trusted educational partners.
-   **Automated Certification:** Upon completing a course, learners receive smart contract-powered certificates directly to their accounts, eliminating the need for centralized credential storage.
-   **Partnerships:** Plans to collaborate with top educational providers like Dicoding, Harisenin.com, and others for diverse content.

---

## How It Works

1. **Sign Up:** Choose Web3 (Internet Identity) or Web2 (Email/Google) account creation.
2. **Browse Courses:** Explore curated modules from global and local providers.
3. **Pay Securely:** Select ICP tokens or digital payments (QRIS, PayPal, etc.).
4. **Learn:** Engage with interactive, industry-relevant content.
5. **Earn Credentials:** Receive on-chain certificates automatically after completing modules.

---

## Vision

By combining the openness and security of decentralized technology with the ease-of-use of traditional e-learning, EduChain empowers learners to:

**Learn. Earn. On-chain.**

---

## Getting Started

1. **Clone the repository**
    ```bash
    git clone https://github.com/XenomLight/EduChain.git
    ```
2. **Install dependencies**
    ```bash
    dfx deps pull && dfx deps init && dfx deps deploy
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

## 🔐 Authentication

### Register New User
```bash
dfx canister call backend registerWithEmail '("nazriel", "nazriel@gmail.com", "passnaz1", "passnaz1", "Nazriel", "Akbar")'
```

### Login with Email
```bash
dfx canister call backend loginWithEmail '("nazriel@gmail.com", "passnaz1")'
```

### Login with Principal (for wallet-based auth)
```bash
dfx canister call backend loginWithPrincipal '(opt "Nazriel", opt "Akbar", opt "nazriel", opt "nazriel@gmail.com")'
```

## 📚 Course Management

### Get All Courses (Paginated)
```bash
dfx canister call backend getCourses '(1, 10, null)' 
```

### Get Course by ID
```bash
dfx canister call backend getCourseById '("course-1")'
```

### Search Courses
```bash
dfx canister call backend searchCourses '("blockchain", opt "technology", opt "all")' 
```

## 💰 Payments & Enrollment

### Create Transaction
```bash
dfx canister call backend createTransaction '("course-1")'
```

### Confirm Payment
```bash
dfx canister call backend confirmPayment '(1)'  
```

### Enroll in Course
```bash
dfx canister call backend enrollUser '("course-1", "2025-08-18T10:00:00Z")'
```

## 📊 User Progress

### Get My Enrolled Courses
```bash
dfx canister call backend getMyEnrolledCourses '()'  
```

### Get Course Content with Access Control
```bash
dfx canister call backend getCourseContent '("course-1")'  
```

### Check Course Access
```bash
dfx canister call backend hasAccess '(principal "aaaaa-aa", "course-1")'  
```

### Toggle Favorite Course
```bash
dfx canister call backend toggleFavorite '("course-1")'  
```

### Update Course Progress
```bash
dfx canister call backend updateCourseProgress '("course-1", 75)'  
```

### Set User Progress for Module Content
```bash
dfx canister call backend setUserProgress '("course-1", 1, 1, 100)'  
```

## 🔐 Certificate & Access

### Whitelist User for Certificate
```bash
dfx canister call backend whitelistUserForCertificate '("course-1")'
```

### Check Certificate Access
```bash
dfx canister call backend isUserWhitelistedForCertificate '(principal "aaaaa-aa", "course-1")'
```

## 👤 User Management

### Get Current User
```bash
dfx canister call backend getMe '()'
```

### Get User's Wallets
```bash
dfx canister call backend getMyWallets '()'
```

### Connect New Wallet
```bash
dfx canister call backend connectWallet '("0x123...", "plug")' 
```

## 🔍 Transaction History

### Get User's Transactions
```bash
dfx canister call backend getMyTransactions '()'
```

### Get Payment History
```bash
dfx canister call backend getMyPaymentHistory '()'
```

### Get Payment History by Course
```bash
dfx canister call backend getPaymentHistoryByCourse '("course-1")'
```

# Sort by oldest first
dfx canister call backend getAllCourses '(1, 10, opt variant { oldest })'

# Sort by price high to low
dfx canister call backend getAllCourses '(1, 10, opt variant { priceHighToLow })'

# Sort by price low to high
dfx canister call backend getAllCourses '(1, 10, opt variant { priceLowToHigh })'
```

## Dokumentasi Endpoint

### RegisterWithPrincipal

-   **Nama:** RegisterWithPrincipal
-   **Parameter:**
    -   principal: Principal (dari NFID/Internet Identity)
    -   email: Text
    -   password: Text
    -   konfirmasipassword: Text
-   **Return:** Text (pesan sukses/gagal)

### LoginWithPrincipal

-   **Nama:** LoginWithPrincipal
-   **Parameter:**
    -   principal: Principal (dari NFID/Internet Identity)
    -   email: Text
    -   password: Text
-   **Return:** Text (pesan sukses/gagal)

---
