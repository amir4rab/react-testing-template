const Hero = () => {
  return (
    <header className="bg-neutral-950 min-h-[50vh] text-white flex flex-col justify-center rounded-[4em] shadow-xl shadow-neutral-950/10 m-4 md:max-w-6xl md:mx-auto">
      <h1 className="text-6xl md:text-9xl text-center mb-4 font-semibold">
        RTT
      </h1>
      <p
        role="paragraph"
        className="text-xs md:text-sm font-mono text-center font-light px-8"
      >
        <span>
          <code>`react-testing-template`</code>
          {` A Template for testing your React
          JS front-end applications`}
        </span>
      </p>
    </header>
  );
};

export default Hero;
