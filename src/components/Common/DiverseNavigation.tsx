import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaGlobeAfrica, 
  FaGlobeAsia, 
  FaGlobeAmericas, 
  FaGlobeEurope,
  FaFilm,
  FaTv,
  FaStar
} from 'react-icons/fa';

const DiverseNavigation: React.FC = () => {
  const navigationItems = [
    {
      title: "🌍 African Cinema",
      description: "Nollywood, South African, Kenyan & more",
      icon: <FaGlobeAfrica className="text-2xl" />,
      path: "/explore?region=africa",
      color: "from-green-500 to-green-700"
    },
    {
      title: "🌏 Asian Cinema",
      description: "Bollywood, Korean, Japanese, Chinese",
      icon: <FaGlobeAsia className="text-2xl" />,
      path: "/explore?region=asia",
      color: "from-blue-500 to-blue-700"
    },
    {
      title: "🌎 Latin American",
      description: "Mexican, Brazilian, Argentine cinema",
      icon: <FaGlobeAmericas className="text-2xl" />,
      path: "/explore?region=latin",
      color: "from-orange-500 to-orange-700"
    },
    {
      title: "🕌 Middle Eastern",
      description: "Turkish, Egyptian, Saudi cinema",
      icon: <FaGlobeEurope className="text-2xl" />,
      path: "/explore?region=middleeast",
      color: "from-purple-500 to-purple-700"
    },
    {
      title: "🎬 Nollywood",
      description: "Movies from the Nollywood industry (Nigeria)",
      icon: <FaFilm className="text-2xl" />,
      path: "/explore?region=nollywood",
      color: "from-yellow-500 to-yellow-700"
    },
    {
      title: "🎭 Bollywood",
      description: "Indian movies & TV shows",
      icon: <FaTv className="text-2xl" />,
      path: "/explore?region=bollywood",
      color: "from-red-500 to-red-700"
    }
  ];

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          🌍 Discover World Cinema
        </h2>
        <p className="text-gray-400 text-lg">
          Explore movies and TV shows from around the world
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {navigationItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="group block"
          >
            <div className={`
              bg-gradient-to-br ${item.color} 
              p-6 rounded-xl text-white 
              transform transition-all duration-300 
              hover:scale-105 hover:shadow-2xl
              border border-white/20
            `}>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-white/90">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold">
                  {item.title}
                </h3>
              </div>
              
              <p className="text-white/80 text-sm leading-relaxed">
                {item.description}
              </p>
              
              <div className="mt-4 flex items-center gap-2 text-white/70 text-sm">
                <FaStar className="text-yellow-300" />
                <span>Explore Now</span>
                <span className="ml-auto">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <p className="text-gray-500 text-sm">
          Click on any category above to explore movies and TV shows from that region
        </p>
      </div>
    </div>
  );
};

export default DiverseNavigation;
