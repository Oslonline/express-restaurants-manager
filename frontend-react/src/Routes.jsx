import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard, Restaurant, Employee } from "./pages";
import App from "./App";

export default function MainRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="restaurants/:id" element={<Restaurant />} />
          <Route path="restaurants/:rid/employees/:id" element={<Employee />} />
        </Route>
      </Routes>
    </Router>
  );
}
