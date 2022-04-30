import { ArrowSmLeftIcon } from "@heroicons/react/outline";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getUserId } from "~/utils/server/session.server";
import { getNote, getNoteNonUser } from "~/models/notes.server";

import type { LoaderFunction } from "@remix-run/node";

type LoaderData = {
  user?: string | null;
  note: {
    id: string;
    title: string;
    body: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = (await getUserId(request)) as string;
  const { preview } = params;
  //@ts-ignore
  const note = await getNoteNonUser({ id: params.preview });
  console.log(note);

  if (!note) {
    throw new Response("Not Found", { status: 404 });
  }

  if (!userId) {
    return json<LoaderData>(
      {
        user: null,
        note,
      },
      {
        status: 200,
      }
    );
  } else {
    return json<LoaderData>(
      {
        user: userId,
        note,
      },
      {
        status: 200,
      }
    );
  }
};

export default function Preview() {
  const data = useLoaderData();
  console.log(data)

  return (
    <div className="h-screen w-screen relative flex content-center justify-center">
      <img
        className="h-full bg-fixed w-screen object-fill bg-[length:100%_auto] absolute top-0 left-0 z-0 pointer-events-none"
        src="/images/preview-image.jpg"
        alt="preview-background"
      />
      <section className="absolute text-white top-2 left-2 md:top-4 md:left-4 sm:text-lg lg:text-xl font-semibold">
        <Link to="/">
          <span className="hover:animate-bounce hover:cursor-pointer">
            <ArrowSmLeftIcon className="w-5 h-5 md:w-6 md:h-6 inline bottom-[3px]" />
            <span className="">Go Back</span>
          </span>
        </Link>
        {data.user && (
          <div className="inline">
            <span className="ml-1 mr-1 md:ml-2 md:mr-2">|</span>
            <Link to={`/notes/${data.note.id}`}>
              <span className="hover:cursor-pointer">Edit Note</span>
            </Link>
          </div>
        )}
      </section>
      <section
        id="glass-body"
        className="m-auto w-5/6 lg:w-4/6 max-h-[33rem] lg:max-h-[37rem] overflow-x-hidden overflow-y-auto bg-white bg-opacity-25 border border-opacity-25 border-white z-30 text-white font-modern-sans rounded md:rounded-md lg:rounded-lg shadow-preview backdrop-blur-sm"
      >
        <div className="text-white text-opacity-100 opacity-100 py-3 px-2 md:px-3 md:py-4 lg:py-4 lg:px-4">
          {data.note.body}
        </div>
      </section>
    </div>
  );
}
