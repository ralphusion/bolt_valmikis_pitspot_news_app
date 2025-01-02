import React, { useState, useEffect } from 'react';
    import axios from 'axios';

    const getRandomPlaceholder = () => {
      const randomId = Math.floor(Math.random() * 1000);
      return `https://picsum.photos/id/${randomId}/800/500`;
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
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
              source: 'Motorsport.com',
              pubDate: item.pubDate
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
              <div className="title-card">
                <div className="flex items-center justify-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-f1-red"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-13h-2v4H7v2h4v4h2v-4h4v-2h-4V7z" />
                  </svg>
                  <h1 className="text-4xl font-serif font-bold text-gray-900">
                    Valmiki's Pitstop
                  </h1>
                </div>
                <p className="text-center text-gray-600 mt-2">
                  Your daily pitstop for Formula 1 news
                </p>
              </div>
            </div>
          </header>
          <main className="py-6">
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
                    <div className="content-container">
                      <div className="card-content">
                        <h2>{currentStory.title}</h2>
                        <div className="card-meta">
                          {formatDate(currentStory.pubDate)}
                        </div>
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
                      <div className="swipe-buttons-container">
                        <button
                          className="swipe-button"
                          onClick={() => handleSwipe('right')}
                          disabled={currentIndex === 0}
                        >
                          ←
                        </button>
                        <button
                          className="swipe-button"
                          onClick={() => handleSwipe('left')}
                          disabled={currentIndex === stories.length - 1}
                        >
                          →
                        </button>
                      </div>
                    </div>
                    <div className="image-container">
                      <img
                        src={currentStory.image}
                        alt={currentStory.title}
                        className="object-top"
                        onError={(e) => {
                          e.target.src = getRandomPlaceholder();
                        }}
                      />
                    </div>
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
