export default function Home() {
  return (
    <div className="m-8 max-w-lg p-6 bg-slate-800 border border-gray-200 rounded-lg shadow-sm">
      <a href="https://starwoven.vercel.app" target="_balnk">
        <h5 className="mb-2 text-2xl font-semibold tracking-tight text-amber-400">
          Want To See Something Cool I&apos;ve Been Working On?
        </h5>
      </a>
      <p className="mb-3 font-normal text-white">
        If you recall from my final project last semester in CSCI 31, I had an entire section devoted to an easter egg
        for the site surrounding a podcast my kids and I are working on - Starwoven. Well, I needed to keep track of the
        universe and characters, so I built a type of wiki for it. It&apos;s called the Starwoven Data Core, and while
        it&apos;s incomplete and still has some inconsistencies, it&apos;s a great point to start learning about the
        story, behind the scenes/spoiler stuff.
      </p>
      <a
        href="https://starwoven.vercel.app"
        className="inline-flex font-medium items-center text-amber-400 hover:underline"
        target="_balnk"
      >
        Starwoven Data Core
        <svg
          className="w-3 h-3 ms-2.5 rtl:rotate-[270deg]"
          aria-hidden="true"
          xmlns="https://starwoven.vercel.app"
          fill="none"
          viewBox="0 0 18 18"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"
          />
        </svg>
      </a>
    </div>
  )
}
