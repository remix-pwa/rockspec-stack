import type { LinksFunction } from "@remix-run/node";

import paper from "../../styles/paper.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: paper }];
};

export default function NoteId() {
  return (
    <div className="mt-14 sm:mt-14 md:mt-16 lg:mt-18">
      <section className="paper h-[29rem] sm:h-[32rem] md:h-[34rem] lg:h-[38rem]">
        <div className="paper-content">
          <textarea
            autoFocus
            draggable={false}
            placeholder="Hello world !&#10;Write notes here and save them for later."
          ></textarea>
        </div>
      </section>
      <section className="relative px-3 sm:px-0 mt-8 sm:mt-10 md:mt-12 lg:mt-14 content-center flex flex-col justify-center max-w-[1024px] m-auto">
        <div className="flex flex-row align-middle content-center justify-end w-full">
          <label
            htmlFor="title"
            className="hidden sm:inline-block font-semibold text-xl text-left sm:text-2xl md:text-3xl"
          >
            Title:&nbsp;
          </label>
          <input
            type="text"
            className="rounded-md px-2 my-auto w-full min-w-[290px] max-w-[1024px]"
            name="title"
            id="title"
            placeholder="Give your note a title!"
          />
        </div>
        <div className="w-full flex flex-row justify-end align-middle content-center">
          <button
            type="submit"
            className="w-1/3 md:w-1/6  mt-3 max-w-[300px] flex justify-center py-2 px-4 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
          >
            Save Note
          </button>
        </div>
      </section>
    </div>
  );
}
