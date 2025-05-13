

const Footer = () => {
  return (
    <footer className="site-footer mt-5">
      <div className="container">

        {/* Copyright Section */}
        <div className="row mt-5">
          <div className="col-12 text-center">
            <p>
              Copyright &copy; {new Date().getFullYear()}. All Rights Reserved.
              &mdash; Gerald Narisma
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
