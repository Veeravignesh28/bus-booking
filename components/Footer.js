export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* Top row */}
        <div className="footer-top">

          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">🚌 RK<span>Bus</span></div>
            <p className="footer-tagline">
              Book bus tickets online with ease. Choose from top operators, compare prices,
              and travel with confidence across India.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Quick Links</h4>
            {[
              { label: "Home",        href: "/" },
              { label: "My Bookings", href: "/mybookings" },
              { label: "Profile",     href: "/profile" },
            ].map((l) => (
              <a key={l.label} href={l.href} className="footer-link">{l.label}</a>
            ))}
          </div>

          {/* Company */}
          <div className="footer-col">
            <h4 className="footer-col-title">Company</h4>
            {[
              { label: "About Us",   href: "/about" },
              { label: "Contact Us", href: "/contact" },
            ].map((l) => (
              <a key={l.label} href={l.href} className="footer-link">{l.label}</a>
            ))}
          </div>

          {/* Contact snippet */}
          <div className="footer-col">
            <h4 className="footer-col-title">Contact</h4>
            <p className="footer-contact-text">
              📞 +91 88387 33196<br />
              ✉️ support@busgo.in<br />
              📍 Chennai, Tamil Nadu
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          
            <span className="footer-copy">© {year} RK Bus. All rights reserved.</span> 
        </div>

      </div>
    </footer>
  );
}