export interface User {
  name: string;
  email: string;
}

export const signup = (name: string, email: string, password: string) => {
  const users = JSON.parse(localStorage.getItem("eduvision_users") || "[]");
  if (users.find((u: any) => u.email === email)) {
    throw new Error("Email already registered");
  }
  users.push({ name, email, password });
  localStorage.setItem("eduvision_users", JSON.stringify(users));
};

export const login = (email: string, password: string): User => {
  const users = JSON.parse(localStorage.getItem("eduvision_users") || "[]");
  const user = users.find((u: any) => u.email === email && u.password === password);
  if (!user) throw new Error("Invalid email or password");
  localStorage.setItem("eduvision_isLoggedIn", "true");
  localStorage.setItem("eduvision_userEmail", user.email);
  localStorage.setItem("eduvision_userName", user.name);
  return { name: user.name, email: user.email };
};

export const logout = () => {
  localStorage.removeItem("eduvision_isLoggedIn");
  localStorage.removeItem("eduvision_userEmail");
  localStorage.removeItem("eduvision_userName");
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem("eduvision_isLoggedIn") === "true";
};

export const getCurrentUser = (): User | null => {
  if (!isAuthenticated()) return null;
  return {
    name: localStorage.getItem("eduvision_userName") || "Student",
    email: localStorage.getItem("eduvision_userEmail") || "",
  };
};
