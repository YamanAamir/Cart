

import React, { useState } from 'react';
import { Bookmark, Plus, Minus, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import cardImg from "/assets/cpm_club_car.webp";
import logo from "/assets/e-z-go.webp";

export default function GolfCartBuilder() {
  const { brandSlug } = useParams();
  const [brand, setBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);

  useEffect(() => {
    const fetchBrand = async () => {
      // map slug → id (or use slug in DB later)
      const brandMap = {
        "ez-go": 3,
        "club-car": 1,
        "yamaha": 2,
      };

      const res = await axios.get(
        `http://api.clubpromfg.com/api/brands/${brandMap[brandSlug]}`
      );
      // const res = await axios.get(
      //   `http://localhost:5000/api/brands/${brandMap[brandSlug]}`
      // );

      setBrand(res.data);
      setSelectedModel(res.data.models[0]); // default model
    };

    fetchBrand();
  }, [brandSlug]);

  
  
  
  
  
  
  const { addItem } = useCart();
  const navigate = useNavigate();

  const accessoryImages = {
    'CABANA BAG COVER 2022': cardImg,
    'CABANA BAG COVER PRE 2022': cardImg,
    'STORAGE COVER 2-PASS': cardImg,
    'GOLF CAR COOLER': cardImg,
    'Z': cardImg,
  };

  const [openSection, setOpenSection] = useState('ENCLOSURE TYPE');

  const [selections, setSelections] = useState({
    model: { name: 'RXV2', price: 12000 },
    enclosureType: { name: 'RXV FIN', price: 500 },
    enclosureColor: { name: 'Beige', price: 0 },
    accessories: []
  });

  const categories = [
    {
      id: 'ENCLOSURE TYPE',
      type: 'single',
      items: [
        { name: '3-SIDED RXV', price: 450 },
        { name: 'RXV FIN', price: 500 }
      ]
    },
    {
      id: 'ENCLOSURE COLOR',
      type: 'single',
      items: [
        { name: 'Beige', price: 0 },
        { name: 'Black', price: 0 },
        { name: 'White', price: 0 }
      ]
    },
    {
      id: 'SOFT ACCESSORIES',
      type: 'multi',
      items: [
        { name: 'CABANA BAG COVER 2022', price: 120 },
        { name: 'CABANA BAG COVER PRE 2022', price: 110 },
        { name: 'STORAGE COVER 2-PASS', price: 80 },
        { name: 'GOLF CAR COOLER', price: 45 },
        { name: 'Z', price: 99 }
      ]
    },
    {
      id: 'HARD ACCESSORIES',
      type: 'multi',
      items: [
        { name: 'Windshield', price: 150 },
        { name: 'Mirrors', price: 60 }
      ]
    },
    {
      id: 'ADDITIONAL ACCESSORIES',
      type: 'multi',
      items: [
        { name: 'Floor Mat', price: 40 },
        { name: 'Light Kit', price: 200 }
      ]
    },
  ];

  const models = [
    { name: 'RXV2', price: 12000 },
    { name: 'TXT2', price: 11000 },
    { name: 'TXT4', price: 13000 },
    { name: 'LIBERTY', price: 15000 },
    { name: 'CUSHMAN HAULER', price: 14000 }
  ];

  const isSelected = (cateId, item) => {
    if (cateId === 'ENCLOSURE TYPE') return selections.enclosureType.name === item.name;
    if (cateId === 'ENCLOSURE COLOR') return selections.enclosureColor.name === item.name;
    return selections.accessories.some(a => a.name === item.name);
  };

  const handleSelect = (cateId, type, item) => {
    if (type === 'single') {
      if (cateId === 'ENCLOSURE TYPE') setSelections(prev => ({ ...prev, enclosureType: item }));
      if (cateId === 'ENCLOSURE COLOR') setSelections(prev => ({ ...prev, enclosureColor: item }));
    } else {
      setSelections(prev => {
        const exists = prev.accessories.find(a => a.name === item.name);
        let newAccessories;
        if (exists) {
          newAccessories = prev.accessories.filter(a => a.name !== item.name);
        } else {
          newAccessories = [...prev.accessories, item];
        }
        return { ...prev, accessories: newAccessories };
      });
    }
  };

  const handleSaveBuild = () => {
    const itemsToAdd = [
      { ...selections.model, type: 'Model' },
      { ...selections.enclosureType, type: 'Enclosure' },
      { ...selections.enclosureColor, type: 'Color' },
      ...selections.accessories
    ];
    addItem('ezgo', itemsToAdd);
    alert("Build Saved! Redirecting to Checkout...");
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans pt-8 pb-20">
      {/* Page Header */}
      <div className="container mx-auto px-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 text-xs md:text-sm tracking-widest text-gray-500 mb-2"
        >
          <span className="text-[#f9c821]">HOME</span> / EZ-GO
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between text-3xl md:text-5xl font-serif font-bold"
        >
          <div className="flex items-center gap-2">
            <span className="text-gray-900">Build Your</span>
            <span className="text-[#f9c821]">EZ-GO</span>
          </div>
          <img
            src={logo}
            alt="EZ-GO Logo"
            className="h-6 md:h-10 object-contain"
          />
        </motion.h1>
      </div>

      <div className="container mx-auto px-6 flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* LEFT SIDE: Image Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:w-[65%]"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 h-[400px] lg:h-[700px] group transition-all duration-300">
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: 'url("./assets/cpm_club_car.webp")',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start">
              <span className="bg-[#f9c821]/90 text-white px-4 py-3 rounded-full text-xs font-bold tracking-widest">
                PREMIUM SERIES
              </span>
              <button
                onClick={handleSaveBuild}
                className="bg-white/90 backdrop-blur-md border border-gray-300 px-6 py-3 rounded-full shadow-lg text-xs font-bold tracking-widest flex items-center gap-2 hover:bg-[#f9c821] hover:text-white transition-all"
              >
                SAVE BUILD <Bookmark className="w-4 h-4" />
              </button>
            </div>

            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 px-4 flex-wrap z-10">
              {['FULL ENCLOSURE', 'DOOR STORED', 'FULLY STORED'].map((mode, idx) => (
                <button
                  key={mode}
                  className={`
                    px-6 py-3 rounded-full text-xs font-bold tracking-widest transition-all shadow-lg backdrop-blur-md
                    ${idx === 0
                      ? 'bg-[#f9c821] text-white ring-2 ring-[#f9c821] ring-offset-2'
                      : 'bg-gray-100/90 text-gray-700 border border-gray-300 hover:bg-gray-200'}
                  `}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE: Interactive Menus */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:w-[35%]"
        >
          <div className="sticky top-24">
            <h2 className="text-xs font-bold text-[#f9c821] mb-6 tracking-[0.2em] uppercase border-b border-gray-300 pb-4">
              Select Your Model
            </h2>
            <div className="flex flex-wrap gap-3 mb-12">
              {models.map((m) => (
                <button
                  key={m.name}
                  onClick={() => setSelections(prev => ({ ...prev, model: m }))}
                  className={`
                    text-xs font-bold px-4 py-2 rounded-lg transition-all border
                    ${selections.model.name === m.name
                      ? 'bg-[#f9c821] text-white border-[#f9c821] shadow-lg shadow-[#f9c821]/20'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:text-gray-900'}
                  `}
                >
                  {m.name}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {categories.map((cat, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  key={cat.id}
                  className="rounded-xl overflow-hidden border border-gray-300 bg-white shadow-md"
                >
                  <button
                    onClick={() => setOpenSection(openSection === cat.id ? '' : cat.id)}
                    className={`w-full flex justify-between items-center px-6 py-5 transition-all hover:bg-gray-50 ${openSection === cat.id ? 'bg-gray-50' : ''}`}
                  >
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-700">
                      {cat.id}
                    </span>
                    {openSection === cat.id
                      ? <Minus className="w-4 h-4 text-[#f9c821]" />
                      : <Plus className="w-4 h-4 text-gray-500" />
                    }
                  </button>

                  <AnimatePresence>
                    {openSection === cat.id && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden bg-gray-50"
                      >
                        <div className="p-6">
                          {cat.id === 'SOFT ACCESSORIES' ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                              {cat.items.map((item) => {
                                const active = isSelected(cat.id, item);
                                return (
                                  <div
                                    key={item.name}
                                    onClick={() => handleSelect(cat.id, cat.type, item)}
                                    className={`cursor-pointer rounded-xl overflow-hidden border transition-all
                                      ${active
                                        ? 'border-[#f9c821] bg-[#f9c821]/5 shadow-md'
                                        : 'border-gray-300 bg-white hover:bg-gray-50'}
                                    `}
                                  >
                                    <img
                                      src={accessoryImages[item.name]}
                                      alt={item.name}
                                      className="w-full h-28 object-cover"
                                    />
                                    <div className="p-3 text-center">
                                      <p className={`text-sm font-semibold mb-1 ${active ? 'text-[#f9c821]' : 'text-gray-800'}`}>
                                        {item.name}
                                      </p>
                                      <p className="text-xs text-gray-600">${item.price}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {cat.items.map((item) => {
                                const active = isSelected(cat.id, item);
                                return (
                                  <div
                                    key={item.name}
                                    onClick={() => handleSelect(cat.id, cat.type, item)}
                                    className={`
                                      flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border
                                      ${active
                                        ? 'bg-[#f9c821]/10 border-[#f9c821]/30 text-[#f9c821]'
                                        : 'text-gray-700 border-gray-200 hover:bg-gray-100'}
                                    `}
                                  >
                                    <span className="text-sm font-medium">{item.name}</span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-gray-600">${item.price}</span>
                                      {active && <ArrowRight className="w-4 h-4 text-[#f9c821]" />}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}