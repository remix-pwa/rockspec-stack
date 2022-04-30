import { Form, Link, useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import { getUserId } from "~/utils/server/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return userId;
  return json({});
};

export default function Index() {
  const loaderData = useLoaderData();
  let user;

  typeof loaderData === "string" ? (user = loaderData) : (user = null);
  return (
    <div className="relative h-screen w-screen sm:pb-16 sm:pt-8">
      <div className="mx-auto max-w-[90rem] sm:px-6 lg:px-8 relative">
        <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
          <section className="absolute inset-0">
            <img
              className="h-full w-full object-cover"
              src="/images/hero.jpg"
              alt="Rushing vibes of life"
            />
            <div className="absolute inset-0 bg-[color:rgba(27,167,254,0.5)] mix-blend-multiply" />
          </section>
          <section className="lg:pb-18 relative px-4 pt-16 pb-8 sm:px-6 sm:pt-24 sm:pb-14 lg:px-8 lg:pt-32">
            <h1 className="text-center text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-8xl overflow-x-hidden">
              <span className="block uppercase text-center text-blue-500 drop-shadow-md">
                <span className="font-mokoto-3 text-center text-[50px] sm:text-6xl lg:text-8xl">Rockspec&nbsp;</span>
                <span className="font-anxiety block text-center sm:inline">Stack</span>
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-center text-xl text-white sm:max-w-3xl">
              Check the{" "}
              <a href="https://github.com/ShafSpecs/rockspec-stack/blob/main/README.md" target={"_blank"} className="text-white focus:text-white no-underline">
                README.md
              </a>{" "}
              file for instructions on how to get this project deployed.
            </p>
            <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
              {user ? (
                <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                  <Link
                    to="/notes"
                    className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 sm:px-8"
                  >
                    View Notes
                  </Link>
                  <Form action="/logout" method="post">
                    <button
                      type="submit"
                      className="flex items-center w-full justify-center rounded-md bg-blue-500 px-4 py-3 font-medium text-white hover:bg-blue-600"
                    >
                      Log Out
                    </button>
                  </Form>
                </div>
              ) : (
                <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                  <Link
                    to="/join"
                    className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 sm:px-8"
                  >
                    Sign up
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center justify-center rounded-md bg-blue-500 px-4 py-3 font-medium text-white hover:bg-blue-600  "
                  >
                    Log In
                  </Link>
                </div>
              )}
            </div>
            <a href="https://remix.run" className="mx-auto w-max">
              <img
                src="https://user-images.githubusercontent.com/1500684/158298926-e45dafff-3544-4b69-96d6-d3bcc33fc76a.svg"
                alt="Remix"
                className="mx-auto mt-16 w-full max-w-[12rem] md:max-w-[16rem]"
              />
            </a>
          </section>
        </div>
      </div>
      <div className="mx-auto max-w-7xl py-2 px-4 sm:px-6 lg:px-8">
        <div className="mt-6 flex flex-wrap justify-center gap-8">
          {[
            {
              src: "https://user-images.githubusercontent.com/1500684/157764397-ccd8ea10-b8aa-4772-a99b-35de937319e1.svg",
              alt: "Fly.io",
              href: "https://fly.io",
            },
            {
              src: "/svgs/pwa-svgrepo-com.svg",
              alt: "Progressive Web App",
              href: "https://web.dev/progressive-web-apps/",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/158238105-e7279a0c-1640-40db-86b0-3d3a10aab824.svg",
              alt: "PostgreSQL",
              href: "https://www.postgresql.org/",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/157764484-ad64a21a-d7fb-47e3-8669-ec046da20c1f.svg",
              alt: "Prisma",
              href: "https://prisma.io",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/157764276-a516a239-e377-4a20-b44a-0ac7b65c8c14.svg",
              alt: "Tailwind",
              href: "https://tailwindcss.com",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/157764454-48ac8c71-a2a9-4b5e-b19c-edef8b8953d6.svg",
              alt: "Cypress",
              href: "https://www.cypress.io",
            },
            // {
            //   src: "https://user-images.githubusercontent.com/1500684/157772447-00fccdce-9d12-46a3-8bb4-fac612cdc949.svg",
            //   alt: "Vitest",
            //   href: "https://vitest.dev",
            // },
            {
              src: "https://user-images.githubusercontent.com/1500684/157772662-92b0dd3a-453f-4d18-b8be-9fa6efde52cf.png",
              alt: "Testing Library",
              href: "https://testing-library.com",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/157772934-ce0a943d-e9d0-40f8-97f3-f464c0811643.svg",
              alt: "Prettier",
              href: "https://prettier.io",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/157772990-3968ff7c-b551-4c55-a25c-046a32709a8e.svg",
              alt: "ESLint",
              href: "https://eslint.org",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/157773063-20a0ed64-b9f8-4e0b-9d1e-0b65a3d4a6db.svg",
              alt: "TypeScript",
              href: "https://typescriptlang.org",
            },
          ].map((img) => (
            <a
              key={img.href}
              href={img.href}
              className="flex h-16 w-32 justify-center p-1 grayscale transition hover:grayscale-0 focus:grayscale-0"
            >
              <img alt={img.alt} src={img.src} />
            </a>
          ))}
        </div>
      </div>
      <section className="md:absolute relative pb-3 mb-2 mt-2 md:mt-0 md:mb-0 md:bottom-2 w-full text-center">
        Crafted by ShafSpecs with ❤️ and Remix vibes 💿
      </section>
    </div>
  );
}
