export const URLS = {
  items: '/items',
  item: '/item/:id',
} as const

type Urls = typeof URLS[keyof typeof URLS];

type UrlResponseMap = {
  [URLS.item]: Promise<{ id: number, title: string }>,
  [URLS.items]: Promise<{ id: number, title: string }[]>,
}

const cache = new Map<Urls, UrlResponseMap>();

export function fetchData<T extends Urls>(url: T) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url)
}

async function getData<T extends Urls>(url: T) {
  if (url === URLS.items) {
    return await getItems();
  } else if (url === URLS.item) { 
    return await getItem();
  } else {
    throw Error('Not implemented');
  }
}

async function getItems() {
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  const items = [];
  for (let i = 0; i < 500; i++) {
    items.push({
      id: i,
      title: 'Item #' + (i + 1)
    });
  }
  return items;
}

async function getItem() {
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  return {
    id: 1,
    title: 'Item 1'
  };
}

