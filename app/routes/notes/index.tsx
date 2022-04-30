import { json, redirect } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { PencilIcon, XCircleIcon, ShareIcon } from "@heroicons/react/solid";
import { BookOpenIcon } from "@heroicons/react/outline";
import { requireUserId } from "~/utils/server/session.server";
import { deleteNote, getNoteListItems } from "~/models/notes.server";

import type {
  LinksFunction,
  LoaderFunction,
  ActionFunction,
} from "@remix-run/node";

import notes from "../../styles/notes.css";

type LoaderData = {
  noteListItems: Awaited<ReturnType<typeof getNoteListItems>>;
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: notes }];
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const id = formData.get("id") as string;
  invariant(id, "noteId not found");

  await deleteNote({ userId, id });
  return redirect("/notes");
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const noteListItems = await getNoteListItems({ userId });
  return json<LoaderData>({ noteListItems });
};

function NoNote() {
  return (
    <div className="flex flex-col items-center justify-center absolute top-[37.5%] sm:top-[40%] w-full">
      <BookOpenIcon className="text-gray-400 h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-36 lg:w-36" />
      <h3 className="text-gray-400 text-xl md:text-2xl lg:text-3xl font-bold">
        No notes yet
      </h3>
      <Link to="/notes/new">
        <button className="mt-1 sm:mt-2 lg:mt-3 bg-blue-500 font-semibold text-white border rounded-lg border-transparent py-1 lg:py-[0.325rem] px-1 sm:px-2 lg:px-3">
          + Create a new note
        </button>
      </Link>
    </div>
  );
}

function Note({ title, content, link }: any) {
  const fetcher = useFetcher();

  const deleteNote = (id: string): boolean => {
    fetcher.submit({ mode: "DELETE_NOTE", id: link }, { method: "post" });
    return false;
  };

  return (
    <li className="li m-6 sm:m-8 relative">
      <Link
        className="note h-52 sm:h-60 md:h-72 sm:w-60 md:w-72"
        to={`/notes/${link}`}
      >
        <h2 className="note-title font-bold text-xl sm:text-2xl md:text-3xl">
          {title}
        </h2>
        <p className="note-text mt-2 sm:mt-3 md:mt-4">{content}</p>
        <div
          className="h-1/5 flex-row text-center content-center justify-center absolute bottom-0 w-full left-0 z-30 hidden"
          id="menu"
        >
          <PencilIcon className="w-8 h-8 mr-2 md:mr-4 text-gray-600 hover:text-blue-500" />
          <XCircleIcon
            id="delete"
            className="w-8 h-8 ml-2 mr-2 md:ml-4 md:mr-4 text-gray-600 hover:text-red-600"
            onClick={() => deleteNote(link)}
          />
          {/* <ShareIcon className="w-8 h-8 ml-2 md:ml-4 text-gray-600 hover:text-green-400" onClick={shareNote}/> */}
        </div>
      </Link>
    </li>
  );
}

export default function IndexNotes() {
  const data = useLoaderData() as LoaderData;

  return (
    <div>
      {data.noteListItems.length > 0 && (
        <section className="mb-1 mt-1 md:mb-2 md:mt-2 w-full text-center">
          <Link to="/notes/new">
            <button className="bg-blue-500 font-semibold text-white border rounded-lg border-transparent py-1 lg:py-[0.325rem] px-1 sm:px-2 lg:px-3">
              New Note
            </button>
          </Link>
        </section>
      )}
      <section className="mt-4 sm:mt-7 md:mt-10">
        {data.noteListItems.length == 0 || !data ? (
          <NoNote />
        ) : (
          <ul className="note-list">
            {data.noteListItems.map((note) => (
              <Note
                key={note.id}
                link={note.id}
                title={note.title}
                content={note.body}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
