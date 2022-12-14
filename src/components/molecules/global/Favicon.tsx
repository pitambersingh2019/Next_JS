// all the various favicon config, extracted here to keep the parent component (either Dashboard or Page) DRYer & neater 
const Meta = () => (
  <>
    <meta name="msapplication-TileColor" 
      content="#13161d" />
    <meta name="theme-color" 
      content="#ffffff" />
    <link rel="icon" 
      href="/favicon.ico" />
    <link rel="apple-touch-icon" 
      sizes="180x180" 
      href="/apple-touch-icon.png" />
    <link rel="icon" 
      type="image/png" 
      sizes="32x32" 
      href="/favicon-32x32.png" />
    <link rel="icon" 
      type="image/png" 
      sizes="16x16" 
      href="/favicon-16x16.png" />
    <link rel="manifest" 
      href="/manifest.json" />
    <link rel="mask-icon" 
      href="/safari-pinned-tab.svg" 
      color="#13161d" />
  </>
);

export default Meta;
