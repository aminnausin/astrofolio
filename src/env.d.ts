interface ImportMetaEnv {
    readonly DOMAIN: string;
    readonly PLAUSIBLE_DOMAIN: string;
    readonly RESUME_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
