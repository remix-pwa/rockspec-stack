import React from "react";
import {
  Form,
  useActionData,
  useFetcher,
  useTransition,
} from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { createNote } from "~/models/notes.server";
import { requireUserId } from "~/utils/server/session.server";

import type { LinksFunction, ActionFunction } from "@remix-run/node";

import paper from "../../styles/paper.css";

type ActionData = {
  errors?: {
    title?: string;
    body?: string;
  };
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: paper }];
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");

  if (typeof title !== "string" || title.length === 0) {
    return json<ActionData>(
      { errors: { title: "Title is required" } },
      { status: 400 }
    );
  }

  if (typeof body !== "string" || body.length === 0) {
    return json<ActionData>(
      { errors: { body: "Body is required" } },
      { status: 400 }
    );
  }

  const note = await createNote({ title, body, userId });

  return redirect(`/notes/${note.id}`);
};

export default function New() {
  const actionData = useActionData() as ActionData;
  const fetcher = useFetcher();
  const transition = useTransition();

  const titleRef = React.useRef<HTMLInputElement>(null);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form method="post" className="mt-14 sm:mt-14 md:mt-16 lg:mt-18">
      {actionData?.errors?.body && (
        <section className="animate-bounce absolute text-center z-40 w-full flex content-center justify-center">
          <div className="bg-red-300 text-red-600 border w-5/6 sm:w-1/2 lg:w-1/3 border-red-600 text-lg rounded sm:rounded-md py-1 px-2 md:py-2 md:px-4 xl:px-5 xl:py-3">
            {actionData.errors.body}
          </div>
        </section>
      )}
      <section className="paper h-[29rem] sm:h-[32rem] md:h-[34rem] lg:h-[38rem]">
        <div className="paper-content">
          <label htmlFor="body">
            <textarea
              autoFocus
              ref={bodyRef}
              draggable={false}
              name="body"
              placeholder="Hello world !&#10;Write notes here and save them for later."
              aria-invalid={actionData?.errors?.body ? true : undefined}
              aria-errormessage={
                actionData?.errors?.body ? "body-error" : undefined
              }
            />
          </label>
        </div>
      </section>
      <section className="relative px-3 sm:px-0 mt-8 sm:mt-10 md:mt-12 lg:mt-14 content-center flex flex-col justify-center max-w-[1024px] m-auto">
        <label
          htmlFor="title"
          className="flex flex-row align-middle content-center justify-end w-full"
        >
          <div className="font-semibold text-xl text-left sm:text-2xl md:text-3xl">
            Title:&nbsp;
          </div>
          <div className="my-auto w-full min-w-[290px] max-w-[1024px]">
            <input
              type="text"
              className="rounded-md px-2 w-full"
              name="title"
              id="title"
              ref={titleRef}
              placeholder="Give your note a title!"
            />
            {actionData?.errors?.title && (
              <span className="m-0 text-red-500 text-sm">
                {actionData.errors.title}
              </span>
            )}
          </div>
        </label>
        <div className="w-full flex flex-row justify-end align-middle content-center">
          {transition.state == "idle" && fetcher.state !== "submitting" ? (
            <button
              type="submit"
              className="w-1/3 md:w-1/6  mt-3 max-w-[300px] flex justify-center py-2 px-4 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
            >
              Save Note
            </button>
          ) : (
            <button
              type="button"
              className="w-1/3 md:w-1/6  mt-3 max-w-[300px] flex justify-center py-2 px-4 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
            >
              <svg
                className="animate-spin h-4 w-4 md:w-5 md:h-5 text-blue-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </button>
          )}
        </div>
      </section>
    </Form>
  );
}
