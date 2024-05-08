import Image from "next/image";

export default function Home() {
  return (
    <main className="grow h-full flex flex-col items-center justify-between">
      <div className="grid grow place-items-center text-center">
        <h1 className="px-2 text-xl sm:text-3xl lg:text-5xl font-bold leading-6">
          Streamline Your Pilot Training with a <br />
          <code className="bg-sky-500 px-2 rounded-md leading-6">
            Digital Logbook
          </code>
        </h1>
        <div className="grid sm:grid-cols-2 auto-rows-fr gap-2 p-2">
          <a className="group rounded-lg border border-transparent px-5 py-4 transition-colors border-gray-300 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800/30">
            <h2 className="mb-3 text-lg font-semibold">
              Log Your Flight Details{" "}
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Easily record every aspect of your flights, from takeoff to
              touchdown and many more.
            </p>
          </a>

          <a className="group rounded-lg border border-transparent px-5 py-4 transition-colors border-gray-300 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800/30">
            <h2 className="mb-3 text-lg font-semibold">
              Explore Your Flight History{" "}
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Access your complete flight history at a glance. Filter flights by
              location, flight type and sort them by date.
            </p>
          </a>

          <a className="group sm:col-span-2 mx-auto rounded-lg border border-transparent px-5 py-4 transition-colors border-gray-300 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800/30">
            <h2 className="mb-3 text-lg font-semibold">
              Dive Deeper into Each Flight{" "}
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Review detailed information for each of your flights.
            </p>
          </a>
        </div>
      </div>
    </main>
  );
}
