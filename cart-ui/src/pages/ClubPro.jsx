// export default function ClubPro() {
//   return (
//     <div className="p-8">
//       <h1 className="text-4xl font-bold mb-4">CLUB PRO</h1>
//       <p className="text-gray-700 text-lg">
//         Club Pro page
//       </p>
//     </div>
//   );
// }


export default function ClubPro() {
  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-6 text-[#f9c821]">Welcome to Club Pro</h1>

      <p className="text-lg mb-4 text-[#737a81] leading-relaxed">
        Club Pro has been the most trusted golf car accessories provider since 1989. 
        We specialize in premium enclosures, cab systems, and accessories for Club Car, 
        E-Z-GO, and Yamaha golf carts. Quality, durability, and style are at the heart of everything we do.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">Our Product Lines</h2>
      <ul className="list-disc list-inside text-[#737a81] mb-6">
        <li>Club Car Enclosures – 2-Passenger and 4-Passenger options</li>
        <li>E-Z-GO Enclosures – TXT and RXV models</li>
        <li>Yamaha Enclosures – Over-the-top, 3-sided, and cab systems</li>
        <li>Custom Accessories – Mirrors, seats, roofs, and more</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900">Why Choose Club Pro?</h2>
      <p className="text-[#737a81] mb-4 leading-relaxed">
        - High-quality materials for long-lasting performance <br/>
        - Expertly designed enclosures that fit perfectly <br/>
        - Stylish designs that enhance your golf cart’s appearance <br/>
        - Trusted by golf enthusiasts nationwide
      </p>

      {/* <div className="mt-8">
        <a
          href="/#products"
          className="bg-[#d97606] hover:bg-[#d08700] text-white font-bold uppercase px-8 py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Explore Products
        </a>
      </div> */}
    </div>
  );
}
