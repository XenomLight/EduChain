/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DFX_NETWORK: string;
  readonly VITE_CANISTER_ID_INTERNET_IDENTITY: string;
  // tambahkan variabel env lain yang dibutuhkan di sini
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
