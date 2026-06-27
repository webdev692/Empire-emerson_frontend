import valuesCard from '../../assets/Agency_Values.png'

export default function ValuesSection() {
  return (
    <section id="our-values" className="bg-gradient-to-b from-white via-[#eef3fa] to-[#dbe6f3] py-16 sm:py-20">
      <div className="mx-auto max-w-[1320px] px-5">
        <img
          src={valuesCard}
          alt="Our Values — The Emerson Agency values integrity, clarity, professionalism, empowerment, trust, and results-driven service."
          className="w-full rounded-[24px] shadow-[0_30px_80px_rgba(15,23,51,0.18)]"
        />
      </div>
    </section>
  )
}
