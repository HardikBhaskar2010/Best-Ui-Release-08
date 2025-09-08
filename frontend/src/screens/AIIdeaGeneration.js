import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Heart, Share2, Eye, Bookmark, Lightbulb, Zap, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { saveIdea as saveIdeaToFirebase } from '../services/firebaseService';

const AIIdeaGeneration = () => {
  const navigate = useNavigate();
  const [generatedIdeas, setGeneratedIdeas] = useState([]);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [savedIdeas, setSavedIdeas] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get selected components from localStorage instead of context
  const [selectedComponents] = useState(() => {
    try {
      const saved = localStorage.getItem('selectedComponents');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sample ideas for demonstration
  const sampleIdeas = [
    {
      id: 'idea_1',
      title: 'Smart Home Security System',
      description: 'Arduino-based security system with motion detection and remote monitoring',
      difficulty: 'Intermediate',
      availability: 'Available',
      estimated_cost: '₹1500-2000',
      components: ['Arduino Uno', 'PIR Motion Sensor', 'ESP32 DevKit'],
      problem_statement: 'Create a cost-effective home security solution that can detect motion and send alerts to your smartphone',
      working_principle: 'PIR sensor detects motion, Arduino processes the signal, ESP32 sends notifications via WiFi',
      innovation_elements: ['Remote monitoring via mobile app', 'Low power consumption', 'Easy installation'],
      scalability_options: ['Add camera module', 'Multiple sensor zones', 'Integration with smart home systems']
    },
    {
      id: 'idea_2', 
      title: 'Automated Plant Watering System',
      description: 'IoT-enabled plant care system with soil moisture sensing and automatic watering',
      difficulty: 'Beginner',
      availability: 'Available',
      estimated_cost: '₹800-1200',
      components: ['Arduino Uno', 'Servo Motor SG90', 'Ultrasonic Sensor HC-SR04'],
      problem_statement: 'Automate plant watering to ensure optimal growth while conserving water',
      working_principle: 'Soil moisture sensor triggers servo-controlled valve when plants need water',
      innovation_elements: ['Moisture-based automation', 'Water conservation', 'Plant health monitoring'],
      scalability_options: ['Multiple plant zones', 'Weather integration', 'Growth tracking']
    },
    {
      id: 'idea_3',
      title: 'RGB LED Mood Lighting',
      description: 'Programmable ambient lighting system with music sync and color patterns',
      difficulty: 'Beginner',
      availability: 'Available', 
      estimated_cost: '₹600-900',
      components: ['Arduino Uno', 'LED Strip WS2812B', 'Ultrasonic Sensor HC-SR04'],
      problem_statement: 'Create dynamic ambient lighting that responds to environment and music',
      working_principle: 'Arduino controls addressable LEDs with programmed patterns and sensor inputs',
      innovation_elements: ['Music synchronization', 'Color psychology', 'Energy efficient LEDs'],
      scalability_options: ['Voice control', 'Mobile app control', 'Room-wide installation']
    },
    {
      id: 'idea_4',
      title: 'Smart Temperature Monitor',
      description: 'IoT-based temperature monitoring system with alerts and data logging',
      difficulty: 'Intermediate',
      availability: 'Available',
      estimated_cost: '₹800-1100',
      components: ['ESP32 DevKit', 'Temperature Sensor DS18B20', 'LCD Display 16x2'],
      problem_statement: 'Monitor and log temperature data for smart environments with real-time alerts',
      working_principle: 'ESP32 reads temperature data, displays on LCD, and sends to cloud with WiFi',
      innovation_elements: ['Cloud data logging', 'Mobile app notifications', 'Historical data analysis'],
      scalability_options: ['Multiple sensor zones', 'Weather station integration', 'Predictive analytics']
    },
    {
      id: 'idea_5',
      title: 'Motion-Activated Night Light',
      description: 'Energy-efficient automatic lighting system using motion detection',
      difficulty: 'Beginner',
      availability: 'Available',
      estimated_cost: '₹400-600',
      components: ['Arduino Uno', 'PIR Motion Sensor', 'LED Strip WS2812B'],
      problem_statement: 'Create an automatic lighting system that activates only when motion is detected',
      working_principle: 'PIR sensor detects motion and triggers Arduino to control LED lighting patterns',
      innovation_elements: ['Motion-based automation', 'Energy conservation', 'Customizable lighting'],
      scalability_options: ['Smart home integration', 'Daylight sensing', 'Multiple zones']
    },
    {
      id: 'idea_6',
      title: 'Digital Weather Station',
      description: 'Comprehensive weather monitoring system with multiple environmental sensors',
      difficulty: 'Advanced',
      availability: 'Available',
      estimated_cost: '₹1200-1800',
      components: ['ESP32 DevKit', 'Temperature Sensor DS18B20', 'LCD Display 16x2', 'Ultrasonic Sensor HC-SR04'],
      problem_statement: 'Build a complete weather station that monitors multiple environmental parameters',
      working_principle: 'Multiple sensors collect data, ESP32 processes and displays on LCD while logging to server',
      innovation_elements: ['Multi-parameter monitoring', 'Web dashboard', 'Historical trends'],
      scalability_options: ['Solar power integration', 'Wireless mesh network', 'AI weather prediction']
    },
    {
      id: 'idea_7',
      title: 'Smart Parking System',
      description: 'Automated parking space detection and management system',
      difficulty: 'Intermediate',
      availability: 'Available',
      estimated_cost: '₹900-1300',
      components: ['Arduino Uno', 'Ultrasonic Sensor HC-SR04', 'Servo Motor SG90', 'LCD Display 16x2'],
      problem_statement: 'Automate parking space detection and provide real-time availability information',
      working_principle: 'Ultrasonic sensors detect vehicle presence, servo controls barrier, LCD shows status',
      innovation_elements: ['Real-time availability', 'Mobile app integration', 'Payment system ready'],
      scalability_options: ['Multi-level parking', 'License plate recognition', 'Booking system']
    }
  ];

  // Replace useMutation with regular async functions
  const generateIdeas = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Filter ideas based on selected components (simple matching)
      const filteredIdeas = sampleIdeas.filter(idea => 
        selectedComponents.some(comp => 
          idea.components.includes(comp.name)
        )
      );
      
      const ideasToShow = filteredIdeas.length > 0 ? filteredIdeas : sampleIdeas;
      setGeneratedIdeas(ideasToShow);
      
      toast.success('Ideas generated successfully!');
      
      // Update stats in localStorage
      try {
        const stats = JSON.parse(localStorage.getItem('userStats') || '{}');
        stats.ideas_generated = (stats.ideas_generated || 0) + ideasToShow.length;
        localStorage.setItem('userStats', JSON.stringify(stats));
      } catch (e) {
        console.warn('Could not update stats:', e);
      }
    } catch (error) {
      setError('Failed to generate ideas. Please try again.');
      console.error('Generate ideas error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveIdea = async (idea) => {
    try {
      toast.loading('Saving idea to library...', { id: 'save-idea' });
      
      const ideaToSave = {
        ...idea,
        savedAt: new Date().toISOString(),
        components: idea.components || selectedComponents.map(comp => comp.name),
        is_favorite: false,
        tags: [idea.difficulty, 'Generated'],
        estimated_cost: idea.estimated_cost || 'N/A'
      };
      
      // Save to Firebase
      const savedIdea = await saveIdeaToFirebase(ideaToSave);
      
      // Also save to localStorage as backup
      const savedIdeasList = JSON.parse(localStorage.getItem('savedIdeas') || '[]');
      savedIdeasList.push(savedIdea);
      localStorage.setItem('savedIdeas', JSON.stringify(savedIdeasList));
      
      setSavedIdeas(prev => new Set([...prev, idea.id]));
      toast.success('Idea saved to your Firebase library! 🎉', { id: 'save-idea' });
    } catch (error) {
      toast.error('Failed to save to Firebase. Saved locally instead.', { id: 'save-idea' });
      console.error('Save idea error:', error);
      
      // Fallback to localStorage only
      const savedIdeasList = JSON.parse(localStorage.getItem('savedIdeas') || '[]');
      const ideaToSave = {
        ...idea,
        savedAt: new Date().toISOString(),
        components: idea.components || selectedComponents.map(comp => comp.name)
      };
      savedIdeasList.push(ideaToSave);
      localStorage.setItem('savedIdeas', JSON.stringify(savedIdeasList));
      
      setSavedIdeas(prev => new Set([...prev, idea.id]));
    }
  };

  useEffect(() => {
    // Auto-generate ideas on mount (don't redirect if no components)
    generateIdeas();
  }, []);

  const handleSaveIdea = (idea) => {
    saveIdea(idea);
  };

  const handleShareIdea = (idea) => {
    const shareText = `Check out this project idea: ${idea.title}\n\n${idea.description}`;
    
    if (navigator.share) {
      navigator.share({
        title: idea.title,
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Idea copied to clipboard!');
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'Available': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'Partially Available': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      default: return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/components')}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Home</span>
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-white">
                  AI Idea Generation
                </h1>
                <p className="text-gray-400">
                  {generatedIdeas.length > 0 
                    ? `${generatedIdeas.length} ideas generated based on your selections`
                    : 'Generating personalized project ideas...'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/library')}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                <Bookmark className="h-4 w-4" />
                <span>Library</span>
              </button>
              
              {generatedIdeas.length > 0 && (
                <button
                  onClick={generateIdeas}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Generate More</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-white mb-2">
                Generating Ideas...
              </h3>
              <p className="text-gray-400">
                Our AI is creating personalized project ideas based on your components
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="text-red-500 mb-4">
              <AlertCircle className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              Generation Failed
            </h3>
            <p className="text-gray-400 mb-6">
              {error}
            </p>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => navigate('/components')}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                Change Components
              </button>
              <button
                onClick={generateIdeas}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Generated Ideas */}
        {generatedIdeas.length > 0 && !isLoading && (
          <div>
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Lightbulb className="h-6 w-6 text-yellow-500" />
                <h2 className="text-xl font-semibold text-white">
                  Generated Ideas
                </h2>
              </div>
              
              {/* Selected Components Summary */}
              {selectedComponents.length > 0 && (
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-white mb-2">
                    Based on your selected components:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedComponents.map((component) => (
                      <span
                        key={component.id}
                        className="px-3 py-1 bg-gray-700 rounded-full text-sm font-medium text-gray-300 border border-gray-600"
                      >
                        {component.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {generatedIdeas.map((idea, index) => (
                <div
                  key={idea.id}
                  className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:bg-gray-750 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {idea.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3">
                        {idea.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      idea.difficulty === 'Beginner' ? 'bg-green-900/20 text-green-300 border-green-500/30' :
                      idea.difficulty === 'Intermediate' ? 'bg-yellow-900/20 text-yellow-300 border-yellow-500/30' :
                      'bg-red-900/20 text-red-300 border-red-500/30'
                    } border`}>
                      {idea.difficulty}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-900/20 text-green-300 border-green-500/30 border">
                      {idea.availability}
                    </span>
                    <span className="text-sm font-medium text-blue-400">
                      {idea.estimated_cost}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-white mb-2 text-sm">
                      Required Components:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {idea.components?.slice(0, 3).map((component, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-400"
                        >
                          {component}
                        </span>
                      ))}
                      {idea.components?.length > 3 && (
                        <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-400">
                          +{idea.components.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedIdea(idea)}
                      className="flex-1 py-2 px-4 rounded-lg font-medium text-sm bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all duration-200"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Eye className="h-3 w-3" />
                        <span>View Details</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handleSaveIdea(idea)}
                      disabled={savedIdeas.has(idea.id)}
                      className={`py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                        savedIdeas.has(idea.id) ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                      } text-white`}
                    >
                      <Heart className={`h-3 w-3 ${savedIdeas.has(idea.id) ? 'fill-current' : ''}`} />
                    </button>
                    
                    <button
                      onClick={() => handleShareIdea(idea)}
                      className="py-2 px-3 rounded-lg font-medium text-sm bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all duration-200"
                    >
                      <Share2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && generatedIdeas.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Zap className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              Ready to Generate Ideas
            </h3>
            <p className="text-gray-400 mb-6">
              Click the button below to start generating personalized project ideas
            </p>
            <button
              onClick={generateIdeas}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Generate Ideas
            </button>
          </div>
        )}
      </div>

      {/* Simple Modal for Idea Details */}
      {selectedIdea && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {selectedIdea.title}
                </h2>
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedIdea.difficulty === 'Beginner' ? 'bg-green-900/20 text-green-300 border-green-500/30' :
                    selectedIdea.difficulty === 'Intermediate' ? 'bg-yellow-900/20 text-yellow-300 border-yellow-500/30' :
                    'bg-red-900/20 text-red-300 border-red-500/30'
                  } border`}>
                    {selectedIdea.difficulty}
                  </span>
                  <span className="text-sm font-medium text-blue-400">
                    {selectedIdea.estimated_cost}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedIdea(null)}
                className="text-gray-400 hover:text-white transition-colors text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-white mb-2">
                  Problem Statement
                </h3>
                <p className="text-gray-400">
                  {selectedIdea.problem_statement}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">
                  Working Principle
                </h3>
                <p className="text-gray-400">
                  {selectedIdea.working_principle}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">
                  Required Components
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {selectedIdea.components?.map((component, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-gray-700 rounded-lg text-sm text-gray-300"
                    >
                      {component}
                    </span>
                  ))}
                </div>
              </div>

              {selectedIdea.innovation_elements && selectedIdea.innovation_elements.length > 0 && (
                <div>
                  <h3 className="font-semibold text-white mb-2">
                    Innovation Elements
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-400">
                    {selectedIdea.innovation_elements.map((element, index) => (
                      <li key={index}>{element}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center space-x-3 pt-4 border-t border-gray-600">
                <button
                  onClick={() => {
                    handleSaveIdea(selectedIdea);
                    setSelectedIdea(null);
                  }}
                  disabled={savedIdeas.has(selectedIdea.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    savedIdeas.has(selectedIdea.id) ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                  } text-white flex items-center space-x-2`}
                >
                  <Heart className={`h-4 w-4 ${savedIdeas.has(selectedIdea.id) ? 'fill-current' : ''}`} />
                  <span>{savedIdeas.has(selectedIdea.id) ? 'Saved' : 'Save Idea'}</span>
                </button>
                
                <button
                  onClick={() => handleShareIdea(selectedIdea)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium flex items-center space-x-2"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIIdeaGeneration;