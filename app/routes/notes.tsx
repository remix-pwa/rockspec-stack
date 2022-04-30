import { Fragment } from "react";
import { Link, Outlet, useLoaderData, Form } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { Menu, Transition } from "@headlessui/react";
import { MenuAlt3Icon } from "@heroicons/react/outline";
import { getUserId, requireUserId } from "~/utils/server/session.server";
import { deleteNote } from "~/models/notes.server";
import invariant from "tiny-invariant";

import type { LoaderFunction, ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  await deleteNote({ userId, id: params.noteId });
  return redirect("/notes");
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) {
    return userId;
  } else {
    return redirect("/login");
  }
};

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Notes() {
  return (
    <div>
      <header className="px-3 py-2 relative flex flex-row content-center">
        <h3 className="text-left text-3xl font-extrabold tracking-tight lg:text-7xl sm:text-5xl md:text-6xl cursor-default">
          <span className="block uppercase text-blue-500 drop-shadow-md">
            <span className="font-mokoto-3">Rockspec&nbsp;</span>
            <span className="font-modern-sans">Notes</span>
          </span>
        </h3>
        <nav className="absolute flex flex-row right-3 md:right-4">
          <Link
            to="/"
            className="items-center lg:text-xl hidden xl:flex justify-center border-0 text-blue-500 px-5 py-3 lg:px-6 lg:py-4 font-bold hover:text-blue-600"
          >
            Homepage
          </Link>
          <Link
            to="/notes"
            className="items-center lg:text-xl hidden xl:flex justify-center border-0 text-blue-500 px-5 py-3 lg:px-6 lg:py-4 font-bold hover:text-blue-600"
          >
            Dashboard
          </Link>
          <Form action="/logout" method="post">
            <button
              type="submit"
              className="items-center lg:text-lg hidden xl:flex justify-center rounded-md bg-blue-500 px-5 py-3 lg:px-6 lg:py-4 font-medium text-white hover:bg-blue-600"
            >
              Log Out
            </button>
          </Form>
          <Menu
            as="div"
            className="relative mobile z-50 inline-block xl:hidden text-left"
          >
            <div>
              <Menu.Button className="inline-flex justify-center w-full rounded-full border border-gray-300 shadow-sm p-3 sm:p-4 bg-white text-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-400">
                <MenuAlt3Icon
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7 text-gray-800"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>

            {/* Dropdown Menu */}
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="z-50 origin-top-right absolute right-0 pt-0 pb-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Home
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/notes"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Dashboard
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Form action="/logout" method="post">
                        <button
                          type="submit"
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block w-full text-left px-4 py-2 text-sm"
                          )}
                        >
                          Sign out
                        </button>
                      </Form>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
