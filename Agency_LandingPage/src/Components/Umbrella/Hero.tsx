import heroCard from '../../assets/Agency_Hero.png'

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-white via-[#eef3fa] to-[#cfddef] py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-[1320px] px-5">
        <img
          src={heroCard}
          alt="The Emerson Agency — Our mission: empowering individuals, families, and entrepreneurs with ethical financial guidance, strategic business support, and practical services that help build stability, confidence, and long-term growth."
          className="w-full rounded-[24px] shadow-[0_30px_80px_rgba(15,23,51,0.25)]"
        />
      </div>
    </section>
  )
}
