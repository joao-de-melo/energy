import Nav from "./nav";
import Footer from "./footer";


export default function Layout({ children }) {
    return (
        <div>
            <Nav/>
            <div className="container mt-3">
                {children}
            </div>
            <Footer/>
        </div>
    )
}