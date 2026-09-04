import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CartIcon from "../pages/CartIcon";

function MainLayout({ children }) {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = () => {
        signOut();
        navigate("/");
    };

    return (
        <div className="app">
            <nav className="navbar">
                <div className="brand">
                    <div className="logo-icon">⚔</div>
                    <div>
                        <h1>
                            Anime<span>Store</span>
                        </h1>
                        <p>アニメストア</p>
                    </div>
                </div>
                <div className="nav-links">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/catalog">Catalog</NavLink>
                    <CartIcon />
                    {user && <NavLink to="/dashboard">Dashboard</NavLink>}
                </div>
                <div className="nav-icons">
                    {user ? (
                        <>
                            <Link
                                className="user-link"
                                to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                            >
                                👤 {user.name}
                            </Link>
                            {user.role === "admin" && (
                                <Link className="admin-dashboard-button" to="/admin/dashboard">
                                    Admin Dashboard
                                </Link>
                            )}
                            <button className="sign-out-button" onClick={handleSignOut}>
                                Sign out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link className="auth-nav-link" to="/signin">Sign in</Link>
                            <Link className="admin-dashboard-button" to="/signup">Sign up</Link>
                        </>
                    )}
                </div>
            </nav>

            {children || <Outlet />}

            <footer>
                <h3>
                    Anime<span>Store</span>
                </h3>
                <p>Anime • Manga • Collectibles • Gaming</p>
                <p className="copyright">© 2026 AnimeStore | ADP3 Capstone Project</p>
            </footer>
        </div>
    );
}

export default MainLayout;