interface IProps {
  meta: IMeta;
}

// all the various meta data config, extracted here to keep the parent component Page neater 
const Meta = ({ meta }: IProps) => {

  const { title, description, keywords, canonical, robots, sharing } = meta;
  const { opengraph, twitter } = sharing;
  const { url: ogUrl, title: ogTitle, description: ogDescription, image: ogImage } = opengraph;
  const { title: twTitle, description: twDescription, image: twImage } = twitter;
  
  return (
    <>
      <title>{ title }</title>
      <meta name="description" 
        content={description} />
      <meta name="keywords" 
        content={keywords} />
      <meta name="robots" 
        content={robots} />
      <meta name="commission-factory-verification" 
        content="61536885b4284a34997b6fe0af482964" />
      <link rel="canonical" 
        href={canonical} />
      <link rel="alternate" 
        href="https://prosperex.com.au/" 
        hrefLang="x-default" />
      {ogUrl && (
        <meta property="og:url" 
          content={ogUrl} />
      )}
      {ogTitle && (
        <meta property="og:title" 
          content={ogTitle} />
      )}
      {ogDescription && (
        <meta property="og:description" 
          content={ogDescription} />
      )}
      {ogImage && (
        <meta property="og:image" 
          content={ogImage} />
      )}
      {twTitle && (
        <meta name="twitter:title" 
          content={twTitle} />
      )}
      {twDescription && (
        <meta name="twitter:description" 
          content={twDescription} />
      )}
      {twImage && (
        <meta name="twitter:image:src" 
          content={twImage} />
      )}
    </>
  );

};

export default Meta;
