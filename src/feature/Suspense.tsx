import { Suspense } from "react";
import { URLS, fetchData } from "../data/fetchData";

export const SuspenseComponent = () => {
  return (
    <Suspense fallback={<h1>Loading</h1>}>
      <List />
    </Suspense>
  );
}


function List() {
  const items = use(fetchData(URLS.items)) ?? [];
  return (
    <ul className="items">
      {items.map(item =>
        <Item key={item.id} title={item.title} />
      )}
    </ul>
  );
}

function Item({ title }: { title: string }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

type OwnUsePromise<T> = Promise<T> & { status?: 'pending' | 'fulfilled' | 'rejected', value?: T, reason?: unknown };

function use<R>(promise?: Promise<R>): R | undefined {
  if (!promise) return;

  const ownUsePromise: OwnUsePromise<R> = promise

  if (ownUsePromise.status === 'fulfilled') {
    return ownUsePromise.value;
  } else if (ownUsePromise.status === 'rejected') {
    throw ownUsePromise.reason;
  } else if (ownUsePromise.status === 'pending') {
    throw promise;
  } else {
    ownUsePromise.status = 'pending';
    ownUsePromise.then(
      result => {
        ownUsePromise.status = 'fulfilled';
        ownUsePromise.value = result;
      },
      reason => {
        ownUsePromise.status = 'rejected';
        ownUsePromise.reason = reason;
      },
    );
    throw promise;
  }
}
