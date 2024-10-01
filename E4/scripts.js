function fetchData(url) {
    return new Promise((myResolve, myReject) => {
        const timeout = 3000;
        const protocol = url.startsWith('http://') || url.startsWith('https://');

        if (!protocol) {
          myReject(new Error(`Invalid protocol for URL: ${url}`));
          return;
        }

        setTimeout(() => {
          myResolve(`Data from ${url}`);
        }, timeout);
  });
}
function fetchSequentialData(urls) {
  let results = [];

  return fetchData(urls[0])
    .then(r1 => {
      results.push(r1);
      return fetchData(urls[1]);
    })
    .then(r2 => {
      results.push(r2);
      return fetchData(urls[2]);
    })
    .then(r3 => {
      results.push(r3);
      return results;
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      return results;
    });
}

function fetchAllData(urls) {
  return Promise.all(
    urls.map(url =>
      fetchData(url).catch(error => `Error fetching ${url}: ${error.message}`)
    )
  )
}

async function fetchSequentialDataAsync(urls) {
  let results = [];

  try {
    for (const url of urls) {
      const result = await fetchData(url);
      results.push(result);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return results;
  }
  return results;
}

module.exports = {
    fetchData,
    fetchSequentialData,
    fetchAllData,
    fetchSequentialDataAsync
};