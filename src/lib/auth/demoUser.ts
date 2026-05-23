interface StoredUser {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: number;
}

const USERS_KEY = "cs.users";

const DEMO_USER: StoredUser = {
  id: "u-demo",
  email: "demo@studio.com",
  name: "Demo",
  password: "Password@123",
  createdAt: 1700000000000,
};

export const ensureDemoUser = () => {
  try {
    const users: StoredUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    if (!users.some((u) => u.email.toLowerCase() === DEMO_USER.email)) {
      localStorage.setItem(USERS_KEY, JSON.stringify([...users, DEMO_USER]));
    }
  } catch {
    localStorage.setItem(USERS_KEY, JSON.stringify([DEMO_USER]));
  }
};
