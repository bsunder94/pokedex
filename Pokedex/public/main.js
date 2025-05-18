document.getElementById('searchForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('searchInput').value.trim();
  const resultsDiv = document.getElementById('results');

  if (!name) {
    resultsDiv.innerHTML = '<p>Please enter a card name to search.</p>';
    return;
  }

  try {
    const res = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:"${name}"`);
    const data = await res.json();

    if (!data.data || data.data.length === 0) {
      resultsDiv.innerHTML = `<p>No cards found for "${name}".</p>`;
      return;
    }

    resultsDiv.innerHTML = data.data.map(card => `
      <div class="card">
        <img src="${card.images.small}" alt="${card.name}">
        <h3>${card.name} (#${card.number})</h3>
        <p><em>${card.set.name}</em></p>
        <p>Market Price: $${(card.cardmarket?.prices?.averageSellPrice || 0).toFixed(2)}</p>
        <button 
          onclick="saveCard('${card.id}', '${card.name.replace(/'/g, "\\'")}', '${card.set.name.replace(/'/g, "\\'")}', '${card.images.small}', ${card.cardmarket?.prices?.averageSellPrice || 0})">
          Add to Collection
        </button>
      </div>
    `).join('');
  } catch (err) {
    console.error('Search failed:', err);
    resultsDiv.innerHTML = '<p>Something went wrong. Please try again.</p>';
  }
});


  document.getElementById('collectionBtn').addEventListener('click', async () => {
    console.log('Collection button clicked!');
    const res = await fetch('/api/cards/collection');
    const data = await res.json();
    const resultsDiv = document.getElementById('results');
  
    resultsDiv.innerHTML = data.map(card => `
      <div class="card" data-id="${card._id}">
        <img src="${card.imageUrl}" alt="${card.name}">
        <h3>${card.name}</h3>
        <p><em>${card.set}</em></p>
        <p>Market Price: $${(card.marketPrice || 0).toFixed(2)}</p>
        <button class="remove-btn" data-id="${card._id}">Remove</button>
      </div>
    `).join('');
  
    
    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const cardId = e.target.dataset.id;
        const confirmDelete = confirm('Remove this card from your collection?');
        if (!confirmDelete) return;
  
        const res = await fetch(`/api/cards/remove/${cardId}`, {
          method: 'DELETE'
        });
  
        const result = await res.json();
        alert(result.message);
  
        // Remove the card from the DOM
        e.target.closest('.card').remove();
      });
    });
  });
  
  
  async function saveCard(id, name, set, imageUrl, marketPrice) {
    const res = await fetch('/api/cards/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        name,
        set,
        imageUrl,
        marketPrice
      })
    });
    const result = await res.json();
    alert(result.message);
  }
  async function loadSetOptions() {
    try {
      const res = await fetch('https://api.pokemontcg.io/v2/sets');
      const data = await res.json();
      const select = document.getElementById('setSelect');
  
      
      const sortedSets = data.data.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
  
      sortedSets.forEach(set => {
        const option = document.createElement('option');
        option.value = set.id; 
        option.textContent = set.name; 
        select.appendChild(option);
      });
    } catch (err) {
      console.error('Failed to load sets:', err);
    }
  }
  document.addEventListener('DOMContentLoaded', () => {
    loadSetOptions();
  });
  document.getElementById('setOnlyBtn').addEventListener('click', async () => {
    const setId = document.getElementById('setSelect').value;
    const resultsDiv = document.getElementById('results');
  
    if (!setId) {
      resultsDiv.innerHTML = '<p>Please select a set first.</p>';
      return;
    }
  
    try {
      const res = await fetch(`https://api.pokemontcg.io/v2/cards?q=set.id:${setId}&orderBy=number`);
      const data = await res.json();
  
      if (!data.data || data.data.length === 0) {
        resultsDiv.innerHTML = '<p>No cards found for that set.</p>';
        return;
      }
  
      resultsDiv.innerHTML = data.data.map(card => `
        <div class="card">
          <img src="${card.images.small}" alt="${card.name}">
          <h3>${card.name} (#${card.number})</h3>
          <p><em>${card.set.name}</em></p>
          <p>Market Price: $${(card.cardmarket?.prices?.averageSellPrice || 0).toFixed(2)}</p>
          <button 
            onclick="saveCard('${card.id}', '${card.name.replace(/'/g, "\\'")}', '${card.set.name.replace(/'/g, "\\'")}', '${card.images.small}', ${card.cardmarket?.prices?.averageSellPrice || 0})">
            Add to Collection
          </button>
        </div>
      `).join('');
    } catch (err) {
      console.error('Set search failed:', err);
      resultsDiv.innerHTML = '<p>Something went wrong. Please try again.</p>';
    }
  });
  document.getElementById('resetBtn').addEventListener('click', () => {
    document.getElementById('results').innerHTML = '';
  });

