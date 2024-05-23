import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 flex min-h-16 items-center justify-around bg-gray-100">
      <Link className="group font-semibold" to={"/"}>
        <p className="group-hover:underline underline-offset-2">Home</p>
      </Link>
      <div>
        <p className="text-xl font-bold uppercase">Restaurants & Employees Manager</p>
      </div>
    </header>
  );
}
