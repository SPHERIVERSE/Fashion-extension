document.addEventListener('DOMContentLoaded', () => {
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: getProductData,
        }, (results) => {
            if (chrome.runtime.lastError) {
                errorDiv.classList.remove('hidden');
                return;
            }

            const productData = results[0].result;
            if (!productData) {
                errorDiv.classList.remove('hidden');
                return;
            }

            loadingDiv.classList.remove('hidden');

            // Get API key from storage
            chrome.storage.local.get(['fashionClipApiKey'], (data) => {
                const apiKey = data.fashionClipApiKey;

                if (!apiKey) {
                    loadingDiv.classList.add('hidden');
                    errorDiv.textContent = "API Key not set. Please set the API key in the extension's options.";
                    errorDiv.classList.remove('hidden');
                    return;
                }

                // Use the API to get similar products
                fetchSimilarProducts(productData, apiKey)
                    .then(similarProducts => {
                        loadingDiv.classList.add('hidden');
                        displayResults(similarProducts);
                    })
                    .catch(err => {
                        console.error('API Error:', err);
                        loadingDiv.classList.add('hidden');
                        errorDiv.textContent = "API request failed.";
                        errorDiv.classList.remove('hidden');
                    });
            });
        });
    });

    function displayResults(products) {
        if (!products || products.length === 0) {
          resultsDiv.innerHTML = "<p>No similar products found.</p>";
          return;
        }

        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product-item');

            productDiv.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Price: ${product.price}</p>
                <a href="${product.link}" target="_blank">View Product</a>
            `;

            resultsDiv.appendChild(productDiv);
        });
    }

    async function fetchSimilarProducts(productData, apiKey) {
        // Replace with your FashionCLIP API endpoint
        const apiUrl = 'YOUR_FASHIONCLIP_API_ENDPOINT'; // Example: Fashion CLIP API endpoint

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                image_url: productData.imageUrl, // Assuming the API takes image URL
                // you can add more parameters, if your api requires it
            }),
        });

        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        return data.results; // Adjust based on your API response structure, if the api returns an array called results
    }

    function getProductData() {
        // Example: Scraping from a typical e-commerce site
        const name = document.querySelector('h1.product-title')?.textContent;
        const price = document.querySelector('.product-price')?.textContent;
        const imageUrl = document.querySelector('.product-image img')?.src;
        const description = document.querySelector('.product-description')?.textContent;

        return { name, price, imageUrl, description };
    }
});
