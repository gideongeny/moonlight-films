import React from 'react';

const AboutStatement: React.FC = () => {
  return (
    <div id="about-story" className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Our Story
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto"></div>
        </div>
        
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/10">
          <p className="text-lg md:text-xl leading-relaxed mb-6 text-gray-100">
            "Moonlight Films represents more than just a streaming website. It's the culmination of countless hours, 
            days, months, and now a full year of dedication, passion, and unwavering commitment to creating something 
            truly special for our community."
          </p>
          
          <p className="text-lg md:text-xl leading-relaxed mb-6 text-gray-100">
            "This project was born from my drive to find a homegrown solution - an alternative to MovieBox and Goojera 
            that would serve Kenya and Africa with pride. It's about creating something that's ours, built with our 
            needs in mind, and designed to showcase the incredible talent and creativity of our continent."
          </p>
          
          <p className="text-lg md:text-xl leading-relaxed mb-8 text-gray-100">
            "Above all, this journey was inspired by my sister, whose love for storytelling and cinema ignited the 
            spark that would become Moonlight Films. This is for her, for Kenya, for Africa, and for everyone who 
            believes in the power of homegrown solutions."
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              <span>Made with ❤️ in Kenya</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>For Africa & Beyond</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span>Inspired by Family</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-yellow-400 font-semibold text-lg">
            🌟 Dedicated to creating homegrown solutions that make us proud 🌟
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutStatement;
