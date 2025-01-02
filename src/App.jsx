import React, { useState, useEffect } from 'react';
    import axios from 'axios';

    const getRandomPlaceholder = () => {
      const randomId = Math.floor(Math.random() * 1000);
      return `https://picsum.photos/id/${randomId}/800/500`;
    };

    const App = () => {
      const [stories, setStories] = useState([]);
      const [loading, setLoading] = useState(true);
      const [currentIndex, setCurrentIndex] = useState(0);

      useEffect(() => {
        const fetchStories = async () => {
          try {
            const response = await axios.get('https://api.rss2json.com/v1/api.json?rss_url=https://www.motorsport.com/rss/f1/news/');
            const data = response.data.items;
            const sanitizedStories = data.map(item => ({
              title: item.title,
              content: item.description.replace(/<[^>]+>/g, ''),
              url: item.link,
              image: item.enclosure.link || getRandomPlaceholder(),
              source: 'Motorsport.com'
            }));
            setStories(sanitizedStories);
          } catch (error) {
            console.error('Error fetching stories:', error);
          } finally {
            setLoading(false);
          }
        };

        fetchStories();
      }, []);

      const handleSwipe = (direction) => {
        if (direction === 'left' && currentIndex < stories.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else if (direction === 'right' && currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
        }
      };

      const currentStory = stories[currentIndex];

      return (
        <div className="min-h-screen bg-gray-50">
          <header className="py-8">
            <div className="max-w-7xl mx-auto px-4">
              <h1 className="text-4xl font-serif font-bold text-center text-gray-900">
                Valmiki's Pitstop
              </h1>
              <p className="text-center text-gray-600 mt-2">
                Your daily pitstop for Formula 1 news
              </p>
            </div>
          </header>
          <main className="py-12">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-center">
                {loading ? (
                  <div className="skeleton">
                    <div className="skeleton-content">
                      <div className="skeleton-title"></div>
                      <div className="skeleton-text"></div>
                      <div className="skeleton-text"></div>
                      <div className="skeleton-text"></div>
                    </div>
                    <div className="skeleton-image"></div>
                  </div>
                ) : currentStory ? (
                  <div className="card">
                    <button
                      className="swipe-button left"
                      onClick={() => handleSwipe('right')}
                      disabled={currentIndex === 0}
                    >
                      ←
                    </button>
                    <div className="content-container">
                      <div className="card-content">
                        <h2>{currentStory.title}</h2>
                        <p>{currentStory.content}</p>
                      </div>
                      <div className="card-footer">
                        <span>{currentStory.source}</span>
                        <a
                          href={currentStory.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="read-more"
                        >
                          Read more →
                        </a>
                      </div>
                    </div>
                    <div className="image-container">
                      <img
                        src={currentStory.image}
                        alt={currentStory.title}
                        onError={(e) => {
                          e.target.src = getRandomPlaceholder();
                        }}
                      />
                    </div>
                    <button
                      className="swipe-button right"
                      onClick={() => handleSwipe('left')}
                      disabled={currentIndex === stories.length - 1}
                    >
                      →
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-gray-600">No stories available</div>
                )}
              </div>
            </div>
          </main>
        </div>
      );
    };

    export default App;
