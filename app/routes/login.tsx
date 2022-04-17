import { Link } from "@remix-run/react";
import { LoginIcon } from "@heroicons/react/outline";

export default function Login() {
  return (
    <div className="relative self-center align-middle m-auto sm:pb-16 pt-6 sm:pt-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative">
        <div className="relative shadow-xl overflow-hidden py-3 sm:py-5 rounded-lg sm:rounded-2xl lg:py-7">
          <section>
            <img
              src="/svgs/remix-black.svg"
              alt="Remix"
              className="mx-auto mt-16 w-full max-w-[12rem] md:max-w-[16rem] text-black"
            />
          </section>
          <section className="">
            <div>
              <h3 className="text-gray-500 text-center mt-4 md:mt-6 text-3xl">
                Sign in to your account
              </h3>
              <p className="mt-1 text-center text-md text-gray-600">
                Or{" "}
                <Link
                  to="/join"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  start your 14-day free trial
                </Link>
              </p>
            </div>
            <div className="rounded-md shadow-sm -space-y-px px-8 py-5 md:px-12 md:py-8 lg:px-20 lg:py-12">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
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
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>
            <div className="flex flex-row align-middle justify-center content-center px-8 md:px-12 lg:px-20">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LoginIcon
                    className="h-5 w-5 text-blue-400 group-hover:text-blue-300"
                    aria-hidden="true"
                  />
                </span>
                Sign In
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
