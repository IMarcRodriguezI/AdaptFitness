import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  // Public routes (no layout - landing, login, signup)
  index("routes/LandingPage.tsx"),
  route("login", "routes/LoginPage.tsx"),
  route("signup", "routes/SignupPage.tsx"),
  
  // Protected routes (with dashboard layout)
  layout("components/AppLayout.tsx", [
    route("dashboard", "components/ui/home.tsx"),
    route("workouts", "components/ui/workouts.tsx"),
    route("nutrition", "components/ui/nutrition.tsx"),
    route("goals", "components/ui/goals.tsx"),
    route("progress", "components/ui/progress.tsx"),
    route("profile", "components/ui/profile.tsx"),
    route("settings", "components/ui/settings.tsx"),
  ]),
] satisfies RouteConfig;
