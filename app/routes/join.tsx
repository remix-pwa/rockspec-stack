import React from "react";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useSearchParams,
  useTransition,
} from "@remix-run/react";
import { LockClosedIcon } from "@heroicons/react/solid";
import { createUserSession, getUserId } from "~/utils/server/session.server";
import { createUser, getUserByEmail } from "~/models/user.server";
import { validateEmail } from "~/utils/server/db-utils.server";

import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/notes");
  return json({});
};

interface ActionData {
  errors: {
    email?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo");

  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: "Email is invalid" } },
      { status: 400 }
    );
  }

  if (typeof password !== "string") {
    return json<ActionData>(
      { errors: { password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json<ActionData>(
      { errors: { password: "Password is too short" } },
      { status: 400 }
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json<ActionData>(
      { errors: { email: "A user already exists with this email" } },
      { status: 403 }
    );
  }

  const user = await createUser(email, password);

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo: typeof redirectTo === "string" ? redirectTo : "/notes",
  });
};

export const meta: MetaFunction = () => {
  return {
    title: "Join RockSpec",
  };
};

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData() as ActionData;
  const transition = useTransition();
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="h-screen w-screen self-center flex flex-row content-center justify-center align-middle m-auto sm:pb-16 pt-6 sm:pt-8">
      <div className="mx-auto max-w-3xl w-full sm:min-w-[31rem] md:min-w-[36rem] md:max-w-2xl lg:min-w-[48rem] px-4 sm:px-6 lg:px-8 relative self-center">
        <div className="relative shadow-xl overflow-hidden py-3 sm:py-5 rounded-lg sm:rounded-2xl lg:py-7">
          <section>
            <img
              src="/svgs/remix-black.svg"
              alt="Remix"
              className="mx-auto mt-16 w-full max-w-[12rem] md:max-w-[16rem] text-black"
            />
          </section>
          <section className="mb-2 py-2">
            <h3 className="text-gray-500 text-center mt-4 md:mt-6 text-2xl md:text-3xl">
              Create an account
            </h3>
            <p className="mt-1 text-center text-sm sm:text-base text-gray-600">
              <Link
                to={{
                  pathname: "/login",
                  search: searchParams.toString(),
                }}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Already have an account?
              </Link>
            </p>
            <Form method="post">
              <div className="rounded-md shadow-sm -space-y-px px-8 py-5 md:px-12 md:py-7 lg:px-20 lg:py-10">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    ref={emailRef}
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    ref={passwordRef}
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
                <div className="text-sm pt-1 text-red-700">
                  {actionData?.errors?.password && (
                    <div id="password-error">{actionData.errors.password}</div>
                  )}
                  {actionData?.errors?.email && (
                    <div id="email-error">{actionData.errors.email}</div>
                  )}
                </div>
              </div>
              <input type="hidden" name="redirectTo" value={redirectTo} />
              <div className="flex flex-row align-middle justify-center content-center px-8 md:px-12 lg:px-20">
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <LockClosedIcon
                      className="h-5 w-5 text-blue-400 group-hover:text-blue-300"
                      aria-hidden="true"
                    />
                  </span>
                  Create account
                </button>
              </div>
            </Form>
          </section>
        </div>
      </div>
      {transition.state == "submitting" && (
        <div className="absolute bottom-10 md:bottom-14 flex flex-row justify-between content-center px-6 py-1 text-sm sm:text-base sm:px-7 sm:py-2 md:px-9 md:py-3 bg-blue-200 rounded-md border border-blue-600">
          <p className="text-left relative top-1 ms:top-2 h-full flex content-center align-middle font-modern-sans text-lg sm:text-xl lg:text-2xl">
            Crafting a new account..
          </p>
          <svg
            className="animate-spin ml-3 h-5 w-5 md:w-7 md:h-7 text-blue-500"
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
          {/* <p className="text-gray-800 text-left">
          Check the <a href="#">docs</a> for building a better optimistic UI
        </p> */}
        </div>
      )}
      {(transition.state == "submitting" || transition.state == "loading") && (
        <div className="absolute bottom-4 md:bottom-7">
          <p className="text-center text-gray-600 text-sm sm:text-base">
            Check the Remix Docs for tips on better Optimistic UI and UX!
          </p>
        </div>
      )}
    </div>
  );
}
