import { PencilIcon, XCircleIcon, ShareIcon } from "@heroicons/react/solid";
import type { LinksFunction } from "@remix-run/node";

import notes from "../../styles/notes.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: notes }];
};

function Note({ title, content }: any) {
  return (
    <li className="li m-6 sm:m-8 relative">
      <a className="note h-52 sm:h-60 md:h-72 sm:w-60 md:w-72" href="#">
        <h2 className="note-title font-bold text-xl sm:text-2xl md:text-3xl">{title}</h2>
        <p className="note-text mt-2 sm:mt-3 md:mt-4">{content}</p>
        <div className="h-1/5 flex-row text-center content-center justify-center absolute bottom-0 w-full left-0 z-30 hidden" id="menu">
          <PencilIcon className="w-8 h-8 mr-2 md:mr-4 text-gray-600 hover:text-blue-500"/>
          <XCircleIcon className="w-8 h-8 ml-2 mr-2 md:ml-4 md:mr-4 text-gray-600 hover:text-red-600"/>
          <ShareIcon className="w-8 h-8 ml-2 md:ml-4 text-gray-600 hover:text-green-400"/>
        </div>
      </a>
    </li>
  );
}

export default function IndexNotes() {
  return (
    <div>
      <section className="mt-4 sm:mt-7 md:mt-10">
        <ul className="note-list">
          <Note title="Note Taking" content="Went out to buy some goodies from my house and"/>.
          <Note title="Note Taking" content="Went out to buy some goodies from my house and..."/>
          <Note title="Note Taking" content="Went out to buy some goodies from my house and..."/>
          <Note title="Note Taking" content="Went out to buy some goodies from my house and..."/>
          <Note title="Note Taking" content="Went out to buy some goodies from my house and..."/>
          <Note title="Note Taking" content="Went out to buy some goodies from my house and..."/>
          <Note title="Note Taking" content="Went out to buy some goodies from my house and..."/>
          <Note title="Note Taking" content="Went out to buy some goodies from my house and..."/>
        </ul>
      </section>
    </div>
  );
}
