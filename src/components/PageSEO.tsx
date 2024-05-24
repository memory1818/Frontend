import Head from 'next/head';
import React from 'react';


interface Props {
  title?: string;
}

export default function PageSEO({ title}: Props) {
  const curatedTitle = title;

  return (
    <Head>
      <title>{curatedTitle}</title>
      <meta itemProp="name" content={curatedTitle} />

    </Head>
  );
}
