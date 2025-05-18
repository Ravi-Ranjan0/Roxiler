import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

type Role = "USER" | "ADMIN" | "STORE_OWNER";

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

type AuthPayload = {
  accessToken: string | null;
  user: User | null;
};

type AuthContextType = {
  auth: AuthPayload | null;
  login: (data: AuthPayload) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<AuthPayload | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");
    if (token && user) {
      setAuth({
        accessToken: token,
        user: JSON.parse(user),
      });
    }
  }, []);

  const login = (data: AuthPayload) => {
    setAuth(data);
    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
    }
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
