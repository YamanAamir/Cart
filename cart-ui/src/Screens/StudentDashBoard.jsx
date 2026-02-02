import React, { useState, useCallback, useRef, useEffect } from 'react';
import img1 from '../assets/menuimages/1.png';
import img2 from '../assets/menuimages/2.png';
import img3 from '../assets/menuimages/3.png';
import img4 from '../assets/menuimages/4.png';
import img5 from '../assets/menuimages/5.png';
import img6 from '../assets/menuimages/6.png';

// import img10 from '../assets/logo.jpeg';
import Tshirt from '../Components/Tshirt';
import Hoodie from '../Components/Hoodie';
import ZippedHoodie from '../Components/ZippedHoodie';
import Shorts from '../Components/Shorts';
import SweatPants from '../Components/SweatPants';
import SweatShirt from '../Components/SweatShirt';
import QuoteModal from '../Components/Modal';
import { useParams, useSearchParams } from 'react-router-dom';
import { GraduationCap, ChevronUp, ChevronDown } from 'lucide-react';



const StudentDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('T-SHIRT');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const packageName = searchParams.get("package");  // "standard"
  const program = searchParams.get("program");
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [globalEmblem, setGlobalEmblem] = useState({ name: 'Guld', value: 'Guld', color: '#FCD34D' });
  const [isAppReady, setIsAppReady] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [extraCoverReset, setExtraCoverReset] = useState(false)
  const [sizeFlag, setSizeFlag] = useState(true)
  const [errors, setErrors] = useState({});



  // Complete state for all components
  



  

  const menuItems = [
    { name: 'T-SHIRT', icon: img1 },
    { name: 'SWEATSHIRT', icon: img2 },
    { name: 'HOODIE', icon: img3 },
    { name: 'ZIPPERHOODIE', icon: img4 },
    { name: 'SWEATPANTS', icon: img5 },
    { name: 'SHORTS', icon: img6 },
   
  ];


  // Generic handler for all option changes
  

  // Function to collect all selected options
  
  useEffect(() => {
     
      var iframe_desktop = document.getElementById('preview-iframe');
      var iframe_mobile = document.getElementById('preview-iframe2');
    if (window.innerWidth >= 768) {
      iframe_desktop.src = 'https://playcanv.as/e/p/i27y23x9/';

    }else{

      iframe_mobile.src = 'https://playcanv.as/e/p/i27y23x9/';
    }
    
  }, []);
  
  
  useEffect(() => {
     
    window.onmessage = (event) => { 
      if (event.data=='app:ready') {
        
                    ['preview-iframe', 'preview-iframe2'].forEach((id) => {
                      const iframe = document.getElementById(id);
                      if (iframe?.contentWindow) {
                        console.log("Sending message to iframe:", `Page : ${1}`);
                        iframe.contentWindow.postMessage(`Page : ${1}`, "*");
                       
                        console.log("Sending message to iframe:", 'T-Shirt:red');
                        iframe.contentWindow.postMessage('T-Shirt:red', "*");
                       
                      } else {
                        console.log("Iframe not ready or program not available");
                      }
                    });
                    
                  
                    
                   

                 
                 
      }

    }
    
  }, []);

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
           

      {/* Desktop Layout (md and up) */}
      
      <div className="hidden md:flex h-[calc(100vh-80px)] w-full ">
      {/* Sidebar */}
      <div>
      <div className='flex'>
        <div className="bg-white/70 backdrop-blur-sm border-r border-slate-200 overflow-y-auto firstdiv">
          <div className="p-6">
            <h2 className="text-sm font-semibold text-center text-slate-600 uppercase tracking-wider mb-4">
              Clothing
            </h2>
            <nav className="">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    ['preview-iframe', 'preview-iframe2'].forEach((id) => {
                      const iframe = document.getElementById(id);
                      if (iframe?.contentWindow) {
                        console.log("Sending message to iframe:", `Page : ${index+1}`);
                        iframe.contentWindow.postMessage(`Page : ${index+1}`, "*");
                        console.log("Sending message to iframe:", 'Tilvælg:no');
                        iframe.contentWindow.postMessage('Tilvælg:no', "*");
                      } else {
                        console.log("Iframe not ready or program not available");
                      }
                    });
                    
                  
                    
                    setActiveMenu(item.name);

                 
                  }}
                  className={`flex items-center px-2 py-3 rounded-xl transition-all duration-200 group ${
                    activeMenu === item.name
                      ? 'bg-gradient-to-r from-green-50 to-green-50 border border-green-200 shadow-sm'
                      : 'hover:bg-slate-50 hover:shadow-sm'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-transform duration-200 ${
                    activeMenu === item.name ? 'scale-110' : 'group-hover:scale-105'
                  }`}>
                    <img src={item.icon} alt={item.name} className="w-10 h-10 object-contain" />
                  </div>

                  {activeMenu === item.name && (
                    <div className="ml-auto w-2 h-2 bg-green-700 rounded-full"></div>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        <div className="w-[90%] bg-white/50 min-h-[calc(100vh-164px)] max-h-[calc(100vh-164px)] backdrop-blur-sm secondDiv overflow-y-scroll">
          <div className="p-6 space-y-8  overflow-y-auto">
            {activeMenu === 'T-SHIRT' && <Tshirt />}
            {activeMenu === "SWEATSHIRT" && <SweatShirt />}
            {activeMenu === "HOODIE" && <Hoodie />}
            {activeMenu === "ZIPPERHOODIE" && <ZippedHoodie />}
            {activeMenu === "SWEATPANTS" && <SweatPants />}
            {activeMenu === "SHORTS" && <Shorts />}
          </div>
        </div>
      </div>
      <div className=" border-slate-200 p-6 bg-white/50 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-slate-600">Samlet pris</span>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">
                400 DKK
              </div>
              <div className="text-xs text-slate-500"> Servicegebyr på 59,00 kr. inkl.</div>
            </div>
          </div>
          <button
            // onClick={collectSelectedOptions}
            disabled={!sizeFlag}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 shadow-md
            
        ${sizeFlag
                  ? "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 hover:shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
            >
              Godkend og Betal
            </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Preview Panel */}
        <div className="flex-1 p-6">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-xl h-full flex flex-col border border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">Valgt {activeMenu}</h4>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-slate-600">LIVE FORSIDE</span>
              </div>
            </div>

            {/* Iframe Preview */}
            <div className="flex-1 rounded-b-2xl overflow-hidden">
              <iframe 
                id="preview-iframe"  
                src=""  
                className="w-full h-full"  
                frameBorder="0"  
                title="3D Student Card Preview"  
              /> 
            </div>
          </div>
        </div>
      </div>
    </div>

      <div className="md:hidden flex flex-col ">

        {/* Mobile Preview Panel - Top */}
        <div className="flex flex-col h-screen">
          {/* Main content area that will scroll */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Preview section */}
            <div
              className={`transition-all duration-300 ${isConfigOpen ? 'h-[35vh]' : 'h-[70vh]'
                }`}
            >
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 h-full">
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-600 rounded-xl flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">Valgt {activeMenu}</h4>
                      {/* <p className="text-xs text-slate-600 capitalize" >{program.toUpperCase()}</p> */}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-slate-600">LIVE</span>
                  </div>
                </div>

                {/* Scrolling Message */}
                {/* <div className="bg-yellow-100 border-y border-yellow-300 px-4 py-2">
                  <p className="text-[10px] text-yellow-800 font-semibold text-center">
                    Ændringen vises ikke på huen, men bare rolig — det er ikke en fejl 😉 Din hue bliver præcis, som du designer den.
                    Er du i tvivl? Skriv til os på Instagram eller TikTok, så uploader vi en video af en hue, der ligner din 🎥✨
                  </p>
                </div> */}
                <div
                    className="h-[calc(100%-60px)] rounded-b-2xl overflow-hidden"
                    style={{
                      pointerEvents: isConfigOpen ? 'none' : 'auto',
                    }}
                  >
                  <iframe id="preview-iframe2"  src=""  className="w-full h-full"  frameBorder="0"  title="3D Student Card Preview" 
                   />  
                </div>
              </div>
            </div>

            {/* Config Toggle Button */}
            <div className="px-4 py-2 bg-white/80 border-t border-slate-200 flex justify-center flex-shrink-0">
              <button
                onClick={() => setIsConfigOpen(!isConfigOpen)}
                className="flex items-center justify-center w-full py-2 bg-slate-100 rounded-lg text-slate-700 font-medium"
              >
                {isConfigOpen ? (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Skjul konfiguration
                  </>
                ) : (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Vis konfiguration
                  </>
                )}
              </button>
            </div>

            {/* Config Panel (collapsible + scrollable) */}
            {/* Config Panel (collapsible + scrollable) */}
            <div
              className={`transition-all duration-300 overflow-y-auto ${isConfigOpen ? '' : 'flex-none h-0'
                }`}
            >
              {isConfigOpen && (
                <div className="p-4 space-y-6">
                  {/* Keep all components mounted but conditionally show based on activeMenu */}
                 {activeMenu === 'T-SHIRT' && <Tshirt />}
            {activeMenu === "SWEATSHIRT" && <SweatShirt />}
            {activeMenu === "HOODIE" && <Hoodie />}
            {activeMenu === "ZIPPERHOODIE" && <ZippedHoodie />}
            {activeMenu === "SWEATPANTS" && <SweatPants />}
            {activeMenu === "SHORTS" && <Shorts />}
                </div>
              )}
            </div>

            {/* Sidebar - Now inside the scrollable area but above footer */}
            <div className="bg-white/70 backdrop-blur-sm border-t border-slate-200 flex-shrink-0">
              <div className="px-4 pt-2">
                <h3 className="text-xs font-semibold text-center text-slate-600 uppercase tracking-wider mb-3">
                  Kasketter
                </h3>
                <div className="flex overflow-x-auto space-x-3 pb-2">
                  {menuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() =>{ 
                             ['preview-iframe', 'preview-iframe2'].forEach((id) => {
                const iframe = document.getElementById(id);
                if (iframe?.contentWindow) {
                  console.log("Sending message to iframe:", `Page : ${index+1}`);
                  iframe.contentWindow.postMessage(`Page : ${index+1}`, "*")
                    console.log("Iframe not ready or program not available");
                }
            });
                        
                        setActiveMenu(item.name)}}
                      className={`flex-shrink-0 flex flex-col items-center px-3 rounded-xl transition-all duration-200 min-w-[80px] ${activeMenu === item.name
                          ? 'bg-gradient-to-r from-green-50 to-green-50 border border-green-200 shadow-sm'
                          : 'hover:bg-slate-50 hover:shadow-sm'
                        }`}
                    >
                      <div
                        className={`w-8 rounded-lg flex items-center justify-center mb-2 transition-transform duration-200 ${activeMenu === item.name ? 'scale-110' : 'hover:scale-105'
                          }`}
                      >
                        <img
                          src={item.icon}
                          alt={item.name}
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-600 text-center leading-tight">
                        {item.name.replace(' ', '\n')}
                      </span>
                      {activeMenu === item.name && (
                        <div className="mt-1 w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Footer - Always visible at bottom */}
          <div className="border-t border-slate-200 p-4 bg-white/90 backdrop-blur-sm flex-shrink-0">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-slate-600">Samlet pris</span>
              <div className="text-right">
                <div className="text-xl font-bold text-slate-900">
                  400 DKK
                </div>
                <div className="text-xs text-slate-500">Servicegebyr på 59,00 kr. inkl.</div>
              </div>
            </div>
            <button
              // onClick={collectSelectedOptions 
                
              // }
              // disabled={!sizeFlag}
              // disabled={!sizeFlag}
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 shadow-md
        ${sizeFlag
                  ? "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 hover:shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
            >
              Godkend og Betal
            </button>
          </div>
        </div>

        {/* Quote Modal */}
      </div>
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        // selectedOptions={selectedOptions}
        price={100}
        packageName={packageName}
        program={program}
        
      />
    </div>
  );
};

export default StudentDashboard;