interface RuntimeEnv {
  AUTH_TOKEN?: string;
}

export const getAuthToken = (): string => {
  const runtime = (window as any).__ENV__ as RuntimeEnv | undefined;

  return runtime?.AUTH_TOKEN || import.meta.env.VITE_AUTH_TOKEN || "";
};
