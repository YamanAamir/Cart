import { Link } from "react-router-dom";

// Images (make sure ye .webp transparent ya light ke liye suitable hon)
import clubCarImg from "/assets/clubcar.webp";
import ezgoImg from "/assets/e-z-go.webp";
import yamahaImg from "/assets/yamaha.webp";

const products = [
  {
    name: "Club Car Enclosures",
    img: clubCarImg,
    description:
      "Enclosures and Cab Systems designed for Club Car vehicles. 2-Passenger and 4-Passenger options available. Our Precedent Enclosures also work perfectly on the Onward vehicles. Click below to see our options!",
    buttonText: "VIEW CLUB CAR ENCLOSURES",
    link: "/ClubCar",
  },
  {
    name: "E-Z-GO Enclosures",
    img: ezgoImg,
    description:
      "Enclosures and Cab Systems designed for E-Z-GO vehicles. Several options for either the TXT or RXV vehicles. Some options are available through E-Z-GO exclusively. Click below for more info!",
    buttonText: "VIEW E-Z-GO ENCLOSURES",
    link: "/ezgo",
  },
  {
    name: "Yamaha Enclosures",
    img: yamahaImg,
    description:
      "Enclosures and Cab Systems designed for the Yamaha Golf Car vehicles. Offering over-the-top enclosures, 3-sided enclosures and Cab Systems for the Yamaha Drive and Drive2 models. Click below to see our options!",
    buttonText: "VIEW YAMAHA ENCLOSURES",
    link: "/yamaha",
  },
];

export default function ProductSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-3 gap-12">
          {products.map((product, idx) => {
            // Center card (index 1 = E-Z-GO) ko alag style
            const isCenter = idx === 1;
            const cardBg = isCenter ? "bg-white" : "bg-white"; // Dark navy ≈ gray-900
            const textColor = isCenter ? "text-[#737a81]" : "text-[#737a81]";
            const headingColor = isCenter ? "text-black" : "text-black";

            return (
              <div
                key={idx}
                className={`${cardBg} p-10 rounded-2xl shadow-xl flex flex-col items-center text-center hover:shadow-2xl transition-shadow duration-300`}
              >
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-56 h-auto mb-8 object-contain" // Thoda bada logo for better look
                />
                <h3 className={`text-2xl font-bold mb-4 font-custom ${headingColor}`}>
                  {product.name}
                </h3>
                <p className={`text-base mb-8 leading-relaxed ${textColor} font-custom`}>
                  {product.description}
                </p>
                <Link
                  to={product.link}
                  className="bg-[#f9c821] hover:bg-[#f9c821]/80 text-white font-bold uppercase text-sm tracking-wider px-8 py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  {product.buttonText}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
