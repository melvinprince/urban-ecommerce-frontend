import Link from "next/link";

export default function HeaderAuth({ isLoggedIn, user, logout }) {
  if (!isLoggedIn) {
    return (
      <Link
        href="/user/login-register"
        className="header-auth-wrapper relative overflow-hidden px-4 py-2 text-background group"
      >
        <span className="relative z-10">Login/Register</span>
        <span className="header-auth-bg absolute inset-0 bg-ogr translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-0"></span>
      </Link>
    );
  }

  return (
    <>
      {user?.role === "adm" ? (
        <Link
          href="/admin"
          className="header-auth-wrapper relative overflow-hidden px-4 py-2 text-background group"
        >
          <span className="relative z-10">Admin Panel</span>
          <span className="header-auth-bg absolute inset-0 bg-ogr translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-0"></span>
        </Link>
      ) : (
        <Link
          href="/user/profile"
          className="header-auth-wrapper relative overflow-hidden px-4 py-2 text-background group"
        >
          <span className="relative z-10">User</span>
          <span className="header-auth-bg absolute inset-0 bg-ogr translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-0"></span>
        </Link>
      )}

      <button
        onClick={logout}
        className="header-auth-wrapper relative overflow-hidden px-4 py-2 text-background group"
      >
        <span className="relative z-10">Sign Out</span>
        <span className="header-auth-bg absolute inset-0 bg-ogr translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out z-0"></span>
      </button>
    </>
  );
}
