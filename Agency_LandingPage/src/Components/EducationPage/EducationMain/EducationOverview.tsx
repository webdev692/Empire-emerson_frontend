export default function EducationOverview() {
  return (
    <section className="w-full bg-white px-5 py-8 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-[1320px] space-y-8">
        
        {/* Block what */}
        <div className="border-b border-gray-200 pb-6 sm:pb-8">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            What is TEA?
          </h2>
          <p className="mt-3 text-sm font-medium text-amber-700 sm:text-base">
            (Approved TEA education copy)
          </p>
        </div>

        {/* Block why */}
        <div className="border-b border-gray-200 pb-6 sm:pb-8">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Why this matters
          </h2>
          <p className="mt-3 text-sm font-medium text-amber-700 sm:text-base">
            (Approved TEA education copy)
          </p>
        </div>

      </div>
    </section>
  )
}