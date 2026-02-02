export default function ClubCar() {
  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-6 text-[#f9c821]">Club Car Enclosures</h1>

      <p className="text-lg mb-4 text-[#737a81] leading-relaxed">
        Our Club Car enclosures are designed for 2-passenger and 4-passenger models, 
        including Precedent and Onward series. Built with premium materials for durability, 
        protection, and style.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">Available Options</h2>
      <ul className="list-disc list-inside text-[#737a81]">
        <li>2-Passenger Standard Enclosures</li>
        <li>4-Passenger Extended Enclosures</li>
        <li>Precedent & Onward Compatible Cab Systems</li>
        <li>Custom Roofs and Accessories</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">Why Choose Club Car Enclosures?</h2>
      <p className="text-[#737a81] mb-4 leading-relaxed">
        - High-quality materials for long-lasting performance <br/>
        - Expertly designed to fit Club Car models perfectly <br/>
        - Enhance comfort and protect passengers from weather <br/>
        - Trusted by golf cart owners nationwide
      </p>

      {/* <div className="mt-8">
        <a
          href="/#products"
          className="bg-[#d97606] hover:bg-[#d08700] text-white font-bold uppercase px-8 py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Explore Club Car Products
        </a>
      </div> */}
    </div>
  );
}

