import { Fragment, useEffect, useRef, useState } from "react";
import {
  useTransition,
  useFetcher,
  useLoaderData,
  useActionData,
  Link,
} from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { Dialog, Transition, Menu } from "@headlessui/react";
import { deleteNote, getNote, updateNote } from "~/models/notes.server";
import { requireUserId } from "~/utils/server/session.server";
import {
  PencilAltIcon,
  TrashIcon,
  ExclamationIcon,
  DotsVerticalIcon,
  PresentationChartBarIcon,
  ClipboardCopyIcon,
} from "@heroicons/react/outline";
import { ShareIcon } from "@heroicons/react/solid";
import { WebShareLink, copyText } from "~/utils/client/pwa-utils.client";
import { domain } from "~/utils/client/domain.client";

import type {
  LoaderFunction,
  LinksFunction,
  ActionFunction,
  MetaFunction,
} from "@remix-run/node";
import type { Note } from "~/models/notes.server";

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

type LoaderData = {
  note: Note;
};

type ModalProps = {
  openFunc: (bool: boolean) => void;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  const note = await getNote({ userId, id: params.noteId });
  if (!note) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ note });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  const formData = await request.formData();
  const mode = formData.get("mode") as unknown as "DELETE_NOTE" | "UPDATE_NOTE";

  if (mode == "DELETE_NOTE") {
    await deleteNote({ userId, id: params.noteId });
    return redirect("/notes");
  } else if (mode == "UPDATE_NOTE") {
    const title = formData.get("title") as unknown as string;
    const body = formData.get("body") as unknown as string;

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

    await updateNote({ id: params.noteId, title, body });
    return json(
      { messages: "Successfully updated your note!" },
      { status: 201 }
    );
  }
};

export const meta: MetaFunction = ({ data }) => {
  if (!data) {
  }
  return {
    title: data.note.title,
  };
};

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export function Modal({ openFunc }: ModalProps) {
  const transition = useTransition();
  const fetcher = useFetcher();
  const [open, setOpen] = useState(true);

  const cancelButtonRef = useRef(null);

  const deleteNote = () => {
    fetcher.submit({ mode: "DELETE_NOTE" }, { method: "post" });
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => openFunc(false)}
        initialFocus={cancelButtonRef}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationIcon
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Delete Note
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this note? You won't be
                        able to recover your note again (A long time!)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {transition.state == "idle" &&
                fetcher.state !== "submitting" ? (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={deleteNote}
                  >
                    Delete Note
                  </button>
                ) : (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    <svg
                      className="animate-spin h-4 w-4 md:w-5 md:h-5 text-red-400"
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
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => openFunc(false)}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default function NoteId() {
  const actionData = useActionData() as ActionData | any;
  const data = useLoaderData() as LoaderData;
  const transition = useTransition();
  const fetcher = useFetcher();

  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus();
      //@ts-ignore
    } else if (actionData?.messages) {
      bodyRef.current?.focus();
    }
  }, [actionData]);

  const updateNote = () => {
    const bodyText = bodyRef.current?.value as unknown as string;
    const titleText = titleRef.current?.value as unknown as string;

    fetcher.submit(
      { body: bodyText, title: titleText, mode: "UPDATE_NOTE" },
      { method: "post" }
    );
  };

  const [open, setOpen] = useState(false);

  return (
    <div className="mt-14 sm:mt-14 md:mt-16 lg:mt-18">
      {open && <Modal openFunc={setOpen} />}
      {actionData?.errors?.body && (
        <section className="animate-bounce absolute text-center z-40 w-full flex content-center justify-center">
          <div className="bg-red-300 text-red-600 border w-5/6 sm:w-1/2 lg:w-1/3 border-red-600 text-lg rounded sm:rounded-md py-1 px-2 md:py-2 md:px-4 xl:px-5 xl:py-3">
            {actionData.errors.body}
          </div>
        </section>
      )}
      {actionData?.messages && (
        <section className="animate-bounce absolute text-center z-40 w-full flex content-center justify-center">
          <div className="bg-blue-300 text-blue-600 border w-5/6 sm:w-1/2 lg:w-1/3 border-blue-600 text-lg rounded sm:rounded-md py-1 px-2 md:py-2 md:px-4 xl:px-5 xl:py-3">
            {actionData.messages}
          </div>
        </section>
      )}
      <section className="paper h-[29rem] sm:h-[32rem] md:h-[34rem] lg:h-[38rem]">
        <div className="paper-content">
          <textarea
            autoFocus
            ref={bodyRef}
            draggable={false}
            placeholder="Hello world !&#10;Write notes here and save them for later."
            defaultValue={data.note.body}
          />
        </div>
      </section>
      <section className="relative px-3 sm:px-0 mt-8 sm:mt-10 md:mt-12 lg:mt-14 content-center flex flex-col justify-center max-w-[768px] lg:max-w-[1024px] m-auto">
        <div className="flex flex-row align-middle content-center justify-end w-full">
          <label
            htmlFor="title"
            className="hidden sm:inline-block font-semibold text-xl text-left sm:text-2xl md:text-3xl"
          >
            Title:&nbsp;
          </label>
          <input
            type="text"
            ref={titleRef}
            className="rounded-md px-2 my-auto w-full min-w-[290px] max-w-[1024px]"
            name="title"
            id="title"
            placeholder="Give your note a title!"
            defaultValue={data.note.title}
          />
          {actionData?.errors?.title && (
            <span className="m-0 text-red-500 text-sm">
              {actionData.errors.title}
            </span>
          )}
        </div>
        <div className="w-full flex flex-row justify-end align-middle content-center">
          {transition.state == "idle" && fetcher.state !== "submitting" ? (
            <button
              type="submit"
              onClick={updateNote}
              className="w-fit lg:w-1/6  mt-3 max-w-[300px] flex justify-center py-2 px-4 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
            >
              <PencilAltIcon className="mr-1 w-5 h-5 md:w-7 md:h-7" />
              Update Note
            </button>
          ) : (
            <button
              type="button"
              className="w-fit lg:w-1/6  mt-3 max-w-[300px] flex justify-center py-2 px-4 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
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
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-fit lg:w-1/6  mt-3 ml-1 max-w-[300px] flex justify-center py-2 px-4 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500"
          >
            <TrashIcon className="mr-1 w-5 h-5 md:w-7 md:h-7" />
            Delete Note
          </button>
          <Menu as="div">
            <Menu.Button
              type="button"
              className=" relative max-w-min mt-3 ml-1 h-2/3 md:h-5/6 flex justify-center content-center text-center items-center py-1 px-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
            >
              <DotsVerticalIcon className="text-gray-600 w-5 h-5 p-0" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-right absolute right-0 bottom-0 mb-12 z-50 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <div
                        onClick={() => {
                          copyText(data.note.body);
                        }}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "flex flex-row content-center align-middle justify-start px-4 py-2 text-sm hover:cursor-pointer"
                        )}
                      >
                        <ClipboardCopyIcon className="w-4 h-4 md:w-5 md:h-5" />
                        &nbsp;<span className="ml-1">Copy to clipboard</span>
                      </div>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to={`/preview/${data.note.id}`}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "flex flex-row content-center align-middle justify-start px-4 py-2 text-sm"
                        )}
                      >
                        <PresentationChartBarIcon className="w-4 h-4 md:w-5 md:h-5" />
                        &nbsp;<span className="ml-1">Preview</span>
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <div
                        onClick={() => {
                          WebShareLink(`https://${domain}/preview/${data.note.id}`, `${data.note.title}`, "Check my note out!");
                        }}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "flex flex-row content-center align-middle justify-start px-4 py-2 text-sm hover:cursor-pointer"
                        )}
                      >
                        <ShareIcon className="w-4 h-4 md:w-5 md:h-5" />
                        &nbsp;<span className="ml-1">Share</span>
                      </div>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </section>
    </div>
  );
}
