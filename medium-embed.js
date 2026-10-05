/**
 * Medium Articles Embed Widget
 * Fetches the latest articles from a Medium RSS feed and displays them in a container.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    // [PLACEHOLDER] Replace with your Medium username (without the @)
    const mediumUsername = 'sly_43735';
    // Number of articles to display
    const maxArticles = 3;

    // Elements
    const containerId = 'medium-articles-container';
    const loadingId = 'medium-articles-loading';

    const articlesContainer = document.getElementById(containerId);
    const loadingText = document.getElementById(loadingId);

    if (!articlesContainer) {
        console.error(`Container with ID '${containerId}' not found.`);
        return;
    }

    // Endpoints
    const rssUrl = `https://medium.com/feed/@sly_43735`;
    // We use rss2json to convert the XML RSS feed into JSON
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'ok' && data.items && data.items.length > 0) {
                if (loadingText) loadingText.style.display = 'none';

                const latestArticles = data.items.slice(0, maxArticles);

                latestArticles.forEach(item => {
                    // Clean up the excerpt (remove HTML tags and convert to plain text)
                    let excerpt = item.description.replace(/<[^>]*>?/gm, '');
                    excerpt = excerpt.substring(0, 150) + '...';

                    // Format publication date
                    const pubDate = new Date(item.pubDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });

                    // Create the HTML structure for each article
                    const articleHTML = `
                        <div class="article">
                            <h3>
                                <a href="${item.link}" target="_blank" rel="noopener noreferrer">
                                    ${item.title}
                                </a>
                            </h3>
                            <span class="date">${pubDate}</span>
                            <p>${excerpt}</p>
                        </div>
                    `;

                    articlesContainer.insertAdjacentHTML('beforeend', articleHTML);
                });
            } else {
                if (loadingText) loadingText.textContent = "No recent articles found right now.";
            }
        })
        .catch(error => {
            console.error('Error fetching Medium articles:', error);
            if (loadingText) loadingText.textContent = "Unable to load articles. Please visit Medium directly.";
        });
});
